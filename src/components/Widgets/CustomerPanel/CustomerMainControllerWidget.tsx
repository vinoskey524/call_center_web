/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import { refIdType } from '../../Tools/type';
import { _success_, _dev_, _defaultLanguage_ } from '../../Tools/constants';
import { catchErrorFunc, replaceConsecutiveSpacesByOneFunc, sortStringFunc } from '../../Tools/methodForest';
import { language } from '../../Tools/language';

/* Widget */
type propsType = {
    $data: {
        /** Every change made to "wid" affect controller */
        wid: string,
        refId: refIdType,
        controllerRef?: refIdType,
        rootControllers: any
    }
};
const CustomerMainControllerWidget = (props: propsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const parentProps = props;

    const windowWidth = useRef(window.innerWidth);

    const windowHeight = useRef(window.innerHeight);

    const isMounted = useRef(false);

    const render = useRef(false);

    const lang = useRef(_defaultLanguage_);

    const traduction = language[lang.current];

    /* $data */

    const data = props.$data;

    const wid = data.wid;

    const refId = data.refId;

    const controllerRef = data.controllerRef;

    const rootControllers = data.rootControllers;

    /* Root controllers */

    const mainControllerRef: refIdType = rootControllers.mainControllerRef;

    const requestControllerRef: refIdType = rootControllers.requestControllerRef;

    const dataStoreControllerRef: refIdType = rootControllers.dataStoreControllerRef;

    /* - */

    const customerHomeDashboardRef = useRef<any>(undefined);

    const customerProductDashboardRef = useRef<any>(undefined);

    const customerComplaintDashboardRef = useRef<any>(undefined);

    const customerAccountDashboardRef = useRef<any>(undefined);

    const productDashboardMainRef = useRef<any>(undefined);
    const productFeedListRef = useRef<any>(undefined);
    const productFeedSearchListRef = useRef<any>(undefined);

    const complaintDashboardMainRef = useRef<any>(undefined);

    /* - */

    const emptyRef = useRef(undefined);

    const dashboardTab = { home: customerHomeDashboardRef, product: customerProductDashboardRef, complaint: customerComplaintDashboardRef, account: customerAccountDashboardRef };

    const currentDashboardType = useRef('');
    const currentDashboardRef = useRef<any>(undefined);

    const homeDashboardIsInitalized = useRef(false);
    const productDashboardIsInitalized = useRef(false);
    const complaintDashboardIsInitalized = useRef(false);

    const currentProductSelectedWid = useRef<any>(undefined);
    const currentProductSelectedRef = useRef<any>(undefined);

    const productSearchText = useRef<string>('');

    const timer = useRef<any>(undefined);


    /* ------------------------------------ Methods ------------------------------------- */

    /* Add widget home: ref */
    const addWidgetRefFunc = (x: { wid: string, refId: any }) => {
        const wid = x.wid, refId = x.refId;
        switch (wid) {
            case 'customerHomeDashboardRef': { customerHomeDashboardRef.current = refId.current } break;
            case 'customerProductDashboardRef': { customerProductDashboardRef.current = refId.current } break;
            case 'customerComplaintDashboardRef': { customerComplaintDashboardRef.current = refId.current } break;
            case 'customerAccountDashboardRef': { customerAccountDashboardRef.current = refId.current } break;

            case 'productDashboardMainRef': { productDashboardMainRef.current = refId.current } break;
            case 'productFeedListRef': { productFeedListRef.current = refId.current } break;
            case 'productFeedSearchListRef': { productFeedSearchListRef.current = refId.current } break;

            case 'complaintDashboardMainRef': { complaintDashboardMainRef.current = refId.current } break;

            default: { };
        };
    };

    /* Set text value from inputs */
    const setTextValueFunc = (x: { wid: string, text: string }) => {
        const wid = x.wid, t = (x.text).replaceAll("'", '’').trimStart(), text = replaceConsecutiveSpacesByOneFunc(t), len = text.length;
        const lowerText = text.toLowerCase(), upperText = text.toUpperCase();

        switch (wid) {
            case 'ctmpdw_h_input_box_id': {
                productSearchText.current = lowerText;
                $('#ctmpdw_h_input_box_id').val(productSearchText.current);
                refId.current.findProductFunc({ text: productSearchText.current });
            } break;

            default: { };
        };
    };

    /* On window size change */
    const onWindowSizeChangeFunc = () => {
        windowWidth.current = window.innerWidth;
        windowHeight.current = window.innerHeight;
    };

    /* Show dashboard */
    const showDashboardFunc = (x: { type: 'home' | 'product' | 'complaint' | 'account' }) => {
        const target = dashboardTab[x.type];
        if (target.current !== undefined && currentDashboardType.current !== x.type) {
            target.current.showFunc({ show: true });
            (currentDashboardRef.current !== undefined) && currentDashboardRef.current.showFunc({ show: false });
            currentDashboardRef.current = target.current;
            currentDashboardType.current = x.type;

            /* - */
            switch (x.type) {
                case 'home': { if (!homeDashboardIsInitalized.current) refId.current.initHomeDashboardFunc() } break;

                case 'product': { if (!productDashboardIsInitalized.current) refId.current.initProductDashboardFunc() } break;

                case 'complaint': { if (!complaintDashboardIsInitalized.current) refId.current.initComplaintDashboardFunc() } break;

                case 'account': { } break;

                default: { };
            };
        }
    };

    /* Init home dashboard */
    const initHomeDashboardFunc = async () => {
        try {

            homeDashboardIsInitalized.current = true;
        } catch (e: any) { }
    };

    /* Init home dashboard */
    const initProductDashboardFunc = async () => {
        try {
            const currentCustomerData = dataStoreControllerRef.current.currentCustomerData;
            const domain = currentCustomerData.current.domain;
            const tmp = dataStoreControllerRef.current.customerProductNewerTimestamp_ms.current;

            /* - */
            const data = { domain: domain, timestamp_ms: tmp, state: 'new' };
            const product = await requestControllerRef.current.fetchProductFunc({ data: data });
            const feed: any[] = product.data;

            /* Store data into data store */
            dataStoreControllerRef.current.setDataFunc({ type: 'customerProduct', data: feed });

            /* Render feed */
            productFeedListRef.current.setDataFunc({ data: feed, position: 'top' });

            /* - */
            productDashboardIsInitalized.current = true;

        } catch (e: any) { return catchErrorFunc({ err: e.message }) }
    };

    /* Init home dashboard */
    const initComplaintDashboardFunc = async () => {
        try {

            complaintDashboardIsInitalized.current = true;
        } catch (e: any) { }
    };

    /* Add product */
    const addProductFunc = () => {
        const currentCustomerData = dataStoreControllerRef.current.currentCustomerData;
        const id = currentCustomerData.current.id;
        const domain = currentCustomerData.current.domain;

        const productCreationMainRef: refIdType = mainControllerRef.current.productCreationMainRef;
        productCreationMainRef.current.showFunc({ show: true, currentControllerRef: refId, customerId: id, customerDomain: domain });
    };

    /* On product created  */
    const onProductCreatedFunc = (x: { data: any }) => {
        productFeedListRef.current.setDataFunc({ data: [x.data], position: 'top' });
    };

    /* Find product */
    const findProductFunc = async (x: { text: string }) => {
        try {
            const text = x.text;
            const len = text.length;

            productDashboardMainRef.current.showSearchListFunc({ show: (len > 0) ? true : false });
            productFeedSearchListRef.current.showLoadingFunc({ show: (len > 0) ? true : false, position: 'top' });

            if (len > 0) {
                /* Find product */
                const productTab: any[] = dataStoreControllerRef.current.customerProductData.current;
                const res = productTab.filter((e: any, i: number) => (e.name).includes(text) === true);
                if (res.length > 0) {
                    const tab = (res.length > 1) ? res.sort((a: any, b: any) => sortStringFunc({ a: a.name, b: b.name })) : res;
                    productFeedSearchListRef.current.resetListFunc();
                    setTimeout(() => { productFeedSearchListRef.current.setDataFunc({ data: tab, position: 'top' }) }, 60);

                    /* Hide top loading */
                    timer.current = setTimeout(() => { productFeedSearchListRef.current.showLoadingFunc({ show: false, position: 'top' }) }, 300);
                } else {
                    productFeedSearchListRef.current.resetListFunc();
                    setTimeout(() => {
                        productFeedSearchListRef.current.showLoadingFunc({ show: false, position: 'top' });
                        productFeedSearchListRef.current.displayMessageFunc({ text: traduction['t0040'], position: 'top' });
                    }, 60);
                    _dev_ && console.log('nothing found');
                }

            } else {
                productFeedSearchListRef.current.showLoadingFunc({ show: false, position: 'top' });
                productFeedSearchListRef.current.displayMessageFunc({ text: '', position: 'top' });
                productFeedSearchListRef.current.resetListFunc();
            }

        } catch (e: any) {
            const err = catchErrorFunc({ err: e.message });
        }
    };

    /* Add complaint */
    const addComplaintFunc = () => {
        const currentCustomerData = dataStoreControllerRef.current.currentCustomerData;
        const id = currentCustomerData.current.id;
        const domain = currentCustomerData.current.domain;

        const complaintCreationRef: refIdType = mainControllerRef.current.complaintCreationRef;
        complaintCreationRef.current.showFunc({ show: true, currentControllerRef: refId, customerId: id, customerDomain: domain });
    };

    /* Select product */
    const selectProductFunc = (x: { wid: string, targetRef: refIdType }) => {
        if (currentProductSelectedRef.current !== undefined) currentProductSelectedRef.current.selectFunc({ select: false });
        (x.targetRef).current.selectFunc({ select: true });

        currentProductSelectedWid.current = x.wid;
        currentProductSelectedRef.current = (x.targetRef).current;
    };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        productSearchText: productSearchText,

        addWidgetRefFunc(x: any) { addWidgetRefFunc(x) },
        setTextValueFunc(x: any) { setTextValueFunc(x) },

        showDashboardFunc(x: any) { showDashboardFunc(x) },
        initHomeDashboardFunc() { initHomeDashboardFunc() },
        initProductDashboardFunc() { initProductDashboardFunc() },
        initComplaintDashboardFunc() { initComplaintDashboardFunc() },

        selectProductFunc(x: any) { selectProductFunc(x) },

        addProductFunc() { addProductFunc() },
        findProductFunc(x: any) { findProductFunc(x) },

        addComplaintFunc() { addComplaintFunc() },
        onProductCreatedFunc(x: any) { onProductCreatedFunc(x) },
    }), []);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            (controllerRef?.current !== undefined) && controllerRef.current.addWidgetRefFunc({ wid: wid, refId: refId });
        }
    }, []);

    /* On window size change */
    useEffect(() => {
        window.addEventListener('resize', onWindowSizeChangeFunc);
        return () => window.removeEventListener('resize', onWindowSizeChangeFunc);
    });


    /* Return */


    return (<></>);
};

export default forwardRef(CustomerMainControllerWidget);
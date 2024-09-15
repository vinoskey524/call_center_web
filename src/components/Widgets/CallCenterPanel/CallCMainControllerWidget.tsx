/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

/* Custom packages */
import { refIdType } from '../../Tools/type';
import { _success_, _error_, _requestFailed_, _dev_, _defaultLanguage_ } from '../../Tools/constants';
import { catchErrorFunc, sortStringFunc } from '../../Tools/methodForest';
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
const CallCMainControllerWidget = (props: propsType, ref: any) => {
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

    /* Refs */

    const callCMenuMainContainerRef = useRef<any>(undefined);

    const callCMainContainerRef = useRef<any>(undefined);

    const callCMenuCustomerFeedListRef = useRef<any>(undefined);

    const callCMenuCustomerSearchFeedListRef = useRef<any>(undefined);

    const callCenterDashboardFeedListRef = useRef<any>(undefined);

    /* - */

    const emptyRef = useRef(undefined);

    const isMenuSearchContainerVisible = useRef(false);

    const stopMenuSearchingLoop = useRef(false);
    const runningMenuSearchingLoop = useRef(false);

    const searchString = useRef('');

    const timer = useRef<any>(undefined);

    const dashBoardPageIdTab = useRef<string[]>([]);
    const dashBoardPageRefIdTab = useRef<Array<{ customerId: string, refId: refIdType }>>([]);

    const currentDashboardPageId = useRef<string>('');
    const currentDashboardPageRef = useRef<any>(undefined);


    /* ------------------------------------ Methods ------------------------------------- */

    /* Add widget ref */
    const addWidgetRefFunc = (x: { wid: string, refId: any }) => {
        const wid = x.wid, refId = x.refId;
        switch (wid) {
            case 'callCMenuMainContainerRef': { callCMenuMainContainerRef.current = refId.current } break;
            case 'callCMainContainerRef': { callCMainContainerRef.current = refId.current } break;
            case 'callCMenuCustomerFeedListRef': { callCMenuCustomerFeedListRef.current = refId.current } break;
            case 'callCMenuCustomerSearchFeedListRef': { callCMenuCustomerSearchFeedListRef.current = refId.current } break;
            case 'callCenterDashboardFeedListRef': { callCenterDashboardFeedListRef.current = refId.current } break;
            default: { };
        };
    };

    /* Set text value from inputs */
    const setTextValueFunc = (x: { wid: string, text: string }) => {
        const wid = x.wid, text = x.text;
        switch (wid) {
            case '': { } break;
            default: { };
        };
    };

    /* On window size change */
    const onWindowSizeChangeFunc = () => {
        windowWidth.current = window.innerWidth;
        windowHeight.current = window.innerHeight;
    };

    /* Init */
    const initFunc = async () => {
        try {
            let checkDb = false;

            /* Fetch local accounts */
            checkDb = true;

            /* Fetch account from db */
            if (checkDb) {
                const timestamp_ms = dataStoreControllerRef.current.customerAccountNewerTimestamp_ms.current;

                /* - */
                const req = await requestControllerRef.current.fetchCustomerAccountFunc({ state: 'new', timestamp_ms: timestamp_ms });
                if (req.status !== _success_) throw new Error(JSON.stringify(req)); /* If error */

                /* Render */
                const customerData: any[] = req.data.customerData;
                const total_customer_count = req.data.total_customer_count;
                if (customerData.length > 0) {
                    /* Store data into dataStoreController */
                    dataStoreControllerRef.current.setDataFunc({ type: 'customerAccount', data: customerData });

                    /* Render */
                    callCMenuCustomerFeedListRef.current.setDataFunc({ data: customerData, position: 'top' });

                } else {
                    /* If no data found */
                }
            }

        } catch (e: any) { catchErrorFunc({ err: e.message }) }
    };

    /* Prepare menu search */
    const prepareMenuSearchingFunc = () => { stopMenuSearchingLoop.current = (runningMenuSearchingLoop.current) ? true : false };

    /* Set menu search text */
    const setMenuSearchTextFunc = async (x: { text: string }) => {
        const text = (x.text).toLowerCase(), len = text.length;

        callCMenuCustomerSearchFeedListRef.current.displayMessageFunc({ text: '', position: 'top' });
        searchString.current = text;
        clearTimeout(timer.current);

        if (len > 0) {

            /* Show menu search container */
            if (!isMenuSearchContainerVisible.current) {
                isMenuSearchContainerVisible.current = true;
                callCMenuMainContainerRef.current.showSearchMenuContainerFunc({ show: true });
            }

            /* show top loading */
            callCMenuCustomerSearchFeedListRef.current.showLoadingFunc({ show: true, position: 'top' });

            /* Filter data */
            const data: any[] = dataStoreControllerRef.current.customerAccountData.current;
            const res = data.filter((e: any, i: number) => ((e.company_name).toLowerCase()).includes(text) === true);
            if (res.length > 0) {
                const tab = (res.length > 1) ? res.sort((a: any, b: any) => sortStringFunc({ a: a.company_name, b: b.company_name })) : res;
                callCMenuCustomerSearchFeedListRef.current.resetListFunc();
                setTimeout(() => { callCMenuCustomerSearchFeedListRef.current.setDataFunc({ data: tab, position: 'top' }) }, 60);

                /* Hide top loading */
                timer.current = setTimeout(() => { callCMenuCustomerSearchFeedListRef.current.showLoadingFunc({ show: false, position: 'top' }) }, 300);
            } else {
                callCMenuCustomerSearchFeedListRef.current.resetListFunc();
                setTimeout(() => {
                    callCMenuCustomerSearchFeedListRef.current.showLoadingFunc({ show: false, position: 'top' });
                    callCMenuCustomerSearchFeedListRef.current.displayMessageFunc({ text: traduction['t0040'], position: 'top' });
                }, 60);
                _dev_ && console.log('nothing found');
            }

        } else {
            /* Hide menu search container */
            if (isMenuSearchContainerVisible.current) {
                isMenuSearchContainerVisible.current = false;
                callCMenuMainContainerRef.current.showSearchMenuContainerFunc({ show: false });
            }

            /* - */
            callCMenuCustomerSearchFeedListRef.current.displayMessageFunc({ text: '', position: 'top' });
            callCMenuCustomerSearchFeedListRef.current.resetListFunc();
        }
    };

    /* Show page */
    const showPageFunc = (x: { data: refIdType }) => {
        try {
            const customerData = x.data.current;
            const customerId = customerData.id;

            if (customerId !== currentDashboardPageId.current) {
                /* Check if page exists */
                const exists = dashBoardPageIdTab.current.findIndex((e: any) => e === customerId) !== -1 ? true : false;
                if (exists) {
                    const find = dashBoardPageRefIdTab.current.filter((e) => e.customerId === customerId);
                    if (find.length === 0) throw new Error('no_ref_found'); /* If no refId found */
                    const target = find[0].refId;

                    /* show selected page */
                    target.current.showFunc({ show: true });

                    /* hide current page */
                    (currentDashboardPageRef.current !== undefined) && currentDashboardPageRef.current.showFunc({ show: false });

                    /* Update dashboard data */
                    currentDashboardPageId.current = customerId;
                    currentDashboardPageRef.current = target.current;

                } else {
                    /* render selected page */
                    dashBoardPageIdTab.current.push(customerId);
                    callCenterDashboardFeedListRef.current.setDataFunc({ data: customerData, position: 'bottom' });

                    /* hide current page */
                    (currentDashboardPageRef.current !== undefined) && currentDashboardPageRef.current.showFunc({ show: false });
                }
            }

        } catch (e: any) { _dev_ && console.log(e.message) }
    };

    /* Set dashboard refId */
    const setDashboardRefIdFunc = (x: { customerId: string, refId: refIdType }) => {
        dashBoardPageRefIdTab.current.push(x);

        /* Update dashboard data */
        currentDashboardPageId.current = x.customerId;
        currentDashboardPageRef.current = x.refId.current;
    };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        searchString: searchString,
        addWidgetRefFunc(x: any) { addWidgetRefFunc(x) },
        setTextValueFunc(x: any) { setTextValueFunc(x) },
        prepareMenuSearchingFunc() { prepareMenuSearchingFunc() },
        setMenuSearchTextFunc(x: any) { setMenuSearchTextFunc(x) },
        initFunc() { initFunc() },
        showPageFunc(x: any) { showPageFunc(x) },
        setDashboardRefIdFunc(x: any) { setDashboardRefIdFunc(x) }
    }), []);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            (controllerRef?.current !== undefined) && controllerRef.current.addWidgetRefFunc({ wid: wid, refId: refId });

            /* - */
            setTimeout(() => { initFunc() }, 100);
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

export default forwardRef(CallCMainControllerWidget);
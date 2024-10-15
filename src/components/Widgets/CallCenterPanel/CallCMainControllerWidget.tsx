/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

/* Custom packages */
import { refIdType } from '../../Tools/type';
import { _success_, _error_, _requestFailed_, _dev_, _defaultLanguage_ } from '../../Tools/constants';
import { catchErrorFunc, sortStringFunc, replaceConsecutiveSpacesByOneFunc } from '../../Tools/methodForest';

/** Every change made to "wid" affect controller */
type propsType = { $data: { wid: string, controllerRef?: refIdType, rootControllers: any } };
const CallCMainControllerWidget = (props: propsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const refId: refIdType = ref;

    const windowWidth = useRef(window.innerWidth);
    const windowHeight = useRef(window.innerHeight);

    const isMounted = useRef(false);
    const mountCount = useRef(0);
    const render = useRef(false);

    const emptyRef = useRef(undefined);

    const broadcastIndex = useRef(-1);

    /* $data */
    const $data = props.$data;
    const wid = $data.wid;
    const controllerRef = $data.controllerRef;
    const rootControllers = $data.rootControllers;

    /* Refs */
    const refIdStore = useRef<any>({});
    const callCMenuMainContainerRef = useRef<any>(undefined);
    const callCMainContainerRef = useRef<any>(undefined);
    const callCMenuCustomerFeedListRef = useRef<any>(undefined);
    const callCMenuCustomerFeedListControllerRef = useRef<any>(undefined);
    const callCMenuCustomerSearchFeedListRef = useRef<any>(undefined);
    const callCMenuCustomerSearchFeedListControllerRef = useRef<any>(undefined);
    const callCenterDashboardFeedListRef = useRef<any>(undefined);
    const callCenterDashboardFeedListControllerRef = useRef<any>(undefined);

    /* Root controllers */
    const mainRootControllerRef: refIdType = rootControllers?.current?.mainRootControllerRef;
    const requestRootControllerRef: refIdType = rootControllers?.current?.requestRootControllerRef;
    const dataStoreRootControllerRef: refIdType = rootControllers?.current?.dataStoreRootControllerRef;

    /* - */

    const traduction = useRef(dataStoreRootControllerRef.current.traduction.current);

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

    /* Add ref id */
    const addRefIdFunc = (x: { wid: string, refId: any }) => {
        const wid = x.wid, refId = x.refId;
        refIdStore.current[wid] = refId;
        switch (wid) {
            case 'callCMenuMainContainerRef': { callCMenuMainContainerRef.current = refId.current } break;
            case 'callCMainContainerRef': { callCMainContainerRef.current = refId.current } break;
            case 'callCMenuCustomerFeedListRef': { callCMenuCustomerFeedListRef.current = refId.current } break;
            case 'callCMenuCustomerFeedListControllerRef': { callCMenuCustomerFeedListControllerRef.current = refId.current } break;
            case 'callCMenuCustomerSearchFeedListRef': { callCMenuCustomerSearchFeedListRef.current = refId.current } break;
            case 'callCMenuCustomerSearchFeedListControllerRef': { callCMenuCustomerSearchFeedListControllerRef.current = refId.current } break;
            case 'callCenterDashboardFeedListRef': { callCenterDashboardFeedListRef.current = refId.current } break;
            case 'callCenterDashboardFeedListControllerRef': { callCenterDashboardFeedListControllerRef.current = refId.current } break;
            default: { };
        };
    };

    /* Delete refId */
    const deleteRefIdFunc = (x: { wid: string | string[] }) => {
        const wid = (typeof x.wid === 'string') ? [x.wid] : x.wid;
        for (let i = 0; i < wid.length; i++) { delete refIdStore.current[wid[i]] }
    };

    /* Set text value from inputs */
    const setTextValueFunc = (x: { wid: string, text: string }) => {
        const wid = x.wid, t = (x.text).replaceAll("'", '’').trimStart(), text = replaceConsecutiveSpacesByOneFunc(t), len = text.length;
        const lowerText = text.toLowerCase(), upperText = text.toUpperCase();
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

    /* Unmount */
    const unmountFunc = () => {
        /* Prevent from first unmounting caused by "strictMode" */
        mountCount.current += 1; if (mountCount.current === 1) return;

        /* unmount logic */
        mainRootControllerRef?.current?.deleteFromBroadcastDomainFunc({ index: broadcastIndex.current });
        mainRootControllerRef?.current?.deleteRefIdFunc({ wid: wid });
        (controllerRef?.current !== undefined) && controllerRef.current.deleteRefIdFunc({ wid: wid, refId: refId });
    };

    /* Init */
    const initFunc = async () => {
        try {
            let checkDb = false;

            /* Fetch local accounts */
            checkDb = true;

            /* Fetch account from db */
            if (checkDb) {
                const timestamp_ms = dataStoreRootControllerRef.current.customerAccountNewerTimestamp_ms.current;

                /* - */
                const req = await requestRootControllerRef.current.fetchCustomerAccountFunc({ state: 'new', timestamp_ms: timestamp_ms });
                if (req.status !== _success_) throw new Error(JSON.stringify(req)); /* If error */

                console.log('.... ::', req);

                /* Render */
                const customerData: any[] = req.data.customerData;
                const total_customer_count = req.data.total_customer_count;
                if (customerData.length > 0) {
                    /* Store data into dataStoreController */
                    dataStoreRootControllerRef.current.setDataFunc({ type: 'customerAccount', data: customerData });

                    /* Render */
                    callCMenuCustomerFeedListControllerRef.current.setDataFunc({ data: customerData, position: 'top' });

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
        clearTimeout(timer.current);
        callCMenuCustomerSearchFeedListControllerRef.current.resetListFunc();

        const text = (x.text).toLowerCase(), len = text.length;

        callCMenuCustomerSearchFeedListControllerRef.current.displayMessageFunc({ text: '', position: 'top' });
        len > 0 && callCMenuCustomerSearchFeedListControllerRef.current.showLoadingFunc({ show: true, position: 'top' });

        /* - */
        if (len === 0) {
            isMenuSearchContainerVisible.current = false;
            callCMenuMainContainerRef.current.showSearchMenuContainerFunc({ show: false });
            return;
        }

        /* Show menu search container */
        if (!isMenuSearchContainerVisible.current) {
            isMenuSearchContainerVisible.current = true;
            callCMenuMainContainerRef.current.showSearchMenuContainerFunc({ show: true });
        }

        /* - */
        timer.current = setTimeout(() => {
            searchString.current = text;
            if (len > 0) {
                /* Filter data */
                const data: any[] = dataStoreRootControllerRef.current.customerAccountData.current;
                const res = data.filter((e: any, i: number) => ((e.company_name).toLowerCase()).includes(text) === true);

                if (res.length > 0) {
                    const tab = (res.length > 1) ? res.sort((a: any, b: any) => sortStringFunc({ a: a.company_name, b: b.company_name })) : res;
                    callCMenuCustomerSearchFeedListControllerRef.current.setDataFunc({ data: tab, position: 'top' });
                    callCMenuCustomerSearchFeedListControllerRef.current.showLoadingFunc({ show: false, position: 'top' });

                } else {
                    callCMenuCustomerSearchFeedListControllerRef.current.showLoadingFunc({ show: false, position: 'top' });
                    setTimeout(() => { callCMenuCustomerSearchFeedListControllerRef.current.displayMessageFunc({ text: traduction.current['t0040'], position: 'top' }); }, 320);
                    _dev_ && console.log('nothing found');
                }
            }
        }, 600);
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
                    console.log('ll ::', callCenterDashboardFeedListControllerRef, customerData);
                    /* render selected page */
                    dashBoardPageIdTab.current.push(customerId);
                    callCenterDashboardFeedListControllerRef.current.setDataFunc({ data: customerData, position: 'bottom' });

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
        refIdStore: refIdStore,
        searchString: searchString,
        addRefIdFunc(x: any) { addRefIdFunc(x) },
        deleteRefIdFunc(x: any) { deleteRefIdFunc(x) },
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
            broadcastIndex.current = mainRootControllerRef.current.addToBroadcastDomainFunc({ wid: wid, refId: refId });
            mainRootControllerRef.current.addRefIdFunc({ wid: wid, refId: refId });
            controllerRef?.current?.addRefIdFunc({ wid: wid, refId: refId });
        }
        return () => unmountFunc();
    }, []);

    /* On window size change */
    useEffect(() => {
        // window.addEventListener('resize', onWindowSizeChangeFunc);
        // return () => window.removeEventListener('resize', onWindowSizeChangeFunc);
    });


    /* Return */
    return (<></>);
};

export default forwardRef(CallCMainControllerWidget);
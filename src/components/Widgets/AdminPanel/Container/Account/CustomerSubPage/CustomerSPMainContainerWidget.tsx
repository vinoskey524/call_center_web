/* Standard packages */
import React, { useState, memo, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import './CustomerSPMainContainerWidget.css';
import { generateIdFunc, catchErrorFunc, replaceConsecutiveSpacesByOneFunc } from '../../../../../Tools/methodForest';
import { refIdType } from '../../../../../Tools/type';
import { _dev_, _appEmitterType_, _defaultLanguage_, _success_, _error_, _requestFailed_ } from '../../../../../Tools/constants';
import FeedListWidget from '../../../../FeedList/FeedListWidget';
import trash_icon from '../../../../../Assets/png/trash.png';
import edit_icon from '../../../../../Assets/png/ed.png';
import test_logo from '../../../../../Assets/png/react.png';
import SwitchWidget from '../../../../Others/SwitchWidget';

/** Every change made to "wid" affect controller */
type propsType = { $data: { wid: string, controllerRef?: refIdType, rootControllers: any } };
const CustomerSPMainContainerWidget = forwardRef((props: propsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const refId = ref;

    const windowWidth = useRef(window.innerWidth);
    const windowHeight = useRef(window.innerHeight);

    const refresher = useRef(false);
    const [refresh, setRefresh] = useState(refresher.current);

    const isMounted = useRef(false);
    const mountCount = useRef(0);
    const render = useRef(true);

    const controllerRef = useRef<any>(undefined);

    const broadcastIndex = useRef(-1);

    /* $data */
    const $data = props.$data;
    const wid = useRef($data.wid || generateIdFunc()).current;
    const parentControllerRef = $data.controllerRef;
    const rootControllers = $data.rootControllers || { current: undefined };

    /* Root controllers */
    const mainRootControllerRef: refIdType = rootControllers?.current?.mainRootControllerRef;
    const requestRootControllerRef: refIdType = rootControllers?.current?.requestRootControllerRef;
    const dataStoreRootControllerRef: refIdType = rootControllers?.current?.dataStoreRootControllerRef;

    /* - */

    const traduction = useRef(dataStoreRootControllerRef.current.traduction.current);

    const customerFeedListRef = useRef<any>(undefined);
    const customerSPMainControllerRef = useRef<any>(undefined);

    const testFeed = Array(1).fill(undefined).map((_, i: number) => { return { id: `id_${i}`, fullName: 'Kevin ODOUTAN', email: 'entreprise@gmail.com', phone: '+229 96986123', expiration: '26 jours', active: false } })
    const feedRef = Array(5).fill(undefined).map(() => React.createRef());


    /* ------------------------------------ Methods ------------------------------------- */

    /* Refresh component */
    const refreshFunc = () => { refresher.current = !refresher.current; setRefresh(refresher.current) };

    /* Render */
    const renderFunc = (x: { render: boolean }) => { render.current = x.render; refreshFunc() };

    /* Set language */
    const setTraductionFunc = (x: { traduction: any }) => { traduction.current = x.traduction; refreshFunc() };

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
        // mainRootControllerRef?.current?.deleteRefIdFunc({ wid: wid, refId: refId });
        parentControllerRef?.current?.deleteRefIdFunc({ wid: wid, refId: refId });
    };

    /* Show or hide */
    const showFunc = (x: { show: boolean }) => {
        $('#cspmcw_scaffold').css({ 'z-index': x.show ? 5 : 1 });
        !x.show && $('#cspmcw_scaffold').removeAttr('style');
    };

    /* Create new account */
    const createNewAccountFunc = () => { mainRootControllerRef.current.refIdStore.current['accountCreationRef'].current.showFunc({ show: true, sourcePage: 'customer' }) };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        refreshFunc() { refreshFunc() },
        renderFunc(x: any) { renderFunc(x) },
        setTraductionFunc(x: any) { setTraductionFunc(x) },
        showFunc(x: any) { showFunc(x) }
    }), []);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            broadcastIndex.current = mainRootControllerRef.current.addToBroadcastDomainFunc({ wid: wid, refId: refId });
            (parentControllerRef?.current !== undefined) && parentControllerRef.current.addRefIdFunc({ wid: wid, refId: refId });

            /* init */
            controllerRef.current.initFunc();
        }
        return () => unmountFunc();
    }, []);

    /* On window size change */
    useEffect(() => {
        // window.addEventListener('resize', onWindowSizeChangeFunc);
        // return () => window.removeEventListener('resize', onWindowSizeChangeFunc);
    }, []);


    /* Return */

    /* Create feed */
    // const callCenterFeed = [];
    // if (callCenterFeed.length === 0) for (let i = 0; i < testFeed.length; i++) callCenterFeed.push(<CustomerSPFeedWidget key={i} ref={feedRef[i]} $data={{ controllerRef: controllerRef, rootControllers: rootControllers, accountData: testFeed[i] }} />);

    /* - */
    const component = <>
        <Controller ref={controllerRef} $data={{ wid: 'customerSPMainControllerRef', rootControllers: rootControllers }} />
        {render.current && <>
            <div id='cspmcw_scaffold' className='prevent_select'>
                <div id='cspmcw_header' className='glass'>
                    <div id='cspmcw_title_container'>
                        <h1 id='cspmcw_title'>{traduction.current['t0010']}</h1>
                        <button id='cspmcw_add_account_btn_container' className='btn_opacity' onClick={createNewAccountFunc}>
                            <p id='cspmcw_add_account_btn_title'>+ {traduction.current['t0011']}</p>
                        </button>
                    </div>

                    <div id='cspmcw_table_header'>
                        <div className='cspfw_checkbox_container'>
                            <input className='cspfw_checkbox' type='checkbox' />
                        </div>
                        <div className='cspfw_hyphen' />

                        <p className='cspfw_full_name one_line'>Name</p>
                        <div className='cspfw_hyphen' />

                        <p className='cspfw_email one_line'>Email</p>
                        <div className='cspfw_hyphen' />

                        <p className='cspfw_phone one_line'>Phone</p>
                        <div className='cspfw_hyphen' />

                        <p className='cspfw_expiration one_line'>Expire dans</p>
                        <div className='cspfw_hyphen' />

                        <p className='cspfw_action_btn_container' style={{ justifyContent: 'center' }}>Actions</p>
                    </div>
                </div>

                <div id='cspmcw_body'>
                    <FeedListWidget ref={customerFeedListRef} $data={{
                        wid: 'customerFeedListRef', controllerRef: controllerRef, customerControllerWid: 'customerFeedListControllerRef', rootControllers: rootControllers, paddingTop: 95,
                        widget: ({ _key, _refId, _data }: any) => { return <CustomerSPFeedWidget key={_key} ref={_refId} $data={{ controllerRef: controllerRef, rootControllers: rootControllers, accountData: _data }} /> }
                    }} />
                </div>
            </div>
        </>}
    </>;
    return (<>{render.current && component}</>);

}); export default (CustomerSPMainContainerWidget);














































/* ----------------------------------------------------- Controller ----------------------------------------------------- */

/* Controller */
type ctrlType = { $data: { wid?: string, consumerRef?: refIdType, parentRef?: refIdType, controllerRef?: refIdType, rootControllers: any } };
const __Controller = forwardRef((props: ctrlType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const refId = ref;

    const windowWidth = useRef(window.innerWidth);
    const windowHeight = useRef(window.innerHeight);

    const isMounted = useRef(false);
    const mountCount = useRef(0);
    const emptyRef = useRef<any>(undefined);

    const broadcastIndex = useRef(-1);

    /* $data */
    const $data = props.$data;
    const wid = useRef($data.wid || generateIdFunc()).current;
    const consumerRef = $data.consumerRef;
    const parentRef = $data.parentRef;
    const controllerRef = $data.controllerRef;
    const rootControllers = $data.rootControllers;

    /* Root controllers */
    const mainRootControllerRef: refIdType = rootControllers?.current?.mainRootControllerRef;
    const requestRootControllerRef: refIdType = rootControllers?.current?.requestRootControllerRef;
    const dataStoreRootControllerRef: refIdType = rootControllers?.current?.dataStoreRootControllerRef;

    /* refId store */
    const refIdStore = useRef<any>({});

    /* - */

    const traduction = useRef(dataStoreRootControllerRef.current.traduction.current);

    const currentUserData = useRef<any>(dataStoreRootControllerRef.current.currentUserData.current);
    const customerAccountData = useRef<any[]>(dataStoreRootControllerRef.current.customerAccountData.current);
    const customerAccountNewerTimestamp_ms = useRef<any>(dataStoreRootControllerRef.current.customerAccountNewerTimestamp_ms.current);

    /* - */

    const customerFeedListRef = useRef<any>(undefined);


    /* ------------------------------------ Methods ------------------------------------- */

    /* Add refId */
    const addRefIdFunc = (x: { wid: string, refId: any }) => { refIdStore.current[x.wid] = x.refId };

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
        }
    };

    /* Set traduction */
    const setTraductionFunc = (x: { traduction: any }) => { traduction.current = x.traduction };

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
        mainRootControllerRef?.current?.addRefIdFunc({ wid: wid });
        controllerRef?.current?.deleteRefIdFunc({ wid: wid });
    };

    /* Initialize */
    const initFunc = async () => {
        try {
            refIdStore.current['customerFeedListControllerRef'].current.showLoaderFunc({ show: true });
            let checkDb = false;

            /* Check for local data */
            const localData: any[] = customerAccountData.current;
            if (localData.length > 0) {
                refIdStore.current['customerFeedListControllerRef'].current.setDataFunc({ data: localData, position: 'bottom' });
            } else checkDb = true;

            /* Check db for new data, if necessary */
            if (checkDb) { await refId.current.fetchAccountFunc() }

        } catch (e: any) {
            refIdStore.current['customerFeedListControllerRef'].current.setMessageFunc({ text: traduction.current['t0016'] });
            const err = catchErrorFunc({ err: e.message });
            console.log(err);
        }
    };

    /* Fetch account */
    const fetchAccountFunc = async () => {
        try {
            const domain = currentUserData.current.domain;

            /* Req to pg */
            const req = await requestRootControllerRef.current.fetchAccountFunc({ domain: domain, type: 'customer', state: 'new', timestamp_ms: customerAccountNewerTimestamp_ms.current });
            if (req.status !== _success_) throw new Error(JSON.stringify(req)); /* If error */

            /* On pg req success */
            const data: { adminData: any[], customerData: any[] } = req.data;
            const adminData: any[] = data.adminData;
            const customerData: any[] = data.customerData;

            if (adminData.length > 0 && customerData.length > 0) {
                const mergedData = Object.assign(customerData, { defaultAdmin: adminData });

                /* Store data into dataStoreController */
                dataStoreRootControllerRef.current.setDataFunc({ type: 'customerAccount', data: mergedData });

                /* Render accounts */
                refId.current.renderAccountFunc({ data: mergedData, merged: true });

            } else {
                refIdStore.current['customerFeedListControllerRef'].current.setMessageFunc({ text: traduction.current['t0032'] });
                _dev_ && console.warn('no data found.');
            }

        } catch (e: any) {
            refIdStore.current['customerFeedListControllerRef'].current.setMessageFunc({ text: traduction.current['t0016'] });
            const err = catchErrorFunc({ err: e.message });
            console.log(err);
        }
    };

    /* Render accounts */
    const renderAccountFunc = (x: { data: any, merged?: boolean }) => {
        try {
            const data = x.merged ? x.data : Object.assign(x.data.customerData, { defaultAdmin: x.data.adminData });
            refIdStore.current['customerFeedListControllerRef'].current.setDataFunc({ data: Array.isArray(data) ? data : [data], position: 'top' });

        } catch (e: any) {
            refIdStore.current['customerFeedListControllerRef'].current.setMessageFunc({ text: traduction.current['t0016'] });
            const err = catchErrorFunc({ err: e.message });
            console.log(err);
        }
    };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Imperative handler */
    useImperativeHandle(ref, () => ({
        addRefIdFunc(x: any) { addRefIdFunc(x) },
        deleteRefIdFunc(x: any) { deleteRefIdFunc(x) },

        setTextValueFunc(x: any) { setTextValueFunc(x) },
        fetchAccountFunc() { fetchAccountFunc() },
        renderAccountFunc(x: any) { renderAccountFunc(x) },

        initFunc() { initFunc() }
    }), []);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            broadcastIndex.current = mainRootControllerRef.current.addToBroadcastDomainFunc({ wid: wid, refId: refId });
            mainRootControllerRef.current.addRefIdFunc({ wid: wid, refId: refId });
            (controllerRef?.current !== undefined) && controllerRef.current.addRefIdFunc({ wid: wid, refId: refId });
        }
        return () => unmountFunc();
    }, []);

    /* - */
    return (<></>);
});
const Controller = memo(__Controller);














































/* ----------------------------------------------------- Direct Children Components ----------------------------------------------------- */

/* Feed */
type customerSPType = { $data: { wid?: string, controllerRef?: refIdType, rootControllers: any, accountData: any } };
const CustomerSPFeedWidget = forwardRef((props: customerSPType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const refId = ref;

    const windowWidth = useRef(window.innerWidth);
    const windowHeight = useRef(window.innerHeight);

    const refresher = useRef(false);
    const [refresh, setRefresh] = useState(refresher.current);

    const isMounted = useRef(false);
    const mountCount = useRef(0);
    const render = useRef(true);

    const broadcastIndex = useRef(-1);

    /* $data */
    const $data = props.$data;
    const wid = useRef($data.wid || generateIdFunc()).current;
    const controllerRef = $data.controllerRef;
    const rootControllers = $data.rootControllers || { current: undefined };
    const accountData = useRef($data.accountData);

    /* Root controllers */
    const mainRootControllerRef: refIdType = rootControllers?.current?.mainRootControllerRef;
    const requestRootControllerRef: refIdType = rootControllers?.current?.requestRootControllerRef;
    const dataStoreRootControllerRef: refIdType = rootControllers?.current?.dataStoreRootControllerRef;

    /* - */

    const traduction = useRef(dataStoreRootControllerRef.current.traduction.current);

    const switchRef = useRef(undefined);


    /* ------------------------------------ Methods ------------------------------------- */

    /* Refresh component */
    const refreshFunc = () => { refresher.current = !refresher.current; setRefresh(refresher.current) };

    /* Render */
    const renderFunc = (x: { render: boolean }) => { render.current = x.render; refreshFunc() };

    /* Set language */
    const setTraductionFunc = (x: { traduction: any }) => { traduction.current = x.traduction; refreshFunc() };

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
        mainRootControllerRef.current.deleteFromBroadcastDomainFunc({ index: broadcastIndex.current });
        mainRootControllerRef.current.deleteRefIdFunc({ wid: wid, refId: refId });
        (controllerRef?.current !== undefined) && controllerRef.current.deleteRefIdFunc({ wid: wid, refId: refId });
    };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        refreshFunc() { refreshFunc() },
        renderFunc(x: any) { renderFunc(x) },
        setTraductionFunc(x: any) { setTraductionFunc(x) }
    }), []);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            broadcastIndex.current = mainRootControllerRef.current.addToBroadcastDomainFunc({ wid: wid, refId: refId });
            (controllerRef?.current !== undefined) && controllerRef.current.addRefIdFunc({ wid: wid, refId: refId });
        }
        return () => unmountFunc();
    }, []);

    /* On window size change */
    useEffect(() => {
        // window.addEventListener('resize', onWindowSizeChangeFunc);
        // return () => window.removeEventListener('resize', onWindowSizeChangeFunc);
    }, []);


    /* Return */

    const component = <>
        <div className='cspfw_scaffold prevent_select'>
            <div className='cspfw_checkbox_container'>
                <input className='cspfw_checkbox' type='checkbox' />
                {test_logo && <img className='cspfw_icon' src={test_logo} />}
            </div>
            <div className='cspfw_hyphen' />

            <p className='cspfw_full_name one_line'>{accountData.current.company_name}</p>
            <div className='cspfw_hyphen' />

            <p className='cspfw_email one_line'>{accountData.current.email}</p>
            <div className='cspfw_hyphen' />

            <p className='cspfw_phone one_line'>{accountData.current.phone}</p>
            <div className='cspfw_hyphen' />

            <p className='cspfw_expiration one_line'>{accountData.current.expiration}</p>
            <div className='cspfw_hyphen' />

            <div className='cspfw_action_btn_container'>
                <SwitchWidget ref={switchRef} $data={{
                    wid: 'switchRef', refId: switchRef, controllerRef: { current: undefined }, style: { width: 40, height: 21, backgroundColor: 'white' }, title: traduction.current['t0012'],
                    switched: accountData.current.is_active ? true : false
                }} />
                <img className='cspfw_action_btn_icon btn_opacity' style={{ marginInline: 20 }} src={edit_icon} onClick={() => { }} />
                <img className='cspfw_action_btn_icon btn_opacity' src={trash_icon} title='Delete' onClick={() => { }} />
            </div>
        </div>
    </>;
    return (<>{render.current && component}</>);
});

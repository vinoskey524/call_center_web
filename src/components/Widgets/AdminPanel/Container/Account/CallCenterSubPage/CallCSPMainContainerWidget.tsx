/* Standard packages */
import React, { useState, memo, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import './CallCSPMainContainerWidget.css';
import { generateIdFunc, catchErrorFunc, replaceConsecutiveSpacesByOneFunc } from '../../../../../Tools/methodForest';
import { refIdType } from '../../../../../Tools/type';
import { _appEmitterType_, _defaultLanguage_, _success_, _error_, _requestFailed_, _dev_ } from '../../../../../Tools/constants';
import FeedListWidget from '../../../../FeedList/FeedListWidget';
import trash_icon from '../../../../../Assets/png/trash.png';
import edit_icon from '../../../../../Assets/png/ed.png';
import logo_h_icon from '../../../../../Assets/png/logo_h.png';
import logo_f_icon from '../../../../../Assets/png/logo_f.png';
import SwitchWidget from '../../../../Others/SwitchWidget';

/** Every change made to "wid" affect controller */
type propsType = { $data: { wid: string, controllerRef?: refIdType, rootControllers: any } };
const CallCSPMainContainerWidget = forwardRef((props: propsType, ref: any) => {
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

    const callCenterFeedListRef = useRef(undefined);

    const testFeed = Array(1).fill(undefined).map((_, i: number) => { return { id: `id_${i}`, fullName: 'Kevin ODOUTAN', username: 'o.kevin', ssm: 'kh!jnox.e$', rights: 'Full', status: 'connected', active: false } })

    const feedRef = Array(5).fill(undefined).map(() => React.createRef());


    /* ------------------------------------ Methods ------------------------------------- */

    /* Refresh component */
    const refreshFunc = () => {
        refresher.current = !refresher.current;
        setRefresh(refresher.current);
    };

    /* Render */
    const renderFunc = (x: { render: boolean }) => {
        render.current = x.render;
        refreshFunc();
    };

    /* Set traduction */
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
        mainRootControllerRef?.current?.deleteRefIdFunc({ wid: wid, refId: refId });
        parentControllerRef?.current?.deleteRefIdFunc({ wid: wid, refId: refId });
    };

    /* Show or hide */
    const showFunc = (x: { show: boolean }) => {
        $('#ccspmcw_scaffold').css({ 'z-index': x.show ? 5 : 1 });
        !x.show && $('#ccspmcw_scaffold').removeAttr('style');
    };

    /* Create new account */
    const createNewAccountFunc = () => { mainRootControllerRef.current.refIdStore.current['accountCreationRef'].current.showFunc({ show: true, sourcePage: 'callCenter' }) };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        refreshFunc() { refreshFunc() },
        setTraductionFunc(x: any) { setTraductionFunc(x) },
        showFunc(x: any) { showFunc(x) }
    }), []);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            broadcastIndex.current = mainRootControllerRef.current.addToBroadcastDomainFunc({ wid: wid, refId: refId });
            mainRootControllerRef.current.addRefIdFunc({ wid: wid, refId: refId });
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
    const callCenterFeed = [];
    if (callCenterFeed.length === 0) for (let i = 0; i < testFeed.length; i++) callCenterFeed.push(<CallCSPFeedWidget key={i} ref={feedRef[i]} $data={{ controllerRef: controllerRef, rootControllers: rootControllers, accountData: testFeed[i] }} />);

    /* - */
    const component = <>
        <Controller ref={controllerRef} $data={{ wid: 'callCSPMainControllerRef', rootControllers: rootControllers }} />
        {render.current && <>
            <div id='ccspmcw_scaffold' className='prevent_select'>
                <div id='ccspmcw_header' className='glass'>
                    <div id='ccspmcw_title_container'>
                        <h1 id='ccspmcw_title'>{traduction.current['t0009']}</h1>
                        <button id='ccspmcw_add_account_btn_container' className='btn_opacity' onClick={createNewAccountFunc}>
                            <p id='ccspmcw_add_account_btn_title'>+ {traduction.current['t0011']}</p>
                        </button>
                    </div>

                    <div id='ccspmcw_table_header'>
                        <div className='ccspfw_checkbox_container'>
                            <input className='ccspfw_checkbox' type='checkbox' />
                        </div>
                        <div className='ccspfw_hyphen' />

                        <p className='ccspfw_full_name one_line'>Name</p>
                        <div className='ccspfw_hyphen' />

                        <p className='ccspfw_username one_line'>Username</p>
                        <div className='ccspfw_hyphen' />

                        <p className='ccspfw_status one_line'>Status</p>
                        <div className='ccspfw_hyphen' />

                        <p className='ccspfw_action_btn_container' style={{ justifyContent: 'center' }}>Actions</p>
                    </div>
                </div>

                <div id='ccspmcw_body'>
                    <FeedListWidget ref={callCenterFeedListRef} $data={{
                        wid: 'callCenterFeedListRef', controllerRef: controllerRef, customerControllerWid: 'callCenterFeedListControllerRef', rootControllers: rootControllers, paddingTop: 95,
                        widget: ({ _key, _refId, _data }: any) => { return <CallCSPFeedWidget key={_key} ref={_refId} $data={{ controllerRef: controllerRef, rootControllers: rootControllers, accountData: _data }} /> }
                    }} />
                </div>
            </div>
        </>}
    </>;
    return (component);

}); export default (CallCSPMainContainerWidget);










































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
    const wid = useRef(props.$data.wid || generateIdFunc()).current;
    const consumerRef = props.$data.consumerRef;
    const parentRef = props.$data.parentRef;
    const controllerRef = props.$data.controllerRef;
    const rootControllers = props.$data.rootControllers;

    /* Root controllers */
    const mainRootControllerRef: refIdType = rootControllers?.current?.mainRootControllerRef;
    const requestRootControllerRef: refIdType = rootControllers?.current?.requestRootControllerRef;
    const dataStoreRootControllerRef: refIdType = rootControllers?.current?.dataStoreRootControllerRef;

    /* Refs */
    const refIdStore = useRef<any>({});

    /* - */
    const traduction = useRef(dataStoreRootControllerRef.current.traduction.current);
    const currentUserData = useRef<any>(dataStoreRootControllerRef.current.currentUserData.current);
    const callCenterAccountData = useRef<any[]>(dataStoreRootControllerRef.current.callCenterAccountData.current);
    const callCenterAccountNewerTimestamp_ms = useRef(dataStoreRootControllerRef.current.callCenterAccountNewerTimestamp_ms.current);

    /* - */


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
            refIdStore.current['callCenterFeedListControllerRef'].current.showLoaderFunc({ show: true });
            let checkDb = false;

            /* Check for local data */
            const localData: any[] = callCenterAccountData.current;
            if (localData.length > 0) {
                refIdStore.current['callCenterFeedListControllerRef'].current.setDataFunc({ data: localData, position: 'bottom' });
            } else checkDb = true;

            /* Check db for new data, if necessary */
            if (checkDb) { await refId.current.fetchAccountFunc() }

        } catch (e: any) { catchErrorFunc({ err: e.message }) }
    };

    /* Fetch account */
    const fetchAccountFunc = async () => {
        try {
            const domain = currentUserData.current.domain;

            /* Req to pg */
            const req = await requestRootControllerRef.current.fetchAccountFunc({ domain: domain, type: 'call_center', state: 'new', timestamp_ms: callCenterAccountNewerTimestamp_ms.current });
            if (req.status !== _success_) throw new Error(JSON.stringify(req)); /* If error */

            /* On pg req success */
            const data: { userData: any[], accountData: any[] } = req.data;
            const userData: any[] = data.userData;
            const accountData: any[] = data.accountData;
            if (userData.length > 0 && accountData.length > 0) {
                /* Merge data */
                const mergedData = refId.current.mergeAccountDataFunc({ userData: userData, accountData: accountData });

                /* Store data into dataStoreController */
                dataStoreRootControllerRef.current.setDataFunc({ type: 'callCenterAccount', data: mergedData });

                /* Render accounts */
                refId.current.renderAccountFunc({ data: mergedData, merged: true });

            } else {
                refIdStore.current['callCenterFeedListControllerRef'].current.setMessageFunc({ text: traduction.current['t0032'] });
                _dev_ && console.warn('no data found.');
            }

        } catch (e: any) {
            const err = catchErrorFunc({ err: e.message });
            console.log(err);
        }
    };

    /* Merge account data */
    const mergeAccountDataFunc = (x: { userData: any[], accountData: any[] }) => {
        const userData = x.userData, accountData = x.accountData;
        let mergedData = [];

        for (let i = 0; i < userData.length; i++) {
            const user = userData[i];
            const account = (accountData.filter((e: any) => e.id === user.id))[0];

            delete user._id;
            delete account._id;
            delete account.id;
            delete account.timestamp;
            delete account.timestamp_ms;

            const res = Object.assign(user, account);
            mergedData.push(res);
        }

        return mergedData;
    };

    /* Render accounts */
    const renderAccountFunc = (x: { data: any, merged?: boolean }) => {
        try {
            const data = x.data;
            const merged = x.merged ? x.merged : false;
            const mergedData = merged ? data : refId.current.mergeAccountDataFunc({ userData: [data.userData], accountData: [data.accountData] });
            refIdStore.current['callCenterFeedListControllerRef'].current.setDataFunc({ data: mergedData, position: 'top' });

        } catch (e: any) { catchErrorFunc({ err: e.message }) }
    };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Imperative handler */
    useImperativeHandle(ref, () => ({
        addRefIdFunc(x: any) { addRefIdFunc(x) },
        deleteRefIdFunc(x: any) { deleteRefIdFunc(x) },
        setTextValueFunc(x: any) { setTextValueFunc(x) },
        setTraductionFunc(x: any) { setTraductionFunc(x) },
        fetchAccountFunc() { fetchAccountFunc() },
        mergeAccountDataFunc(x: any) { return mergeAccountDataFunc(x) },
        renderAccountFunc(x: any) { renderAccountFunc(x) },
        initFunc() { initFunc() }
    }), []);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            broadcastIndex.current = mainRootControllerRef.current.addToBroadcastDomainFunc({ wid: wid, refId: refId });
            mainRootControllerRef.current.addRefIdFunc({ wid: wid, refId: refId });
        }
        return () => unmountFunc();
    }, []);

    /* - */
    return (<></>);
});
const Controller = memo(__Controller);


















































/* ----------------------------------------------------- Direct Children Components ----------------------------------------------------- */

/* Feed */
type callFeedPropType = { $data: { wid?: string, controllerRef?: refIdType, rootControllers: any, accountData: any } };
const CallCSPFeedWidget = forwardRef((props: callFeedPropType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const refId = ref;

    const windowWidth = useRef(window.innerWidth);
    const windowHeight = useRef(window.innerHeight);

    const refresher = useRef(false);
    const [refresh, setRefresh] = useState(refresher.current);

    const isMounted = useRef(false);
    const mountCount = useRef(0);
    const render = useRef(!false);

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
    const refreshFunc = () => {
        refresher.current = refresher.current ? false : true;
        setRefresh(refresher.current);
    };

    /* Render */
    const renderFunc = (x: { render: boolean }) => {
        render.current = x.render;
        refreshFunc();
    };

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
        controllerRef?.current?.deleteRefIdFunc({ wid: wid, refId: refId });
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
            // mainRootControllerRef.current.addRefIdFunc({ wid: wid, refId: refId });
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
        <div className='ccspfw_scaffold prevent_select'>
            <div className='ccspfw_checkbox_container'>
                <input className='ccspfw_checkbox' type='checkbox' />
                <img className='ccspfw_icon' src={logo_h_icon} />
            </div>
            <div className='ccspfw_hyphen' />

            <p className='ccspfw_full_name one_line'>{accountData.current.fullname}</p>
            <div className='ccspfw_hyphen' />

            <p className='ccspfw_username one_line'>{accountData.current.username}</p>
            <div className='ccspfw_hyphen' />

            <p className='ccspfw_status one_line'>{accountData.current.status}</p>
            <div className='ccspfw_hyphen' />

            <div className='ccspfw_action_btn_container'>
                <SwitchWidget ref={switchRef} $data={{
                    wid: 'switchRef', refId: switchRef, controllerRef: { current: undefined }, style: { width: 40, height: 21, backgroundColor: 'white' }, title: traduction.current['t0012'],
                    switched: accountData.current.is_active ? true : false
                }} />
                <img className='ccspfw_action_btn_icon btn_opacity' style={{ marginInline: 20 }} src={edit_icon} onClick={() => { }} />
                <img className='ccspfw_action_btn_icon btn_opacity' src={trash_icon} title='Delete' onClick={() => { }} />
            </div>
        </div>
    </>;
    return (render.current ? component : <></>);
});
// @refersh reset

/* Standard packages */
import React, { useState, memo, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import './AdminASPMainContainerWidget.css';
import { generateIdFunc, catchErrorFunc, replaceAllOccurenceFunc, replaceConsecutiveSpacesByOneFunc } from '../../../../../Tools/methodForest';
import { refIdType } from '../../../../../Tools/type';
import { _dev_, _appEmitterType_, _defaultLanguage_, _success_, _error_, _requestFailed_ } from '../../../../../Tools/constants';
import SwitchWidget from '../../../../Others/SwitchWidget';
import reload_icon from '../../../../../Assets/png/reload.png';
import FeedListWidget from '../../../../FeedList/FeedListWidget';
import trash_icon from '../../../../../Assets/png/trash.png';
import edit_icon from '../../../../../Assets/png/ed.png';

/** Every change made to "wid" affect controller */
type propsType = { $data: { wid?: string, controllerRef?: refIdType, rootControllers: any } };
const AdminASPMainContainerWidget = forwardRef((props: propsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const refId = ref;

    const windowWidth = useRef(window.innerWidth);
    const windowHeight = useRef(window.innerHeight);

    const refresher = useRef(false);
    const [refresh, setRefresh] = useState(refresher.current);

    const isMounted = useRef(false);
    const mountCount = useRef(0);
    const render = useRef(!false);

    const controllerRef = useRef<any>(undefined);

    const broadcastIndex = useRef(-1);

    /* $data */
    const $data = props.$data;
    const wid = $data.wid;
    const parentControllerRef = $data.controllerRef;
    const rootControllers = $data.rootControllers;

    /* Root controllers */
    const mainRootControllerRef: refIdType = rootControllers?.current?.mainRootControllerRef;
    const requestRootControllerRef: refIdType = rootControllers?.current?.requestRootControllerRef;
    const dataStoreRootControllerRef: refIdType = rootControllers?.current?.dataStoreRootControllerRef;

    /* - */

    const traduction = useRef(dataStoreRootControllerRef.current.traduction.current);

    const testFeed = Array(1).fill(undefined).map((_, i: number) => { return { id: `id_${i}`, fullname: 'Kevin ODOUTAN', username: 'o.kevin', ssm: 'kh!jnox.e$', rights: 'Full', status: 'connected', active: false } });

    const feedRef = Array(5).fill(undefined).map(() => React.createRef());

    const switchRef = useRef(undefined);

    const adminASPMainControllerRef = useRef<any>(undefined);

    const adminFeedListRef = useRef<any>(undefined);


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
        mainRootControllerRef?.current?.deleteFromBroadcastDomainFunc({ index: broadcastIndex.current });
        // mainRootControllerRef?.current?.deleteRefIdFunc({ wid: wid, refId: refId });
        parentControllerRef?.current?.deleteRefIdFunc({ wid: wid, refId: refId });
    };

    /* Show or hide */
    const showFunc = (x: { show: boolean }) => {
        $('#aap_scaffold').css({ 'z-index': x.show ? 5 : 2 });
        !x.show && $('#accp_scaffold').removeAttr('style');
    };

    /* Create new account */
    const createNewAccountFunc = () => { mainRootControllerRef.current.refIdStore.current['accountCreationRef'].current.showFunc({ show: true, sourcePage: 'admin' }) };

    /* Fetch account */
    const fetchAccountFunc = () => { adminASPMainControllerRef.current.fetchAccountFunc() };


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

    const component = <>
        <Controller ref={controllerRef} $data={{ wid: 'adminASPMainControllerRef', rootControllers: rootControllers }} />
        <div id='aaspmw_scaffold' className='prevent_select'>
            <div id='aaspmw_header' className='glass'>
                <div id='aaspmv_title_container'>
                    <h1 id='aaspmw_title'>{traduction.current['t0008']}</h1>
                    <button id='aaspmw_add_account_btn_container' className='btn_opacity' onClick={createNewAccountFunc}>
                        <p id='aaspmw_add_account_btn_title'>+ {traduction.current['t0011']}</p>
                    </button>
                    <button id='aaspmv_refresh_btn_container' onClick={fetchAccountFunc}>
                        <img id='aaspmv_refresh_btn_icon' src={reload_icon} />
                    </button>
                </div>

                <div id='aaspmw_table_header'>
                    <div className='aaspfw_checkbox_container'>
                        <input className='aaspfw_checkbox' type='checkbox' />
                    </div>
                    <div className='aaspfw_hyphen' />

                    <p className='aaspfw_full_name one_line'>Name</p>
                    <div className='aaspfw_hyphen' />

                    <p className='aaspfw_username one_line'>Username</p>
                    <div className='aaspfw_hyphen' />

                    <p className='aaspfw_rights one_line'>Rights</p>
                    <div className='aaspfw_hyphen' />

                    <p className='aaspfw_status one_line'>Status</p>
                    <div className='aaspfw_hyphen' />

                    <p className='aaspfw_action_btn_container' style={{ justifyContent: 'center' }}>Actions</p>
                </div>
            </div>

            <div id='aaspmw_body'>
                <FeedListWidget ref={adminFeedListRef} $data={{
                    wid: 'adminFeedListRef', controllerRef: controllerRef, customerControllerWid: 'adminFeedListControllerRef', rootControllers: rootControllers, paddingTop: 95,
                    widget: ({ _key, _refId, _data }: any) => { return <AdminASPFeedWidget key={_key} ref={_refId} $data={{ controllerRef: controllerRef, rootControllers: rootControllers, accountData: _data }} /> }
                }} />
            </div>
        </div>
    </>;
    return (render.current ? component : <></>);

}); export default (AdminASPMainContainerWidget);



















































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
    const controllerRef = $data.controllerRef;
    const rootControllers = $data.rootControllers;

    /* Refs */
    const refIdStore = useRef<any>({});

    /* Root controllers */
    const mainRootControllerRef: refIdType = rootControllers?.current?.mainRootControllerRef;
    const requestRootControllerRef: refIdType = rootControllers?.current?.requestRootControllerRef;
    const dataStoreRootControllerRef: refIdType = rootControllers?.current?.dataStoreRootControllerRef;

    /* - */

    const traduction = useRef(dataStoreRootControllerRef.current.traduction.current);

    const currentUserData = useRef(dataStoreRootControllerRef.current.currentUserData.current);
    const mainAdminAccountData = useRef(dataStoreRootControllerRef.current.mainAdminAccountData.current);
    const mainAdminAccountNewerTimestamp_ms = useRef(dataStoreRootControllerRef.current.mainAdminAccountNewerTimestamp_ms.current);

    /* Refs */


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
            refIdStore.current['adminFeedListControllerRef'].current.showLoaderFunc({ show: true });
            let checkDb = false;

            /* Check for local data */
            const localData: any[] = mainAdminAccountData.current;
            if (localData.length > 0) {
                refIdStore.current['adminFeedListControllerRef'].current.setDataFunc({ data: localData, position: 'bottom' });
            } else checkDb = true;

            /* Check db for new data, if necessary */
            if (checkDb) { await refId.current.fetchAccountFunc() }

        } catch (e: any) {
            refIdStore.current['adminFeedListControllerRef'].current.setMessageFunc({ text: traduction.current['t0016'] });
            const err = catchErrorFunc({ err: e.message });
            console.log('err ::', err);
        }
    };

    /* Fetch account */
    const fetchAccountFunc = async () => {
        try {
            const domain = currentUserData.current.domain;

            /* Req to pg */
            const req = await requestRootControllerRef.current.fetchAccountFunc({ domain: domain, type: 'main_admin', state: 'new', timestamp_ms: mainAdminAccountNewerTimestamp_ms.current });
            if (req.status !== _success_) throw new Error(JSON.stringify(req)); /* If error */

            /* On pg req success */
            const data: { userData: any[], accountData: any[] } = req.data;
            const userData: any[] = data.userData;
            const accountData: any[] = data.accountData;
            if (userData.length > 0 && accountData.length > 0) {
                /* Merge data */
                const mergedData = refId.current.mergeAccountDataFunc({ userData: userData, accountData: accountData });

                /* Store data into dataStoreController */
                dataStoreRootControllerRef.current.setDataFunc({ type: 'mainAdminAccount', data: mergedData });

                /* Render accounts */
                refId.current.renderAccountFunc({ data: mergedData, merged: true });

            } else {
                refIdStore.current['adminFeedListControllerRef'].current.setMessageFunc({ text: traduction.current['t0032'] });
                _dev_ && console.log('no data found.');
            }

        } catch (e: any) {
            refIdStore.current['adminFeedListControllerRef'].current.setMessageFunc({ text: traduction.current['t0016'] });
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
            refIdStore.current['adminFeedListControllerRef'].current.setDataFunc({ data: mergedData, position: 'top' });

        } catch (e: any) {
            const err = catchErrorFunc({ err: e.message });
            console.log(err);
        }
    };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Imperative handler */
    useImperativeHandle(ref, () => ({
        addRefIdFunc(x: any) { addRefIdFunc(x) },
        deleteRefIdFunc(x: any) { deleteRefIdFunc(x) },

        setTraductionFunc(x: any) { setTraductionFunc(x) },
        setTextValueFunc(x: any) { setTextValueFunc(x) },

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
type adminASPType = { $data: { wid?: string, controllerRef?: refIdType, rootControllers: any, accountData: any } };
const AdminASPFeedWidget = forwardRef((props: adminASPType, ref: any) => {
    /* ----------------------------------------------------------- Constants ----------------------------------------------------------- */

    const refId = ref;

    const windowWidth = useRef(window.innerWidth);
    const windowHeight = useRef(window.innerHeight);

    const refresher = useRef(false);
    const [refresh, setRefresh] = useState(refresher.current);

    const isMounted = useRef(false);
    const mountCount = useRef(0);
    const render = useRef(!false);

    /* $data */
    const $data = props.$data;
    const wid = useRef($data.wid || generateIdFunc()).current;
    const parentControllerRef = $data.controllerRef;
    const rootControllers = $data.rootControllers;
    const accountData = useRef($data.accountData);

    /* Root controllers */
    const mainRootControllerRef: refIdType = rootControllers?.current?.mainRootControllerRef;
    const requestRootControllerRef: refIdType = rootControllers?.current?.requestRootControllerRef;
    const dataStoreRootControllerRef: refIdType = rootControllers?.current?.dataStoreRootControllerRef;

    /* - */

    const traduction = useRef(dataStoreRootControllerRef.current.traduction.current);

    const switchRef = useRef(undefined);

    /* User data */
    const rights = accountData.current.rights;
    const isActive = accountData.current.is_active;


    /* ----------------------------------------------------------- Methods ----------------------------------------------------------- */

    /* Refresh component */
    const refreshFunc = () => {
        refresher.current = refresher.current ? false : true;
        setRefresh(refresher.current);
    };

    /* Set traduction */
    const setTraductionFunc = (x: { traduction: any }) => { traduction.current = x.traduction; setRefresh(!refresh); };

    /* On window size change */
    const onWindowSizeChangeFunc = () => {
        windowWidth.current = window.innerWidth;
        windowHeight.current = window.innerHeight;
    };


    /* ----------------------------------------------------------- Hooks ----------------------------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        refreshFunc() { refreshFunc() },
        setTraductionFunc(x: any) { setTraductionFunc(x) }
    }), []);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
        }
    }, []);

    /* On window size change */
    useEffect(() => {
        // window.addEventListener('resize', onWindowSizeChangeFunc);
        // return () => window.removeEventListener('resize', onWindowSizeChangeFunc);
    }, []);


    /* Return */

    const component = <>
        <div className='aaspfw_scaffold prevent_select'>
            <div className='aaspfw_checkbox_container'>
                <input className='aaspfw_checkbox' type='checkbox' />
            </div>
            <div className='aaspfw_hyphen' />

            <p className='aaspfw_full_name one_line'>{accountData.current.fullname}</p>
            <div className='aaspfw_hyphen' />

            <p className='aaspfw_username one_line'>{accountData.current.username}</p>
            <div className='aaspfw_hyphen' />

            <p className='aaspfw_rights one_line'>{'rights'}</p>
            <div className='aaspfw_hyphen' />

            <p className='aaspfw_status one_line'>{accountData.current.status}</p>
            <div className='aaspfw_hyphen' />

            <div className='aaspfw_action_btn_container'>
                <SwitchWidget ref={switchRef} $data={{
                    wid: 'switchRef', refId: switchRef, controllerRef: { current: undefined }, style: { width: 40, height: 21, backgroundColor: 'white' }, title: traduction.current['t0012'],
                    switched: accountData.current.is_active ? true : false
                }} />

                <img className='aaspfw_action_btn_icon btn_opacity' style={{ marginInline: 20 }} src={edit_icon} onClick={() => { }} />
                <img className='aaspfw_action_btn_icon btn_opacity' src={trash_icon} title='Delete' onClick={() => { }} />
            </div>
        </div>
    </>;
    return (render.current ? component : <></>);
});
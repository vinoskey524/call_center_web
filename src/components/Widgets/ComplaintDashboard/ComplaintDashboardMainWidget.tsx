/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle, memo } from 'react';
import $ from 'jquery';

/* Custom packages */
import './ComplaintDashboardMainWidget.css';
import { generateIdFunc, catchErrorFunc, replaceConsecutiveSpacesByOneFunc } from '../../Tools/methodForest';
import { refIdType } from '../../Tools/type';
import { _success_, _defaultLanguage_ } from '../../Tools/constants';
import FeedListWidget from '../FeedList/FeedListWidget';
import edit_icon from '../../Assets/png/edit_1.png';
import history_icon from '../../Assets/png/history.png';
import arrow_down_icon from '../../Assets/png/arrow_down.png';
import back_icon from '../../Assets/png/back.png';
import trash_icon from '../../Assets/png/trash_1.png';
import replace_icon from '../../Assets/png/replace.png';
import trash_3_icon from '../../Assets/png/trash_3.png';
import star_icon from '../../Assets/png/star.png';
import more_icon from '../../Assets/png/more.png';
import target_icon from '../../Assets/png/target.png';
import location_icon from '../../Assets/png/location.png';
import clock_icon from '../../Assets/png/clock.png';


/** Every change made to "wid" affect controller */
type propsType = { $data: { wid: string, controllerRef: refIdType, rootControllers: any } };
const ComplaintDashboardMainWidget = forwardRef((props: propsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const refId: refIdType = ref;

    const windowWidth = useRef(window.innerWidth);
    const windowHeight = useRef(window.innerHeight);

    const refresher = useRef(false);
    const [refresh, setRefresh] = useState(refresher.current);

    const isMounted = useRef(false);
    const mountCount = useRef(0);
    const render = useRef(true);

    const emptyRef = useRef(undefined);

    const broadcastIndex = useRef(-1);

    /* $data */
    const $data = props.$data;
    const wid = $data.wid;
    const controllerRef = $data.controllerRef;
    const rootControllers = $data.rootControllers;

    /* Root controllers */
    const mainRootControllerRef: refIdType = rootControllers?.current?.mainRootControllerRef;
    const requestRootControllerRef: refIdType = rootControllers?.current?.requestRootControllerRef;
    const dataStoreRootControllerRef: refIdType = rootControllers?.current?.dataStoreRootControllerRef;

    /* - */

    const traduction = useRef(dataStoreRootControllerRef.current.traduction.current);

    const complaintDashboardControllerRef = useRef<any>(undefined);
    const complaintFeedPreviewRef = useRef<any>(undefined);

    const comdmw_scaffold_id = useRef(generateIdFunc()).current;
    const comdmw_bottom_dock_id = useRef(generateIdFunc()).current;

    /* - */

    const complaintFeedListRef = useRef<any>(undefined);
    const complaintFeedSearchListRef = useRef<any>(undefined);

    const dockChildRef = useRef<any>(undefined);


    /* ------------------------------------ Methods ------------------------------------- */

    /* Refresh component */
    const refreshFunc = () => { refresher.current = !refresher.current; setRefresh(refresher.current) };

    /* Render */
    const renderFunc = (x: { render: boolean }) => { render.current = x.render; refreshFunc() };

    /* Set language */
    const setTraductionFunc = (x: { traduction: any }) => { traduction.current = x.traduction; /* refreshFunc() */ };

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
        controllerRef?.current?.deleteRefIdFunc({ wid: wid, refId: refId });
    };

    /* Show */
    const showFunc = (x: { show: boolean }) => { $(`#${comdmw_scaffold_id}`).css({ 'z-index': x.show ? 1 : 0 }) };

    /* Show dock */
    const showDockFunc = (x: { show: boolean }) => {
        const show = x.show;
        $(`#${comdmw_bottom_dock_id}`).animate({ 'bottom': show ? '25px' : '-100px' }, 300);
    };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        refreshFunc() { refreshFunc() },
        renderFunc(x: any) { renderFunc(x) },
        setTraductionFunc(x: any) { setTraductionFunc(x) },
        showFunc(x: any) { showFunc(x) },
        showDockFunc(x: any) { showDockFunc(x) }
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
    }, []);


    /* Return */

    const component = <>
        <Controller ref={complaintDashboardControllerRef} $data={{ wid: 'complaintDashboardControllerRef', controllerRef: controllerRef, parentRef: refId, rootControllers: rootControllers }} />
        <div id={comdmw_scaffold_id} className='comdmw_scaffold'>
            <div /* list */ className='comdmw_feed_list_container'>
                <div className='comdmw_feed_container'>
                    <div className='comdmw_feed_default_list'>
                        <FeedListWidget ref={complaintFeedListRef} $data={{
                            wid: 'complaintFeedListRef', controllerRef: complaintDashboardControllerRef, rootControllers: rootControllers, customerControllerWid: 'complaintFeedListControllerRef', paddingTop: 60,
                            widget: ({ _key, _refId, _data }: any) => { return <ComplaintFeedWidget key={_key} ref={_refId} $data={{ controllerRef: complaintDashboardControllerRef, rootControllers: rootControllers, feed: _data }} /> }
                        }} />
                    </div>

                    <div className='comdmw_feed_search_list'>
                        <FeedListWidget ref={complaintFeedSearchListRef} $data={{
                            wid: 'complaintFeedSearchListRef', controllerRef: complaintDashboardControllerRef, rootControllers: rootControllers, customerControllerWid: 'complaintFeedSearchListControllerRef', paddingTop: 60,
                            widget: ({ _key, _refId, _data }: any) => { return <ComplaintFeedWidget key={_key} ref={_refId} $data={{ controllerRef: complaintDashboardControllerRef, rootControllers: rootControllers, feed: _data }} /> }
                        }} />
                    </div>
                </div>

                <div className='comdmw_right_bar' />
            </div>

            <div /* Preview */ className='comdmw_feed_preview'>
                <div className='comdmw_feed_preview_wrapper'>
                    <ComplaintFeedPreviewWidget ref={complaintFeedPreviewRef} $data={{ wid: 'complaintFeedPreviewRef', controllerRef: complaintDashboardControllerRef, rootControllers: rootControllers }} />
                </div>

                <div /* Dock */ id={comdmw_bottom_dock_id} className='comdmw_bottom_dock'>
                    <DockChild ref={dockChildRef} $data={{ wid: 'dockChildRef', controllerRef: complaintDashboardControllerRef, rootControllers: rootControllers }} />
                </div>
            </div>
        </div>
    </>;
    return (<>{render.current && component}</>);

}); export default (ComplaintDashboardMainWidget);






















































/* ----------------------------------------------------- Context Consumer & Controller ----------------------------------------------------- */

/* - */
type controllerPropsType = { $data: { wid: string, parentRef: refIdType, controllerRef?: refIdType, rootControllers: any } };
const __controller = forwardRef((props: controllerPropsType, ref: any) => {
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
    const wid = useRef($data.wid || generateIdFunc()).current;
    const parentRef = $data.parentRef;
    const controllerRef = $data.controllerRef;
    const rootControllers = $data.rootControllers || { current: undefined };

    /* Root controllers */
    const mainRootControllerRef: refIdType = rootControllers?.current?.mainRootControllerRef;
    const requestRootControllerRef: refIdType = rootControllers?.current?.requestRootControllerRef;
    const dataStoreRootControllerRef: refIdType = rootControllers?.current?.dataStoreRootControllerRef;

    /* refs */

    const refIdStore = useRef<any>({});

    const complaintFeedListRef = useRef<any>(undefined);
    const complaintFeedListControllerRef = useRef<any>(undefined);
    const complaintFeedSearchListRef = useRef<any>(undefined);
    const complaintFeedSearchListControllerRef = useRef<any>(undefined);
    const complaintFeedPreviewRef = useRef<any>(undefined);

    /* - */

    const traduction = useRef(dataStoreRootControllerRef.current.traduction.current);

    const canInit = useRef(true);

    const currentSelectedComplaintId = useRef<string | undefined>(undefined);
    const currentSelectedComplaintRef = useRef<any>(undefined);


    /* ------------------------------------ Methods ------------------------------------- */

    /* Add widget ref */
    const addRefIdFunc = (x: { wid: string, refId: any }) => {
        const wid = x.wid, refId = x.refId;
        refIdStore.current[wid] = refId;
        switch (wid) {
            case 'complaintFeedListRef': { complaintFeedListRef.current = refId.current } break;
            case 'complaintFeedListControllerRef': { complaintFeedListControllerRef.current = refId.current } break;
            case 'complaintFeedSearchListRef': { complaintFeedSearchListRef.current = refId.current } break;
            case 'complaintFeedSearchListControllerRef': { complaintFeedSearchListControllerRef.current = refId.current } break;
            case 'complaintFeedPreviewRef': { complaintFeedPreviewRef.current = refId.current } break;
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
        controllerRef?.current?.deleteRefIdFunc({ wid: wid, refId: refId });
    };

    /* init */
    const initFunc = async (x: { data: any }) => {
        if (!canInit.current) return; /* stop if can't init */

        try {
            canInit.current = false;

            /* Show loading */
            complaintFeedListControllerRef.current.showLoadingFunc({ show: true, position: 'top' });

            /* - */
            const res = await requestRootControllerRef.current.fetchComplaintFunc({ data: x.data });
            if (res.status !== _success_) throw new Error(JSON.stringify(res));
            const resData = res.data;

            /* store complaint in data store */
            dataStoreRootControllerRef.current.setDataFunc({ type: 'customerComplaintData', data: resData });

            /* render feed */
            complaintFeedListControllerRef.current.setDataFunc({ data: resData, position: 'top' });

            /* hide loading */
            complaintFeedListControllerRef.current.showLoadingFunc({ show: false, position: 'top' });

        } catch (e: any) {
            canInit.current = true;

            const err = catchErrorFunc({ err: e.message });

            /* hide loading */
            complaintFeedListControllerRef.current.showLoadingFunc({ show: false, position: 'top' });
        }
    };

    /* Enable edition */
    const enableEditionFunc = (x: { enable: boolean }) => {
        const enable = x.enable;
        parentRef.current.showDockFunc({ show: !enable });
        complaintFeedPreviewRef.current.enableEditionFunc({ enable: enable });
    };

    /* On complaint creation */
    const onComplaintCreatedFunc = (x: { data: any }) => { complaintFeedListControllerRef.current.setDataFunc({ data: [x.data], position: 'top' }) };

    /* on complaint selected */
    const onComplaintSelectedFunc = (x: { targetId: string, targetRef: refIdType, data: any }) => {
        const targetId = x.targetId, targetRef = x.targetRef, data = x.data;

        /* stop method if complaint is already selected */
        if (targetId === currentSelectedComplaintId.current) return;

        /* unselect current complaint and select next complaint */
        (currentSelectedComplaintRef.current !== undefined) && currentSelectedComplaintRef.current.selectFunc({ select: false });
        targetRef.current.selectFunc({ select: true });

        /* update current select complaint id and ref */
        currentSelectedComplaintId.current = targetId;
        currentSelectedComplaintRef.current = targetRef.current;

        /* preview complaint */
        complaintFeedPreviewRef.current.setDataFunc({ data: data });
    };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        addRefIdFunc(x: any) { addRefIdFunc(x) },
        deleteRefIdFunc(x: any) { deleteRefIdFunc(x) },
        setTextValueFunc(x: any) { setTextValueFunc(x) },
        initFunc(x: any) { initFunc(x) },
        enableEditionFunc(x: any) { enableEditionFunc(x) },
        onComplaintCreatedFunc(x: any) { onComplaintCreatedFunc(x) },
        onComplaintSelectedFunc(x: any) { onComplaintSelectedFunc(x) }
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
});
const Controller = memo(__controller);























































/* ----------------------------------------------------- Direct Children Components ----------------------------------------------------- */

/* ComplaintFeedPreviewWidget */
type complaintFeedPreviewpropsType = { $data: { wid: string, controllerRef: refIdType, rootControllers: any } };
const __complaintFeedPreviewWidget = forwardRef((props: complaintFeedPreviewpropsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const refId: refIdType = ref;

    const windowWidth = useRef(window.innerWidth);
    const windowHeight = useRef(window.innerHeight);

    const refresher = useRef(false);
    const [refresh, setRefresh] = useState(refresher.current);

    const isMounted = useRef(false);
    const mountCount = useRef(0);
    const render = useRef(true);

    const emptyRef = useRef(undefined);

    const broadcastIndex = useRef(-1);

    /* $data */
    const $data = props.$data;
    const wid = useRef($data.wid || generateIdFunc()).current;
    const controllerRef = $data.controllerRef;
    const rootControllers = $data.rootControllers || { current: undefined };

    /* Root controllers */
    const mainRootControllerRef: refIdType = rootControllers?.current?.mainRootControllerRef;
    const requestRootControllerRef: refIdType = rootControllers?.current?.requestRootControllerRef;
    const dataStoreRootControllerRef: refIdType = rootControllers?.current?.dataStoreRootControllerRef;

    /* - */

    const traduction = useRef(dataStoreRootControllerRef.current.traduction.current);

    const enableEdition = useRef(false);

    const feed = useRef<any>(undefined);

    const feedExists = (feed.current !== undefined) ? true : false;

    /* creation date extraction */
    const utc = feedExists ? new Date(feed.current.created_at) : undefined;
    const tmp = (utc !== undefined) ? new Date(utc.toLocaleString()) : undefined;
    const date = tmp?.toLocaleDateString() || '';
    const hour = tmp?.getHours() || '';
    const minute = tmp?.getMinutes() || '';

    /* last modification date extraction */
    const utc1 = (feed.current !== undefined && (feed.current.created_at !== feed.current.last_modification_at)) ? new Date(feed.current.last_modification_at) : undefined;
    const tmp1 = (utc1 !== undefined) ? new Date(utc1.toLocaleString()) : undefined;
    const date1 = tmp1?.toLocaleDateString() || '';
    const hour1 = tmp1?.getHours() || '';
    const minute1 = tmp1?.getMinutes() || '';


    /* ------------------------------------ Methods ------------------------------------- */

    /* Refresh component */
    const refreshFunc = () => { refresher.current = !refresher.current; setRefresh(refresher.current) };

    /* Render */
    const renderFunc = (x: { render: boolean }) => { render.current = x.render; refreshFunc() };

    /* Set language */
    const setTraductionFunc = (x: { traduction: any }) => { traduction.current = x.traduction; /* refreshFunc() */ };

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
        controllerRef?.current?.deleteRefIdFunc({ wid: wid, refId: refId });
    };

    /* Enable edition */
    const enableEditionFunc = (x: { enable: boolean }) => {
        $('.cfeprw_blurable').removeClass('cfeprw_blur_off');
        $('.cfeprw_blurable').addClass('cfeprw_blur_on');

        setTimeout(() => {
            enableEdition.current = x.enable;
            refreshFunc();
            setTimeout(() => {
                $('.cfeprw_blurable').removeClass('cfeprw_blur_on');
                $('.cfeprw_blurable').addClass('cfeprw_blur_off');
            }, 100);
        }, 150);
    };

    /* On done */
    const onDoneFunc = () => { };

    /* On cancel */
    const onCancelFunc = () => { controllerRef.current.enableEditionFunc({ enable: false }) };

    /* set data */
    const setDataFunc = (x: { data: any }) => {
        feed.current = x.data;
        refreshFunc();
    };

    /* on change */
    const onChangeFunc = (x: { type: string, e: any }) => {
        const target = (x.e).nativeEvent.target;
        const id = target.id;
        const value = target.value;
        const type = target.type;
        const name = target.name;

        console.log('oo ::', id, type, target);
    };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        refreshFunc() { refreshFunc() },
        renderFunc(x: any) { renderFunc(x) },
        setTraductionFunc(x: any) { setTraductionFunc(x) },
        enableEditionFunc(x: any) { enableEditionFunc(x) },
        setDataFunc(x: any) { setDataFunc(x) }
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
    }, []);


    /* Return */

    const component = <>
        <div className='cfeprw_scaffold'>
            <div className='cfeprw_spacer' />

            <table id='cfeprw_name_input' className='cfeprw_data_table'>
                <tbody /* Id */ style={{}}>
                    <tr>
                        <th></th>
                        <td style={{ color: '#9e9e9e', fontSize: 12, paddingBottom: 2 }}>Identifiant</td>
                    </tr>
                    <tr>
                        <th className=''>Id :</th>
                        <td className='cfeprw_blurable cfeprw_blur_off enable_select' style={{ color: '#FFD802' }}>{feedExists ? feed.current.id : ''}</td>
                    </tr>
                </tbody>

                <tbody /* Client */ style={{}}>
                    <tr>
                        <th></th>
                        <td style={{ color: '#9e9e9e', fontSize: 12, paddingTop: 12, paddingBottom: 2 }}>Informations client</td>
                    </tr>
                    <tr>
                        <th className=''>Name :</th>
                        <td className='cfeprw_blurable cfeprw_blur_off enable_select'>
                            {enableEdition.current ? <input id='cfeprw_name_input' name='name' className='cfeprw_data_input' type='text' onChange={(e) => onChangeFunc({ type: '', e: e })} value={feedExists ? feed.current.name : ''} /> : <>{feedExists ? feed.current.name : ''}</>}
                        </td>
                    </tr>
                    <tr>
                        <th className=''>Phone :</th>
                        <td className='cfeprw_blurable cfeprw_blur_off enable_select'>
                            {enableEdition.current ? <input id='cfeprw_phone_input' name='phone' className='cfeprw_data_input' type='text' onChange={(e) => onChangeFunc({ type: '', e: e })} value={feedExists ? feed.current.phone : ''} /> : <>{feedExists ? feed.current.phone : ''}</>}
                        </td>
                    </tr>
                    <tr>
                        <th className=''>Location :</th>
                        <td className='cfeprw_blurable cfeprw_blur_off enable_select'>
                            {enableEdition.current ? <input id='cfeprw_location_input' name='location' className='cfeprw_data_input' type='text' onChange={(e) => onChangeFunc({ type: '', e: e })} value={feedExists ? feed.current.location : ''} /> : <>{feedExists ? feed.current.location : ''}</>}
                        </td>
                    </tr>
                </tbody>

                <tbody /* Advanced */ style={{}}>
                    <tr>
                        <th></th>
                        <td style={{ color: '#9e9e9e', fontSize: 12, paddingTop: 12, paddingBottom: 2 }}>Informations avancees</td>
                    </tr>
                    <tr>
                        <th className=''>Object :</th>
                        <td className='cfeprw_blurable cfeprw_blur_off enable_select'>
                            {enableEdition.current ? <input id='cfeprw_object_input' name='object' className='cfeprw_data_input' type='text' onChange={(e) => onChangeFunc({ type: '', e: e })} value={feedExists ? feed.current.object : ''} /> : <>{feedExists ? feed.current.object : ''}</>}
                        </td>
                    </tr>
                    <tr>
                        <th className=''>Product :</th>
                        <td className='cfeprw_blurable cfeprw_blur_off enable_select'>
                            {enableEdition.current ? <input id='cfeprw_product_input' name='product' className='cfeprw_data_input' type='text' onChange={(e) => onChangeFunc({ type: '', e: e })} value={feedExists ? feed.current.product : ''} /> : <>{feedExists ? feed.current.product : ''}</>}
                        </td>
                    </tr>
                    <tr>
                        <th className=''>Agence :</th>
                        <td className='cfeprw_blurable cfeprw_blur_off enable_select'>
                            {enableEdition.current ? <input id='cfeprw_agency_input' name='agency' className='cfeprw_data_input' type='text' onChange={(e) => onChangeFunc({ type: '', e: e })} value={feedExists ? feed.current.agency : ''} /> : <>{feedExists ? feed.current.agency : ''}</>}
                        </td>
                    </tr>
                    <tr>
                        <th className=''>Description :</th>
                        <td className='cfeprw_blurable cfeprw_blur_off enable_select'>
                            {enableEdition.current ? <textarea id='cfeprw_description_input' name='description' className='cfeprw_data_textarea' onChange={(e) => onChangeFunc({ type: '', e: e })} value={feedExists ? feed.current.description : ''} /> : <>{feedExists ? feed.current.description : ''}</>}
                        </td>
                    </tr>
                    {!enableEdition.current &&
                        <tr>
                            <th className=''>Fichiers :</th>
                            <td className='cfeprw_blurable cfeprw_blur_off enable_select'></td>
                        </tr>
                    }
                </tbody>

                {!enableEdition.current &&
                    <tbody /* Autres informations */ style={{}}>
                        <tr>
                            <th></th>
                            <td style={{ color: '#9e9e9e', fontSize: 12, paddingTop: 12, paddingBottom: 2 }}>Autres informations</td>
                        </tr>
                        <tr>
                            <th className=''>Créateur :</th>
                            <td className='cfeprw_blurable cfeprw_blur_off enable_select'>{feedExists ? feed.current.creator : ''}</td>
                        </tr>
                        <tr>
                            <th className=''>Date de création :</th>
                            <td className='cfeprw_blurable cfeprw_blur_off enable_select'>{feedExists ? `${date} à ${hour}:${minute}` : ''}</td>
                        </tr>
                        <tr>
                            <th className=''>Dernière modification :</th>
                            <td className='cfeprw_blurable cfeprw_blur_off enable_select'>{date1 !== '' ? `${date1} à ${hour1}:${minute1} par Luis Godjo` : ''}</td>
                        </tr>
                        <tr>
                            <th className=''>Status :</th>
                            <td className='cfeprw_blurable cfeprw_blur_off enable_select'>{feedExists ? feed.current.status : ''}</td>
                        </tr>
                    </tbody>
                }

                {enableEdition.current &&
                    <tbody /* Action */ style={{}}>
                        <tr>
                            <th className=''></th>
                            <td className=''>
                                <div id='cfeprw_name_input' className='cfeprw_data_action_btn'>
                                    <div id='cfeprw_name_input' className='cfeprw_data_done_btn btn_opacity' onClick={onDoneFunc}>Done</div>
                                    <div id='cfeprw_name_input' className='cfeprw_data_cancel_btn btn_opacity' onClick={onCancelFunc}>Cancel</div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                }
            </table>
        </div>
    </>;
    return (render.current ? component : <></>);
});
const ComplaintFeedPreviewWidget = memo(__complaintFeedPreviewWidget);















































/* ComplaintFeedWidget */
type complaintFeedPropsType = { $data: { wid?: string, controllerRef: refIdType, rootControllers: any, feed: any } };
const __complaintFeedWidget = forwardRef((props: complaintFeedPropsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const refId: refIdType = ref;

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
    const rootControllers = $data.rootControllers;
    const feed = useRef<any>($data.feed);

    /* Root controllers */
    const mainRootControllerRef: refIdType = rootControllers?.current?.mainRootControllerRef;
    const requestRootControllerRef: refIdType = rootControllers?.current?.requestRootControllerRef;
    const dataStoreRootControllerRef: refIdType = rootControllers?.current?.dataStoreRootControllerRef;

    /* - */

    const traduction = useRef(dataStoreRootControllerRef.current.traduction.current);

    const comfew_scaffold_id = useRef(generateIdFunc()).current;

    const utc = new Date(feed.current.created_at);
    const tmp = new Date(utc.toLocaleString());
    const date = tmp.toLocaleDateString();
    const hour = tmp.getHours();
    const min = tmp.getMinutes();


    /* ------------------------------------ Methods ------------------------------------- */

    /* Refresh component */
    const refreshFunc = () => { refresher.current = !refresher.current; setRefresh(refresher.current) };

    /* Render */
    const renderFunc = (x: { render: boolean }) => { render.current = x.render; refreshFunc() };

    /* Set language */
    const setTraductionFunc = (x: { traduction: any }) => { traduction.current = x.traduction; /* refreshFunc() */ };

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
        controllerRef?.current?.deleteRefIdFunc({ wid: wid, refId: refId });
    };

    /* on select */
    const onSelectFunc = () => { controllerRef.current.onComplaintSelectedFunc({ targetId: wid, targetRef: refId, data: feed.current }) };

    /* Select feed */
    const selectFunc = (x: { select: boolean }) => {
        const $el = $(`#${comfew_scaffold_id}`);
        $el.css({ 'background-color': x.select ? 'rgba(149, 167, 189, 0.12)' : 'transparent' });
        !x.select && $el.removeAttr('style');
    };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        refreshFunc() { refreshFunc() },
        renderFunc(x: any) { renderFunc(x) },
        setTraductionFunc(x: any) { setTraductionFunc(x) },
        selectFunc(x: any) { selectFunc(x) }
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
    }, []);


    /* Return */

    const component = <>
        <div id={comfew_scaffold_id} className='comfew_scaffold btn_opacity' onClick={onSelectFunc}>
            <div style={{ flex: 1, marginLeft: 6 }}>
                <div className='comfew_object_container'>
                    <div className='comfew_object_title ellipsis_line_1'>{feed.current.object}</div>
                    <div className='comfew_action_container'>
                        <div className='comfew_action_btn_wrapper'><img className='comfew_action_btn_icon' src={star_icon} /></div>
                        <div className='comfew_action_separator' />
                        <div className='comfew_action_btn_wrapper'><img className='comfew_action_btn_icon' src={more_icon} /></div>
                    </div>
                </div>

                <div className='comfew_container'>
                    <div className='comfew_icon_container'><img className='comfew_icon' src={target_icon} /></div>
                    <div className='comfew_title ellipsis_line_1'>{feed.current.product}</div>
                </div>

                <div className='comfew_container'>
                    <div className='comfew_icon_container'><img className='comfew_agence_icon' src={location_icon} /></div>
                    <div className='comfew_title ellipsis_line_1'>{feed.current.agency}</div>
                </div>

                <div className='comfew_container'>
                    <div className='comfew_icon_container'><img className='comfew_Timestamp_icon' src={clock_icon} /></div>
                    <div className='comfew_title ellipsis_line_1'>{date} • {hour}h{min} • {feed.current.creator}</div>
                </div>

                <div className='comfew_bottom_line' />
            </div>
        </div>
    </>;
    return (<>{render.current && component}</>);
});
const ComplaintFeedWidget = __complaintFeedWidget;















































/* Child */
type childType = { $data: { wid?: string, controllerRef: refIdType, rootControllers: any } };
const __dockChild = forwardRef((props: childType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */
    const refId: refIdType = ref;

    const windowWidth = useRef(window.innerWidth);
    const windowHeight = useRef(window.innerHeight);

    const refresher = useRef(false);
    const [refresh, setRefresh] = useState(refresher.current);

    const isMounted = useRef(false);
    const mountCount = useRef(0);
    const render = useRef(true);

    const emptyRef = useRef<any>(undefined);

    const broadcastIndex = useRef(-1);

    /* $data */
    const $data = props.$data;
    const wid = useRef($data.wid || generateIdFunc()).current;
    const controllerRef = $data.controllerRef;
    const rootControllers = $data.rootControllers;

    /* Root controllers */
    const mainRootControllerRef: refIdType = rootControllers?.current?.mainRootControllerRef;
    const requestRootControllerRef: refIdType = rootControllers?.current?.requestRootControllerRef;
    const dataStoreRootControllerRef: refIdType = rootControllers?.current?.dataStoreRootControllerRef;

    /* - */

    const traduction = useRef(dataStoreRootControllerRef.current.traduction.current);

    const isModificationHistoryVisible = useRef(false);
    const isStateContainerVisible = useRef(false);
    const isDeleteContainerVisible = useRef(false);

    const comdmw_dock_history_container_id = useRef(generateIdFunc()).current;
    const comdmw_dock_state_container_id = useRef(generateIdFunc()).current;
    const comdmw_dock_del_confirm_container_id = useRef(generateIdFunc()).current;


    /* ------------------------------------ Methods ------------------------------------- */

    /* Refresh component */
    const refreshFunc = () => { refresher.current = !refresher.current; setRefresh(refresher.current) };

    /* Render */
    const renderFunc = (x: { render: boolean }) => { render.current = x.render; /* refreshFunc() */ };

    /* Set traduction */
    const setTraductionFunc = (x: { traduction: any }) => { traduction.current = x.traduction; /* refreshFunc() */ };

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
        controllerRef?.current?.deleteRefIdFunc({ wid: wid });
    };

    /* On Edit complaint */
    const onEditComplaintFunc = () => { controllerRef.current.enableEditionFunc({ enable: true }) };

    /* Show modification history */
    const onShowModificationHistoryFunc = () => {
        const current = isModificationHistoryVisible.current;
        current && $(`#${comdmw_dock_history_container_id}`).css({ scale: 1.00001 });
        $(`#${comdmw_dock_history_container_id}`).animate(current ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }, 200, () => { current && $(`#${comdmw_dock_history_container_id}`).css({ 'display': 'none' }) });
        !current && $(`#${comdmw_dock_history_container_id}`).css({ 'display': 'flex' });
        isModificationHistoryVisible.current = !isModificationHistoryVisible.current; /* update | Must be last line */
    };

    /* Show state container */
    const onShowStateContainerFunc = () => {
        const current = isStateContainerVisible.current;
        current && $(`#${comdmw_dock_state_container_id}`).css({ scale: 1.00001 });
        $(`#${comdmw_dock_state_container_id}`).animate(current ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }, 200, () => { current && $(`#${comdmw_dock_state_container_id}`).css({ 'display': 'none' }) });
        !current && $(`#${comdmw_dock_state_container_id}`).css({ 'display': 'flex' });
        isStateContainerVisible.current = !isStateContainerVisible.current; /* update | Must be last line */
    };

    /* Show delete container */
    const onShowDeleteContainerFunc = () => {
        const current = isDeleteContainerVisible.current;
        current && $(`#${comdmw_dock_del_confirm_container_id}`).css({ scale: 1.00001 });
        $(`#${comdmw_dock_del_confirm_container_id}`).animate(current ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }, 200, () => { current && $(`#${comdmw_dock_del_confirm_container_id}`).css({ 'display': 'none' }) });
        !current && $(`#${comdmw_dock_del_confirm_container_id}`).css({ 'display': 'flex' });
        isDeleteContainerVisible.current = !isDeleteContainerVisible.current; /* update | Must be last line */
    };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Imperative handler */
    useImperativeHandle(ref, () => ({
        refreshFunc() { refreshFunc() },
        renderFunc(x: any) { renderFunc(x) },
        setTraductionFunc(x: any) { setTraductionFunc(x) },
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
    }, []);


    /* return */

    const component = <>
        <div /* delete */ className='comdmw_dock_container' title='Delete' style={{ marginRight: 12 }}>
            <div className='comdmv_dock_backdrop_blur' />
            <div className='comdmw_dock_del_icon_btn btn_opacity' onClick={onShowDeleteContainerFunc}>
                <img className='comdmw_dock_del_icon' src={trash_icon} />
            </div>

            <div id={comdmw_dock_del_confirm_container_id} className='comdmw_dock_del_confirm_container floating_container_glass'>
                <img className='comdmw_dock_del_confirm_icon' src={trash_3_icon} />
                <div className='comdmw_dock_del_confirm_message'>Etes vous sûr de vouloir continuer ?</div>
                <div className='comdmw_dock_del_confirm_yes btn_opacity'>oui</div>
                <div className='comdmw_dock_del_confirm_no btn_opacity'>non</div>
            </div>
        </div>

        <div /* middle container */ className='comdmw_dock_container'>
            <div className='comdmv_dock_backdrop_blur' />
            <div className='comdmw_dock_wrapper'>
                <div className='comdmw_dock_icon_btn'>
                    <div className='comdmw_dock_icon_wrapper btn_opacity' title='Edit' onClick={onEditComplaintFunc}>
                        <img className='comdmw_dock_icon' src={edit_icon} />
                    </div>
                </div>

                <div className='comdmw_dock_icon_btn'>
                    <div className='comdmw_dock_icon_wrapper btn_opacity' title='History' onClick={onShowModificationHistoryFunc}>
                        <img className='comdmw_dock_icon' src={history_icon} />
                    </div>

                    <div id={comdmw_dock_history_container_id} className='comdmw_dock_history_container floating_container_glass'>
                        <div className='comdmw_dock_history_title'>Historique des modifications</div>
                        <div className='comdmw_dock_history_btn btn_opacity'>#1 <p className='comdmw_dock_history_date'>04/08/2024 • Par Louis Godjo</p></div>
                        <div className='comdmw_dock_history_btn btn_opacity'>#2 <p className='comdmw_dock_history_date'>04/08/2024 • Par Louis Godjo</p></div>
                        <div className='comdmw_dock_history_btn btn_opacity'>#3 <p className='comdmw_dock_history_date'>04/08/2024 • Par Louis Godjo</p></div>
                    </div>
                </div>

                <div className='comdmw_dock_icon_btn'>
                    <div className='comdmw_dock_icon_wrapper btn_opacity' title='Export' onClick={undefined}>
                        <img className='comdmw_dock_icon' style={{ transform: 'rotate(180deg)' }} src={arrow_down_icon} />
                    </div>
                </div>

                <div className='comdmw_dock_icon_btn'>
                    <div className='comdmw_dock_icon_wrapper btn_opacity' title='Status' onClick={onShowStateContainerFunc}>
                        <img className='comdmw_dock_icon' src={replace_icon} />
                    </div>

                    <div id={comdmw_dock_state_container_id} className='comdmw_dock_state_container floating_container_glass'>
                        <div className='comdmw_dock_state_btn btn_opacity'>Non traités</div>
                        <div className='comdmw_dock_state_btn btn_opacity'>En traitement</div>
                        <div className='comdmw_dock_state_btn btn_opacity'>Traités</div>
                    </div>
                </div>
            </div>
        </div>

        <div /* nav */ className='comdmw_dock_container_nav' style={{ marginLeft: 12 }}>
            <div className='comdmw_dock_nav_icon_btn btn_opacity' title='Prev' onClick={undefined}>
                <img className='comdmw_dock_nav_icon' src={back_icon} />
            </div>

            <div className='comdmw_dock_nav_separator' />

            <div className='comdmw_dock_nav_icon_btn btn_opacity' title='Next' onClick={undefined}>
                <img className='comdmw_dock_nav_icon' style={{ transform: 'rotate(180deg)' }} src={back_icon} />
            </div>
        </div>
    </>;
    return (<>{render.current && component}</>);
});
const DockChild = memo(__dockChild);
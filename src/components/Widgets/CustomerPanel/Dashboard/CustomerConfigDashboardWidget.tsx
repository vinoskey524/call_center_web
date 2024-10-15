/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle, memo } from 'react';
import $ from 'jquery';

/* Custom packages */
import './CustomerConfigDashboardWidget.css';
import { generateIdFunc } from '../../../Tools/methodForest';
import { _success_, _error_, _requestFailed_, _dev_ } from '../../../Tools/constants';
import { refIdType } from '../../../Tools/type';
import { _defaultLanguage_ } from '../../../Tools/constants';
import FeedListWidget from '../../FeedList/FeedListWidget';
import edit_2_icon from '../../../Assets/png/edit_2.png';
import trash_2_icon from '../../../Assets/png/trash_2.png';
import cancel_1_icon from '../../../Assets/png/cancel_1.png';
import LoadingWidget from '../../Others/LoadingWidget';


/** Every change made to "wid" affect controller */
type propsType = { $data: { wid: string, controllerRef: refIdType, rootControllers: any } };
const CustomerConfigDashboardWidget = forwardRef((props: propsType, ref: any) => {
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
    const rootControllers = $data.rootControllers;

    /* Root controllers */
    const mainRootControllerRef: refIdType = rootControllers?.current?.mainRootControllerRef;
    const requestRootControllerRef: refIdType = rootControllers?.current?.requestRootControllerRef;
    const dataStoreRootControllerRef: refIdType = rootControllers?.current?.dataStoreRootControllerRef;

    /* - */

    const traduction = useRef(dataStoreRootControllerRef.current.traduction.current);

    const scaffold_id = useRef(generateIdFunc()).current;

    const cuscdw_lm_account_btn_id = useRef(generateIdFunc()).current;
    const cuscdw_lm_object_btn_id = useRef(generateIdFunc()).current;
    const cuscdw_lm_agency_btn_id = useRef(generateIdFunc()).current;

    const currentSelectedBtnId = useRef<string>(cuscdw_lm_account_btn_id);
    const currentSelectedPageId = useRef('cuscdw_account_container');

    const btnIdTab = { account: cuscdw_lm_account_btn_id, object: cuscdw_lm_object_btn_id, agency: cuscdw_lm_agency_btn_id };
    const pageIdTab = { account: 'cuscdw_account_container', object: 'cuscdw_object_container', agency: 'cuscdw_agency_container' };

    const configFeedAccountListRef = useRef<any>(undefined);
    const configFeedObjectListRef = useRef<any>(undefined);
    const configFeedAgencyListRef = useRef<any>(undefined);

    const cuscdw_fullname_input_id = 'cuscdw_fullname_input_id';
    const cuscdw_username_input_id = 'cuscdw_username_input_id';
    const cuscdw_password_input_id = 'cuscdw_password_input_id';
    const cuscdw_confirm_input_id = 'cuscdw_confirm_input_id';

    const cuscdw_object_name_input_id = 'cuscdw_object_name_input_id';
    const cuscdw_agency_name_input_id = 'cuscdw_agency_name_input_id';

    const customerConfigFormLoadingRef = useRef(undefined);

    const isAccountListInitialized = useRef(false);
    const isObjectListInitialized = useRef(false);
    const isAgencyListInitialized = useRef(false);

    const spaceTop = 60;

    const currentPageType = useRef('account');

    const isLeftMenuBtnDisabled = useRef(false);


    /* ------------------------------------ Methods ------------------------------------- */

    /* Refresh component */
    const refreshFunc = () => { refresher.current = !refresher.current; setRefresh(refresher.current) };

    /* Render */
    const renderFunc = (x: { render: boolean }) => { render.current = x.render; /* refreshFunc() */ };

    /* Set traduction */
    const setTraductionFunc = (x: { traduction: any }) => {
        traduction.current = x.traduction;
        $('#cuscdw_submit_btn_id').text(traduction.current['t0025']);
        // refreshFunc();
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
        controllerRef?.current?.deleteRefIdFunc({ wid: wid });
    };

    /* Show | Hide */
    const showFunc = (x: { show: boolean }) => {
        $(`#${scaffold_id}`).css({ transform: `translateY(${x.show ? '0%' : '-100%'})` });
    };

    /* Select page */
    const selectPageFunc = (x: { type: 'account' | 'object' | 'agency' }) => {
        if (isLeftMenuBtnDisabled.current) return;

        const btnId = btnIdTab[x.type];
        const currentBtnId = currentSelectedBtnId.current;

        /* Check if btn is not already selected */
        if (btnId === currentBtnId) return;

        /* Set current page type */
        currentPageType.current = x.type;

        /* empty all input */
        $('.cuscdw_input_box').val('');
        $('.cuscdw_input_box').css({ 'border-bottom': '1px solid #4B4E55' });
        $('#cuscdw_submit_btn_id').css({ 'opacity': '0.5' });

        /* select new btn and unselect old */
        $(`#${currentBtnId}`).css({ backgroundColor: 'transparent' });
        $(`#${btnId}`).css({ backgroundColor: '#007aff' });
        $(`#${currentBtnId}`).removeAttr('style');

        /* update current selected btn id */
        currentSelectedBtnId.current = btnId;

        /* show select page */
        const pageId = pageIdTab[x.type];
        const currentPageId = currentSelectedPageId.current;
        $(`#${currentPageId}`).css({ transform: 'translateX(100%)' });
        $(`#${pageId}`).css({ transform: 'translateX(0%)' });
        currentSelectedPageId.current = pageId;

        /* Change form */
        switch (x.type) {
            case 'account': {
                $('.cuscdw_input_box_for_object').hide();
                $('.cuscdw_input_box_for_agency').hide();
                $('.cuscdw_input_box_for_account').show();
                /* initalized when component mount */
            } break;

            case 'object': {
                $('.cuscdw_input_box_for_agency').hide();
                $('.cuscdw_input_box_for_account').hide();
                $('.cuscdw_input_box_for_object').show();
                !isObjectListInitialized.current && refId.current.initFeedListFunc({ type: 'object' });
                isObjectListInitialized.current = true;
            } break;

            case 'agency': {
                $('.cuscdw_input_box_for_object').hide();
                $('.cuscdw_input_box_for_account').hide();
                $('.cuscdw_input_box_for_agency').show();
                !isAgencyListInitialized.current && refId.current.initFeedListFunc({ type: 'agency' });
                isAgencyListInitialized.current = true;
            } break;

            default: { };
        };
    };

    /* on change */
    const onChangeFunc = (x: { wid: any }) => {
        const val = $(`#${x.wid}`).val();
        controllerRef.current.setTextValueFunc({ wid: x.wid, text: val });
    };

    /* On submit */
    const onSubmitFunc = () => {
        switch (currentSelectedPageId.current) {
            case 'cuscdw_account_container': { controllerRef.current.createAccountFunc() } break;
            case 'cuscdw_object_container': { controllerRef.current.createObjectFunc() } break;
            case 'cuscdw_agency_container': { controllerRef.current.createAgencyFunc() } break;
            default: { _dev_ && console.error(`Unknown pageId "${currentSelectedPageId.current}"`) };
        };
    };

    /* Init feed list */
    const initFeedListFunc = (x: { type: 'account' | 'object' | 'agency' }) => { controllerRef.current.initComponentFunc({ type: x.type }) };

    /* Disable btn container */
    const disableLeftMenuBtnFunc = (x: { disable: boolean }) => {
        $('.cuscdw_lm_btn_container').css({ opacity: x.disable ? 0.45 : 1 });
        isLeftMenuBtnDisabled.current = x.disable ? true : false;
    };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        currentPageType: currentPageType,
        refreshFunc() { refreshFunc() },
        renderFunc(x: any) { renderFunc(x) },
        setTraductionFunc(x: any) { setTraductionFunc(x) },
        showFunc(x: any) { showFunc(x) },
        onSubmitFunc() { onSubmitFunc() },
        initFeedListFunc(x: any) { initFeedListFunc(x) },
        disableLeftMenuBtnFunc(x: any) { disableLeftMenuBtnFunc(x) },
    }), []);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            broadcastIndex.current = mainRootControllerRef.current.addToBroadcastDomainFunc({ wid: wid, refId: refId });
            mainRootControllerRef.current.addRefIdFunc({ wid: wid, refId: refId });
            controllerRef?.current?.addRefIdFunc({ wid: wid, refId: refId });

            /* - */
            $(`#${cuscdw_lm_account_btn_id}`).css({ backgroundColor: '#007aff' });
            $('#cuscdw_account_container').css({ transform: 'translateX(0%)' });

            /* - */
            initFeedListFunc({ type: 'account' });
            isAccountListInitialized.current = true;
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
        <div id={scaffold_id} className='cuscdw_scaffold'>
            <div className='cuscdw_container'>
                <div className='cuscdw_container_left'>
                    <div id={cuscdw_lm_account_btn_id} className='cuscdw_lm_btn_container btn_opacity' style={{ marginTop: 2 }} onClick={() => selectPageFunc({ type: 'account' })}>Comptes administrateurs</div>
                    <div id={cuscdw_lm_object_btn_id} className='cuscdw_lm_btn_container btn_opacity' onClick={() => selectPageFunc({ type: 'object' })}>Objects des plaintes</div>
                    <div id={cuscdw_lm_agency_btn_id} className='cuscdw_lm_btn_container btn_opacity' onClick={() => selectPageFunc({ type: 'agency' })}>Agences</div>
                </div>

                <div style={{ width: 1, height: '80%', marginInline: 20, marginTop: spaceTop, backgroundColor: '#3B3F47' }} />

                <div className='cuscdw_container_right'>
                    <div /* feed list container */ className='cuscdw_feed_list_container'>
                        <div id='cuscdw_account_container' className='cuscdw_x_container'>
                            <FeedListWidget ref={configFeedAccountListRef} $data={{
                                wid: 'configFeedAccountListRef', controllerRef: controllerRef, rootControllers: rootControllers, customerControllerWid: 'configFeedAccountListControllerRef', paddingTop: spaceTop,
                                widget: ({ _key, _refId, _data }: any) => { return <ConfigAccountWidget key={_key} ref={_refId} $data={{ refId: _refId, controllerRef: controllerRef, feed: _data }} /> }
                            }} />
                        </div>

                        <div id='cuscdw_object_container' className='cuscdw_x_container'>
                            <FeedListWidget ref={configFeedObjectListRef} $data={{
                                wid: 'configFeedObjectListRef', controllerRef: controllerRef, rootControllers: rootControllers, customerControllerWid: 'configFeedObjectListControllerRef', paddingTop: spaceTop,
                                widget: ({ _key, _refId, _data }: any) => { return <ConfigObjectWidget key={_key} ref={_refId} $data={{ refId: _refId, controllerRef: controllerRef, feed: _data }} /> }
                            }} />
                        </div>

                        <div id='cuscdw_agency_container' className='cuscdw_x_container'>
                            <FeedListWidget ref={configFeedAgencyListRef} $data={{
                                wid: 'configFeedAgencyListRef', controllerRef: controllerRef, rootControllers: rootControllers, customerControllerWid: 'configFeedAgencyListControllerRef', paddingTop: spaceTop,
                                widget: ({ _key, _refId, _data }: any) => { return <ConfigAgencyWidget key={_key} ref={_refId} $data={{ refId: _refId, controllerRef: controllerRef, feed: _data }} /> }
                            }} />
                        </div>
                    </div>

                    <div style={{ width: 1, height: '40%', marginLeft: 20 }} />

                    <div /* inputs */ className='cuscdw_input_conatainer'>
                        <input id={cuscdw_fullname_input_id} className='cuscdw_input_box cuscdw_input_box_for_account' style={{ marginTop: 0 }} type='text' autoCorrect='off' placeholder='Nom' onChange={() => onChangeFunc({ wid: cuscdw_fullname_input_id })} />
                        <div id='cuscdw_fullname_error_container' className='cuscdw_error_container'></div>
                        <input id={cuscdw_username_input_id} className='cuscdw_input_box cuscdw_input_box_for_account' type='text' autoCorrect='off' placeholder={`Nom d'utilisateur`} onChange={() => onChangeFunc({ wid: cuscdw_username_input_id })} />
                        <div id='cuscdw_username_error_container' className='cuscdw_error_container'></div>
                        <input id={cuscdw_password_input_id} className='cuscdw_input_box cuscdw_input_box_for_account' type='text' autoCorrect='off' placeholder={`Mot de passe`} onChange={() => onChangeFunc({ wid: cuscdw_password_input_id })} />
                        <input id={cuscdw_confirm_input_id} className='cuscdw_input_box cuscdw_input_box_for_account' type='text' autoCorrect='off' placeholder={`Confirmation`} onChange={() => onChangeFunc({ wid: cuscdw_confirm_input_id })} />

                        <input id={cuscdw_object_name_input_id} className='cuscdw_input_box cuscdw_input_box_for_object' style={{ marginTop: 0, display: 'none' }} type='text' autoCorrect='off' placeholder='Nouvel objet' onChange={() => onChangeFunc({ wid: cuscdw_object_name_input_id })} />
                        <div id='cuscdw_object_name_error_container' className='cuscdw_error_container'></div>

                        <input id={cuscdw_agency_name_input_id} className='cuscdw_input_box cuscdw_input_box_for_agency' style={{ marginTop: 0, display: 'none' }} type='text' autoCorrect='off' placeholder="Nouvelle agence" onChange={() => onChangeFunc({ wid: cuscdw_agency_name_input_id })} />
                        <div id='cuscdw_agency_name_error_container' className='cuscdw_error_container'></div>

                        <div id='cuscdw_unknown_error_container' className='cuscdw_error_container'></div>
                        <LoadingWidget ref={customerConfigFormLoadingRef} $data={{ wid: 'customerConfigFormLoadingRef', controllerRef: controllerRef }} />
                        <div id='cuscdw_submit_btn_id' className='cuscdw_input_submit_btn btn_opacity' onClick={onSubmitFunc}>{traduction.current['t0025']}</div>
                    </div>
                </div>

            </div>
        </div>
    </>;
    return (<>{render.current && component}</>);

}); export default (CustomerConfigDashboardWidget);





























/* ----------------------------------------------------- Direct Children Components ----------------------------------------------------- */

/* config account widget */
const __configAccountWidget = forwardRef((props: { $data: { refId: refIdType, controllerRef: refIdType, feed: any } }, ref: any) => {
    const isMounted = useRef(false);
    const data = props.$data;
    const wid = useRef(generateIdFunc()).current;
    const refId = data.refId;
    const controllerRef = data.controllerRef;
    const feed = useRef(data.feed);
    const conf_feed_fullname_id = useRef(generateIdFunc()).current;
    const conf_feed_username_id = useRef(generateIdFunc()).current;
    const conf_feed_circular_edit_btn_id = useRef(generateIdFunc()).current;
    const conf_feed_circular_delete_btn_id = useRef(generateIdFunc()).current;
    const canEdit = useRef(true);
    const canDelete = useRef(true);

    /* On edit */
    const onEditFunc = () => {
        if (canEdit.current) {
            canEdit.current = false;
            controllerRef.current.editAccountFunc({ edit: true, targetRef: refId, data: feed.current });

        } else { controllerRef.current.editAccountFunc({ edit: false, targetRef: refId }) }
    };

    /* On delete */
    const onDeleteFunc = async () => {
        if (canDelete.current) {
            canDelete.current = false;
            const res = await controllerRef.current.deleteAccountFunc({ targetWid: wid, data: { id: feed.current.id, type: feed.current.type, domain: feed.current.domain } });
            if (!res) canDelete.current = true;
        }
    };

    /* Set edit mode */
    const setEditModeFunc = (x: { edit: boolean }) => {
        const edit = x.edit;

        /* Enable | Disable edit and delete */
        canEdit.current = edit ? false : true;
        canDelete.current = edit ? false : true;

        /* Hidghlight parent el */
        $(`#${wid}`).css({ 'border': `1px solid ${edit ? '#007aff' : '#3B3F47'}` });

        /* Change edit btn into cancel edit btn */
        $(`#${conf_feed_circular_edit_btn_id} .conf_feed_circular_btn_icon`).attr('src', edit ? cancel_1_icon : edit_2_icon);

        /* hide delete btn */
        const $el = $(`#${conf_feed_circular_delete_btn_id} .conf_feed_circular_btn_icon`);
        edit ? $el.hide() : $el.show();

        /* Reset edit and delete & empty error containers */
        if (!edit) {
            canEdit.current = true;
            canDelete.current = true;
            $('.cuscdw_error_container').text('');
        }
    };

    /* Update account */
    const updateDataFunc = (x: { data: any }) => {
        feed.current = x.data;
        $(`#${conf_feed_fullname_id}`).text(feed.current.fullname);
        $(`#${conf_feed_username_id}`).text(feed.current.username);
    };

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        setEditModeFunc(x: any) { setEditModeFunc(x) },
        updateDataFunc(x: any) { updateDataFunc(x) }
    }), []);

    /* mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
        }
    }, []);


    /* Retun */

    const component = <>
        <div id={wid} className='conf_feed_scaffold'>
            <div className='just_row' style={{ alignItems: 'center' }}>
                <div style={{ flex: 1 }} className='just_column'>
                    <div id={conf_feed_fullname_id} className='conf_feed_title'>{feed.current.fullname}</div>
                    <div id={conf_feed_username_id} className='conf_feed_subtitle'>{feed.current.username}</div>
                </div>

                <div style={{ width: 1, height: '60%', marginInline: 20, backgroundColor: '#4B4E54' }} />

                <div className='conf_feed_btn_container just_row'>
                    <div /* edit */ id={conf_feed_circular_edit_btn_id} className='conf_feed_circular_btn' onClick={onEditFunc}>
                        <img className='conf_feed_circular_btn_icon' src={edit_2_icon} />
                        <img className='conf_feed_circular_btn_icon_1' style={{ display: 'none' }} src={cancel_1_icon} />
                    </div>

                    <div /* delete */ id={conf_feed_circular_delete_btn_id} className='conf_feed_circular_btn' style={{ marginLeft: 10 }} onClick={onDeleteFunc}>
                        <img className='conf_feed_circular_btn_icon' src={trash_2_icon} />
                    </div>
                </div>
            </div>
        </div>
    </>;
    return (component);
});
const ConfigAccountWidget = memo(__configAccountWidget);




















/* config object widget */
const __configObjectWidget = forwardRef((props: { $data: { refId: refIdType, controllerRef: refIdType, feed: any } }, ref: any) => {
    const isMounted = useRef(false);
    const data = props.$data;
    const wid = useRef(generateIdFunc()).current;
    const refId = data.refId;
    const controllerRef = data.controllerRef;
    const feed = useRef(data.feed);
    const conf_feed_name_id = useRef(generateIdFunc()).current;
    const conf_feed_circular_edit_btn_id = useRef(generateIdFunc()).current;
    const conf_feed_circular_delete_btn_id = useRef(generateIdFunc()).current;
    const canEdit = useRef(true);
    const canDelete = useRef(true);

    /* On edit */
    const onEditFunc = () => {
        if (canEdit.current) {
            canEdit.current = false;
            controllerRef.current.editObjectFunc({ edit: true, targetRef: refId, data: feed.current });

        } else { controllerRef.current.editObjectFunc({ edit: false, targetRef: refId }) }
    };

    /* On delete */
    const onDeleteFunc = async () => {
        if (canDelete.current) {
            canDelete.current = false;
            const res = await controllerRef.current.deleteObjectFunc({ targetWid: wid, data: { id: feed.current.id, name: feed.current.name, domain: feed.current.domain } });
            if (!res) canDelete.current = true;
        }
    };

    /* Set edit mode */
    const setEditModeFunc = (x: { edit: boolean }) => {
        const edit = x.edit;

        /* Enable | Disable edit and delete */
        canEdit.current = edit ? false : true;
        canDelete.current = edit ? false : true;

        /* Hidghlight parent el */
        $(`#${wid}`).css({ 'border': `1px solid ${edit ? '#007aff' : '#3B3F47'}` });

        /* Change edit btn into cancel edit btn */
        $(`#${conf_feed_circular_edit_btn_id} .conf_feed_circular_btn_icon`).attr('src', edit ? cancel_1_icon : edit_2_icon);

        /* hide delete btn */
        const $el = $(`#${conf_feed_circular_delete_btn_id} .conf_feed_circular_btn_icon`);
        edit ? $el.hide() : $el.show();

        /* Reset edit and delete & empty error containers */
        if (!edit) {
            canEdit.current = true;
            canDelete.current = true;
            $('.cuscdw_error_container').text('');
        }
    };

    /* Update data */
    const updateDataFunc = (x: { data: any }) => {
        feed.current = x.data;
        $(`#${conf_feed_name_id}`).text(feed.current.name);
    };

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        setEditModeFunc(x: any) { setEditModeFunc(x) },
        updateDataFunc(x: any) { updateDataFunc(x) }
    }), []);

    /* mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
        }
    }, []);


    /* Retun */

    const component = <>
        <div id={wid} className='conf_feed_scaffold'>
            <div className='just_row' style={{ alignItems: 'center' }}>
                <div style={{ flex: 1 }} className='just_column'>
                    <div id={conf_feed_name_id} className='conf_feed_title2'>{feed.current.name}</div>
                </div>

                <div style={{ width: 1, height: '60%', marginInline: 20, backgroundColor: '#4B4E54' }} />

                <div className='conf_feed_btn_container just_row'>
                    <div /* edit */ id={conf_feed_circular_edit_btn_id} className='conf_feed_circular_btn' onClick={onEditFunc}>
                        <img className='conf_feed_circular_btn_icon' src={edit_2_icon} />
                    </div>

                    <div /* delete */ id={conf_feed_circular_delete_btn_id} className='conf_feed_circular_btn' style={{ marginLeft: 10 }} onClick={onDeleteFunc}>
                        <img className='conf_feed_circular_btn_icon' src={trash_2_icon} />
                    </div>
                </div>
            </div>
        </div>
    </>;
    return (component);
});
const ConfigObjectWidget = memo(__configObjectWidget);























/* config agency widget */
const __configAgencyWidget = forwardRef((props: { $data: { refId: refIdType, controllerRef: refIdType, feed: any } }, ref: any) => {
    const isMounted = useRef(false);
    const data = props.$data;
    const wid = useRef(generateIdFunc()).current;
    const refId = data.refId;
    const controllerRef = data.controllerRef;
    const feed = useRef(data.feed);
    const conf_feed_name_id = useRef(generateIdFunc()).current;
    const conf_feed_circular_edit_btn_id = useRef(generateIdFunc()).current;
    const conf_feed_circular_delete_btn_id = useRef(generateIdFunc()).current;
    const canEdit = useRef(true);
    const canDelete = useRef(true);

    /* On edit */
    const onEditFunc = () => {
        if (canEdit.current) {
            canEdit.current = false;
            controllerRef.current.editAgencyFunc({ edit: true, targetRef: refId, data: feed.current });

        } else { controllerRef.current.editAgencyFunc({ edit: false, targetRef: refId }) }
    };

    /* On delete */
    const onDeleteFunc = async () => {
        if (canDelete.current) {
            canDelete.current = false;
            const res = await controllerRef.current.deleteAgencyFunc({ targetWid: wid, data: { id: feed.current.id, name: feed.current.name, domain: feed.current.domain } });
            if (!res) canDelete.current = true;
        }
    };

    /* Set edit mode */
    const setEditModeFunc = (x: { edit: boolean }) => {
        const edit = x.edit;

        /* Enable | Disable edit and delete */
        canEdit.current = edit ? false : true;
        canDelete.current = edit ? false : true;

        /* Hidghlight parent el */
        $(`#${wid}`).css({ 'border': `1px solid ${edit ? '#007aff' : '#3B3F47'}` });

        /* Change edit btn into cancel edit btn */
        $(`#${conf_feed_circular_edit_btn_id} .conf_feed_circular_btn_icon`).attr('src', edit ? cancel_1_icon : edit_2_icon);

        /* hide delete btn */
        const $el = $(`#${conf_feed_circular_delete_btn_id} .conf_feed_circular_btn_icon`);
        edit ? $el.hide() : $el.show();

        /* Reset edit and delete & empty error containers */
        if (!edit) {
            canEdit.current = true;
            canDelete.current = true;
            $('.cuscdw_error_container').text('');
        }
    };

    /* Update data */
    const updateDataFunc = (x: { data: any }) => {
        feed.current = x.data;
        $(`#${conf_feed_name_id}`).text(feed.current.name);
    };

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        setEditModeFunc(x: any) { setEditModeFunc(x) },
        updateDataFunc(x: any) { updateDataFunc(x) }
    }), []);

    /* mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
        }
    }, []);


    /* Retun */

    const component = <>
        <div id={wid} className='conf_feed_scaffold'>
            <div className='just_row' style={{ alignItems: 'center' }}>
                <div style={{ flex: 1 }} className='just_column'>
                    <div id={conf_feed_name_id} className='conf_feed_title2'>{feed.current.name}</div>
                </div>

                <div style={{ width: 1, height: '60%', marginInline: 20, backgroundColor: '#4B4E54' }} />

                <div className='conf_feed_btn_container just_row'>
                    <div /* edit */ id={conf_feed_circular_edit_btn_id} className='conf_feed_circular_btn' onClick={onEditFunc}>
                        <img className='conf_feed_circular_btn_icon' src={edit_2_icon} />
                    </div>

                    <div /* delete */ id={conf_feed_circular_delete_btn_id} className='conf_feed_circular_btn' style={{ marginLeft: 10 }} onClick={onDeleteFunc}>
                        <img className='conf_feed_circular_btn_icon' src={trash_2_icon} />
                    </div>
                </div>
            </div>
        </div>
    </>;
    return (component);
});
const ConfigAgencyWidget = memo(__configAgencyWidget);
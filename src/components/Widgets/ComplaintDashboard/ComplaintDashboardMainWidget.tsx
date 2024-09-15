/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import './ComplaintDashboardMainWidget.css';
import { generateIdFunc } from '../../Tools/methodForest';
import { language } from '../../Tools/language';
import { refIdType } from '../../Tools/type';
import { _defaultLanguage_ } from '../../Tools/constants';
import ComplaintFeedWidget from './ComplaintFeedWidget';
import ComplaintDashboardControllerWidget from './ComplaintDashboardControllerWidget';
import ComplaintFeedPreviewWidget from './ComplaintFeedPreviewWidget';
import edit_icon from '../../Assets/png/edit_1.png';
import history_icon from '../../Assets/png/history.png';
import arrow_down_icon from '../../Assets/png/arrow_down.png';
import back_icon from '../../Assets/png/back.png';
import trash_icon from '../../Assets/png/trash_1.png';
import replace_icon from '../../Assets/png/replace.png';
import trash_3_icon from '../../Assets/png/trash_3.png';

/* Widget */
type propsType = {
    $data: {
        /** Every change made to "wid" affect controller */
        wid: string,
        refId: refIdType,
        controllerRef: refIdType,
        rootControllers: any
    }
};
const ComplaintDashboardMainWidget = (props: propsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const parentProps = props;

    const windowWidth = useRef(window.innerWidth);

    const windowHeight = useRef(window.innerHeight);

    const refresher = useRef(false);
    const [refresh, setRefresh] = useState(refresher.current);

    const isMounted = useRef(false);

    const render = useRef(true);

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

    const emptyRef = useRef(undefined);

    const complaintDashboardControllerRef = useRef<any>(undefined);

    const complaintFeedPreviewRef = useRef<any>(undefined);

    const comdmw_scaffold_id = useRef(generateIdFunc()).current;

    const comdmw_bottom_dock_id = useRef(generateIdFunc()).current;

    const comdmw_dock_history_container_id = useRef(generateIdFunc()).current;

    const comdmw_dock_state_container_id = useRef(generateIdFunc()).current;

    const comdmw_dock_del_confirm_container_id = useRef(generateIdFunc()).current;

    const isModificationHistoryVisible = useRef(false);

    const isStateContainerVisible = useRef(false);

    const isDeleteContainerVisible = useRef(false);


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

    /* Set language */
    const setLanguageFunc = (x: { lang: 'en' | 'fr' }) => {
        lang.current = x.lang;
        refreshFunc();
    };

    /* On window size change */
    const onWindowSizeChangeFunc = () => {
        windowWidth.current = window.innerWidth;
        windowHeight.current = window.innerHeight;
    };

    /* Show */
    const showFunc = (x: { show: boolean }) => { $(`#${comdmw_scaffold_id}`).css({ 'z-index': x.show ? 1 : 0 }) };

    /* On Edit complaint */
    const onEditComplaintFunc = () => { complaintDashboardControllerRef.current.enableEditionFunc({ enable: true }) };

    /* Show dock */
    const showDockFunc = (x: { show: boolean }) => {
        const show = x.show;
        $(`#${comdmw_bottom_dock_id}`).animate({ 'bottom': show ? '25px' : '-100px' }, 300);
    };

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


    /* ------------------------------------ jQuery ------------------------------------- */


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        refreshFunc() { refreshFunc() },
        renderFunc(x: any) { renderFunc(x) },
        setLanguageFunc(x: any) { setLanguageFunc(x) },
        showFunc(x: any) { showFunc(x) },
        showDockFunc(x: any) { showDockFunc(x) }
    }), []);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            (controllerRef.current !== undefined) && controllerRef.current.addWidgetRefFunc({ wid: wid, refId: refId });
        }
    }, []);

    /* On window size change */
    // useEffect(() => {
    //     window.addEventListener('resize', onWindowSizeChangeFunc);
    //     return () => window.removeEventListener('resize', onWindowSizeChangeFunc);
    // }, []);


    /* Return */


    /* Dock Child */
    const dockChild = <>
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

    /* Component */
    const component = <>
        <div id={comdmw_scaffold_id} className='comdmw_scaffold'>
            <div /* list */ className='comdmw_feed_list_container'>
                <div className='comdmw_feed_container'>
                    <div className='comdmw_feed_default_list'>
                        <div className='comdmw_top_space' />
                        {Array(20).fill(undefined).map((_, i) => <ComplaintFeedWidget key={i} ref={emptyRef} $data={{ wid: 'emptyRef', refId: emptyRef, controllerRef: complaintDashboardControllerRef, rootControllers: rootControllers }} />)}
                    </div>

                    <div className='comdmw_feed_search_list'>
                        <div className='comdmw_top_space' />
                    </div>
                </div>

                <div className='comdmw_right_bar' />
            </div>

            <div /* Preview */ className='comdmw_feed_preview'>
                <div className='comdmw_feed_preview_wrapper'>
                    <ComplaintFeedPreviewWidget ref={complaintFeedPreviewRef} $data={{ wid: 'complaintFeedPreviewRef', refId: complaintFeedPreviewRef, controllerRef: complaintDashboardControllerRef, rootControllers: rootControllers }} />
                </div>

                <div /* Dock */ id={comdmw_bottom_dock_id} className='comdmw_bottom_dock'>{dockChild}</div>
            </div>
        </div>
        <ComplaintDashboardControllerWidget ref={complaintDashboardControllerRef} $data={{ wid: 'complaintDashboardControllerRef', refId: complaintDashboardControllerRef, parentRef: refId, rootControllers: rootControllers }} />
    </>;
    return (render.current ? component : <></>);
};

export default forwardRef(ComplaintDashboardMainWidget);
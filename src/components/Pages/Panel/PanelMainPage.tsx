/* Standard packages */
import React, { useState, useRef, memo, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import './PanelMainPage.css';
import logo_f_icon from '../../Assets/png/logo_f.png';
import logo_h_icon from '../../Assets/png/logo_h.png';
import admin_icon from '../../Assets/png/admin.png';
import account_icon from '../../Assets/png/account.png';
import call_center_icon from '../../Assets/png/call_center.png';
import notification_icon from '../../Assets/png/notification.png';
import off_icon from '../../Assets/png/off.png';
import door_icon from '../../Assets/png/door.png';
import { refIdType } from '../../Tools/type';
import { _appEmitterType_, _defaultLanguage_, _dev_ } from '../../Tools/constants';

import AdminMainMenuWidget from '../../Widgets/AdminPanel/Menu/AdminMainMenuWidget';
import AdminMainContainerWidget from '../../Widgets/AdminPanel/Container/AdminMainContainerWidget';
import AdminMainController from '../../Widgets/AdminPanel/AdminMainController';

import CallCMenuMainContainerWidget from '../../Widgets/CallCenterPanel/Menu/CallCMenuMainContainerWidget';
import CallCMainContainerWidget from '../../Widgets/CallCenterPanel/Container/CallCMainContainerWidget';
import CallCMainControllerWidget from '../../Widgets/CallCenterPanel/CallCMainControllerWidget';

import CustomerMenuMainWidget from '../../Widgets/CustomerPanel/Menu/CustomerMenuMainWidget';
import CustomerMainContainerWidget from '../../Widgets/CustomerPanel/Container/CustomerMainContainerWidget';
import CustomerMainControllerWidget from '../../Widgets/CustomerPanel/CustomerMainControllerWidget';

import NotificationMainContainerWidget from '../../Widgets/Notification/NotificationMainContainerWidget';
import { generateIdFunc } from '../../Tools/methodForest';
import logo_f from '../../Assets/png/logo_f.png';


/** Every change made to "wid" affect controller */
type propsType = { $data: { wid: string, controllerRef?: refIdType, rootControllers: any } };
const PanelMainPage = forwardRef((props: propsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const refId = ref;

    const windowWidth = useRef(window.innerWidth);
    const windowHeight = useRef(window.innerHeight);

    const refresher = useRef(false);
    const [refresh, setRefresh] = useState(refresher.current);

    const isMounted = useRef(false);
    const render = useRef(true);

    const emptyRef = useRef<any>(undefined);
    const consumerRef = useRef<any>(undefined);
    const controllerRef = useRef<any>(undefined);

    const broadcastIndex = useRef(-1);
    const mountCount = useRef(0);

    /* $data */
    const $data = props.$data;
    const wid = useRef($data.wid || generateIdFunc()).current;
    const parentControllerRef = $data.controllerRef;
    const rootControllers = $data.rootControllers;

    /* Root controllers */
    const mainRootControllerRef: refIdType = rootControllers?.current?.mainRootControllerRef;
    const requestRootControllerRef: refIdType = rootControllers?.current?.requestRootControllerRef;
    const dataStoreRootControllerRef: refIdType = rootControllers?.current?.dataStoreRootControllerRef;

    /* - */

    const traduction = useRef(dataStoreRootControllerRef.current.traduction.current);

    const panelLogoRef = useRef(undefined);
    const panelHeaderRef = useRef(undefined);
    const panelMainControllerRef = useRef(undefined);

    const adminMainMenuRef = useRef(undefined);
    const adminMainContainerRef = useRef(undefined);
    const adminMainControllerRef = useRef(undefined);

    const callCMenuMainContainerRef = useRef(undefined);
    const callCMainContainerRef = useRef(undefined);
    const callCMainControllerRef = useRef(undefined);

    const customerMenuMainRef = useRef(undefined);
    const customerMainContainerRef = useRef(undefined);
    const customerMainControllerRef = useRef(undefined);

    const notificationMainContainerRef = useRef(undefined);

    /* - */

    const currentUserData = useRef(dataStoreRootControllerRef.current.currentUserData.current);

    const accountMenuData = {
        container: { id: 'account', title: traduction.current['t0007'] },
        children: [
            { id: 'admin_menu', iconUri: admin_icon, title: traduction.current['t0008'] },
            { id: 'call_center_menu', iconUri: call_center_icon, title: traduction.current['t0009'] },
            { id: 'customer_menu', iconUri: account_icon, title: traduction.current['t0010'] },
        ]
    };

    const pm_disconnect_container_id = useRef(generateIdFunc()).current;
    const pm_disconnect_container_ref = useRef<any>(undefined);

    const pm_notification_container_id = useRef(generateIdFunc()).current;

    const isDisconnectionVisible = useRef(false);
    const isNotificationVisible = useRef(false);


    /* ------------------------------------ Methods ------------------------------------- */

    /* Refresh component */
    const refreshFunc = () => { refresher.current = !refresher.current; setRefresh(refresher.current) };

    /* Render */
    const renderFunc = (x: { render: boolean }) => {
        currentUserData.current = dataStoreRootControllerRef.current.currentUserData.current;
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

    /* Display Disconnection */
    const displayDisconnectionFunc = () => {
        const current = isDisconnectionVisible.current;

        current && $(`#${pm_disconnect_container_id}`).css({ scale: 1.00001 });
        $(`#${pm_disconnect_container_id}`).animate(current ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }, 200, () => { current && $(`#${pm_disconnect_container_id}`).css({ 'display': 'none' }) });

        !current && $(`#${pm_disconnect_container_id}`).css({ 'display': 'flex' });

        /* update | Must be last lines */
        (!current) && $(`#${pm_disconnect_container_id}`).trigger('focus');
        isDisconnectionVisible.current = !isDisconnectionVisible.current;
    };

    /* Display notification */
    const displayNotificationFunc = () => {
        const current = isNotificationVisible.current;
        current && $(`#${pm_notification_container_id}`).css({ scale: 1.00001 });
        $(`#${pm_notification_container_id}`).animate(current ? { opacity: 0, scale: 0.95 } : { opacity: 1, scale: 1 }, 100, () => { current && $(`#${pm_notification_container_id}`).css({ 'display': 'none' }) });
        !current && $(`#${pm_notification_container_id}`).css({ 'display': 'flex' });
        isNotificationVisible.current = !isNotificationVisible.current; /* update | Must be last line */
    };

    /* Unmount */
    const unmountFunc = () => {
        /* Prevent from first unmounting caused by "strictMode" */
        mountCount.current += 1; if (mountCount.current === 1) return;

        /* unmount logic */
        mainRootControllerRef?.current?.deleteFromBroadcastDomainFunc({ index: broadcastIndex.current });
        mainRootControllerRef?.current?.deleteRefIdFunc({ wid: wid, refId: refId });
    };

    /* On disconnect modal blur */
    const onDisconnectModalBlur = () => { console.log('oooo') };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Imperatif handler */
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
            mainRootControllerRef.current.addRefIdFunc({ wid: wid, refId: refId });
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
        {currentUserData.current !== undefined && <>
            {currentUserData.current.type === 'main_admin' && <AdminMainController ref={adminMainControllerRef} $data={{ wid: 'adminMainControllerRef', rootControllers: rootControllers }} />}
            {currentUserData.current.type === 'call_center' && <CallCMainControllerWidget ref={callCMainControllerRef} $data={{ wid: 'callCMainControllerRef', rootControllers: rootControllers }} />}
            {currentUserData.current.type === 'customer_admin' && <CustomerMainControllerWidget ref={customerMainControllerRef} $data={{ wid: 'customerMainControllerRef', rootControllers: rootControllers }} />}

            <div id='pm_scaffold'>
                <div id='pm_menu'>
                    <div id='pm_logo_container' className='prevent_select menu_glass'>
                        <img id='pm_logo_icon' src={logo_f_icon} />
                        <p id='pm_app_name'>SGC</p>
                    </div>

                    {currentUserData.current.type === 'main_admin' && <AdminMainMenuWidget ref={adminMainMenuRef} $data={{ wid: 'adminMainMenuRef', controllerRef: adminMainControllerRef, rootControllers: rootControllers, menuData: accountMenuData }} />}
                    {currentUserData.current.type === 'call_center' && <CallCMenuMainContainerWidget ref={callCMenuMainContainerRef} $data={{ wid: 'callCMenuMainContainerRef', controllerRef: callCMainControllerRef, rootControllers: rootControllers }} />}
                    {currentUserData.current.type === 'customer_admin' && <CustomerMenuMainWidget ref={customerMenuMainRef} $data={{ wid: 'customerMenuMainRef', controllerRef: customerMainControllerRef, rootControllers: rootControllers }} />}

                    <div id='pm_footer'>
                        <div id='pm_footer_backdrop' className='menu_glass' />
                        <div id='pm_footer_wrapper'>
                            <div className='pm_footer_top'>

                                <div className='pm_footer_username ellipsis_line_2'>{currentUserData.current.fullname}</div>

                                <div className='pm_footer_btn_container'>
                                    <div className='pm_footer_btn_wrapper btn_opacity' title='Deconnexion' onClick={displayDisconnectionFunc}>
                                        <img className='pm_footer_btn_icon' src={off_icon} />
                                    </div>
                                    <div ref={pm_disconnect_container_ref} tabIndex={0} id={pm_disconnect_container_id} className='pm_disconnect_container floating_container_glass' onBlur={displayDisconnectionFunc}>
                                        <img className='pm_disconnect_logo' src={door_icon} />
                                        <div className='pm_disconnect_msg'>Etes vous sûr de vouloir continuer ?</div>
                                        <div className='pm_disconnect_yes btn_opacity'>Yes</div>
                                        <div className='pm_disconnect_no btn_opacity'>No</div>
                                    </div>
                                </div>


                                {/* <div className='pm_footer_btn_container'>
                                    <div className='pm_footer_btn_wrapper btn_opacity' title='Notification' onClick={displayNotificationFunc}>
                                        <img className='pm_footer_btn_icon' src={notification_icon} />
                                    </div>
                                    <div id={pm_notification_container_id} className='pm_notification_container'>
                                         <NotificationMainContainerWidget ref={notificationMainContainerRef} $data={{ wid: 'notificationMainContainerRef', refId: notificationMainContainerRef, controllerRef: mainRootControllerRef }} />
                                    </div>
                                </div> */}
                            </div>
                            <div className='pm_footer_separator' />
                            <div className='pm_footer_bottom'>© 2024 Call center. All rights reserved.</div>
                        </div>
                    </div>
                </div>

                <div id='pm_container'>
                    {currentUserData.current.type === 'main_admin' && <AdminMainContainerWidget ref={adminMainContainerRef} $data={{ wid: 'adminMainContainerRef', controllerRef: adminMainControllerRef, rootControllers: rootControllers }} />}
                    {currentUserData.current.type === 'call_center' && <CallCMainContainerWidget ref={callCMainContainerRef} $data={{ wid: 'callCMainContainerRef', controllerRef: callCMainControllerRef, rootControllers: rootControllers }} />}
                    {currentUserData.current.type === 'customer_admin' && <CustomerMainContainerWidget ref={customerMainContainerRef} $data={{ wid: 'customerMainContainerRef', controllerRef: customerMainControllerRef, rootControllers: rootControllers }} />}
                </div>
            </div>
        </>}
    </>;
    return (<>{render.current && component}</>);

}); export default memo(PanelMainPage);
































/* ----------------------------------------------------- Direct Children Components ----------------------------------------------------- */


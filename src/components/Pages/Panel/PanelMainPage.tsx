/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
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
import { language } from '../../Tools/language';
import { refIdType } from '../../Tools/type';
import { _defaultLanguage_ } from '../../Tools/constants';

import AdminMainMenuWidget from '../../Widgets/AdminPanel/Menu/AdminMainMenuWidget';
import AdminMainContainerWidget from '../../Widgets/AdminPanel/Container/AdminMainContainerWidget';
import AdminMainControllerWidget from '../../Widgets/AdminPanel/AdminMainControllerWidget';

import CallCMenuMainContainerWidget from '../../Widgets/CallCenterPanel/Menu/CallCMenuMainContainerWidget';
import CallCMainContainerWidget from '../../Widgets/CallCenterPanel/Container/CallCMainContainerWidget';
import CallCMainControllerWidget from '../../Widgets/CallCenterPanel/CallCMainControllerWidget';

import CustomerMainContainerWidget from '../../Widgets/CustomerPanel/Container/CustomerMainContainerWidget';

import NotificationMainContainerWidget from '../../Widgets/Notification/NotificationMainContainerWidget';
import { generateIdFunc } from '../../Tools/methodForest';

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
const PanelMainPage = (props: propsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const parentProps = props;

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const [windowHeight, setWindowHeight] = useState(window.innerHeight);

    const [refresh, setRefresh] = useState(false);

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

    const panelLogoRef = useRef(undefined);
    const panelHeaderRef = useRef(undefined);
    const panelMainControllerRef = useRef(undefined);

    const adminMainMenuRef = useRef(undefined);
    const adminMainContainerRef = useRef(undefined);
    const adminMainControllerRef = useRef(undefined);

    const callCMenuMainContainerRef = useRef(undefined);
    const callCMainContainerRef = useRef(undefined);
    const callCMainControllerRef = useRef(undefined);

    const CustomerMainContainerRef = useRef(undefined);

    const notificationMainContainerRef = useRef(undefined);

    /* - */

    const currentUserData = dataStoreControllerRef.current.currentUserData.current;

    const accountType = currentUserData?.type;

    const accountMenuData = {
        container: { id: 'account', title: traduction['t0007'] },
        children: [
            { id: 'admin_menu', iconUri: admin_icon, title: traduction['t0008'] },
            { id: 'call_center_menu', iconUri: call_center_icon, title: traduction['t0009'] },
            { id: 'customer_menu', iconUri: account_icon, title: traduction['t0010'] },
        ]
    };

    const pm_disconnect_container_id = useRef(generateIdFunc()).current;

    const pm_notification_container_id = useRef(generateIdFunc()).current;

    const isDisconnectionVisible = useRef(false);

    const isNotificationVisible = useRef(false);


    /* ------------------------------------ Methods ------------------------------------- */

    /* Refresh component */
    const refreshFunc = () => { setRefresh(!refresh) };

    /* Render */
    const renderFunc = (x: { render: boolean }) => {
        render.current = x.render;
        refreshFunc();
    };

    /* Set language */
    const setLanguageFunc = (x: { lang: 'en' | 'fr' }) => { lang.current = x.lang; setRefresh(!refresh) };

    /* On window size change */
    const onWindowSizeChangeFunc = () => { setWindowWidth(window.innerWidth); setWindowHeight(window.innerHeight) };

    /* Init user data */
    const initUSerData = () => {
        currentUserData.current = (dataStoreControllerRef.current).currentUserData.current;
    };

    /* Display Disconnection */
    const displayDisconnectionFunc = () => {
        const current = isDisconnectionVisible.current;
        $(`#${pm_disconnect_container_id}`).animate(current ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }, 200, () => { current && $(`#${pm_disconnect_container_id}`).css({ 'display': 'none' }) });
        !current && $(`#${pm_disconnect_container_id}`).css({ 'display': 'flex' });
        isDisconnectionVisible.current = !isDisconnectionVisible.current; /* update | Must be last line */
    };

    /* Display notification */
    const displayNotificationFunc = () => {
        const current = isNotificationVisible.current;
        $(`#${pm_notification_container_id}`).animate(current ? { opacity: 0, scale: 0.95 } : { opacity: 1, scale: 1 }, 100, () => { current && $(`#${pm_notification_container_id}`).css({ 'display': 'none' }) });
        !current && $(`#${pm_notification_container_id}`).css({ 'display': 'flex' });
        isNotificationVisible.current = !isNotificationVisible.current; /* update | Must be last line */
    };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        refreshFunc() { refreshFunc() },
        renderFunc(x: any) { renderFunc(x) },
        setLanguageFunc(x: any) { setLanguageFunc(x) }
    }), [refresh]);

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
    }, []);


    /* Return */


    const component = <>
        {currentUserData !== undefined && <>
            <div id='pm_scaffold'>
                {(accountType !== 'customer_admin') &&
                    <div id='pm_menu'>
                        <div id='pm_logo_container' className='prevent_select menu_glass'>
                            <img id='pm_logo_icon' src={logo_f_icon} />
                            <p id='pm_app_name'>Call Center</p>
                        </div>

                        {accountType === 'main_admin' && <AdminMainMenuWidget ref={adminMainMenuRef} $data={{ wid: 'adminMainMenuRef', refId: adminMainMenuRef, controllerRef: adminMainControllerRef, rootControllers: rootControllers, menuData: accountMenuData }} />}
                        {accountType === 'call_center' && <CallCMenuMainContainerWidget ref={callCMenuMainContainerRef} $data={{ wid: 'callCMenuMainContainerRef', refId: callCMenuMainContainerRef, controllerRef: callCMainControllerRef, rootControllers: rootControllers }} />}

                        <div id='pm_footer'>
                            <div id='pm_footer_backdrop' className='menu_glass' />
                            <div id='pm_footer_wrapper'>
                                <div className='pm_footer_top'>
                                    <div className='pm_footer_btn_container'>
                                        <div className='pm_footer_btn_wrapper btn_opacity' title='Deconnexion' onClick={displayDisconnectionFunc}>
                                            <img className='pm_footer_btn_icon' src={off_icon} />
                                        </div>
                                        <div id={pm_disconnect_container_id} className='pm_disconnect_container floating_container_glass'>
                                            <img className='pm_disconnect_logo' src={door_icon} />
                                            <div className='pm_disconnect_msg'>Etes vous sûr de vouloir continuer ?</div>
                                            <div className='pm_disconnect_yes btn_opacity'>Yes</div>
                                            <div className='pm_disconnect_no btn_opacity'>No</div>
                                        </div>
                                    </div>

                                    <div className='pm_footer_username ellipsis_line_2'>{currentUserData.fullname}</div>

                                    <div className='pm_footer_btn_container'>
                                        <div className='pm_footer_btn_wrapper btn_opacity' title='Notification' onClick={displayNotificationFunc}>
                                            <img className='pm_footer_btn_icon' src={notification_icon} />
                                        </div>
                                        <div id={pm_notification_container_id} className='pm_notification_container'>
                                            <NotificationMainContainerWidget ref={notificationMainContainerRef} $data={{ wid: 'notificationMainContainerRef', refId: notificationMainContainerRef, controllerRef: mainControllerRef, rootControllers: rootControllers }} />
                                        </div>
                                    </div>
                                </div>
                                <div className='pm_footer_separator' />
                                <div className='pm_footer_bottom'>© 2024 Call center. All rights reserved.</div>
                            </div>
                        </div>
                    </div>
                }

                {(accountType !== 'customer_admin') ?
                    <div id='pm_container'>
                        {accountType === 'main_admin' && <AdminMainContainerWidget ref={adminMainContainerRef} $data={{ wid: 'adminMainContainerRef', refId: adminMainContainerRef, controllerRef: adminMainControllerRef, rootControllers: rootControllers }} />}
                        {accountType === 'call_center' && <CallCMainContainerWidget ref={callCMainContainerRef} $data={{ wid: 'callCMainContainerRef', refId: callCMainContainerRef, controllerRef: callCMainControllerRef, rootControllers: rootControllers }} />}
                    </div> :
                    <CustomerMainContainerWidget ref={CustomerMainContainerRef} $data={{ wid: 'CustomerMainContainerRef', refId: CustomerMainContainerRef, controllerRef: callCMainControllerRef, rootControllers: rootControllers }} />
                }
            </div>
            {accountType === 'main_admin' && <AdminMainControllerWidget ref={adminMainControllerRef} $data={{ wid: 'adminMainControllerRef', refId: adminMainControllerRef, rootControllers: rootControllers }} />}
            {accountType === 'call_center' && <CallCMainControllerWidget ref={callCMainControllerRef} $data={{ wid: 'callCMainControllerRef', refId: callCMainControllerRef, rootControllers: rootControllers }} />}
        </>}
    </>;
    return (render.current ? component : <></>);
};

export default forwardRef(PanelMainPage);
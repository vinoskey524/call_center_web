/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

/* Custom packages */
import './PanelMainPage.css';
import admin_icon from '../../Assets/png/admin.png';
import account_icon from '../../Assets/png/account.png';
import call_center_icon from '../../Assets/png/call_center.png';
import { language } from '../../Tools/language';
import { refIdType } from '../../Tools/type';
import { _defaultLanguage_ } from '../../Tools/constants';

import PanelLogoWidget from '../../Widgets/Panel/PanelLogoWidget';
import PanelMainControllerWidget from '../../Widgets/Panel/PanelMainControllerWidget';
import PanelCCMenuWidget from '../../Widgets/Panel/CallCenter/PanelCCMenuWidget';
import PanelCCContainerWidget from '../../Widgets/Panel/CallCenter/PanelCCContainerWidget';

import AdminMainMenuWidget from '../../Widgets/Panel/Admin/Menu/AdminMainMenuWidget';
import AdminMainContainerWidget from '../../Widgets/Panel/Admin/Container/AdminMainContainerWidget';
import AdminMainControllerWidget from '../../Widgets/Panel/Admin/AdminMainControllerWidget';

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

    const panelLogoRef = useRef(undefined);
    const panelHeaderRef = useRef(undefined);
    const panelMainControllerRef = useRef(undefined);

    const adminMainMenuRef = useRef(undefined);
    const adminMainContainerRef = useRef(undefined);
    const adminMainControllerRef = useRef(undefined);

    const panelCCMenuRef = useRef(undefined);
    const panelCCContainerRef = useRef(undefined);

    /* - */

    const accountType: refIdType = dataStoreControllerRef.current.accountType;

    const accountMenuData = {
        container: { id: 'account', title: traduction['t0007'] },
        children: [
            { id: 'admin_menu', iconUri: admin_icon, title: traduction['t0008'] },
            { id: 'call_center_menu', iconUri: call_center_icon, title: traduction['t0009'] },
            { id: 'customer_menu', iconUri: account_icon, title: traduction['t0010'] },
        ]
    };


    /* ------------------------------------ Methods ------------------------------------- */

    /* Refresh component */
    const refreshFunc = () => { setRefresh(!refresh) };

    /* Set language */
    const setLanguageFunc = (x: { lang: 'en' | 'fr' }) => { lang.current = x.lang; setRefresh(!refresh) };

    /* On window size change */
    const onWindowSizeChangeFunc = () => { setWindowWidth(window.innerWidth); setWindowHeight(window.innerHeight) };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        refreshFunc() { refreshFunc() },
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
        <div id='pm_scaffold'>
            <div id='pm_menu'>
                <PanelLogoWidget ref={panelLogoRef} $data={{ wid: 'panelLogoRef', refId: panelLogoRef }} />
                <div id='pm_scroll_area'>
                    {accountType.current === 'admin' && <AdminMainMenuWidget ref={adminMainMenuRef} $data={{ wid: 'adminMainMenuRef', refId: adminMainMenuRef, controllerRef: adminMainControllerRef, rootControllers: rootControllers, menuData: accountMenuData }} />}
                    {accountType.current === 'callCenter' && <PanelCCMenuWidget ref={panelCCMenuRef} $data={{ wid: 'panelCCMenuRef', refId: panelCCMenuRef, controllerRef: adminMainControllerRef, rootControllers: rootControllers }} />}
                </div>
            </div>

            <div id='pm_container'>
                {accountType.current === 'admin' && <AdminMainContainerWidget ref={adminMainContainerRef} $data={{ wid: 'adminMainContainerRef', refId: adminMainContainerRef, controllerRef: adminMainControllerRef, rootControllers: rootControllers }} />}

                {accountType.current === 'callCenter' && <PanelCCContainerWidget ref={panelCCContainerRef} $data={{ wid: 'panelCCContainerRef', refId: panelCCContainerRef, controllerRef: panelMainControllerRef, rootControllers: rootControllers }} />}
            </div>
        </div>
        <AdminMainControllerWidget ref={adminMainControllerRef} $data={{ wid: 'adminMainControllerRef', refId: adminMainControllerRef, rootControllers: rootControllers }} />
        <PanelMainControllerWidget ref={panelMainControllerRef} $data={{ wid: 'panelMainControllerRef', refId: panelMainControllerRef, rootControllers: rootControllers }} />
    </>;
    return (render.current ? component : <></>);
};

export default forwardRef(PanelMainPage);
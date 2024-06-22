/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

/* Custom packages */
import './PanelMainPage.css';
import admin_icon from '../../Assets/png/admin.png';
import account_icon from '../../Assets/png/account.png';
import call_center_icon from '../../Assets/png/call_center.png';
import { language } from '../../Tools/language';
import { refIdType } from '../../Tools/type';
import PanelLogoWidget from '../../Widgets/Panel/PanelLogoWidget';
import PanelHeaderWidget from '../../Widgets/Panel/PanelHeaderWidget';
import PanelMenuContainerWidget from '../../Widgets/Panel/Menu/PanelMenuContainerWidget';
import PanelMainControllerWidget from '../../Widgets/Panel/PanelMainControllerWidget';

/* Widget */
type propsType = {
    $data: {
        /** Every change made to "wid" affect controller */
        wid: string,
        refId: refIdType,
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

    const zIndex = useRef(2);

    const lang = useRef('en');

    const traduction = language[lang.current];

    /* $data */

    const data = props.$data;

    const wid = data.wid;

    const refId = data.refId;

    const rootControllers = data.rootControllers;

    /* Root controllers */

    const mainControllerRef: refIdType = rootControllers.mainControllerRef;

    const requestControllerRef: refIdType = rootControllers.requestControllerRef;

    const dataStoreControllerRef: refIdType = rootControllers.dataStoreControllerRef;

    /* - */

    const panelLogoRef = useRef(undefined);

    const panelHeaderRef = useRef(undefined);

    const panelMenuContainerRef = useRef(undefined);

    const panelMainControllerRef = useRef(undefined);

    const accountMenuData = {
        container: { id: 'account', title: traduction['t0007'] },
        children: [
            { id: 'admin_menu', iconUri: admin_icon, title: traduction['t0008'] },
            { id: 'call_canter_menu', iconUri: call_center_icon, title: traduction['t0009'] },
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
        }
    }, []);

    /* On window size change */
    useEffect(() => {
        window.addEventListener('resize', onWindowSizeChangeFunc);
        return () => window.removeEventListener('resize', onWindowSizeChangeFunc);
    }, []);


    /* Return */


    const component = <>
        <div id='pm_scaffold' style={{ zIndex: zIndex.current }}>
            <div id='pm_menu'>
                <PanelLogoWidget ref={panelLogoRef} $data={{ wid: 'panelLogoRef', refId: panelLogoRef }} />
                <div id='pm_scroll_area'>
                    <PanelMenuContainerWidget ref={panelMenuContainerRef} $data={{ wid: 'panelMenuContainerRef', refId: panelMenuContainerRef, controllerRef: panelMainControllerRef, rootControllers: rootControllers, menuData: accountMenuData }} />
                </div>
            </div>

            <div id='pm_container'>
                <PanelHeaderWidget ref={panelHeaderRef} $data={{ wid: 'panelHeaderRef', refId: panelHeaderRef, controllerRef: panelMainControllerRef, rootControllers: rootControllers }} />
            </div>
        </div>
        <PanelMainControllerWidget ref={panelMainControllerRef} $data={{ wid: 'panelMainControllerRef', refId: panelMainControllerRef, rootControllers: rootControllers }} />
    </>;
    return (render.current ? component : <></>);
};

export default forwardRef(PanelMainPage);
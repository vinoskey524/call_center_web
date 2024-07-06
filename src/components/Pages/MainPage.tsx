/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

/* Custom packages */
import './Base.css';
import './MainPage.css';
import { refIdType } from '../Tools/type';
import MainControllerWidget from '../Widgets/MainControllerWidget';
import RequestControllerWidget from '../Widgets/RequestControllerWidget';
import DataStoreControllerWidget from '../Widgets/DataStoreControllerWidget';
import AuthLoginPage from './Auth/AuthLoginPage';
import PanelMainPage from './Panel/PanelMainPage';
import AccountCreationPage from './Account/AccountCreationPage';

/* Widget */
type propsType = {
    $data: {
        /** Every change made to "wid" affect controller */
        wid: string,
        refId: refIdType,
    }
};
const MainPage = (props: propsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const parentProps = props;

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const [windowHeight, setWindowHeight] = useState(window.innerHeight);

    const [refresh, setRefresh] = useState(false);

    const isMounted = useRef(false);

    const render = useRef(false);

    /* $data */

    const data = props.$data;

    const wid = data.wid;

    const refId = data.refId;
    console.log(refId);

    /* - */

    const mainControllerRef = useRef(undefined);
    const requestControllerRef = useRef(undefined);
    const dataStoreControllerRef = useRef(undefined);

    const rootControllers = {
        mainControllerRef: mainControllerRef,
        requestControllerRef: requestControllerRef,
        dataStoreControllerRef: dataStoreControllerRef
    };

    const authLoginRef = useRef(undefined);

    const panelMainRef = useRef(undefined);

    const accountCreationRef = useRef(undefined);

    const timer = useRef<any>(undefined);

    const rootControllersReady = useRef(false);


    /* ------------------------------------ Methods ------------------------------------- */

    /* Render */
    const renderFunc = (x: { render: boolean }) => { render.current = x.render; setRefresh(!refresh) };

    /* Refresh component */
    const refreshFunc = () => { setRefresh(!refresh) };

    /* On window size change */
    const onWindowSizeChangeFunc = () => { setWindowWidth(window.innerWidth); setWindowHeight(window.innerHeight) };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        renderFunc(x: any) { renderFunc(x) },
        refreshFunc() { refreshFunc() }
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
    });


    /* Return */


    const component = <>
        <div id='mp_scaffold'>
            {render.current && <>
                <AuthLoginPage ref={authLoginRef} $data={{ wid: 'authLoginRef', refId: authLoginRef, controllerRef: mainControllerRef, rootControllers: rootControllers }} />
                <PanelMainPage ref={panelMainRef} $data={{ wid: 'panelMainRef', refId: panelMainRef, controllerRef: mainControllerRef, rootControllers: rootControllers }} />
                <AccountCreationPage ref={accountCreationRef} $data={{ wid: 'accountCreationRef', refId: accountCreationRef, controllerRef: mainControllerRef, rootControllers: rootControllers }} />
            </>}
        </div>

        <MainControllerWidget ref={mainControllerRef} $data={{ wid: 'mainControllerRef', refId: mainControllerRef, parentRef: refId, requestControllerRef: requestControllerRef, dataStoreControllerRef: dataStoreControllerRef }} />
        <RequestControllerWidget ref={requestControllerRef} $data={{ wid: 'requestControllerRef', refId: requestControllerRef, mainControllerRef: mainControllerRef, dataStoreControllerRef: dataStoreControllerRef }} />
        <DataStoreControllerWidget ref={dataStoreControllerRef} $data={{ wid: 'dataStoreControllerRef', refId: dataStoreControllerRef, mainControllerRef: mainControllerRef, requestControllerRef: requestControllerRef }} />
    </>;
    return (component);
};

export default forwardRef(MainPage);
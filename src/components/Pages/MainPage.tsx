// @refresh reset

/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';
import $ from 'jquery';

/* Custom packages */
import './Base.css';
import './MainPage.css';
import { refIdType } from '../Tools/type';

import MainRootController from '../RootControllers/MainRootController';
import RequestRootController from '../RootControllers/RequestRootController';
import DataStoreRootController from '../RootControllers/DataStoreRootController';

import AuthLoginPage from './Auth/AuthLoginPage';
import PanelMainPage from './Panel/PanelMainPage';
import ProductCreationWidget from '../Widgets/ProductCreation/ProductCreationWidget';
import ComplaintCreationWidget from '../Widgets/ComplaintCreation/ComplaintCreationWidget';
import AccountCreationWidget from '../Widgets/AdminPanel/Container/Account/Creation/AccountCreationWidget';
import { generateIdFunc } from '../Tools/methodForest';


/** Every change made to "wid" affect controller */
type propsType = { $data: { wid: string } };
const MainPage = forwardRef((props: propsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const refId: refIdType = ref;

    const windowWidth = useRef(window.innerWidth);
    const windowHeight = useRef(window.innerHeight);

    const refresher = useRef(false);
    const [refresh, setRefresh] = useState(refresher.current);

    const isMounted = useRef(false);
    const mountCount = useRef(0);
    const render = useRef(false);

    /* $data */
    const $data = props.$data;
    const wid = $data.wid;

    /* - */

    const mainRootControllerRef = useRef<any>(undefined);
    const requestRootControllerRef = useRef<any>(undefined);
    const dataStoreRootControllerRef = useRef<any>(undefined);
    const rootControllers = useRef({ mainRootControllerRef: mainRootControllerRef, requestRootControllerRef: requestRootControllerRef, dataStoreRootControllerRef: dataStoreRootControllerRef });

    const authLoginRef = useRef<any>(undefined);
    const panelMainRef = useRef<any>(undefined);
    const accountCreationRef = useRef<any>(undefined);
    const productCreationMainRef = useRef<any>(undefined);
    const complaintCreationRef = useRef<any>(undefined);


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
    const setLanguageFunc = (x: { traduction: any }) => {
        // traduction.current = x.traduction;
        // setRefresh(!refresh);
    };

    /* On window size change */
    const onWindowSizeChangeFunc = () => {
        windowWidth.current = window.innerWidth;
        windowHeight.current = window.innerHeight;
    };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        renderFunc(x: any) { renderFunc(x) },
        refreshFunc() { refreshFunc() }
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
    });


    /* Return */

    const component = <>
        <MainRootController ref={mainRootControllerRef} $data={{ wid: 'mainRootControllerRef', parentRef: refId, requestRootControllerRef: requestRootControllerRef, dataStoreRootControllerRef: dataStoreRootControllerRef }} />
        <RequestRootController ref={requestRootControllerRef} $data={{ wid: 'requestRootControllerRef', mainRootControllerRef: mainRootControllerRef, dataStoreRootControllerRef: dataStoreRootControllerRef }} />
        <DataStoreRootController ref={dataStoreRootControllerRef} $data={{ wid: 'requestRootControllerRef', mainRootControllerRef: mainRootControllerRef, requestRootControllerRef: requestRootControllerRef }} />

        <div id='mp_scaffold'>
            {render.current && <>
                <AuthLoginPage ref={authLoginRef} $data={{ wid: 'authLoginRef', rootControllers: rootControllers }} />
                <PanelMainPage ref={panelMainRef} $data={{ wid: 'panelMainRef', rootControllers: rootControllers }} />

                <AccountCreationWidget ref={accountCreationRef} $data={{ wid: 'accountCreationRef', controllerRef: mainRootControllerRef, rootControllers: rootControllers }} />
                {/* <ProductCreationWidget ref={productCreationMainRef} $data={{ wid: 'productCreationMainRef', refId: productCreationMainRef, controllerRef: mainRootControllerRef }} /> */}
                {/* <ComplaintCreationWidget ref={complaintCreationRef} $data={{ wid: 'complaintCreationRef', refId: complaintCreationRef, controllerRef: mainRootControllerRef }} /> */}
            </>}
        </div>
    </>;
    return (component);

}); export default (MainPage);
/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import './AdminAccountMainSubPageWidget.css';
import { generateIdFunc } from '../../../../../Tools/methodForest';
import { language } from '../../../../../Tools/language';
import { refIdType } from '../../../../../Tools/type';
import { _defaultLanguage_ } from '../../../../../Tools/constants';
import AdminASPMainContainerWidget from './AdminAccountSubPage/AdminASPMainContainerWidget';
import CallCSPMainContainerWidget from './CallCenterSubPage/CallCSPMainContainerWidget';
import CustomerSPMainContainerWidget from './CustomerSubPage/CustomerSPMainContainerWidget';

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
const AdminAccountMainSubPageWidget = (props: propsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const parentProps = props;

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const [windowHeight, setWindowHeight] = useState(window.innerHeight);

    const refresher = useRef(false);
    const [refresh, setRefresh] = useState(refresher.current);

    const isMounted = useRef(false);

    const render = useRef(!false);

    const lang = useRef(_defaultLanguage_);

    const traduction = language[lang.current];

    /* $data */

    const data = props.$data;

    const wid = data.wid;

    const refId = data.refId;

    const controllerRef = data.controllerRef; /* AdminMainControllerWidget */

    const rootControllers = data.rootControllers;

    /* Root controllers */

    const mainControllerRef: refIdType = rootControllers.mainControllerRef;

    const requestControllerRef: refIdType = rootControllers.requestControllerRef;

    const dataStoreControllerRef: refIdType = rootControllers.dataStoreControllerRef;

    /* - */

    const adminASPMainContainerRef = useRef(undefined);

    const callCSPMainContainerRef = useRef(undefined);

    const customerSPMainContainerRef = useRef(undefined);


    /* ------------------------------------ Methods ------------------------------------- */

    /* Refresh component */
    const refreshFunc = () => {
        refresher.current = refresher.current ? false : true;
        setRefresh(refresher.current);
    };

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
    // useEffect(() => {
    //     window.addEventListener('resize', onWindowSizeChangeFunc);
    //     return () => window.removeEventListener('resize', onWindowSizeChangeFunc);
    // }, []);


    /* Return */


    const component = <>
        <div id='aamspw_scaffold'>
            <AdminASPMainContainerWidget ref={adminASPMainContainerRef} $data={{ wid: 'adminASPMainContainerRef', refId: adminASPMainContainerRef, controllerRef: controllerRef, rootControllers: rootControllers }} />
            <CallCSPMainContainerWidget ref={callCSPMainContainerRef} $data={{ wid: 'callCSPMainContainerRef', refId: callCSPMainContainerRef, controllerRef: controllerRef, rootControllers: rootControllers }} />
            <CustomerSPMainContainerWidget ref={customerSPMainContainerRef} $data={{ wid: 'customerSPMainContainerRef', refId: customerSPMainContainerRef, controllerRef: controllerRef, rootControllers: rootControllers }} />
        </div>
    </>;
    return (render.current ? component : <></>);
};

export default forwardRef(AdminAccountMainSubPageWidget);
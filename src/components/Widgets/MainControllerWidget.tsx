/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import { refIdType } from '../Tools/type';

/* Widget */
type propsType = {
    $data: {
        /** Every change made to "wid" affect controller */
        wid: string,
        refId: refIdType,
        parentRef: refIdType,
        requestControllerRef: refIdType,
        dataStoreControllerRef: refIdType
    }
};
const MainControllerWidget = (props: propsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const parentProps = props;

    const windowWidth = useRef(window.innerWidth);

    const windowHeight = useRef(window.innerHeight);

    const isMounted = useRef(false);

    const render = useRef(false);

    /* $data */

    const data = props.$data;

    const wid = data.wid;

    const refId = data.refId;

    const parentRef = data.parentRef;

    const requestControllerRef = data.requestControllerRef;

    const dataStoreControllerRef = data.dataStoreControllerRef;

    /* Refs */

    const authLoginRef = useRef<any>(undefined);
    const panelMainRef = useRef<any>(undefined)
    const accountCreationRef = useRef<any>(undefined);
    const productCreationMainRef = useRef<any>(undefined);
    const complaintCreationRef = useRef<any>(undefined);

    const adminASPMainControllerRef = useRef<any>(undefined);
    const callCSPMainControllerRef = useRef<any>(undefined);
    const customerSPMainControllerRef = useRef<any>(undefined);
    const accountCreationControllerRef = useRef<any>(undefined);
    const adminMainControllerRef = useRef<any>(undefined);

    /* - */

    const emptyRef = useRef(undefined);

    const hasInternet = useRef(true);


    /* ------------------------------------ Methods ------------------------------------- */

    /* Add widget ref */
    const addWidgetRefFunc = (x: { wid: string, refId: any }) => {
        const wid = x.wid, refId = x.refId;
        switch (wid) {
            case 'authLoginRef': { authLoginRef.current = refId.current } break;
            case 'panelMainRef': { panelMainRef.current = refId.current } break;
            case 'accountCreationRef': { accountCreationRef.current = refId.current } break;
            case 'productCreationMainRef': { productCreationMainRef.current = refId.current } break;
            case 'complaintCreationRef': { complaintCreationRef.current = refId.current } break;

            case 'adminASPMainControllerRef': { adminASPMainControllerRef.current = refId.current } break;
            case 'callCSPMainControllerRef': { callCSPMainControllerRef.current = refId.current } break;
            case 'customerSPMainControllerRef': { customerSPMainControllerRef.current = refId.current } break;
            case 'accountCreationControllerRef': { accountCreationControllerRef.current = refId.current } break;
            case 'adminMainControllerRef': { adminMainControllerRef.current = refId.current } break;

            default: { };
        };
    };

    /* Set text value from inputs */
    const setTextValueFunc = (x: { wid: string, text: string }) => {
        const wid = x.wid, text = x.text;
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

    /* Start up check done */
    const startUpCheckDoneFunc = () => { parentRef.current.renderFunc({ render: true }) };

    /* Login user */
    const loginUserFunc = () => {
        panelMainRef.current.renderFunc({ render: true });
        authLoginRef.current.renderFunc({ render: false });
    };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        authLoginRef: authLoginRef,
        panelMainRef: panelMainRef,

        accountCreationRef: accountCreationRef,
        productCreationMainRef: productCreationMainRef,
        complaintCreationRef: complaintCreationRef,

        adminASPMainControllerRef: adminASPMainControllerRef,
        callCSPMainControllerRef: callCSPMainControllerRef,
        customerSPMainControllerRef: customerSPMainControllerRef,
        accountCreationControllerRef: accountCreationControllerRef,
        adminMainControllerRef: adminMainControllerRef,

        hasInternet: hasInternet,

        addWidgetRefFunc(x: any) { addWidgetRefFunc(x) },
        setTextValueFunc(x: any) { setTextValueFunc(x) },
        startUpCheckDoneFunc() { startUpCheckDoneFunc() },
        loginUserFunc() { loginUserFunc() },
    }), []);

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

    /* Connection listener */
    useEffect(() => {
        window.addEventListener('online', () => { hasInternet.current = true; console.info('User is connected') });
        window.addEventListener('offline', () => { hasInternet.current = false; console.info('User is not connected') });
        return () => {
            window.removeEventListener('online', () => { });
            window.removeEventListener('offline', () => { });
        }
    });


    /* Return */


    return (<></>);
};

export default forwardRef(MainControllerWidget);
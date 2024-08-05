/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import { refIdType } from '../../Tools/type';

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
const AdminMainControllerWidget = (props: propsType, ref: any) => {
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

    const controllerRef = data.controllerRef;

    const rootControllers = data.rootControllers;

    /* Root controllers */

    const mainControllerRef: refIdType = rootControllers.mainControllerRef;

    const requestControllerRef: refIdType = rootControllers.requestControllerRef;

    const dataStoreControllerRef: refIdType = rootControllers.dataStoreControllerRef;

    /* Refs */

    const adminASPMainContainerRef = useRef<any>(undefined);

    const callCSPMainContainerRef = useRef<any>(undefined);

    const customerSPMainContainerRef = useRef<any>(undefined);

    /* - */

    const currentMenuData = useRef<{ id: string, refId: refIdType } | undefined>();

    const currentMenuSubPageRef = useRef<any>(undefined);


    /* ------------------------------------ Methods ------------------------------------- */

    /* Add widget ref */
    const addWidgetRefFunc = (x: { wid: string, refId: any }) => {
        const wid = x.wid, refId = x.refId;
        switch (wid) {
            case 'adminASPMainContainerRef': { adminASPMainContainerRef.current = refId.current } break;
            case 'callCSPMainContainerRef': { callCSPMainContainerRef.current = refId.current } break;
            case 'customerSPMainContainerRef': { customerSPMainContainerRef.current = refId.current } break;
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

    /* Show menu page */
    const showMenuPageFunc = (x: { id: string, refId: refIdType }) => {
        (currentMenuData.current !== undefined) && (currentMenuData.current.refId).current.selectFunc({ select: false });
        (x.refId).current.selectFunc({ select: true });
        currentMenuData.current = x;

        /* - */
        (currentMenuSubPageRef.current !== undefined) && currentMenuSubPageRef.current.showFunc({ show: false });
        switch (x.id) {
            case 'admin_menu': {
                adminASPMainContainerRef.current.showFunc({ show: true });
                currentMenuSubPageRef.current = adminASPMainContainerRef.current;
            } break;

            case 'call_center_menu': {
                console.log('RR :', callCSPMainContainerRef);
                callCSPMainContainerRef.current.showFunc({ show: true });
                currentMenuSubPageRef.current = callCSPMainContainerRef.current;
            } break;

            case 'customer_menu': {
                customerSPMainContainerRef.current.showFunc({ show: true });
                currentMenuSubPageRef.current = customerSPMainContainerRef.current;
            } break;

            default: { };
        };
    };


    /* ------------------------------------ jQuery ------------------------------------- */


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        addWidgetRefFunc(x: any) { addWidgetRefFunc(x) },
        setTextValueFunc(x: any) { setTextValueFunc(x) },
        showMenuPageFunc(x: any) { showMenuPageFunc(x) }
    }), []);

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
    });


    /* Return */


    return (<></>);
};

export default forwardRef(AdminMainControllerWidget);
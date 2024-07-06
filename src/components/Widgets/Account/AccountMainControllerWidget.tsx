/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

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
const AccountMainControllerWidget = (props: propsType, ref: any) => {
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

    const controllerRef = data.controllerRef; /* panelMainControllerRef */

    const rootControllers = data.rootControllers;

    /* Root controllers */

    const mainControllerRef: refIdType = rootControllers.mainControllerRef;

    const requestControllerRef: refIdType = rootControllers.requestControllerRef;

    const dataStoreControllerRef: refIdType = rootControllers.dataStoreControllerRef;

    /* Refs */

    const accountAdminRef = useRef<any>(undefined);

    const accountCallCenterRef = useRef<any>(undefined);

    const accountCustomerRef = useRef<any>(undefined);

    /* - */

    const currentMenuPageRef = useRef<any>(undefined);


    /* ------------------------------------ Methods ------------------------------------- */

    /* Add widget ref */
    const addWidgetRefFunc = (x: { wid: string, refId: any }) => {
        const wid = x.wid, refId = x.refId;
        switch (wid) {
            case 'accountAdminRef': { accountAdminRef.current = refId.current } break;
            case 'accountCallCenterRef': { accountCallCenterRef.current = refId.current } break;
            case 'accountCustomerRef': { accountCustomerRef.current = refId.current } break;
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
    const onWindowSizeChangeFunc = () => { setWindowWidth(window.innerWidth); setWindowHeight(window.innerHeight) };

    /* Show menu page */
    const showMenuPageFunc = (x: { id: string }) => {
        (currentMenuPageRef.current !== undefined) && currentMenuPageRef.current.showFunc({ show: false });
        switch (x.id) {
            case 'admin_menu': {
                accountAdminRef.current.showFunc({ show: true });
                currentMenuPageRef.current = accountAdminRef.current;
            } break;

            case 'call_center_menu': {
                accountCallCenterRef.current.showFunc({ show: true });
                currentMenuPageRef.current = accountCallCenterRef.current;
            } break;

            case 'customer_menu': {
                accountCustomerRef.current.showFunc({ show: true });
                currentMenuPageRef.current = accountCustomerRef.current;
            } break;

            default: { };
        };
    };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        addWidgetRefFunc(x: any) { addWidgetRefFunc(x) },
        setTextValueFunc(x: any) { setTextValueFunc(x) },
        showMenuPageFunc(x: any) { showMenuPageFunc(x) }
    }), [refresh]);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            controllerRef?.current.addWidgetRefFunc({ wid: wid, refId: refId });
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

export default forwardRef(AccountMainControllerWidget);
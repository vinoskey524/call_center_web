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
        mainControllerRef: refIdType,
        requestControllerRef: refIdType
    }
};
const DataStoreControllerWidget = (props: propsType, ref: any) => {
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

    const mainControllerRef = data.mainControllerRef;

    const requestControllerRef = data.requestControllerRef;

    /* - */

    const currentUserData = useRef<any | undefined>(undefined);

    const accountType = useRef<'main_admin' | 'call_center' | 'customer_admin' | ''>('');

    const emptyRef = useRef(undefined);


    /* ------------------------------------ Methods ------------------------------------- */

    /* Add widget ref */
    const addWidgetRefFunc = (x: { wid: string, refId: any }) => {
        const wid = x.wid, refId = x.refId;
        switch (wid) {
            case 'emptyRef': { emptyRef.current = refId.current } break;
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

    /* Set current user data */
    const setDataFunc = (x: { type: string, data: any }) => {
        const type = x.type, data = x.data;
        switch (type) {
            case 'currentUserData': {
                currentUserData.current = data;
                accountType.current = data.type;
            } break;

            default: {
                console.error(`DataStoreControllerWidget => Data of type "${type}" doesn't exists !`);
                alert(`DataStoreControllerWidget => Data of type "${type}" doesn't exists !`);
            };
        };
    };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        currentUserData: currentUserData,
        accountType: accountType,
        addWidgetRefFunc(x: any) { addWidgetRefFunc(x) },
        setTextValueFunc(x: any) { setTextValueFunc(x) },
        setDataFunc(x: any) { setDataFunc(x) }
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


    /* Return */


    return (<></>);
};

export default forwardRef(DataStoreControllerWidget);
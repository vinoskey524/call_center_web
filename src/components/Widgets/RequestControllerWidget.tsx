/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import ws from '../Database/ws/init';
import { refIdType } from '../Tools/type';
import { pg_mainFunc } from '../Database/psql/methods';
import { _success_, _error_, _requestFailed_, _pgReqFailed_, _cipherFailed_, _decipherFailed_, _noUserFound_, _wsAddress_ } from '../Tools/constants';
import { cipherFunc, decipherFunc } from '../Tools/methodForest';

/* Widget */
type propsType = {
    $data: {
        /** Every change made to "wid" affect controller */
        wid: string,
        refId: refIdType,
        mainControllerRef: refIdType,
        dataStoreControllerRef: refIdType
    }
};
const RequestControllerWidget = (props: propsType, ref: any) => {
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

    const dataStoreControllerRef = data.dataStoreControllerRef;

    /* - */

    const wsReady = useRef(false);

    const emptyRef = useRef(undefined);

    const timer = useRef<any>(undefined);


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

    /* Check refs :: start_up_check_0 */
    const checkRefs = () => {
        if (mainControllerRef.current !== undefined && dataStoreControllerRef !== undefined) mainControllerRef.current.startUpCheckDoneFunc();
        else setTimeout(() => { refId.current.checkRefs() }, 100);
    };


    /* ------------------------------------ Remote Request ------------------------------------- */

    /* Login */
    const loginFunc = async (x: { data: any, controllerRef?: refIdType }) => {
        try {
            /* Cipher */
            const ciphedData = await cipherFunc({ data: JSON.stringify(x.data) });
            if (ciphedData.status !== _success_) throw new Error(_cipherFailed_);

            /* Request to pg */
            const req = await pg_mainFunc({ func: 'loginFunc', data: ciphedData.data });
            if (req.status !== _success_) throw new Error(req.status);

            /* Decipher */
            const deciphedData = await decipherFunc({ data: req.data });
            if (deciphedData.status !== _success_) throw new Error(_decipherFailed_);

            /* - */
            const fdata = JSON.parse(deciphedData.data);
            (x.controllerRef)?.current.getLoginReqFeedbackFunc({ status: req.status, data: fdata });

        } catch (e: any) {
            const msg = e.message;
            switch (msg) {
                case _cipherFailed_: { } break;
                case _decipherFailed_: { } break;
                default: { };
            }
        }
    };

    /* Create account */
    const createAccountFunc = async (x: { type: string, data: any, controllerRef: refIdType }) => {
        const type = x.type, data = x.data, controllerRef = x.controllerRef;
        try {
            /* Cipher */
            const ciphedData = await cipherFunc({ data: JSON.stringify(data) });
            if (ciphedData.status !== _success_) throw new Error(JSON.stringify({ status: _cipherFailed_, data: ciphedData.data }));

            /* Request to pg */
            const req = await pg_mainFunc({ func: 'createAccountFunc', data: ciphedData.data });
            if (req.status !== _success_) throw new Error(JSON.stringify({ status: _requestFailed_, data: req.data }));

            /* Decipher */
            const deciphedData = await decipherFunc({ data: req.data });
            if (deciphedData.status !== _success_) throw new Error(JSON.stringify({ status: _decipherFailed_, data: deciphedData.data }));

            /* - */
            (x.controllerRef).current.getAccountCreationFeedbackFunc({ data: data });

        } catch (e: any) {
            const msg = JSON.parse(e.message);
            (x.controllerRef).current.handleAccountCreationErrorFunc(msg);
        }
    };

    /* Fetch account */
    const fetchAccountFunc = async (x: { data: { domain: string, type: string, state: 'new' | 'old', timestamp_ms: number } }) => {
        const data = x.data;
        try {
            /* Cipher */
            const ciphedData = await cipherFunc({ data: JSON.stringify(data) });
            if (ciphedData.status !== _success_) throw new Error(JSON.stringify({ status: _cipherFailed_, data: ciphedData.data }));

            /* Request to pg */
            const req = await pg_mainFunc({ func: 'fetchAccountFunc', data: ciphedData.data });
            if (req.status !== _success_) throw new Error(JSON.stringify({ status: _requestFailed_, data: req.data }));

            /* Decipher */
            const deciphedData = await decipherFunc({ data: req.data });
            if (deciphedData.status !== _success_) throw new Error(JSON.stringify({ status: _decipherFailed_, data: deciphedData.data }));

            /* - */
            return { status: _success_, data: deciphedData.data };

        } catch (e: any) { return JSON.parse(e.message) }
    };

    /* Function Prototype */
    // const prototypeFunc = async (x: { data: any }) => {
    //     const data = x.data;
    //     try {
    //         /* Cipher */
    //         const ciphedData = await cipherFunc({ data: JSON.stringify(data) });
    //         if (ciphedData.status !== _success_) throw new Error(JSON.stringify({ status: _cipherFailed_, data: ciphedData.data }));

    //         /* Request to pg */
    //         const req = await pg_mainFunc({ func: 'funtion_to_exec', data: ciphedData.data });
    //         if (req.status !== _success_) throw new Error(JSON.stringify({ status: _requestFailed_, data: req.data }));

    //         /* Decipher */
    //         const deciphedData = await decipherFunc({ data: req.data });
    //         if (deciphedData.status !== _success_) throw new Error(JSON.stringify({ status: _decipherFailed_, data: deciphedData.data }));

    //         /* - */
    //         return { status: _success_, data: undefined };

    //     } catch (e: any) { return JSON.parse(e.message) }
    // };


    /* ------------------------------------ Local Request ------------------------------------- */


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        wsReady: wsReady,
        checkRefs() { checkRefs() },
        addWidgetRefFunc(x: any) { addWidgetRefFunc(x) },
        setTextValueFunc(x: any) { setTextValueFunc(x) },
        loginFunc(x: any) { loginFunc(x) },
        createAccountFunc(x: any) { createAccountFunc(x) },
        fetchAccountFunc(x: any) { return fetchAccountFunc(x) }
    }), []);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            checkRefs();
        }
    }, []);

    /* On window size change */
    useEffect(() => {
        window.addEventListener('resize', onWindowSizeChangeFunc);
        return () => window.removeEventListener('resize', onWindowSizeChangeFunc);
    }, []);

    /* Init web socket */
    useEffect(() => {
        ws.onopen = () => { wsReady.current = true; console.log('op'); ws.send('vinoskey hjg'); };
        ws.onerror = (e) => { wsReady.current = false; console.error('ws error ::', e); ws.send('vinoskey hjg'); };
        ws.onmessage = (msg) => { console.log('WS ::', msg) };
        ws.onclose = () => { wsReady.current = false };
    }, []);


    /* Return */


    return (<></>);
};

export default forwardRef(RequestControllerWidget);
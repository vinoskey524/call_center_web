/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import { refIdType } from '../Tools/type';
import { pg_mainFunc } from '../Database/psql/methods';
import { _success_, _error_, _requestFailed_, _noUserFound_, _wsAddress_ } from '../Tools/constants';
import ws from '../Database/ws/init';

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
        if (mainControllerRef.current !== undefined && dataStoreControllerRef !== undefined) mainControllerRef.current.startUpCheckDoneFunc()
        else setTimeout(() => { refId.current.checkRefs() }, 100);
    };

    /* Login */
    const loginFunc = async (x: { data: any, controllerRef?: refIdType }) => {
        const q = await pg_mainFunc({ func: 'loginFunc', data: x.data });
        x.controllerRef?.current.getLoginReqFeedbackFunc({ status: q.status, data: q.data });
    };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        wsReady: wsReady,
        checkRefs() { checkRefs() },
        addWidgetRefFunc(x: any) { addWidgetRefFunc(x) },
        setTextValueFunc(x: any) { setTextValueFunc(x) },
        loginFunc(x: any) { loginFunc(x) }
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
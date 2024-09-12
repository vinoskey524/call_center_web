/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import { refIdType } from '../Tools/type';
import { _error_, _success_ } from '../Tools/constants';

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

    const emptyRef = useRef(undefined);

    const currentUserData = useRef<any | undefined>(undefined);

    const mainAdminAccountIdTab = useRef<string[]>([]);
    const mainAdminAccountData = useRef<any[]>([]);
    const mainAdminAccountNewerTimestamp_ms = useRef(0);
    const mainAdminAccountOlderTimestamp_ms = useRef(0);

    const callCenterAccountIdTab = useRef<string[]>([]);
    const callCenterAccountData = useRef<any[]>([]);
    const callCenterAccountNewerTimestamp_ms = useRef(0);
    const callCenterAccountOlderTimestamp_ms = useRef(0);

    const customerAccountIdTab = useRef<string[]>([]);
    const customerAccountData = useRef<any[]>([]);
    const customerAccountNewerTimestamp_ms = useRef(0);
    const customerAccountOlderTimestamp_ms = useRef(0);


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
            case 'currentUserData': { currentUserData.current = data } break;

            case 'mainAdminAccount': {
                const len = mainAdminAccountData.current.length;
                const tab = [];

                /* Ensure there's no duplicated data */
                if (len > 0) {
                    for (let i = 0; i < data.length; i++) {
                        const id = data[i].id;
                        if (mainAdminAccountIdTab.current.indexOf(id) === -1) {
                            tab.push(data[i])
                            mainAdminAccountIdTab.current.push(id);
                        }
                    }
                } else {
                    for (let i = 0; i < data.length; i++) { mainAdminAccountIdTab.current.push(data[i].id) }
                    tab.push(...data);
                }

                /* - */
                if (tab.length > 0) {
                    const sortedData = [...mainAdminAccountData.current, ...tab].sort((a: any, b: any) => b.timestamp_ms - a.timestamp_ms);
                    mainAdminAccountData.current = sortedData;

                    /* Update timestamp_ms */
                    mainAdminAccountNewerTimestamp_ms.current = mainAdminAccountData.current[0].timestamp_ms;
                    mainAdminAccountOlderTimestamp_ms.current = (mainAdminAccountData.current.slice(-1))[0].timestamp_ms;

                    /* Store data into local storage */

                    // console.log(mainAdminAccountData.current, mainAdminAccountNewerTimestamp_ms, mainAdminAccountOlderTimestamp_ms);
                }
            } break;

            case 'callCenterAccount': {
                const len = callCenterAccountData.current.length;
                const tab = [];

                /* Ensure there's no duplicated data */
                if (len > 0) {
                    for (let i = 0; i < data.length; i++) {
                        const id = data[i].id;
                        if (callCenterAccountIdTab.current.indexOf(id) === -1) {
                            tab.push(data[i])
                            callCenterAccountIdTab.current.push(id);
                        }
                    }
                } else {
                    for (let i = 0; i < data.length; i++) { callCenterAccountIdTab.current.push(data[i].id) }
                    tab.push(...data);
                }

                /* - */
                if (tab.length > 0) {
                    const sortedData = [...callCenterAccountData.current, ...tab].sort((a: any, b: any) => b.timestamp_ms - a.timestamp_ms);
                    callCenterAccountData.current = sortedData;

                    /* Update timestamp_ms */
                    callCenterAccountNewerTimestamp_ms.current = callCenterAccountData.current[0].timestamp_ms;
                    callCenterAccountOlderTimestamp_ms.current = (callCenterAccountData.current.slice(-1))[0].timestamp_ms;

                    /* Store data into local storage */

                    // console.log(callCenterAccountData.current, mainAdminAccountNewerTimestamp_ms, mainAdminAccountOlderTimestamp_ms);
                }
            } break;

            case 'customerAccount': {
                const len = customerAccountData.current.length;
                const tab = [];

                /* Ensure there's no duplicated data */
                if (len > 0) {
                    for (let i = 0; i < data.length; i++) {
                        const id = data[i].id;
                        if (customerAccountIdTab.current.indexOf(id) === -1) {
                            tab.push(data[i])
                            customerAccountIdTab.current.push(id);
                        }
                    }
                } else {
                    for (let i = 0; i < data.length; i++) { customerAccountIdTab.current.push(data[i].id) }
                    tab.push(...data);
                }

                /* - */
                if (tab.length > 0) {
                    const sortedData = [...customerAccountData.current, ...tab].sort((a: any, b: any) => b.timestamp_ms - a.timestamp_ms);
                    customerAccountData.current = sortedData;

                    /* Update timestamp_ms */
                    customerAccountNewerTimestamp_ms.current = customerAccountData.current[0].timestamp_ms;
                    customerAccountOlderTimestamp_ms.current = (customerAccountData.current.slice(-1))[0].timestamp_ms;

                    /* Store data into local storage */

                    // console.log(customerAccountData.current, mainAdminAccountNewerTimestamp_ms, mainAdminAccountOlderTimestamp_ms);
                }
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

        mainAdminAccountData: mainAdminAccountData,
        mainAdminAccountNewerTimestamp_ms: mainAdminAccountNewerTimestamp_ms,
        mainAdminAccountOlderTimestamp_ms: mainAdminAccountOlderTimestamp_ms,

        callCenterAccountData: callCenterAccountData,
        callCenterAccountNewerTimestamp_ms: callCenterAccountNewerTimestamp_ms,
        callCenterAccountOlderTimestamp_ms: callCenterAccountOlderTimestamp_ms,

        customerAccountData: customerAccountData,
        customerAccountNewerTimestamp_ms: customerAccountNewerTimestamp_ms,
        customerAccountOlderTimestamp_ms: customerAccountOlderTimestamp_ms,

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
/* Standard packages */
import React, { useState, memo, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import { refIdType } from '../Tools/type';
import { useAppContext } from '../Provider/AppProvider';
import { _dev_, _success_ } from '../Tools/constants';

/* Widget */
type propsType = {
    $data: {
        /** Every change made to "wid" affect controller */
        wid: string,
        parentRef: refIdType,
        requestRootControllerRef: refIdType,
        dataStoreRootControllerRef: refIdType
    }
};
const MainRootController = forwardRef((props: propsType, ref: any) => {
    /* ----------------------------------------------------------- Constants ----------------------------------------------------------- */

    const refId = ref;

    const windowWidth = useRef(window.innerWidth);
    const windowHeight = useRef(window.innerHeight);

    const isMounted = useRef(false);
    const render = useRef(false);

    const emptyRef = useRef<any>(undefined);
    const consumerRef = useRef<any>(undefined);

    /* $data */
    const data = props.$data;
    const wid = data.wid;
    const parentRef = data.parentRef;
    const requestRootControllerRef = data.requestRootControllerRef;
    const dataStoreRootControllerRef = data.dataStoreRootControllerRef;

    /* Refs */
    const refIdStore = useRef<any>({});

    /* Broadcast domain */
    const globalBD = useRef<any[]>([]);

    /* - */

    const hasInternet = useRef(true);


    /* ----------------------------------------------------------- Methods ----------------------------------------------------------- */

    /* Add refId */
    const addRefIdFunc = (x: { wid: string, refId: any }) => { refIdStore.current[x.wid] = x.refId };

    /* Delete refId */
    const deleteRefIdFunc = (x: { wid: string | string[] }) => {
        const wid = (typeof x.wid === 'string') ? [x.wid] : x.wid;
        for (let i = 0; i < wid.length; i++) { delete refIdStore.current[wid[i]] }
    };

    /* Add to broadcast domain */
    const addToBroadcastDomainFunc = (x: { wid: string, refId: refIdType, domain?: string[] }) => {
        const wid = x.wid, targetRef = x.refId, domain = x.domain;
        globalBD.current.push(targetRef);
        return (globalBD.current.length - 1);
    };

    /* Delete from broadcast domain */
    const deleteFromBroadcastDomainFunc = (x: { index: number }) => { globalBD.current.splice(x.index, 1) };

    /* Broadcast data */
    const broadcastDataFunc = () => {
        if (globalBD.current.length <= 0) return;
        for (let i = 0; i < globalBD.current.length; i++) globalBD.current[i].current.broadcastDataFunc({ type: 'global', data: 'vinoskey' });
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
    const startUpCheckDoneFunc = async () => {
        try {
            parentRef.current.renderFunc({ render: true });

            /* req */
            const req = await requestRootControllerRef.current.checkDefaultMainAdminAccountExistsFunc();
            if (req.status !== _success_) throw new Error(JSON.stringify(req));

            /* check */
            const exists = req.data.exists;
            _dev_ && console.log('Does default MAA ::', exists);
            setTimeout(() => { refIdStore.current['authLoginRef'].current.hideSplashScreenFunc({ exists: exists }) }, 500);

        } catch (e: any) {
            setTimeout(() => { alert('Error') }, 500);
        }
    };

    /* Login user */
    const loginUserFunc = () => {
        (refIdStore.current).panelMainRef.current.renderFunc({ render: true });
        (refIdStore.current).authLoginRef.current.renderFunc({ render: false });
    };


    /* ----------------------------------------------------------- Hooks ----------------------------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        // ...refIdStore.current,
        refIdStore: refIdStore,
        hasInternet: hasInternet,

        addRefIdFunc(x: any) { addRefIdFunc(x) },
        deleteRefIdFunc(x: any) { deleteRefIdFunc(x) },

        addToBroadcastDomainFunc(x: any) { return addToBroadcastDomainFunc(x) },
        deleteFromBroadcastDomainFunc(x: any) { deleteFromBroadcastDomainFunc(x) },
        broadcastDataFunc() { broadcastDataFunc() },

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
        // window.addEventListener('resize', onWindowSizeChangeFunc);
        // return () => window.removeEventListener('resize', onWindowSizeChangeFunc);
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


    /* - */
    const consumer = <ContextConsumer ref={consumerRef} $data={{ controllerRef: refId }} />;
    return (<>{consumer}</>);

}); export default memo(MainRootController);








































/* ----------------------------------------------------- Context Consumer & Controller ----------------------------------------------------- */

/* Context consumer */
const __contextConsumer = forwardRef((props: any, ref: any) => {
    const wid = props?.$data?.wid;
    const controllerRef = props?.$data?.controllerRef;
    const { data, notifyOnChangeFunc }: any = useAppContext();

    /* ---------------------------------- custom logic ---------------------------------- */

    /* - */
    return (<></>);
});
const ContextConsumer = __contextConsumer;
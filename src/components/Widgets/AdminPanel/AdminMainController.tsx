/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle, memo } from 'react';
import $ from 'jquery';

/* Custom packages */
import { refIdType } from '../../Tools/type';
import { replaceConsecutiveSpacesByOneFunc } from '../../Tools/methodForest';


/** Every change made to "wid" affect controller */
type propsType = { $data: { wid: string, controllerRef?: refIdType, rootControllers: any } };
const AdminMainController = forwardRef((props: propsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const refId = ref;

    const windowWidth = useRef(window.innerWidth);
    const windowHeight = useRef(window.innerHeight);

    const isMounted = useRef(false);
    const mountCount = useRef(0);
    const render = useRef(false);

    const broadcastIndex = useRef(-1);

    /* $data */
    const $data = props.$data;
    const wid = $data.wid;
    const controllerRef = $data.controllerRef;
    const rootControllers = $data.rootControllers;

    /* Refs */
    const refIdStore = useRef<any>({});

    /* Root controllers */
    const mainRootControllerRef: refIdType = rootControllers?.current?.mainRootControllerRef;
    const requestRootControllerRef: refIdType = rootControllers?.current?.requestRootControllerRef;
    const dataStoreRootControllerRef: refIdType = rootControllers?.current?.dataStoreRootControllerRef;

    /* - */

    const currentMenuData = useRef<{ id: string, refId: refIdType } | undefined>(undefined);

    const currentMenuSubPageRef = useRef<any>(undefined);


    /* ------------------------------------ Methods ------------------------------------- */

    /* Add refId */
    const addRefIdFunc = (x: { wid: string, refId: any }) => { refIdStore.current[x.wid] = x.refId };

    /* Delete refId */
    const deleteRefIdFunc = (x: { wid: string | string[] }) => {
        const wid = (typeof x.wid === 'string') ? [x.wid] : x.wid;
        for (let i = 0; i < wid.length; i++) { delete refIdStore.current[wid[i]] }
    };

    /* Set text value from inputs */
    const setTextValueFunc = (x: { wid: string, text: string }) => {
        const wid = x.wid, t = (x.text).replaceAll("'", '’').trimStart(), text = replaceConsecutiveSpacesByOneFunc(t), len = text.length;
        const lowerText = text.toLowerCase(), upperText = text.toUpperCase();
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
                const targetRef = refIdStore.current['adminASPMainContainerRef'];
                targetRef.current.showFunc({ show: true });
                currentMenuSubPageRef.current = targetRef.current;
            } break;

            case 'call_center_menu': {
                const target = refIdStore.current['callCSPMainContainerRef'];
                target.current.showFunc({ show: true });
                currentMenuSubPageRef.current = target.current;
            } break;

            case 'customer_menu': {
                const target = refIdStore.current['customerSPMainContainerRef'];
                target.current.showFunc({ show: true });
                currentMenuSubPageRef.current = target.current;
            } break;

            default: { };
        };
    };

    /* Unmount */
    const unmountFunc = () => {
        /* Prevent from first unmounting caused by "strictMode" */
        mountCount.current += 1; if (mountCount.current === 1) return;

        /* unmount logic */
        mainRootControllerRef?.current?.deleteFromBroadcastDomainFunc({ index: broadcastIndex.current });
        mainRootControllerRef?.current?.addRefIdFunc({ wid: wid });
        controllerRef?.current?.deleteRefIdFunc({ wid: wid });
    };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        addRefIdFunc(x: any) { addRefIdFunc(x) },
        deleteRefIdFunc(x: any) { deleteRefIdFunc(x) },
        setTextValueFunc(x: any) { setTextValueFunc(x) },
        showMenuPageFunc(x: any) { showMenuPageFunc(x) }
    }), []);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            broadcastIndex.current = mainRootControllerRef.current.addToBroadcastDomainFunc({ wid: wid, refId: refId });
            mainRootControllerRef.current.addRefIdFunc({ wid: wid, refId: refId });
            (controllerRef?.current !== undefined) && controllerRef.current.addRefIdFunc({ wid: wid, refId: refId });
        }
        return () => unmountFunc();
    }, []);

    /* On window size change */
    useEffect(() => {
        // window.addEventListener('resize', onWindowSizeChangeFunc);
        // return () => window.removeEventListener('resize', onWindowSizeChangeFunc);
    });


    /* Return */
    return (<></>);

}); export default memo(AdminMainController);
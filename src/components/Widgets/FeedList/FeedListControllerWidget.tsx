/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import { refIdType } from '../../Tools/type';
import { _success_, _error_, _requestFailed_, _defaultLanguage_, _dev_ } from '../../Tools/constants';
import { language } from '../../Tools/language';

/* Widget */
type propsType = {
    $data: {
        /** Every change made to "wid" affect controller */
        wid: string,
        refId: refIdType,
        parentRef: refIdType,
        controllerRef?: refIdType,
        rootControllers: any,
        initialFeed: any[]
    }
};
const FeedListControllerWidget = (props: propsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const parentProps = props;

    const windowWidth = useRef(window.innerWidth);

    const windowHeight = useRef(window.innerHeight);

    const isMounted = useRef(false);

    const render = useRef(false);

    const lang = useRef(_defaultLanguage_);

    const traduction = language[lang.current];

    /* $data */

    const data = props.$data;

    const wid = data.wid;

    const refId = data.refId;

    const parentRef = data.parentRef;

    const controllerRef = data.controllerRef;

    const rootControllers = data.rootControllers;

    const initialFeed = data.initialFeed || [];

    /* Root controllers */

    const mainControllerRef: refIdType = rootControllers.mainControllerRef;

    const requestControllerRef: refIdType = rootControllers.requestControllerRef;

    const dataStoreControllerRef: refIdType = rootControllers.dataStoreControllerRef;

    /* Refs */

    const feedMainSubContainerRef = useRef<any>(undefined);

    const feedListLoaderRef = useRef<any>(undefined);

    /* - */

    const emptyRef = useRef(undefined);

    const subContainerMap = useRef<refIdType[]>([]);


    /* ------------------------------------ Methods ------------------------------------- */

    /* Add widget ref */
    const addWidgetRefFunc = (x: { wid: string, refId: any }) => {
        const wid = x.wid, refId = x.refId;
        switch (wid) {
            case 'feedMainSubContainerRef': { feedMainSubContainerRef.current = refId.current } break;
            case 'feedListLoaderRef': { feedListLoaderRef.current = refId.current } break;
            default: { };
        };
    };

    /* Set text value from inputs */
    const setTextValueFunc = (x: { wid: string, text: string }) => {
        const wid = x.wid, text = (x.text).replaceAll("'", '’').trimStart();
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

    /* Show | hide loading */
    const showLoaderFunc = (x: { show: boolean }) => {
        feedListLoaderRef.current.showLoaderFunc({ show: x.show });
    };

    /* Set data */
    const setDataFunc = (x: { data: any[], position: 'top' | 'bottom' }) => {
        const data = x.data, position = x.position;
        if (data.length > 0) {
            const len = subContainerMap.current.length;
            if (len === 0) {
                feedMainSubContainerRef.current.renderContainerFunc({ data: data });

            } else if (len > 0) {
                const subContainerRef = (position === 'top') ? subContainerMap.current[0] : (subContainerMap.current.slice(-1))[0];
                subContainerRef.current.renderContainerFunc({ data: data });

            } else { _dev_ && console.error(`There'less than 3 subContainer =>`, subContainerMap) }

            /* Hide loader */
            feedListLoaderRef.current.showLoaderFunc({ show: false });
        }
    };

    /* Set subContainer */
    const setSubContainerFunc = (x: { data: refIdType[], position: 'top' | 'bottom' }) => {
        const data = x.data, position = x.position;
        const tab = (position === 'top') ? [...data, ...subContainerMap.current] : [...subContainerMap.current, ...data];
        subContainerMap.current = tab;
    };

    /* Set message */
    const setMessageFunc = (x: { text: string, type?: 'message' | 'warning' | 'error' }) => { feedListLoaderRef.current.setMessageFunc(x) };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        addWidgetRefFunc(x: any) { addWidgetRefFunc(x) },
        setTextValueFunc(x: any) { setTextValueFunc(x) },
        showLoaderFunc(x: any) { showLoaderFunc(x) },
        setDataFunc(x: any) { setDataFunc(x) },
        setSubContainerFunc(x: any) { setSubContainerFunc(x) },
        setMessageFunc(x: any) { setMessageFunc(x) }
    }), []);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            (mainControllerRef?.current !== undefined) && mainControllerRef.current.addWidgetRefFunc({ wid: wid, refId: refId });
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

export default forwardRef(FeedListControllerWidget);
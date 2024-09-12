/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import { refIdType } from '../../../../../Tools/type';
import { _dev_, _success_, _error_, _requestFailed_, _defaultLanguage_ } from '../../../../../Tools/constants';
import { catchErrorFunc } from '../../../../../Tools/methodForest';
import { language } from '../../../../../Tools/language';

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
const CallCSPMainControllerWidget = (props: propsType, ref: any) => {
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

    const controllerRef = data.controllerRef;

    const rootControllers = data.rootControllers;

    /* Root controllers */

    const mainControllerRef: refIdType = rootControllers.mainControllerRef;

    const requestControllerRef: refIdType = rootControllers.requestControllerRef;

    const dataStoreControllerRef: refIdType = rootControllers.dataStoreControllerRef;

    /* - */

    const callCenterFeedListRef = useRef<any>(undefined);

    const emptyRef = useRef(undefined);


    /* ------------------------------------ Methods ------------------------------------- */

    /* Add widget ref */
    const addWidgetRefFunc = (x: { wid: string, refId: any }) => {
        const wid = x.wid, refId = x.refId;
        switch (wid) {
            case 'callCenterFeedListRef': { callCenterFeedListRef.current = refId.current } break;
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

    /* Initialize */
    const initFunc = async () => {
        try {
            let checkDb = false;

            /* Check for local data */
            const localData: any[] = dataStoreControllerRef.current.callCenterAccountData.current;
            if (localData.length > 0) {
                callCenterFeedListRef.current.setDataFunc({ data: localData, position: 'bottom' });
            } else checkDb = true;

            /* Check db for new data, if necessary */
            if (checkDb) { await refId.current.fetchAccountFunc() }

        } catch (e: any) { catchErrorFunc({ err: e.message }) }
    };

    /* Fetch account */
    const fetchAccountFunc = async () => {
        try {
            const currentUserData = dataStoreControllerRef.current.currentUserData.current;
            const domain = currentUserData.domain;

            /* Req to pg */
            const timestamp_ms = dataStoreControllerRef.current.callCenterAccountNewerTimestamp_ms.current;
            const req = await requestControllerRef.current.fetchAccountFunc({ domain: domain, type: 'call_center', state: 'new', timestamp_ms: timestamp_ms });
            if (req.status !== _success_) throw new Error(JSON.stringify(req)); /* If error */

            /* On pg req success */
            const data: { userData: any[], accountData: any[] } = req.data;
            const userData: any[] = data.userData;
            const accountData: any[] = data.accountData;
            if (userData.length > 0 && accountData.length > 0) {
                /* Merge data */
                const mergedData = refId.current.mergeAccountDataFunc({ userData: userData, accountData: accountData });

                /* Store data into dataStoreController */
                dataStoreControllerRef.current.setDataFunc({ type: 'callCenterAccount', data: mergedData });

                /* Render accounts */
                refId.current.renderAccountFunc({ data: mergedData, merged: true });

            } else {
                callCenterFeedListRef.current.setMessageFunc({ text: traduction['t0032'] });
                _dev_ && console.warn('no data found.');
            }

        } catch (e: any) { catchErrorFunc({ err: e.message }) }
    };

    /* Merge account data */
    const mergeAccountDataFunc = (x: { userData: any[], accountData: any[] }) => {
        const userData = x.userData, accountData = x.accountData;
        let mergedData = [];

        for (let i = 0; i < userData.length; i++) {
            const user = userData[i];
            const account = (accountData.filter((e: any) => e.id === user.id))[0];

            delete user._id;
            delete account._id;
            delete account.id;
            delete account.timestamp;
            delete account.timestamp_ms;

            const res = Object.assign(user, account);
            mergedData.push(res);
        }

        return mergedData;
    };

    /* Render accounts */
    const renderAccountFunc = (x: { data: any, merged?: boolean }) => {
        try {
            const data = x.data;
            const merged = x.merged ? x.merged : false;
            const mergedData = merged ? data : refId.current.mergeAccountDataFunc({ userData: [data.userData], accountData: [data.accountData] });
            callCenterFeedListRef.current.setDataFunc({ data: mergedData, position: 'top' });

        } catch (e: any) { catchErrorFunc({ err: e.message }) }
    };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        addWidgetRefFunc(x: any) { addWidgetRefFunc(x) },
        setTextValueFunc(x: any) { setTextValueFunc(x) },
        fetchAccountFunc() { fetchAccountFunc() },
        mergeAccountDataFunc(x: any) { return mergeAccountDataFunc(x) },
        renderAccountFunc(x: any) { renderAccountFunc(x) }
    }), []);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            (mainControllerRef?.current !== undefined) && mainControllerRef.current.addWidgetRefFunc({ wid: wid, refId: refId });
            (controllerRef?.current !== undefined) && controllerRef.current.addWidgetRefFunc({ wid: wid, refId: refId });

            /* Init */
            callCenterFeedListRef.current.showLoaderFunc({ show: true });
            initFunc();
        }
    }, []);

    /* On window size change */
    // useEffect(() => {
    //     window.addEventListener('resize', onWindowSizeChangeFunc);
    //     return () => window.removeEventListener('resize', onWindowSizeChangeFunc);
    // });


    /* Return */


    return (<></>);
};

export default forwardRef(CallCSPMainControllerWidget);
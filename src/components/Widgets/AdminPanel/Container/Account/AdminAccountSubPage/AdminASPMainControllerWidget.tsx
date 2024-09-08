/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import { refIdType } from '../../../../../Tools/type';
import { _success_ } from '../../../../../Tools/constants';

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
const AdminASPMainControllerWidget = (props: propsType, ref: any) => {
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

    /* - */

    const emptyRef = useRef(undefined);

    const firstTimestamp = useRef(0);
    const lastTimestamp = useRef(0);


    /* ------------------------------------ Methods ------------------------------------- */

    /* Add widget ref */
    const addWidgetRefFunc = (x: { wid: string, refId: any }) => {
        const wid = x.wid, refId = x.refId;
        switch (wid) {
            case 'emptyRef': { emptyRef.current = refId.current } break;
            default: { };
        }
    };

    /* Set text value from inputs */
    const setTextValueFunc = (x: { wid: string, text: string }) => {
        const wid = x.wid, text = x.text;
        switch (wid) {
            case '': { } break;
            default: { };
        }
    };

    /* On window size change */
    const onWindowSizeChangeFunc = () => {
        windowWidth.current = window.innerWidth;
        windowHeight.current = window.innerHeight;
    };

    /* Fetch account */
    const fetchAccountFunc = async () => {
        try {
            const currentUserData = dataStoreControllerRef.current.currentUserData.current;
            const domain = currentUserData.domain;

            /* - */
            const req = await requestControllerRef.current.fetchAccountFunc({ data: { domain: domain, type: 'main_admin', state: 'new', timestamp_ms: lastTimestamp.current } });
            if (req.status !== _success_) throw new Error(JSON.stringify(req));

            const data = JSON.parse(req.data);
            const userData: any[] = data.users;
            const accountData: any[] = data.accounts;

            /* Mix data */
            let mixData = [];
            for (let i = 0; i < userData.length; i++) {
                const user = userData[i];
                const account = (accountData.filter((e: any) => e.id === user.id))[0];

                delete user._id;
                delete account._id;
                delete account.id;
                delete account.timestamp;
                delete account.timestamp_ms;

                const res = Object.assign(user, account);
                mixData.push(res);
            }

            /* Store data into dataStoreController */
            dataStoreControllerRef.current.setDataFunc({ type: 'mainAdminAccount', data: mixData });

        } catch (e: any) {
            const err = JSON.parse(e.message);
            console.log(err);
        }
    };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        addWidgetRefFunc(x: any) { addWidgetRefFunc(x) },
        setTextValueFunc(x: any) { setTextValueFunc(x) },
        fetchAccountFunc() { fetchAccountFunc() }
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

export default forwardRef(AdminASPMainControllerWidget);
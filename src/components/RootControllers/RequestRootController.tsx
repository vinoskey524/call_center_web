/* Standard packages */
import React, { useState, memo, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import ws from '../Database/ws/init';
import { refIdType } from '../Tools/type';
import { pg_mainFunc } from '../Database/psql/methods';
import { uploadFileFunc } from '../Upload/init';
import { _success_, _error_, _requestFailed_, _pgReqFailed_, _cipherFailed_, _decipherFailed_, _noUserFound_, _wsAddress_, _dev_ } from '../Tools/constants';
import { catchErrorFunc, cipherFunc, decipherFunc } from '../Tools/methodForest';

/** Every change made to "wid" affect controller */
type propsType = { $data: { wid: string, mainRootControllerRef: refIdType, dataStoreRootControllerRef: refIdType } };
const RequestRootController = forwardRef((props: propsType, ref: any) => {
    /* ----------------------------------------------------------- Constants ----------------------------------------------------------- */

    const refId = ref;

    const windowWidth = useRef(window.innerWidth);
    const windowHeight = useRef(window.innerHeight);

    const isMounted = useRef(false);
    const render = useRef(false);

    /* $data */
    const $data = props.$data;
    const wid = $data.wid;
    const mainRootControllerRef = $data.mainRootControllerRef;
    const dataStoreRootControllerRef = $data.dataStoreRootControllerRef;

    /* - */

    const wsReady = useRef(!false);

    const emptyRef = useRef(undefined);

    const timer = useRef<any>(undefined);

    const retryCounter = useRef(0);


    /* ----------------------------------------------------------- Methods ----------------------------------------------------------- */

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
        if (retryCounter.current >= 10) return;
        retryCounter.current += 1;
        if (mainRootControllerRef.current !== undefined && mainRootControllerRef.current !== null) mainRootControllerRef.current.startUpCheckDoneFunc();
        else setTimeout(() => { refId.current.checkRefs() }, 100);
    };


    /* ----------------------------------------------------------- Remote Request ----------------------------------------------------------- */

    /* check default main admin account exists */
    const checkDefaultMainAdminAccountExistsFunc = async () => {
        try {
            /* Cipher */
            const ciphedData = await cipherFunc({ data: JSON.stringify('') });
            if (ciphedData.status !== _success_) throw new Error(JSON.stringify({ status: _cipherFailed_, data: ciphedData.data }));

            /* Request to pg */
            const req = await pg_mainFunc({ func: 'checkDefaultMainAdminAccountExistsFunc', data: ciphedData.data });
            if (req.status !== _success_) throw new Error(JSON.stringify({ status: _requestFailed_, data: req.data }));

            /* Decipher */
            const deciphedData = await decipherFunc({ data: req.data });
            if (deciphedData.status !== _success_) throw new Error(JSON.stringify({ status: _decipherFailed_, data: deciphedData.data }));

            /* - */
            return { status: _success_, data: JSON.parse(deciphedData.data) };

        } catch (e: any) { return catchErrorFunc({ err: e.message }) }
    };

    /* Create default main admin account */
    const createDefaultMainAdminAccountFunc = async (x: { data: any }) => {
        const data = x.data;
        try {
            /* Cipher */
            const ciphedData = await cipherFunc({ data: JSON.stringify(data) });
            if (ciphedData.status !== _success_) throw new Error(JSON.stringify({ status: _cipherFailed_, data: ciphedData.data }));

            /* Request to pg */
            const req = await pg_mainFunc({ func: 'createDefaultMainAdminAccountFunc', data: ciphedData.data });
            if (req.status !== _success_) throw new Error(JSON.stringify({ status: _requestFailed_, data: req.data }));

            /* Decipher */
            const deciphedData = await decipherFunc({ data: req.data });
            if (deciphedData.status !== _success_) throw new Error(JSON.stringify({ status: _decipherFailed_, data: deciphedData.data }));

            /* - */
            return { status: _success_, data: JSON.parse(deciphedData.data) };

        } catch (e: any) { return catchErrorFunc({ err: e.message }) }
    };





    /* Login */
    const loginFunc = async (x: { data: any }) => {
        const data = x.data;
        ws.send(JSON.stringify({ message: 'user is login' }));

        try {
            /* Cipher */
            const ciphedData = await cipherFunc({ data: JSON.stringify(data) });
            if (ciphedData.status !== _success_) throw new Error(JSON.stringify({ status: _cipherFailed_, data: ciphedData.data }));

            /* Request to pg */
            const req = await pg_mainFunc({ func: 'loginFunc', data: ciphedData.data });
            if (req.status !== _success_) throw new Error(JSON.stringify({ status: _requestFailed_, data: req.data }));

            /* Decipher */
            const deciphedData = await decipherFunc({ data: req.data });
            if (deciphedData.status !== _success_) throw new Error(JSON.stringify({ status: _decipherFailed_, data: deciphedData.data }));

            /* - */
            return { status: _success_, data: JSON.parse(deciphedData.data) };

        } catch (e: any) { return catchErrorFunc({ err: e.message }) }
    };

    /* Create account */
    /* type => main_admin | call_center | customer_admin | customer */
    const createAccountFunc = async (x: { type: string, data: any }) => {
        const type = x.type, data = x.data;
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
            return { status: _success_, data: JSON.parse(deciphedData.data) };

        } catch (e: any) { return catchErrorFunc({ err: e.message }) }
    };

    /* Update account */
    /* type => main_admin | call_center | customer_admin | customer */
    const updateAccountFunc = async (x: { type: string, data: any }) => {
        const type = x.type, data = x.data;
        try {
            /* Cipher */
            const ciphedData = await cipherFunc({ data: JSON.stringify(data) });
            if (ciphedData.status !== _success_) throw new Error(JSON.stringify({ status: _cipherFailed_, data: ciphedData.data }));

            /* Request to pg */
            const req = await pg_mainFunc({ func: 'updateAccountFunc', data: ciphedData.data });
            if (req.status !== _success_) throw new Error(JSON.stringify({ status: _requestFailed_, data: req.data }));

            /* Decipher */
            const deciphedData = await decipherFunc({ data: req.data });
            if (deciphedData.status !== _success_) throw new Error(JSON.stringify({ status: _decipherFailed_, data: deciphedData.data }));

            /* - */
            return { status: _success_, data: JSON.parse(deciphedData.data) };

        } catch (e: any) { return catchErrorFunc({ err: e.message }) }
    };

    /* Delete account */
    const deleteAccountFunc = async (x: { data: any }) => {
        const data = x.data;
        try {
            /* Cipher */
            const ciphedData = await cipherFunc({ data: JSON.stringify(data) });
            if (ciphedData.status !== _success_) throw new Error(JSON.stringify({ status: _cipherFailed_, data: ciphedData.data }));

            /* Request to pg */
            const req = await pg_mainFunc({ func: 'deleteAccountFunc', data: ciphedData.data });
            if (req.status !== _success_) throw new Error(JSON.stringify({ status: _requestFailed_, data: req.data }));

            /* Decipher */
            const deciphedData = await decipherFunc({ data: req.data });
            if (deciphedData.status !== _success_) throw new Error(JSON.stringify({ status: _decipherFailed_, data: deciphedData.data }));

            /* - */
            return { status: _success_, data: JSON.parse(deciphedData.data) };

        } catch (e: any) { return catchErrorFunc({ err: e.message }) }
    };





    /* Fetch users */
    const fetchUsersFunc = async (x: { data: any }) => {
        const data = x.data;
        try {
            /* Cipher */
            const ciphedData = await cipherFunc({ data: JSON.stringify(data) });
            if (ciphedData.status !== _success_) throw new Error(JSON.stringify({ status: _cipherFailed_, data: ciphedData.data }));

            /* Request to pg */
            const req = await pg_mainFunc({ func: 'fetchUsersFunc', data: ciphedData.data });
            if (req.status !== _success_) throw new Error(JSON.stringify({ status: _requestFailed_, data: req.data }));

            /* Decipher */
            const deciphedData = await decipherFunc({ data: req.data });
            if (deciphedData.status !== _success_) throw new Error(JSON.stringify({ status: _decipherFailed_, data: deciphedData.data }));

            /* - */
            return { status: _success_, data: JSON.parse(deciphedData.data) };

        } catch (e: any) { return catchErrorFunc({ err: e.message }) }
    };

    /* Fetch account */
    const fetchAccountFunc = async (x: { domain: string, type: string, state: 'new' | 'old', timestamp_ms: number }) => {
        const data = { domain: x.domain, type: x.type, state: x.state, timestamp_ms: x.timestamp_ms };
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
            return { status: _success_, data: JSON.parse(deciphedData.data) };

        } catch (e: any) { return catchErrorFunc({ err: e.message }) }
    };

    /* Fetch customers accounts */
    const fetchCustomerAccountFunc = async (x: { state: 'new' | 'old', timestamp_ms: number }) => {
        try {
            const data = x;

            /* Cipher */
            const ciphedData = await cipherFunc({ data: JSON.stringify(data) });
            if (ciphedData.status !== _success_) throw new Error(JSON.stringify({ status: _cipherFailed_, data: ciphedData.data }));

            /* Request to pg */
            const req = await pg_mainFunc({ func: 'fetchCustomerAccountFunc', data: ciphedData.data });
            if (req.status !== _success_) throw new Error(JSON.stringify({ status: _requestFailed_, data: req.data }));

            /* Decipher */
            const deciphedData = await decipherFunc({ data: req.data });
            if (deciphedData.status !== _success_) throw new Error(JSON.stringify({ status: _decipherFailed_, data: deciphedData.data }));

            /* - */
            return { status: _success_, data: JSON.parse(deciphedData.data) };

        } catch (e: any) { return catchErrorFunc({ err: e.message }) }
    };





    /* Create product */
    const createProductFunc = async (x: { data: any }) => {
        try {
            const data = x.data;
            const fileData = data.fileData;
            const file = data.fileSource;

            /* Cipher */
            const ciphedData = await cipherFunc({ data: JSON.stringify(fileData) });
            if (ciphedData.status !== _success_) throw new Error(JSON.stringify({ status: _cipherFailed_, data: ciphedData.data }));

            /* Create product in pg */
            const req = await pg_mainFunc({ func: 'createProductFunc', data: ciphedData.data });
            if (req.status !== _success_) throw new Error(JSON.stringify({ status: _requestFailed_, data: req.data }));

            /* Append file &  meta data to FormData() */
            const formData = new FormData();
            formData.append('mojave', file);
            formData.append('func', 'createProductFunc');
            formData.append('data', ciphedData.data);

            /* Upload file */
            const upload = await uploadFileFunc({ formData: formData });
            if (upload.status !== _success_) throw new Error(JSON.stringify({ status: _requestFailed_, data: req.data }));

            console.log(upload);


            /* Decipher */
            // const deciphedData = await decipherFunc({ data: req.data });
            // if (deciphedData.status !== _success_) throw new Error(JSON.stringify({ status: _decipherFailed_, data: deciphedData.data }));

            /* - */
            // return { status: _success_, data: JSON.parse(deciphedData.data) };

        } catch (e: any) { return catchErrorFunc({ err: e.message }) }
    };

    /* Fetch product */
    const fetchProductFunc = async (x: { data: { domain: string, timestamp_ms: number, state: 'new' | 'old' } }) => {
        try {
            const data = x.data;

            /* Cipher */
            const ciphedData = await cipherFunc({ data: JSON.stringify(data) });
            if (ciphedData.status !== _success_) throw new Error(JSON.stringify({ status: _cipherFailed_, data: ciphedData.data }));

            /* Request to pg */
            const req = await pg_mainFunc({ func: 'fetchProductFunc', data: ciphedData.data });
            if (req.status !== _success_) throw new Error(JSON.stringify({ status: _requestFailed_, data: req.data }));

            /* Decipher */
            const deciphedData = await decipherFunc({ data: req.data });
            if (deciphedData.status !== _success_) throw new Error(JSON.stringify({ status: _decipherFailed_, data: deciphedData.data }));

            /* - */
            return { status: _success_, data: JSON.parse(deciphedData.data) };

        } catch (e: any) { return catchErrorFunc({ err: e.message }) }
    };





    /* Create complaint */
    const createComplaintFunc = async (x: { data: any }) => {
        const data = x.data;
        try {
            /* Cipher */
            const ciphedData = await cipherFunc({ data: JSON.stringify(data) });
            if (ciphedData.status !== _success_) throw new Error(JSON.stringify({ status: _cipherFailed_, data: ciphedData.data }));

            /* Request to pg */
            const req = await pg_mainFunc({ func: 'createComplaintFunc', data: ciphedData.data });
            if (req.status !== _success_) throw new Error(JSON.stringify({ status: _requestFailed_, data: req.data }));

            /* Decipher */
            const deciphedData = await decipherFunc({ data: req.data });
            if (deciphedData.status !== _success_) throw new Error(JSON.stringify({ status: _decipherFailed_, data: deciphedData.data }));

            /* - */
            return { status: _success_, data: JSON.parse(deciphedData.data) };

        } catch (e: any) { return catchErrorFunc({ err: e.message }) }
    };

    /* Fetch complaint */
    const fetchComplaintFunc = async (x: { data: any }) => {
        const data = x.data;
        try {
            /* Cipher */
            const ciphedData = await cipherFunc({ data: JSON.stringify(data) });
            if (ciphedData.status !== _success_) throw new Error(JSON.stringify({ status: _cipherFailed_, data: ciphedData.data }));

            /* Request to pg */
            const req = await pg_mainFunc({ func: 'fetchComplaintFunc', data: ciphedData.data });
            if (req.status !== _success_) throw new Error(JSON.stringify({ status: _requestFailed_, data: req.data }));

            /* Decipher */
            const deciphedData = await decipherFunc({ data: req.data });
            if (deciphedData.status !== _success_) throw new Error(JSON.stringify({ status: _decipherFailed_, data: deciphedData.data }));

            /* - */
            return { status: _success_, data: JSON.parse(deciphedData.data) };

        } catch (e: any) { return catchErrorFunc({ err: e.message }) }
    };





    /* Create object */
    const createComplaintObjectFunc = async (x: { data: any }) => {
        const data = x.data;
        try {
            /* Cipher */
            const ciphedData = await cipherFunc({ data: JSON.stringify(data) });
            if (ciphedData.status !== _success_) throw new Error(JSON.stringify({ status: _cipherFailed_, data: ciphedData.data }));

            /* Request to pg */
            const req = await pg_mainFunc({ func: 'createComplaintObjectFunc', data: ciphedData.data });
            if (req.status !== _success_) throw new Error(JSON.stringify({ status: _requestFailed_, data: req.data }));

            /* Decipher */
            const deciphedData = await decipherFunc({ data: req.data });
            if (deciphedData.status !== _success_) throw new Error(JSON.stringify({ status: _decipherFailed_, data: deciphedData.data }));

            console.log(deciphedData.data);

            /* - */
            return { status: _success_, data: JSON.parse(deciphedData.data) };

        } catch (e: any) { return catchErrorFunc({ err: e.message }) }
    };

    /* Update object */
    const updateComplaintObjectFunc = async (x: { data: any }) => {
        const data = x.data;
        try {
            /* Cipher */
            const ciphedData = await cipherFunc({ data: JSON.stringify(data) });
            if (ciphedData.status !== _success_) throw new Error(JSON.stringify({ status: _cipherFailed_, data: ciphedData.data }));

            /* Request to pg */
            const req = await pg_mainFunc({ func: 'updateComplaintObjectFunc', data: ciphedData.data });
            if (req.status !== _success_) throw new Error(JSON.stringify({ status: _requestFailed_, data: req.data }));

            /* Decipher */
            const deciphedData = await decipherFunc({ data: req.data });
            if (deciphedData.status !== _success_) throw new Error(JSON.stringify({ status: _decipherFailed_, data: deciphedData.data }));

            /* - */
            return { status: _success_, data: JSON.parse(deciphedData.data) };

        } catch (e: any) { return catchErrorFunc({ err: e.message }) }
    };

    /* Delete complaint object */
    const deleteComplaintObjectFunc = async (x: { data: any }) => {
        const data = x.data;
        try {
            /* Cipher */
            const ciphedData = await cipherFunc({ data: JSON.stringify(data) });
            if (ciphedData.status !== _success_) throw new Error(JSON.stringify({ status: _cipherFailed_, data: ciphedData.data }));

            /* Request to pg */
            const req = await pg_mainFunc({ func: 'deleteComplaintObjectFunc', data: ciphedData.data });
            if (req.status !== _success_) throw new Error(JSON.stringify({ status: _requestFailed_, data: req.data }));

            /* Decipher */
            const deciphedData = await decipherFunc({ data: req.data });
            if (deciphedData.status !== _success_) throw new Error(JSON.stringify({ status: _decipherFailed_, data: deciphedData.data }));

            /* - */
            return { status: _success_, data: JSON.parse(deciphedData.data) };

        } catch (e: any) { return catchErrorFunc({ err: e.message }) }
    };

    /* Fetch object */
    const fetchComplaintObjectFunc = async (x: { data: any }) => {
        const data = x.data;
        try {
            /* Cipher */
            const ciphedData = await cipherFunc({ data: JSON.stringify(data) });
            if (ciphedData.status !== _success_) throw new Error(JSON.stringify({ status: _cipherFailed_, data: ciphedData.data }));

            /* Request to pg */
            const req = await pg_mainFunc({ func: 'fetchComplaintObjectFunc', data: ciphedData.data });
            if (req.status !== _success_) throw new Error(JSON.stringify({ status: _requestFailed_, data: req.data }));

            /* Decipher */
            const deciphedData = await decipherFunc({ data: req.data });
            if (deciphedData.status !== _success_) throw new Error(JSON.stringify({ status: _decipherFailed_, data: deciphedData.data }));

            /* - */
            return { status: _success_, data: JSON.parse(deciphedData.data) };

        } catch (e: any) { return catchErrorFunc({ err: e.message }) }
    };





    /* Create agency */
    const createAgencyFunc = async (x: { data: any }) => {
        const data = x.data;
        try {
            /* Cipher */
            const ciphedData = await cipherFunc({ data: JSON.stringify(data) });
            if (ciphedData.status !== _success_) throw new Error(JSON.stringify({ status: _cipherFailed_, data: ciphedData.data }));

            /* Request to pg */
            const req = await pg_mainFunc({ func: 'createAgencyFunc', data: ciphedData.data });
            if (req.status !== _success_) throw new Error(JSON.stringify({ status: _requestFailed_, data: req.data }));

            /* Decipher */
            const deciphedData = await decipherFunc({ data: req.data });
            if (deciphedData.status !== _success_) throw new Error(JSON.stringify({ status: _decipherFailed_, data: deciphedData.data }));

            /* - */
            return { status: _success_, data: JSON.parse(deciphedData.data) };

        } catch (e: any) { return catchErrorFunc({ err: e.message }) }
    };

    /* Update agency */
    const updateAgencyFunc = async (x: { data: any }) => {
        const data = x.data;
        try {
            /* Cipher */
            const ciphedData = await cipherFunc({ data: JSON.stringify(data) });
            if (ciphedData.status !== _success_) throw new Error(JSON.stringify({ status: _cipherFailed_, data: ciphedData.data }));

            /* Request to pg */
            const req = await pg_mainFunc({ func: 'updateAgencyFunc', data: ciphedData.data });
            if (req.status !== _success_) throw new Error(JSON.stringify({ status: _requestFailed_, data: req.data }));

            /* Decipher */
            const deciphedData = await decipherFunc({ data: req.data });
            if (deciphedData.status !== _success_) throw new Error(JSON.stringify({ status: _decipherFailed_, data: deciphedData.data }));

            /* - */
            return { status: _success_, data: JSON.parse(deciphedData.data) };

        } catch (e: any) { return catchErrorFunc({ err: e.message }) }
    };

    /* Delete agency */
    const deleteAgencyFunc = async (x: { data: any }) => {
        const data = x.data;
        try {
            /* Cipher */
            const ciphedData = await cipherFunc({ data: JSON.stringify(data) });
            if (ciphedData.status !== _success_) throw new Error(JSON.stringify({ status: _cipherFailed_, data: ciphedData.data }));

            /* Request to pg */
            const req = await pg_mainFunc({ func: 'deleteAgencyFunc', data: ciphedData.data });
            if (req.status !== _success_) throw new Error(JSON.stringify({ status: _requestFailed_, data: req.data }));

            /* Decipher */
            const deciphedData = await decipherFunc({ data: req.data });
            if (deciphedData.status !== _success_) throw new Error(JSON.stringify({ status: _decipherFailed_, data: deciphedData.data }));

            /* - */
            return { status: _success_, data: JSON.parse(deciphedData.data) };

        } catch (e: any) { return catchErrorFunc({ err: e.message }) }
    };

    /* Fetch agency */
    const fetchAgencyFunc = async (x: { data: any }) => {
        const data = x.data;
        try {
            /* Cipher */
            const ciphedData = await cipherFunc({ data: JSON.stringify(data) });
            if (ciphedData.status !== _success_) throw new Error(JSON.stringify({ status: _cipherFailed_, data: ciphedData.data }));

            /* Request to pg */
            const req = await pg_mainFunc({ func: 'fetchAgencyFunc', data: ciphedData.data });
            if (req.status !== _success_) throw new Error(JSON.stringify({ status: _requestFailed_, data: req.data }));

            /* Decipher */
            const deciphedData = await decipherFunc({ data: req.data });
            if (deciphedData.status !== _success_) throw new Error(JSON.stringify({ status: _decipherFailed_, data: deciphedData.data }));

            /* - */
            return { status: _success_, data: JSON.parse(deciphedData.data) };

        } catch (e: any) { return catchErrorFunc({ err: e.message }) }
    };





    /* Customer init fetch */
    const customerInitFetchFunc = async (x: { data: any }) => {
        const data = x.data;
        try {
            /* Cipher */
            const ciphedData = await cipherFunc({ data: JSON.stringify(data) });
            if (ciphedData.status !== _success_) throw new Error(JSON.stringify({ status: _cipherFailed_, data: ciphedData.data }));

            /* Request to pg */
            const req = await pg_mainFunc({ func: 'customerInitFetchFunc', data: ciphedData.data });
            if (req.status !== _success_) throw new Error(JSON.stringify({ status: _requestFailed_, data: req.data }));

            /* Decipher */
            const deciphedData = await decipherFunc({ data: req.data });
            if (deciphedData.status !== _success_) throw new Error(JSON.stringify({ status: _decipherFailed_, data: deciphedData.data }));

            /* - */
            return { status: _success_, data: JSON.parse(deciphedData.data) };

        } catch (e: any) { return catchErrorFunc({ err: e.message }) }
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
    //         return { status: _success_, data: JSON.parse(deciphedData.data) };

    //     } catch (e: any) { return catchErrorFunc({ err: e.message }) }
    // };


    /* ----------------------------------------------------------- Local Request ----------------------------------------------------------- */


    /* ----------------------------------------------------------- Hooks ----------------------------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        wsReady: wsReady,

        /* - */
        checkRefs() { checkRefs() },
        setTextValueFunc(x: any) { setTextValueFunc(x) },

        /* - */
        checkDefaultMainAdminAccountExistsFunc() { return checkDefaultMainAdminAccountExistsFunc() },
        createDefaultMainAdminAccountFunc(x: any) { return createDefaultMainAdminAccountFunc(x) },

        /* users & accounts */
        loginFunc(x: any) { return loginFunc(x) },
        createAccountFunc(x: any) { return createAccountFunc(x) },
        updateAccountFunc(x: any) { return updateAccountFunc(x) },
        fetchUsersFunc(x: any) { return fetchUsersFunc(x) },
        fetchAccountFunc(x: any) { return fetchAccountFunc(x) },
        deleteAccountFunc(x: any) { return deleteAccountFunc(x) },
        fetchCustomerAccountFunc(x: any) { return fetchCustomerAccountFunc(x) },
        createProductFunc(x: any) { return createProductFunc(x) },
        fetchProductFunc(x: any) { return fetchProductFunc(x) },

        /* complaint */
        createComplaintFunc(x: any) { return createComplaintFunc(x) },
        fetchComplaintFunc(x: any) { return fetchComplaintFunc(x) },

        /* complaint object */
        createComplaintObjectFunc(x: any) { return createComplaintObjectFunc(x) },
        updateComplaintObjectFunc(x: any) { return updateComplaintObjectFunc(x) },
        deleteComplaintObjectFunc(x: any) { return deleteComplaintObjectFunc(x) },
        fetchComplaintObjectFunc(x: any) { return fetchComplaintObjectFunc(x) },

        /* agency */
        createAgencyFunc(x: any) { return createAgencyFunc(x) },
        updateAgencyFunc(x: any) { return updateAgencyFunc(x) },
        deleteAgencyFunc(x: any) { return deleteAgencyFunc(x) },
        fetchAgencyFunc(x: any) { return fetchAgencyFunc(x) },

        /* - */
        customerInitFetchFunc(x: any) { return customerInitFetchFunc(x) },

    }), []);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            setTimeout(() => { checkRefs() }, 100);
        }
    }, []);

    /* On window size change */
    useEffect(() => {
        // window.addEventListener('resize', onWindowSizeChangeFunc);
        // return () => window.removeEventListener('resize', onWindowSizeChangeFunc);
    }, []);

    /* Init web socket */
    useEffect(() => {
        // ws.onopen = () => { wsReady.current = true; console.log('op'); ws.send('vinoskey hjg'); };

        /* Error */
        ws.onerror = (e) => { wsReady.current = false; console.error('ws error ::', e); ws.send('vinoskey hjg'); };

        /* Message */
        ws.onmessage = (msg) => {
            console.log('WS ::', msg);
        };

        /* Close */
        ws.onclose = () => { wsReady.current = false };
    }, []);


    /* Return */

    return (<></>);

}); export default memo(RequestRootController);
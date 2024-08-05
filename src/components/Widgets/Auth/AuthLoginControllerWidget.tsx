/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $, { contains } from 'jquery';

/* Custom packages */
import { refIdType } from '../../Tools/type';
import { _success_, _error_, _requestFailed_, _incorrectCredentials_, _defaultLanguage_ } from '../../Tools/constants';
import { language } from '../../Tools/language';

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
const AuthLoginControllerWidget = (props: propsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const parentProps = props;

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const [windowHeight, setWindowHeight] = useState(window.innerHeight);

    const [refresh, setRefresh] = useState(false);

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

    const emptyRef = useRef(undefined);

    const authLoadingRef = useRef<any>(undefined);

    const loginData = useRef({ domain: '', username: '', ssm: '' });

    const isLoginReqPending = useRef(false);

    const notFoundAccountHistory = useRef([]);


    /* ------------------------------------ Methods ------------------------------------- */

    /* Add widget ref */
    const addWidgetRefFunc = (x: { wid: string, refId: any }) => {
        const wid = x.wid, refId = x.refId;
        switch (wid) {
            case 'authLoadingRef': { authLoadingRef.current = refId.current } break;
            default: { };
        };
    };

    /* Set text value from inputs */
    const setTextValueFunc = (x: { wid: string, text: string }) => {
        const wid = x.wid, text = (x.text).replaceAll("'", '’');
        switch (wid) {
            case 'domain_input': { loginData.current.domain = text } break;
            case 'username_input': { loginData.current.username = text } break;
            case 'password_input': { loginData.current.ssm = text } break;
            default: { };
        };
    };

    /* On window size change */
    const onWindowSizeChangeFunc = () => { setWindowWidth(window.innerWidth); setWindowHeight(window.innerHeight) };

    /* Login */
    const loginFunc = () => {
        if (!isLoginReqPending.current) {
            isLoginReqPending.current = true;
            $('#al_message_container').text('');
            $('.al_input').attr({ 'readonly': true });

            const val = Object.values(loginData.current);
            const searchEmptyVal = val.indexOf('');

            if (searchEmptyVal === -1) {
                authLoadingRef.current.showLoadingFunc({ show: true });
                requestControllerRef.current.loginFunc({ data: loginData.current, controllerRef: refId });
            } else {
                $('#al_message_container').css({ 'color': '#FCF2A9' });
                $('#al_message_container').text(`${traduction['t0017']}`);
                $('.al_input').removeAttr('readonly');
                isLoginReqPending.current = false;
            }
        }
    };

    /* Get login request feedback */
    const getLoginReqFeedbackFunc = (x: { status: string, data: any }) => {
        const status = x.status, data = x.data;
        authLoadingRef.current.showLoadingFunc({ show: false });
        if (status === _success_) {
            const hasFoundUser = Object.keys(data).length > 0 ? true : false;
            if (hasFoundUser) {
                $('#al_logo').removeClass('floating');
                dataStoreControllerRef.current.setDataFunc({ type: 'currentUserData', data: data });
                mainControllerRef.current.loginUser();
            } else {
                setTimeout(() => {
                    $('#al_message_container').css({ 'color': '#FCF2A9' });
                    $('#al_message_container').text(`${traduction['t0015']}`);
                }, 320);
            }
        } else {
            setTimeout(() => {
                $('#al_message_container').css({ 'color': 'red' });
                $('#al_message_container').text(`${traduction['t0016']}`);
            }, 320);
        }
        setTimeout(() => {
            $('.al_input').removeAttr('readonly');
            isLoginReqPending.current = false;
        }, 1000);
    };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        addWidgetRefFunc(x: any) { addWidgetRefFunc(x) },
        setTextValueFunc(x: any) { setTextValueFunc(x) },
        loginFunc() { loginFunc() },
        getLoginReqFeedbackFunc(x: any) { getLoginReqFeedbackFunc(x) }
    }), [refresh]);

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

export default forwardRef(AuthLoginControllerWidget);
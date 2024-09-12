/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import './AuthLoginPage.css';
import { language } from '../../Tools/language';
import { refIdType } from '../../Tools/type';
import AuthLoginControllerWidget from '../../Widgets/Auth/AuthLoginControllerWidget';
import LoadingWidget from '../../Widgets/Others/LoadingWidget';
import call_center_logo from '../../Assets/png/logo_f.png';

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
const AuthLoginPage = (props: propsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const parentProps = props;

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const [windowHeight, setWindowHeight] = useState(window.innerHeight);

    const [refresh, setRefresh] = useState(false);

    const isMounted = useRef(false);

    const render = useRef(true);

    const lang = useRef('fr');

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

    const authLoginControllerRef = useRef<any>(undefined);

    const authLoadingRef = useRef<any>(undefined);


    /* ------------------------------------ Methods ------------------------------------- */

    /* Refresh component */
    const refreshFunc = () => { setRefresh(!refresh) };

    /* Render */
    const renderFunc = (x: { render: boolean }) => {
        render.current = x.render;
        refreshFunc();
    };

    /* Set language */
    const setLanguageFunc = (x: { lang: 'en' | 'fr' }) => { lang.current = x.lang; setRefresh(!refresh) };

    /* On window size change */
    const onWindowSizeChangeFunc = () => { setWindowWidth(window.innerWidth); setWindowHeight(window.innerHeight) };

    /* On input change */
    const onInputChangeFunc = (x: { wid: string }) => {
        const wid = x.wid;
        $('#al_message_container').text('');
        switch (wid) {
            case 'domain_input': { authLoginControllerRef.current.setTextValueFunc({ wid: wid, text: $('#al_domain_input').val() }) } break;
            case 'username_input': { authLoginControllerRef.current.setTextValueFunc({ wid: wid, text: $('#al_username_input').val() }) } break;
            case 'password_input': { authLoginControllerRef.current.setTextValueFunc({ wid: wid, text: $('#al_password_input').val() }) } break;
            default: { };
        };
    };

    /* On click */
    const onLoginFunc = async () => { authLoginControllerRef.current.loginFunc() };

    /* Set text */
    const setTextFunc = (x: { type: 'domain' | 'username' | 'password', text: string }) => {
        const obj = { domain: $('#al_domain_input'), username: $('#al_username_input'), password: $('#al_password_input') };
        const $target = obj[x.type];
        $target.val(x.text);
    };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        refreshFunc() { refreshFunc() },
        renderFunc(x: any) { renderFunc(x) },
        setLanguageFunc(x: any) { setLanguageFunc(x) },
        setTextFunc(x: any) { setTextFunc(x) }
    }), [refresh]);

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


    const component = <>
        <div id='al_scaffold'>
            <div id='al_container'>
                <img id='al_logo' className='floating' src={call_center_logo} />
                <input id='al_domain_input' name='domain_input' className='al_input' type='text' placeholder={traduction['t0005']} onChange={() => { onInputChangeFunc({ wid: 'domain_input' }) }} />
                <input id='al_username_input' name='username_input' className='al_input' type='text' placeholder={traduction['t0002']} onChange={() => { onInputChangeFunc({ wid: 'username_input' }) }} />
                <input id='al_password_input' name='password_input' className='al_input' type='password' placeholder={traduction['t0003']} onChange={() => { onInputChangeFunc({ wid: 'password_input' }) }} />
                <div id='al_message_container'></div>
                <LoadingWidget ref={authLoadingRef} $data={{ wid: 'authLoadingRef', refId: authLoadingRef, controllerRef: authLoginControllerRef }} />
                <button id='login_btn' className='al_btn btn_opacity' type='button' onClick={onLoginFunc}>{traduction['t0001']}</button>
            </div>
        </div>
        <AuthLoginControllerWidget ref={authLoginControllerRef} $data={{ wid: 'authLoginControllerRef', refId: authLoginControllerRef, rootControllers: rootControllers, parentRef: refId }} />
    </>;
    return (render.current ? component : <></>);
};

export default forwardRef(AuthLoginPage);
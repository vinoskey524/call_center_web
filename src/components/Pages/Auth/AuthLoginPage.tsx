// @refresh reset

/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle, memo } from 'react';
import $ from 'jquery';

/* Custom packages */
import './AuthLoginPage.css';
import { refIdType } from '../../Tools/type';
import { generateIdFunc } from '../../Tools/methodForest';
import { _defaultLanguage_, _success_, _error_, _requestFailed_, _appEmitterType_ } from '../../Tools/constants';
import { catchErrorFunc, replaceConsecutiveSpacesByOneFunc, replaceAllOccurenceFunc } from '../../Tools/methodForest';
import LoadingWidget from '../../Widgets/Others/LoadingWidget';
import call_center_logo from '../../Assets/png/logo_f.png';
import cell_icon from '../../Assets/png/cell_0.png';


/** Every change made to "wid" affect controller */
type propsType = { $data: { wid?: string, controllerRef?: refIdType, rootControllers: refIdType } };
const AuthLoginPage = forwardRef((props: propsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const refId = ref;

    const windowWidth = useRef(window.innerWidth);
    const windowHeight = useRef(window.innerHeight);

    const refresher = useRef(false);
    const [refresh, setRefresh] = useState(refresher.current);

    const isMounted = useRef(false);
    const mountCount = useRef(0);
    const render = useRef(true);

    const emptyRef = useRef<any>(undefined);
    const consumerRef = useRef<any>(undefined);
    const controllerRef = useRef<any>(undefined);

    const broadcastIndex = useRef(-1);

    /* $data */
    const $data = props.$data;
    const wid = useRef($data.wid || generateIdFunc()).current;
    const parentControllerRef = $data.controllerRef;
    const rootControllers = $data.rootControllers || { current: undefined };

    /* Root controllers */
    const mainRootControllerRef: refIdType = rootControllers?.current?.mainRootControllerRef;
    const requestRootControllerRef: refIdType = rootControllers?.current?.requestRootControllerRef;
    const dataStoreRootControllerRef: refIdType = rootControllers?.current?.dataStoreRootControllerRef;

    /* - */

    const traduction = useRef(dataStoreRootControllerRef.current.traduction.current);

    const authLoadingRef = useRef<any>(undefined);
    const authSetupRef = useRef<any>(undefined);

    const defaultMainAdminAccountExists = useRef(false);
    const showSplashScreen = useRef(true);


    /* ------------------------------------ Methods ------------------------------------- */

    /* Refresh component */
    const refreshFunc = () => { refresher.current = !refresher.current; setRefresh(refresher.current) };

    /* Render */
    const renderFunc = (x: { render: boolean }) => { render.current = x.render; refreshFunc() };

    /* Set language */
    const setTraductionFunc = (x: { traduction: any }) => { traduction.current = x.traduction; refreshFunc() };

    /* On window size change */
    const onWindowSizeChangeFunc = () => {
        windowWidth.current = window.innerWidth;
        windowHeight.current = window.innerHeight;
    };

    /* On input change */
    const onInputChangeFunc = (x: { wid: string }) => {
        const wid = x.wid;
        $('#al_message_container').text('');
        switch (wid) {
            case 'domain_input': { controllerRef.current.setTextValueFunc({ wid: wid, text: $('#al_domain_input').val() }) } break;
            case 'username_input': { controllerRef.current.setTextValueFunc({ wid: wid, text: $('#al_username_input').val() }) } break;
            case 'password_input': { controllerRef.current.setTextValueFunc({ wid: wid, text: $('#al_password_input').val() }) } break;
            default: { };
        };
    };

    /* On click */
    const onLoginFunc = async () => { controllerRef.current.loginFunc() };

    /* Set text */
    const setTextFunc = (x: { type: 'domain' | 'username' | 'password', text: string }) => {
        const obj = { domain: $('#al_domain_input'), username: $('#al_username_input'), password: $('#al_password_input') };
        const $target = obj[x.type];
        $target.val(x.text);
    };

    /* Unmount */
    const unmountFunc = () => {
        /* Prevent from first unmounting caused by "strictMode" */
        mountCount.current += 1; if (mountCount.current === 1) return;

        /* unmount logic */
        mainRootControllerRef?.current?.deleteFromBroadcastDomainFunc({ index: broadcastIndex.current });
        mainRootControllerRef?.current?.deleteRefIdFunc({ wid: wid, refId: refId });
        (parentControllerRef?.current !== undefined) && parentControllerRef.current.deleteRefIdFunc({ wid: wid, refId: refId });
    };

    /* Hide splash screen */
    const hideSplashScreenFunc = (x: { exists: boolean }) => {
        showSplashScreen.current = false;
        defaultMainAdminAccountExists.current = x.exists;
        refreshFunc();
    };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        defaultMainAdminAccountExists: defaultMainAdminAccountExists,

        refreshFunc() { refreshFunc() },
        renderFunc(x: any) { renderFunc(x) },
        setTraductionFunc(x: any) { setTraductionFunc(x) },
        setTextFunc(x: any) { setTextFunc(x) },
        hideSplashScreenFunc(x: any) { hideSplashScreenFunc(x) }
    }), []);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            broadcastIndex.current = mainRootControllerRef.current.addToBroadcastDomainFunc({ wid: wid, refId: refId });
            mainRootControllerRef.current.addRefIdFunc({ wid: wid, refId: refId });
            (parentControllerRef?.current !== undefined) && parentControllerRef.current.addRefIdFunc({ wid: wid, refId: refId });
        }
        return () => unmountFunc();
    }, []);

    /* On window size change */
    useEffect(() => {
        // window.addEventListener('resize', onWindowSizeChangeFunc);
        // return () => window.removeEventListener('resize', onWindowSizeChangeFunc);
    });


    /* Return */

    // const consumer = <ContextConsumer ref={consumerRef} $data={{ wid: 'consumerRef', controllerRef: controllerRef }} />
    const ctrl = <Controller ref={controllerRef} $data={{ wid: 'authLoginControllerRef', consumerRef: controllerRef, parentRef: refId, controllerRef: controllerRef, rootControllers: rootControllers }} />;
    const component = <>
        <div id='al_scaffold'>
            {showSplashScreen.current ? <SplashScreenWidget /> :
                <>
                    {defaultMainAdminAccountExists.current ? <div id='al_container'>
                        <img id='al_logo' className='floating' src={call_center_logo} />
                        <input id='al_domain_input' name='domain_input' className='al_input' type='text' placeholder={traduction.current['t0005']} onChange={() => { onInputChangeFunc({ wid: 'domain_input' }) }} />
                        <input id='al_username_input' name='username_input' className='al_input' type='text' placeholder={traduction.current['t0002']} onChange={() => { onInputChangeFunc({ wid: 'username_input' }) }} />
                        <input id='al_password_input' name='password_input' className='al_input' type='password' placeholder={traduction.current['t0003']} onChange={() => { onInputChangeFunc({ wid: 'password_input' }) }} />
                        <div id='al_message_container'></div>
                        <LoadingWidget ref={authLoadingRef} $data={{ wid: 'authLoadingRef', controllerRef: controllerRef }} />
                        <button id='login_btn' className='al_btn btn_opacity' type='button' onClick={onLoginFunc}>{traduction.current['t0001']}</button>
                    </div> : <AuthSetupWidget ref={authSetupRef} $data={{ wid: 'authSetupRef', controllerRef: controllerRef, rootControllers: rootControllers }} />}
                </>
            }
        </div>
    </>;
    return (<>{ctrl}{render.current && component}</>);

}); export default memo(AuthLoginPage);
































































/* ----------------------------------------------------- Consumer & Controller ----------------------------------------------------- */


/* Controller */
const __controller = forwardRef((props: any, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const refId: refIdType = ref;

    const windowWidth = useRef(window.innerWidth);
    const windowHeight = useRef(window.innerHeight);

    const isMounted = useRef(false);
    const mountCount = useRef(0);
    const emptyRef = useRef<any>(undefined);

    const broadcastIndex = useRef(-1);

    /* $data */
    const wid = useRef(props.$data.wid || generateIdFunc()).current;
    const consumerRef: refIdType = props.$data.consumerRef;
    const parentRef: refIdType = props.$data.parentRef;
    const controllerRef: refIdType = props.$data.controllerRef;
    const rootControllers = props.$data.rootControllers;

    /* Root controllers */
    const mainRootControllerRef: refIdType = rootControllers?.current?.mainRootControllerRef;
    const requestRootControllerRef: refIdType = rootControllers?.current?.requestRootControllerRef;
    const dataStoreRootControllerRef: refIdType = rootControllers?.current?.dataStoreRootControllerRef;

    /* Refs */
    const refIdStore = useRef<any>({});

    const authSetupRef = useRef<any>(undefined);
    const authSetupLoadingRef = useRef<any>(undefined);

    /* - */

    const traduction = useRef(dataStoreRootControllerRef.current.traduction.current);

    const authLoadingRef: refIdType = refIdStore.current.authLoadingRef;

    const loginData = useRef({ domain: '', username: '', ssm: '' });

    const passwordConfirm = useRef('');

    const canLogin = useRef(true);

    const notFoundAccountHistory = useRef([]);

    const istate = { correct: 'correct', empty: 'empty', error: 'error' };

    /* - */
    const isDomainCorrect = useRef(false);
    const isPasswordCorrect = useRef(false);
    const isConfirmCorrect = useRef(false);
    const canCreateDefaultMAA = useRef(false);


    /* ------------------------------------ Methods ------------------------------------- */

    /* Add refId */
    const addRefIdFunc = (x: { wid: string, refId: any }) => {
        const wid = x.wid, refId = x.refId;
        refIdStore.current[wid] = refId;
        switch (wid) {
            case 'authSetupRef': { authSetupRef.current = refId.current } break;
            case 'authSetupLoadingRef': { authSetupLoadingRef.current = refId.current } break;
            default: { };
        };
    };

    /* Delete refId */
    const deleteRefIdFunc = (x: { wid: string | string[] }) => {
        const wid = (typeof x.wid === 'string') ? [x.wid] : x.wid;
        for (let i = 0; i < wid.length; i++) { delete refIdStore.current[wid[i]] }
    };

    /* Check correctness */
    const checkCorrectnessFunc = () => {
        const correctTab = [isDomainCorrect.current, isPasswordCorrect.current, isConfirmCorrect.current];
        const uncorrect = correctTab.includes(false);

        canCreateDefaultMAA.current = uncorrect ? false : true;

        $('#asw_submit_btn').css({ opacity: uncorrect ? 0.5 : 1 });
        $('#asw_submit_btn').addClass('btn_opacity');
        !uncorrect && $('#asw_submit_btn').removeAttr('style');
    };

    /* Set text value from inputs */
    const setTextValueFunc = (x: { wid: string, text: string, id?: string }) => {
        const wid = x.wid, t = (x.text).replaceAll("'", '’').trimStart(), text = replaceConsecutiveSpacesByOneFunc(t), len = text.length;
        const lowerText = text.toLowerCase(), upperText = text.toUpperCase();
        const id = x.id; /* element id */
        switch (wid) {
            case 'domain_input': {
                const txt = replaceAllOccurenceFunc({ text: lowerText, replace: ' ', with: '' });
                loginData.current.domain = txt.trimEnd();
                parentRef.current.setTextFunc({ type: 'domain', text: txt });
            } break;

            case 'username_input': {
                const txt = text.toLowerCase();
                loginData.current.username = txt.trimEnd();
                parentRef.current.setTextFunc({ type: 'username', text: txt });
            } break;

            case 'password_input': {
                loginData.current.ssm = text.trimEnd();
                parentRef.current.setTextFunc({ type: 'password', text: text });
            } break;

            /* Auth setup */

            case 'table_domain': {
                const txt = replaceAllOccurenceFunc({ text: lowerText, replace: ' ', with: '' });
                loginData.current.domain = txt.trimEnd();
                authSetupRef.current.setTextFunc({ type: 'domain', text: txt });

                /* ui update */
                const stateColor = (txt.length >= 2) ? '#007aff' : (txt.length) === 0 ? 'transparent' : '#fa314a';
                $(`#${id}`).css({ 'border-bottom': `1px solid ${stateColor}` });
                isDomainCorrect.current = (stateColor === '#007aff') ? true : false;
            } break;

            case 'table_password': {
                loginData.current.ssm = text.trimEnd();
                authSetupRef.current.setTextFunc({ type: 'password', text: text });

                /* ui update */
                const passVal = loginData.current.ssm;
                const confVal: string = String($('#asw_table_confirm_input').val()) || '';
                const stateColor = (len >= 8) ? '#007aff' : (len === 0) ? 'transparent' : '#fa314a';
                $(`#${id}`).css({ 'border-bottom': `1px solid ${stateColor}` });
                isPasswordCorrect.current = (stateColor === '#007aff') ? true : false;

                /* ui update for confirm */
                if (passwordConfirm.current.length === 0) { checkCorrectnessFunc(); return };
                const stateColor1 = (len >= 8 && passwordConfirm.current === passVal) ? '#007aff' : (len === 0) ? 'transparent' : '#fa314a';
                $('#asw_table_confirm_input').css({ 'border-bottom': `1px solid ${stateColor1}` });
                isConfirmCorrect.current = (stateColor1 === '#007aff') ? true : false;
            } break;

            case 'table_confirm': {
                passwordConfirm.current = text.trimEnd();
                authSetupRef.current.setTextFunc({ type: 'confirm', text: text });

                /* ui update */
                const passVal = $('#asw_table_password_input').val();
                const stateColor = (len >= 8 && passwordConfirm.current === passVal) ? '#007aff' : (len === 0) ? 'transparent' : '#fa314a';
                $(`#${id}`).css({ 'border-bottom': `1px solid ${stateColor}` });
                isConfirmCorrect.current = (stateColor === '#007aff') ? true : false;
            } break;

            default: { };
        };

        /* - */
        id && checkCorrectnessFunc();
    };

    /* On window size change */
    const onWindowSizeChangeFunc = () => {
        windowWidth.current = window.innerWidth;
        windowHeight.current = window.innerHeight;
    };

    /* Login */
    const loginFunc = async () => {
        try {
            if (canLogin.current) {
                canLogin.current = false;

                $('#al_message_container').text('');
                $('.al_input').attr({ 'readonly': true });

                const val = Object.values(loginData.current);
                const searchEmptyVal = val.indexOf('');

                if (searchEmptyVal === -1) {
                    /* Show loading */
                    (refIdStore.current).authLoadingRef.current.showLoadingFunc({ show: true });

                    /* Req to pg */
                    const req = await requestRootControllerRef.current.loginFunc({ data: loginData.current });
                    refId.current.getLoginReqFeedbackFunc({ status: req.status, data: req.data });

                } else {
                    $('#al_message_container').css({ 'color': '#FCF2A9' });
                    $('#al_message_container').text(`${traduction.current['t0017']}`);
                    $('.al_input').removeAttr('readonly');
                    canLogin.current = true;
                }
            }

        } catch (e: any) {
            const err = catchErrorFunc({ err: e.message });
            console.log(err);

            $('.al_input').removeAttr('readonly');
            canLogin.current = true;
            setTimeout(() => { alert(traduction.current['t0016']) }, 500);
        };
    };

    /* Get login request feedback */
    const getLoginReqFeedbackFunc = (x: { status: string, data: any }) => {
        try {
            const status = x.status, data = x.data;
            (refIdStore.current).authLoadingRef.current.showLoadingFunc({ show: false });

            /* - */
            if (status === _success_) {
                const hasFoundUser = Object.keys(data).length > 0 ? true : false;

                if (hasFoundUser) {
                    $('#al_logo').removeClass('floating');

                    const isCustomerAdmin = Object.hasOwn(data, 'customerData');

                    /* Store currentUserData */
                    dataStoreRootControllerRef.current.setDataFunc({ type: 'currentUserData', data: isCustomerAdmin ? data.adminData : data });

                    /* Store currentCustomerData */
                    isCustomerAdmin && dataStoreRootControllerRef.current.setDataFunc({ type: 'currentCustomerData', data: data.customerData });

                    /* Login user */
                    setTimeout(() => { mainRootControllerRef.current.loginUserFunc() }, 300); /* Login user */

                } else {
                    setTimeout(() => {
                        $('#al_message_container').css({ 'color': '#FCF2A9' });
                        $('#al_message_container').text(`${traduction.current['t0015']}`);

                        /* - */
                        $('.al_input').removeAttr('readonly');
                        canLogin.current = true;
                    }, 320);
                }

            } else {
                setTimeout(() => {
                    $('#al_message_container').css({ 'color': 'red' });
                    $('#al_message_container').text(`${traduction.current['t0016']}`); /* Retry error message */

                    /* - */
                    $('.al_input').removeAttr('readonly');
                    canLogin.current = true;
                }, 320);
            }

        } catch (e: any) {
            catchErrorFunc({ err: e.message });
            (refIdStore.current).authLoadingRef.current.showLoadingFunc({ show: false });
            setTimeout(() => { alert(traduction.current['t0016']) }, 500);
        };
    };

    /* create default main admin account */
    const createDefaultMainAdminAccountFunc = async () => {
        try {
            if (canLogin.current && canCreateDefaultMAA.current) {
                canLogin.current = false;

                authSetupLoadingRef.current.showLoadingFunc({ show: true });

                $('#al_message_container').text('');
                $('.asw_table_real_input').css({ opacity: 0.5 });
                $('.asw_table_real_input').attr({ 'readonly': true });

                /* req */
                const rdata = Object.assign(loginData.current, { id: generateIdFunc() });
                const req = await requestRootControllerRef.current.createDefaultMainAdminAccountFunc({ data: rdata });
                if (req.status !== _success_) {
                    console.log('kk ::', req);
                    /* If default MAA exists */
                    if (req.data === '-1') {
                        parentRef.current.hideSplashScreenFunc({ exists: true });
                        console.log('Default MAA already exists !');
                        return;
                    }
                    throw new Error(JSON.stringify(req));
                }

                /* Store currentUserData */
                dataStoreRootControllerRef.current.setDataFunc({ type: 'currentUserData', data: req.data });

                /* Login user */
                setTimeout(() => { mainRootControllerRef.current.loginUserFunc() }, 300); /* Login user */

                console.log('kl ::', req);
            }

        } catch (e: any) {
            const err = catchErrorFunc({ err: e.message });
            console.log(err);

            authSetupLoadingRef.current.showLoadingFunc({ show: false });
            $('.asw_table_real_input').removeAttr('style');
            $('.asw_table_real_input').removeAttr('readonly');
            canLogin.current = true;
            setTimeout(() => { alert(traduction.current['t0016']) }, 500);
        };
    };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        refIdStore: refIdStore,
        addRefIdFunc(x: any) { addRefIdFunc(x) },
        deleteRefIdFunc(x: any) { deleteRefIdFunc(x) },
        setTextValueFunc(x: any) { setTextValueFunc(x) },
        loginFunc() { loginFunc() },
        getLoginReqFeedbackFunc(x: any) { getLoginReqFeedbackFunc(x) },
        createDefaultMainAdminAccountFunc() { createDefaultMainAdminAccountFunc() }
    }), []);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            broadcastIndex.current = mainRootControllerRef.current.addToBroadcastDomainFunc({ wid: wid, refId: refId });
            mainRootControllerRef.current.addRefIdFunc({ wid: wid, refId: refId });
            controllerRef?.current?.addRefIdFunc({ wid: wid, refId: refId });
        }
    }, []);

    /* On window size change */
    useEffect(() => {
        // window.addEventListener('resize', onWindowSizeChangeFunc);
        // return () => window.removeEventListener('resize', onWindowSizeChangeFunc);
    });


    /* - */
    return <></>;
});
const Controller = memo(__controller);
























































/* ----------------------------------------------------- Direct Children Components ----------------------------------------------------- */

/* Child */
type authSetupPropsType = { $data: { wid?: string, controllerRef: refIdType, rootControllers: any } };
const _authSetup = forwardRef((props: authSetupPropsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const refId: refIdType = ref;

    const windowWidth = useRef(window.innerWidth);
    const windowHeight = useRef(window.innerHeight);

    const refresher = useRef(false);
    const [refresh, setRefresh] = useState(refresher.current);

    const isMounted = useRef(false);
    const mountCount = useRef(0);
    const render = useRef(true);

    const emptyRef = useRef<any>(undefined);

    const broadcastIndex = useRef(-1);

    /* $data */
    const $data = props.$data;
    const wid = useRef($data.wid || generateIdFunc()).current;
    const controllerRef = $data.controllerRef;
    const rootControllers = $data.rootControllers;

    /* Root controllers */
    const mainRootControllerRef: refIdType = rootControllers?.current?.mainRootControllerRef;
    const requestRootControllerRef: refIdType = rootControllers?.current?.requestRootControllerRef;
    const dataStoreRootControllerRef: refIdType = rootControllers?.current?.dataStoreRootControllerRef;

    /* - */

    const traduction = useRef(dataStoreRootControllerRef.current.traduction.current);

    const authSetupLoadingRef = useRef(undefined);


    /* ------------------------------------ Methods ------------------------------------- */

    /* Refresh component */
    const refreshFunc = () => { refresher.current = !refresher.current; setRefresh(refresher.current) };

    /* Render */
    const renderFunc = (x: { render: boolean }) => { render.current = x.render; /* refreshFunc() */ };

    /* Set traduction */
    const setTraductionFunc = (x: { traduction: any }) => { traduction.current = x.traduction; /* refreshFunc() */ };

    /* On window size change */
    const onWindowSizeChangeFunc = () => {
        windowWidth.current = window.innerWidth;
        windowHeight.current = window.innerHeight;
    };

    /* Unmount */
    const unmountFunc = () => {
        /* Prevent from first unmounting caused by "strictMode" */
        mountCount.current += 1; if (mountCount.current === 1) return;

        /* unmount logic */
        mainRootControllerRef?.current?.deleteFromBroadcastDomainFunc({ index: broadcastIndex.current });
        mainRootControllerRef?.current?.deleteRefIdFunc({ wid: wid });
        controllerRef?.current?.deleteRefIdFunc({ wid: wid });
    };

    /* On input change */
    const onInputChangeFunc = (x: { wid: string }) => {
        const wid = x.wid;
        $('#al_message_container').text('');
        switch (wid) {
            case 'table_domain': { controllerRef.current.setTextValueFunc({ wid: wid, text: $('#asw_table_domain_input').val(), id: 'asw_table_domain_input' }) } break;
            case 'table_password': { controllerRef.current.setTextValueFunc({ wid: wid, text: $('#asw_table_password_input').val(), id: 'asw_table_password_input' }) } break;
            case 'table_confirm': { controllerRef.current.setTextValueFunc({ wid: wid, text: $('#asw_table_confirm_input').val(), id: 'asw_table_confirm_input' }) } break;
            default: { };
        };
    };

    /* Set text */
    const setTextFunc = (x: { type: 'domain' | 'password' | 'confirm', text: string }) => {
        const obj = { domain: $('#asw_table_domain_input'), password: $('#asw_table_password_input'), confirm: $('#asw_table_confirm_input') };
        const $target = obj[x.type];
        $target.val(x.text);
    };

    /* Create default admin account */
    const createDefaultMainAdminAccountFunc = () => { controllerRef.current.createDefaultMainAdminAccountFunc() };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Imperative handler */
    useImperativeHandle(ref, () => ({
        refreshFunc() { refreshFunc() },
        renderFunc(x: any) { renderFunc(x) },
        setTraductionFunc(x: any) { setTraductionFunc(x) },
        setTextFunc(x: any) { setTextFunc(x) }
    }), []);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            broadcastIndex.current = mainRootControllerRef.current.addToBroadcastDomainFunc({ wid: wid, refId: refId });
            mainRootControllerRef.current.addRefIdFunc({ wid: wid, refId: refId });
            controllerRef?.current?.addRefIdFunc({ wid: wid, refId: refId });
        }
        return () => unmountFunc();
    }, []);

    /* On window size change */
    useEffect(() => {
        // window.addEventListener('resize', onWindowSizeChangeFunc);
        // return () => window.removeEventListener('resize', onWindowSizeChangeFunc);
    }, []);


    /* return */

    const component = <>
        <div id='asw_scaffold'>
            <div id='asw_title'>Bienvenue sur <b>SGC</b> (Service de Gestion de la Clientèle)</div>
            <div id='asw_sub_title'>Pour commencer, nous allons configurer votre domaine et compte administrateur par défaut.</div>

            <table id='asw_table'>
                <tr>
                    <th style={{ display: 'flex', flexDirection: 'row', alignItems: 'start' }}>Domaine</th>
                    <td>
                        <input id='asw_table_domain_input' className='asw_table_input asw_table_real_input' name='table_domain' type='text' onChange={() => { onInputChangeFunc({ wid: 'table_domain' }) }} />
                        <div className='asw_desc'>Le domaine peut être le nom de votre société ou tout autre nom. Il servira d'identifiant unique dans le système et <b>ne peut être modifié après.</b></div>
                    </td>
                </tr>

                <tr>
                    <th>Nom d'utilisateur</th>
                    <td>
                        <div className='asw_table_input' style={{ opacity: 0.4 }}>admin</div>
                    </td>
                </tr>

                <tr>
                    <th>Mot de passe</th>
                    <td>
                        <input id='asw_table_password_input' className='asw_table_input asw_table_real_input' name='table_password' type='password' onChange={() => { onInputChangeFunc({ wid: 'table_password' }) }} />
                    </td>
                </tr>

                <tr>
                    <th>Confirmation</th>
                    <td>
                        <input id='asw_table_confirm_input' className='asw_table_input asw_table_real_input' name='table_confirm' type='password' onChange={() => { onInputChangeFunc({ wid: 'table_confirm' }) }} />
                    </td>
                </tr>
            </table>

            <div id='asw_privacy'>En continuant, vous acceptez notre politique de confidentialitée et nos conditions d'utilisation.</div>

            <div className='just_row' style={{ height: 'auto', alignItems: 'center', marginTop: 20 }}>
                <div id='asw_submit_btn' className='btn_opacity' style={{ opacity: 0.5 }} onClick={createDefaultMainAdminAccountFunc}>Continuer</div>
                <LoadingWidget ref={authSetupLoadingRef} $data={{ wid: 'authSetupLoadingRef', controllerRef: controllerRef, visible: !true }} />
            </div>

            <div id='asw_img'>
                <img width={300} height={270} src={cell_icon} />
            </div>
        </div>
    </>;
    return (<>{render.current && component}</>);
});
const AuthSetupWidget = (_authSetup);




































/* Splash screen */
const _splashScreen = () => {
    const emptyRef = useRef(undefined);
    const component = <>
        <div id='ssw_scaffold'>
            <div id='ssw_container'>
                <img width={80} height={80} style={{ marginBottom: 20 }} src={call_center_logo} />
                <LoadingWidget ref={emptyRef} $data={{ wid: 'emptyRef', visible: true }} />
                <div id='ssw_text'>Chargement...</div>
            </div>
        </div>
    </>;
    return (component);
};
const SplashScreenWidget = (_splashScreen);
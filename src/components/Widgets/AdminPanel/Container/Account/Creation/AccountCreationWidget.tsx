// @refresh reset

/* Standard packages */
import React, { useState, memo, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import './AccountCreationWidget.css';
import { generateIdFunc, animateModalFunc, catchErrorFunc, checkEmailFunc, isJsonFunc, replaceAllOccurenceFunc, replaceConsecutiveSpacesByOneFunc } from '../../../../../Tools/methodForest';
import { refIdType } from '../../../../../Tools/type';
import {
    _appEmitterType_, _defaultLanguage_, _cipherFailed_, _decipherFailed_, _emailExists_, _incompleteForm_, _requestFailed_, _usernameExists_, _fullnameExists_, _success_,
    _domainExists_, _companyNameExists_, _phoneExists_
} from '../../../../../Tools/constants';
import AdminRightsCheckboxWidget from './AdminRightsCheckboxWidget';
import FormInputWidget from '../../../../Others/FormInputWidget';
import LoadingWidget from '../../../../Others/LoadingWidget';
import UIBlockerWidget from '../../../../Others/UIBlockerWidget';

/** Every change made to "wid" affect controller */
type propsType = { $data: { wid: string, controllerRef?: refIdType, rootControllers: any } };
const AccountCreationWidget = forwardRef((props: propsType, ref: any) => {
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

    const adminRightsCheckboxRef = useRef<any>(undefined);

    const adminFullRightsCheckboxRef = useRef<any>(undefined);
    const adminCreateRightsCheckboxRef = useRef<any>(undefined);
    const adminEnableDisableRightsCheckboxRef = useRef<any>(undefined);
    const adminEditRightsCheckboxRef = useRef<any>(undefined);
    const adminDeleteRightsCheckboxRef = useRef<any>(undefined);
    const adminReadOnlyRightsCheckboxRef = useRef<any>(undefined);

    const sourcePageType = useRef<'admin' | 'callCenter' | 'customer'>('admin');

    const pageTitle = { admin: 'Admin', callCenter: 'Call Center', customer: 'Customer' };

    const domainInputRef = useRef<any>(undefined);
    const companyNameInputRef = useRef<any>(undefined);
    const fullnameInputRef = useRef<any>(undefined);
    const usernameInputRef = useRef<any>(undefined);
    const emailInputRef = useRef<any>(undefined);
    const phoneInputRef = useRef<any>(undefined);
    const passwordInputRef = useRef<any>(undefined);
    const confirmInputRef = useRef<any>(undefined);
    const expirationInputRef = useRef<any>(undefined);
    const accountLoadingRef = useRef<any>(undefined);

    const uiBlockerRef = useRef<any>(undefined);

    /* - */

    const acrw_input_classname = useRef<string>('acrw_input_classname');


    /* ------------------------------------ Methods ------------------------------------- */

    /* Refresh component */
    const refreshFunc = () => {
        refresher.current = !refresher.current;
        setRefresh(refresher.current);
    };

    /* Render */
    const renderFunc = (x: { render: boolean }) => {
        render.current = x.render;
        refreshFunc();
    };

    /* Set language */
    const setTraductionFunc = (x: { traduction: any }) => { traduction.current = x.traduction; refreshFunc() };

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
        mainRootControllerRef?.current?.deleteRefIdFunc({ wid: wid, refId: refId });
        (parentControllerRef?.current !== undefined) && parentControllerRef.current.deleteRefIdFunc({ wid: wid, refId: refId });
    };

    /* Show */
    const showFunc = (x: { show: boolean, sourcePage?: 'admin' | 'callCenter' | 'customer' }) => {
        const show = x.show, sourcePage = x.sourcePage;
        const domain = dataStoreRootControllerRef.current.currentUserData.current.domain;

        /* - */
        (sourcePage !== undefined) && (sourcePageType.current = sourcePage);
        domainInputRef.current.updateReadonlyStateFunc({ readonly: (sourcePage === 'customer') ? false : true, text: (sourcePage === 'customer') ? '' : domain });

        /* - */
        setRefresh(!refresh);
        animateModalFunc({ scaffold: '#acrw_scaffold', container: '#acrw_container', show: show });
    }

    /* On create */
    const onCreateFunc = () => { controllerRef.current.createAccountFunc({ type: sourcePageType.current }) };

    /* On Edit */
    const onEditFunc = () => { };

    /* On cancel */
    const onCancelFunc = () => {
        $('#acrw_container').removeClass('shakeX');
        setTimeout(() => { showFunc({ show: false }) }, 0);
        controllerRef.current.cancelFunc();
    };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        refreshFunc() { refreshFunc() },
        setTraductionFunc(x: any) { setTraductionFunc(x) },
        showFunc(x: any) { showFunc(x) }
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
    }, []);


    /* Return */

    const crtl = <Controller ref={controllerRef} $data={{ wid: 'accountCreationControllerRef', rootControllers: rootControllers }} />;
    const component = <>
        <div id='acrw_scaffold' className='prevent_select'>
            <div id='acrw_background' />
            <div id='acrw_container'>
                <div id='acrw_container_content'>
                    <p id='acrw_title'>New account ({pageTitle[sourcePageType.current]})</p>

                    <LoadingWidget ref={accountLoadingRef} $data={{ wid: 'accountLoadingRef', controllerRef: controllerRef }} />

                    <div className='acrw_input_container'>
                        {sourcePageType.current === 'customer' && <div className='acrw_area_title'>Infos de l'entreprise</div>}

                        <FormInputWidget /* Domain */ ref={domainInputRef} $data={{ wid: 'domainInputRef', refId: domainInputRef, controllerRef: controllerRef, rootControllers: rootControllers, className: acrw_input_classname.current, title: traduction.current['t0030'], type: 'text', readonly: (sourcePageType.current === 'customer') ? false : true }} />

                        {sourcePageType.current === 'customer' && <FormInputWidget /* Company name */ ref={companyNameInputRef} $data={{ wid: 'companyNameInputRef', refId: companyNameInputRef, controllerRef: controllerRef, rootControllers: rootControllers, className: acrw_input_classname.current, title: traduction.current['t0034'], type: 'text' }} />}

                        {sourcePageType.current !== 'customer' && <FormInputWidget /* Full name */ ref={fullnameInputRef} $data={{ wid: 'fullnameInputRef', refId: fullnameInputRef, controllerRef: controllerRef, rootControllers: rootControllers, className: acrw_input_classname.current, title: traduction.current['t0018'], type: 'text' }} />}

                        {sourcePageType.current !== 'customer' && <FormInputWidget /* Username */ ref={usernameInputRef} $data={{ wid: 'usernameInputRef', refId: usernameInputRef, controllerRef: controllerRef, rootControllers: rootControllers, className: acrw_input_classname.current, title: traduction.current['t0019'], type: 'text' }} />}
                        {sourcePageType.current === 'customer' && <>
                            <FormInputWidget /* Email */ ref={emailInputRef} $data={{ wid: 'emailInputRef', refId: emailInputRef, controllerRef: controllerRef, rootControllers: rootControllers, className: acrw_input_classname.current, title: traduction.current['t0020'], type: 'email' }} />
                            <FormInputWidget /* Phone */ ref={phoneInputRef} $data={{ wid: 'phoneInputRef', refId: phoneInputRef, controllerRef: controllerRef, rootControllers: rootControllers, className: acrw_input_classname.current, title: traduction.current['t0021'], type: 'number' }} />
                        </>}

                        {sourcePageType.current === 'customer' && <FormInputWidget /* Expiration date */ ref={expirationInputRef} $data={{ wid: 'expirationInputRef', refId: expirationInputRef, controllerRef: controllerRef, rootControllers: rootControllers, className: acrw_input_classname.current, title: traduction.current['t0024'], type: 'date' }} />}

                        {sourcePageType.current === 'customer' && <div className='acrw_area_title'>Compte admin (Défaut)</div>}
                        {sourcePageType.current === 'customer' && <FormInputWidget /* Full name */ ref={fullnameInputRef} $data={{ wid: 'fullnameInputRef', refId: fullnameInputRef, controllerRef: controllerRef, rootControllers: rootControllers, className: acrw_input_classname.current, title: traduction.current['t0018'], type: 'text' }} />}
                        {sourcePageType.current === 'customer' && <FormInputWidget /* Username */ ref={usernameInputRef} $data={{ wid: 'usernameInputRef', refId: usernameInputRef, controllerRef: controllerRef, rootControllers: rootControllers, className: acrw_input_classname.current, title: traduction.current['t0019'], type: 'text' }} />}

                        <FormInputWidget /* Password */ ref={passwordInputRef} $data={{ wid: 'passwordInputRef', refId: passwordInputRef, controllerRef: controllerRef, rootControllers: rootControllers, className: acrw_input_classname.current, title: traduction.current['t0022'], type: 'password' }} />
                        <FormInputWidget /* confirmation */ ref={confirmInputRef} $data={{ wid: 'confirmInputRef', refId: confirmInputRef, controllerRef: controllerRef, rootControllers: rootControllers, className: acrw_input_classname.current, title: traduction.current['t0023'], type: 'password' }} />
                    </div>

                    {sourcePageType.current === 'admin' &&
                        <div /* Rights */ className='acrw_input_checkbox_container'>
                            <div id='acrw_input_title'>Rights :</div>
                            <div className='acrw_input_checkbox_content'>
                                <AdminRightsCheckboxWidget /* Full */ ref={adminFullRightsCheckboxRef} $data={{
                                    wid: 'adminFullRightsCheckboxRef',
                                    refId: adminFullRightsCheckboxRef,
                                    controllerRef: controllerRef,
                                    rootControllers: rootControllers,
                                    scaffoldWidth: '92%',
                                    optionHeight: 20,
                                    mainOption: { id: 'fullMainOption', title: 'Full', fontSize: 13.5, isChecked: false },
                                }} />

                                <AdminRightsCheckboxWidget /* Create */ ref={adminCreateRightsCheckboxRef} $data={{
                                    wid: 'adminCreateRightsCheckboxRef',
                                    refId: adminCreateRightsCheckboxRef,
                                    controllerRef: controllerRef,
                                    rootControllers: rootControllers,
                                    scaffoldWidth: '92%',
                                    optionHeight: 20,
                                    mainOption: { id: 'createMainOption', title: 'Create', fontSize: 13.5, isChecked: false },
                                    subOptions: [
                                        { id: 'createAdminSubOption', subId: 'admin', title: 'Administrators', color: '#9e9e9e', isChecked: false },
                                        { id: 'createCallCenterSubOption', subId: 'callCenter', title: 'Call center', color: '#9e9e9e', isChecked: false },
                                        { id: 'createCustomerSubOption', subId: 'customer', title: 'Customers', color: '#9e9e9e', isChecked: false }
                                    ]
                                }} />

                                <AdminRightsCheckboxWidget /* Enable/Disable */ ref={adminEnableDisableRightsCheckboxRef} $data={{
                                    wid: 'adminEnableDisableRightsCheckboxRef',
                                    refId: adminEnableDisableRightsCheckboxRef,
                                    controllerRef: controllerRef,
                                    rootControllers: rootControllers,
                                    scaffoldWidth: '92%',
                                    optionHeight: 20,
                                    mainOption: { id: 'enDisMainOption', title: 'Enable/Disable', fontSize: 13.5, isChecked: false },
                                    subOptions: [
                                        { id: 'enDisAdminSubOption', subId: 'admin', title: 'Administrators', color: '#9e9e9e', isChecked: false },
                                        { id: 'enDisCallCenterSubOption', subId: 'callCenter', title: 'Call center', color: '#9e9e9e', isChecked: false },
                                        { id: 'enDisCustomerSubOption', subId: 'customer', title: 'Customers', color: '#9e9e9e', isChecked: false }
                                    ]
                                }} />

                                <AdminRightsCheckboxWidget /* Edit */ ref={adminEditRightsCheckboxRef} $data={{
                                    wid: 'adminEditRightsCheckboxRef',
                                    refId: adminEditRightsCheckboxRef,
                                    controllerRef: controllerRef,
                                    rootControllers: rootControllers,
                                    scaffoldWidth: '92%',
                                    optionHeight: 20,
                                    mainOption: { id: 'editMainOption', title: 'Edit', fontSize: 13.5, isChecked: false },
                                    subOptions: [
                                        { id: 'editAdminSubOption', subId: 'admin', title: 'Administrators', color: '#9e9e9e', isChecked: false },
                                        { id: 'editCallCenterSubOption', subId: 'callCenter', title: 'Call center', color: '#9e9e9e', isChecked: false },
                                        { id: 'editCustomerSubOption', subId: 'customer', title: 'Customers', color: '#9e9e9e', isChecked: false }
                                    ]
                                }} />

                                <AdminRightsCheckboxWidget /* Delete */ ref={adminDeleteRightsCheckboxRef} $data={{
                                    wid: 'adminDeleteRightsCheckboxRef',
                                    refId: adminDeleteRightsCheckboxRef,
                                    controllerRef: controllerRef,
                                    rootControllers: rootControllers,
                                    scaffoldWidth: '92%',
                                    optionHeight: 20,
                                    mainOption: { id: 'deleteMainOption', title: 'Delete', fontSize: 13.5, isChecked: false },
                                    subOptions: [
                                        { id: 'deleteAdminSubOption', subId: 'admin', title: 'Administrators', color: '#9e9e9e', isChecked: false },
                                        { id: 'deleteCallCenterSubOption', subId: 'callCenter', title: 'Call center', color: '#9e9e9e', isChecked: false },
                                        { id: 'deleteCustomerSubOption', subId: 'customer', title: 'Customers', color: '#9e9e9e', isChecked: false }
                                    ]
                                }} />

                                <div style={{ width: 30, height: 1, backgroundColor: 'rgba(95, 95, 95, 0.5)', marginLeft: 18, marginBlock: 5 }} />

                                <AdminRightsCheckboxWidget /* Read only */ ref={adminReadOnlyRightsCheckboxRef} $data={{
                                    wid: 'adminReadOnlyRightsCheckboxRef',
                                    refId: adminReadOnlyRightsCheckboxRef,
                                    controllerRef: controllerRef,
                                    rootControllers: rootControllers,
                                    scaffoldWidth: '92%',
                                    optionHeight: 20,
                                    mainOption: { id: 'readOnlyMainOption', title: 'Read only', fontSize: 13.5, isChecked: true }
                                }} />

                            </div>
                        </div>
                    }

                    <div id='acrw_btn_area' className='just_row'>
                        <div id='acrw_btn_wrapper' className='just_row'>
                            <button className='acrw_btn_container btn_opacity' onClick={onCreateFunc}>
                                <p className='acrw_btn_title'>{traduction.current['t0025']}</p>
                            </button>

                            <button className='acrw_btn_container btn_opacity' style={{ backgroundColor: 'transparent', marginLeft: 5 }} onClick={onCancelFunc}>
                                <p className='acrw_btn_title' style={{ color: '#fa315a' }}>{traduction.current['t0026']}</p>
                            </button>
                        </div>
                    </div>

                </div>

                <UIBlockerWidget ref={uiBlockerRef} $data={{ wid: 'uiBlockerRef', controllerRef: controllerRef }} />
            </div>
        </div>
    </>;
    return (<>{crtl}{render.current && component}</>);

}); export default (AccountCreationWidget);


















































/* ----------------------------------------------------- Controller ----------------------------------------------------- */

/* Controller */
type ctrlType = { $data: { wid?: string, consumerRef?: refIdType, parentRef?: refIdType, controllerRef?: refIdType, rootControllers: any } };
const __Controller = forwardRef((props: ctrlType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const refId = ref;

    const windowWidth = useRef(window.innerWidth);
    const windowHeight = useRef(window.innerHeight);

    const isMounted = useRef(false);
    const mountCount = useRef(0);
    const emptyRef = useRef<any>(undefined);

    const broadcastIndex = useRef(-1);

    /* $data */
    const $data = props.$data;
    const wid = useRef($data.wid || generateIdFunc()).current;
    const consumerRef = $data.consumerRef;
    const parentRef = $data.parentRef;
    const controllerRef = $data.controllerRef;
    const rootControllers = $data.rootControllers;

    /* Root controllers */
    const mainRootControllerRef: refIdType = rootControllers?.current?.mainRootControllerRef;
    const requestRootControllerRef: refIdType = rootControllers?.current?.requestRootControllerRef;
    const dataStoreRootControllerRef: refIdType = rootControllers?.current?.dataStoreRootControllerRef;

    /* refId store */
    const refIdStore = useRef<any>({});

    /* Refs */

    const domainInputRef = useRef<any>(undefined);
    const isDomainInputCorrect = useRef(false);

    const companyNameInputRef = useRef<any>(undefined);
    const isCompanyNameInputCorrect = useRef(false);

    const fullnameInputRef = useRef<any>(undefined);
    const isFullNameInputCorrect = useRef(false);

    const usernameInputRef = useRef<any>(undefined);
    const isUsernameInputCorrect = useRef(false);

    const emailInputRef = useRef<any>(undefined);
    const isEmailInputCorrect = useRef(false);

    const phoneInputRef = useRef<any>(undefined);
    const isPhoneInputCorrect = useRef(false);

    const passwordInputRef = useRef<any>(undefined);
    const isPasswordInputCorrect = useRef(false);

    const confirmInputRef = useRef<any>(undefined);
    const isConfirmInputCorrect = useRef(false);

    const expirationInputRef = useRef<any>(undefined);
    const isExpirationInputCorrect = useRef(false);

    const inputRefTab = [domainInputRef, companyNameInputRef, fullnameInputRef, usernameInputRef, emailInputRef, phoneInputRef, passwordInputRef, confirmInputRef, expirationInputRef];
    const correctTab = [isDomainInputCorrect, isCompanyNameInputCorrect, isFullNameInputCorrect, isUsernameInputCorrect, isEmailInputCorrect, isPhoneInputCorrect, isPasswordInputCorrect, isConfirmInputCorrect, isExpirationInputCorrect];

    const adminFullRightsCheckboxRef = useRef<any>(undefined);
    const adminCreateRightsCheckboxRef = useRef<any>(undefined);
    const adminEnableDisableRightsCheckboxRef = useRef<any>(undefined);
    const adminEditRightsCheckboxRef = useRef<any>(undefined);
    const adminDeleteRightsCheckboxRef = useRef<any>(undefined);
    const adminReadOnlyRightsCheckboxRef = useRef<any>(undefined);

    /* - */

    const traduction = useRef(dataStoreRootControllerRef.current.traduction.current);

    const domainValueRef = useRef('');
    const companyNameValueRef = useRef('');
    const fullnameValueRef = useRef('');
    const usernameValueRef = useRef('');
    const emailValueRef = useRef('');
    const phoneValueRef = useRef('');
    const passwordValueRef = useRef('');
    const confirmValueRef = useRef('');
    const expirationValueRef = useRef('');

    const checkboxTab = [adminFullRightsCheckboxRef, adminCreateRightsCheckboxRef, adminEnableDisableRightsCheckboxRef, adminEditRightsCheckboxRef, adminDeleteRightsCheckboxRef, adminReadOnlyRightsCheckboxRef];
    const valueTab = [domainValueRef, fullnameValueRef, usernameValueRef, emailValueRef, phoneValueRef, passwordValueRef, confirmValueRef, expirationValueRef];

    const optionCheckingState = useRef<any>({
        full: { isChecked: false },
        create: { isChecked: false, subOptions: { adminIsChecked: false, callCenterIsChecked: false, customerIsChecked: false } },
        enableDisable: { isChecked: false, subOptions: { adminIsChecked: false, callCenterIsChecked: false, customerIsChecked: false } },
        edit: { isChecked: false, subOptions: { adminIsChecked: false, callCenterIsChecked: false, customerIsChecked: false } },
        delete: { isChecked: false, subOptions: { adminIsChecked: false, callCenterIsChecked: false, customerIsChecked: false } },
        readOnly: { isChecked: true }
    });

    const canCreateAccount = useRef(true);


    /* ------------------------------------ Methods ------------------------------------- */

    /* Add refId */
    const addRefIdFunc = (x: { wid: string, refId: refIdType }) => {
        refIdStore.current[x.wid] = x.refId;
        switch (x.wid) {
            case 'domainInputRef': { domainInputRef.current = x.refId.current } break;
            case 'companyNameInputRef': { companyNameInputRef.current = x.refId.current } break;
            case 'fullnameInputRef': { fullnameInputRef.current = x.refId.current } break;
            case 'usernameInputRef': { usernameInputRef.current = x.refId.current } break;
            case 'emailInputRef': { emailInputRef.current = x.refId.current } break;
            case 'phoneInputRef': { phoneInputRef.current = x.refId.current } break;
            case 'passwordInputRef': { passwordInputRef.current = x.refId.current } break;
            case 'confirmInputRef': { confirmInputRef.current = x.refId.current } break;
            case 'expirationInputRef': { expirationInputRef.current = x.refId.current } break;

            case 'adminFullRightsCheckboxRef': { adminFullRightsCheckboxRef.current = x.refId.current } break;
            case 'adminCreateRightsCheckboxRef': { adminCreateRightsCheckboxRef.current = x.refId.current } break;
            case 'adminEnableDisableRightsCheckboxRef': { adminEnableDisableRightsCheckboxRef.current = x.refId.current } break;
            case 'adminEditRightsCheckboxRef': { adminEditRightsCheckboxRef.current = x.refId.current } break;
            case 'adminDeleteRightsCheckboxRef': { adminDeleteRightsCheckboxRef.current = x.refId.current } break;
            case 'adminReadOnlyRightsCheckboxRef': { adminReadOnlyRightsCheckboxRef.current = x.refId.current } break;

            default: { };
        };
    };

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
            case 'domainInputRef': {
                const txt = replaceAllOccurenceFunc({ text: lowerText, replace: ' ', with: '' });
                const state = (txt.length === 0) ? 'empty' : (txt.length >= 2) ? 'correct' : 'error';
                domainValueRef.current = txt;
                domainInputRef.current.setTextFunc({ text: txt });
                domainInputRef.current.setInputStateFunc({ state: state });
                isDomainInputCorrect.current = (state === 'correct') ? true : false;
            } break;

            case 'companyNameInputRef': {
                const state = (len === 0) ? 'empty' : (len >= 2) ? 'correct' : 'error';
                companyNameValueRef.current = text;
                companyNameInputRef.current.setTextFunc({ text: text });
                companyNameInputRef.current.setInputStateFunc({ state: state });
                isCompanyNameInputCorrect.current = (state === 'correct') ? true : false;
            } break;

            case 'fullnameInputRef': {
                const state = (len === 0) ? 'empty' : (len >= 2) ? 'correct' : 'error';
                fullnameValueRef.current = text;
                fullnameInputRef.current.setTextFunc({ text: text });
                fullnameInputRef.current.setInputStateFunc({ state: state });
                isFullNameInputCorrect.current = (state === 'correct') ? true : false;
            } break;

            case 'usernameInputRef': {
                const state = (len === 0) ? 'empty' : (len >= 2) ? 'correct' : 'error';
                usernameValueRef.current = lowerText;
                usernameInputRef.current.setTextFunc({ text: lowerText });
                usernameInputRef.current.setInputStateFunc({ state: state });
                isUsernameInputCorrect.current = (state === 'correct') ? true : false;
            } break;

            case 'emailInputRef': {
                const txt = replaceAllOccurenceFunc({ text: lowerText, replace: ' ', with: '' });
                const check = checkEmailFunc({ email: txt });
                const state = (txt.length === 0) ? 'empty' : check ? 'correct' : 'error';
                emailValueRef.current = txt;
                emailInputRef.current.setTextFunc({ text: txt });
                emailInputRef.current.setInputStateFunc({ state: state });
                isEmailInputCorrect.current = (state === 'correct') ? true : false;
            } break;

            case 'phoneInputRef': {
                const state = (len === 0) ? 'empty' : (len >= 8) ? 'correct' : 'error';
                phoneValueRef.current = text;
                phoneInputRef.current.setTextFunc({ text: text });
                phoneInputRef.current.setInputStateFunc({ state: state });
                isPhoneInputCorrect.current = (state === 'correct') ? true : false;
            } break;

            case 'passwordInputRef': {
                const state = (len === 0) ? 'empty' : (len >= 8) ? 'correct' : 'error';
                passwordValueRef.current = text;
                passwordInputRef.current.setTextFunc({ text: text });
                passwordInputRef.current.setInputStateFunc({ state: state });
                isPasswordInputCorrect.current = (state === 'correct') ? true : false;

                /* Check confirm */
                if (confirmValueRef.current.length > 0) {
                    if (state === 'correct' && passwordValueRef.current === confirmValueRef.current) {
                        confirmInputRef.current.setInputStateFunc({ state: 'correct' });
                        isConfirmInputCorrect.current = true;
                    } else {
                        confirmInputRef.current.setInputStateFunc({ state: 'error' });
                        isConfirmInputCorrect.current = false;
                    }
                }
            } break;

            case 'confirmInputRef': {
                const state = (len === 0) ? 'empty' : (len >= 8 && (passwordValueRef.current === text)) ? 'correct' : 'error';
                confirmValueRef.current = text;
                confirmInputRef.current.setTextFunc({ text: text });
                confirmInputRef.current.setInputStateFunc({ state: state });
                isConfirmInputCorrect.current = (state === 'correct') ? true : false;
            } break;

            case 'expirationInputRef': {
                const state = (len === 0) ? 'empty' : (len >= 2) ? 'correct' : 'error';
                expirationValueRef.current = text;
                expirationInputRef.current.setTextFunc({ text: text });
                expirationInputRef.current.setInputStateFunc({ state: state });
                isExpirationInputCorrect.current = (state === 'correct') ? true : false;
            } break;

            default: { };
        };
    };

    /* Set traduction */
    const setTraductionFunc = (x: { traduction: any }) => { traduction.current = x.traduction };

    /* Unmount */
    const unmountFunc = () => {
        /* Prevent from first unmounting caused by "strictMode" */
        mountCount.current += 1; if (mountCount.current === 1) return;

        /* unmount logic */
        mainRootControllerRef?.current?.deleteFromBroadcastDomainFunc({ index: broadcastIndex.current });
        // mainRootControllerRef?.current?.addRefIdFunc({ wid: wid });
        controllerRef?.current?.deleteRefIdFunc({ wid: wid });
    };

    /* Check rights integrity */
    const checkRightsIntegrityFunc = () => {
        /* 0 => unchecked | 1 => partially checked | 2 => fully checked */
        let createOptCheckState = 0;
        let enDisOptCheckState = 0;
        let editOptCheckState = 0;
        let deleteOptCheckState = 0;

        /* Create */
        const createSubOptvalues = Object.values(optionCheckingState.current.create.subOptions);
        const createHasTrue = createSubOptvalues.includes(true);
        const createHasFalse = createSubOptvalues.includes(false);
        if ((createHasTrue && createHasFalse) || (createHasTrue && !createHasFalse)) {
            createOptCheckState = (createHasTrue && createHasFalse) ? 1 : 2;
            optionCheckingState.current.readOnly.isChecked = false;
            adminReadOnlyRightsCheckboxRef.current.checkAllFunc({ check: false });
        } else if (!createHasTrue && createHasFalse) {
            createOptCheckState = 0;
            optionCheckingState.current.create.isChecked = false;
            adminCreateRightsCheckboxRef.current.checkAllFunc({ check: false });
        }

        /* Enable/Disable */
        const enDisSubOptvalues = Object.values(optionCheckingState.current.enableDisable.subOptions);
        const enDisHasTrue = enDisSubOptvalues.includes(true);
        const enDisHasFalse = enDisSubOptvalues.includes(false);
        if ((enDisHasTrue && enDisHasFalse) || (enDisHasTrue && !enDisHasFalse)) {
            enDisOptCheckState = (enDisHasTrue && enDisHasFalse) ? 1 : 2;
            optionCheckingState.current.readOnly.isChecked = false;
            adminReadOnlyRightsCheckboxRef.current.checkAllFunc({ check: false });
        } else if (!enDisHasTrue && enDisHasFalse) {
            enDisOptCheckState = 0;
            optionCheckingState.current.enableDisable.isChecked = false;
            adminEnableDisableRightsCheckboxRef.current.checkAllFunc({ check: false });
        }

        /* Edit */
        const editSubOptvalues = Object.values(optionCheckingState.current.edit.subOptions);
        const editHasTrue = editSubOptvalues.includes(true);
        const editHasFalse = editSubOptvalues.includes(false);
        if ((editHasTrue && editHasFalse) || (editHasTrue && !editHasFalse)) {
            editOptCheckState = (editHasTrue && editHasFalse) ? 1 : 2;
            optionCheckingState.current.readOnly.isChecked = false;
            adminReadOnlyRightsCheckboxRef.current.checkAllFunc({ check: false });
        } else if (!editHasTrue && editHasFalse) {
            editOptCheckState = 0;
            optionCheckingState.current.edit.isChecked = false;
            adminEditRightsCheckboxRef.current.checkAllFunc({ check: false });
        }

        /* Delete */
        const deleteSubOptvalues = Object.values(optionCheckingState.current.delete.subOptions);
        const deleteHasTrue = deleteSubOptvalues.includes(true);
        const deleteHasFalse = deleteSubOptvalues.includes(false);
        if ((deleteHasTrue && deleteHasFalse) || (deleteHasTrue && !deleteHasFalse)) {
            deleteOptCheckState = (deleteHasTrue && deleteHasFalse) ? 1 : 2;
            optionCheckingState.current.readOnly.isChecked = false;
            adminReadOnlyRightsCheckboxRef.current.checkAllFunc({ check: false });
        } else if (!deleteHasTrue && deleteHasFalse) {
            deleteOptCheckState = 0;
            optionCheckingState.current.delete.isChecked = false;
            adminDeleteRightsCheckboxRef.current.checkAllFunc({ check: false });
        }

        /* - */
        const checkStateTab = [createOptCheckState, enDisOptCheckState, editOptCheckState, deleteOptCheckState];
        const hasUncheckedOpt = checkStateTab.includes(0);
        const hasPartialcheckedOpt = checkStateTab.includes(1);
        const hasFullcheckedOpt = checkStateTab.includes(2);

        /* readOnly check */
        const readOnlyCheck = (!hasPartialcheckedOpt && !hasFullcheckedOpt) ? true : false;
        optionCheckingState.current.readOnly.isChecked = readOnlyCheck;
        adminReadOnlyRightsCheckboxRef.current.checkAllFunc({ check: readOnlyCheck });

        /* Full check */
        const fullCheck = (hasFullcheckedOpt && !hasPartialcheckedOpt && !hasUncheckedOpt) ? true : false;
        optionCheckingState.current.full.isChecked = fullCheck;
        adminFullRightsCheckboxRef.current.checkAllFunc({ check: fullCheck });
    };

    /* On main option checked  */
    const onMainOptionClickedFunc = (x: { id: string, checked: boolean, innerTrigged?: boolean }) => {
        const id = x.id, checked = x.checked, innerTrigged = x.innerTrigged;
        switch (id) {
            case 'fullMainOption': {
                Object.keys(optionCheckingState.current).forEach((e: any) => {
                    if (e !== 'readOnly') {
                        optionCheckingState.current[e].isChecked = checked;
                        Object.hasOwn(optionCheckingState.current[e], 'subOptions') && Object.keys(optionCheckingState.current[e].subOptions).forEach((f: any) => { optionCheckingState.current[e].subOptions[f] = checked });
                    }
                });
                checkboxTab.forEach((e: refIdType, i: number) => { (i !== (checkboxTab.length - 1)) && e.current.checkAllFunc({ check: checked }) });

                /* Check readOnly */
                if (innerTrigged !== true) {
                    optionCheckingState.current.readOnly.isChecked = !checked;
                    adminReadOnlyRightsCheckboxRef.current.checkAllFunc({ check: !checked });
                }
            } break;

            case 'createMainOption': {
                optionCheckingState.current.create.isChecked = checked;
                Object.keys(optionCheckingState.current.create.subOptions).forEach((e: any) => { optionCheckingState.current.create.subOptions[e] = checked });
                checkRightsIntegrityFunc();
            } break;

            case 'enDisMainOption': {
                optionCheckingState.current.enableDisable.isChecked = checked;
                Object.keys(optionCheckingState.current.enableDisable.subOptions).forEach((e: any) => { optionCheckingState.current.enableDisable.subOptions[e] = checked });
                checkRightsIntegrityFunc();
            } break;

            case 'editMainOption': {
                optionCheckingState.current.edit.isChecked = checked;
                Object.keys(optionCheckingState.current.edit.subOptions).forEach((e: any) => { optionCheckingState.current.edit.subOptions[e] = checked });
                checkRightsIntegrityFunc();
            } break;

            case 'deleteMainOption': {
                optionCheckingState.current.delete.isChecked = checked;
                Object.keys(optionCheckingState.current.delete.subOptions).forEach((e: any) => { optionCheckingState.current.delete.subOptions[e] = checked });
                checkRightsIntegrityFunc();
            } break;

            case 'readOnlyMainOption': {
                optionCheckingState.current.readOnly.isChecked = checked;
                refId.current.onMainOptionClickedFunc({ id: 'fullMainOption', checked: !checked, innerTrigged: true });
            } break;

            default: { };
        }
    };

    /* On sub option checked  */
    const onSubOptionClickedFunc = (x: { id: string, parentId: string, checked: boolean }) => {
        const id = x.id, parentId = x.parentId, checked = x.checked;
        switch (parentId) {
            case 'createMainOption': {
                switch (id) {
                    case 'createAdminSubOption': { optionCheckingState.current.create.subOptions.adminIsChecked = checked } break;
                    case 'createCallCenterSubOption': { optionCheckingState.current.create.subOptions.callCenterIsChecked = checked } break;
                    case 'createCustomerSubOption': { optionCheckingState.current.create.subOptions.customerIsChecked = checked } break;
                    default: { };
                }
            } break;

            case 'enDisMainOption': {
                switch (id) {
                    case 'enDisAdminSubOption': { optionCheckingState.current.enableDisable.subOptions.adminIsChecked = checked } break;
                    case 'enDisCallCenterSubOption': { optionCheckingState.current.enableDisable.subOptions.callCenterIsChecked = checked } break;
                    case 'enDisCustomerSubOption': { optionCheckingState.current.enableDisable.subOptions.customerIsChecked = checked } break;
                    default: { };
                }
            } break;

            case 'editMainOption': {
                switch (id) {
                    case 'editAdminSubOption': { optionCheckingState.current.edit.subOptions.adminIsChecked = checked } break;
                    case 'editCallCenterSubOption': { optionCheckingState.current.edit.subOptions.callCenterIsChecked = checked } break;
                    case 'editCustomerSubOption': { optionCheckingState.current.edit.subOptions.customerIsChecked = checked } break;
                    default: { };
                }
            } break;

            case 'deleteMainOption': {
                switch (id) {
                    case 'deleteAdminSubOption': { optionCheckingState.current.delete.subOptions.adminIsChecked = checked } break;
                    case 'deleteCallCenterSubOption': { optionCheckingState.current.delete.subOptions.callCenterIsChecked = checked } break;
                    case 'deleteCustomerSubOption': { optionCheckingState.current.delete.subOptions.customerIsChecked = checked } break;
                    default: { };
                }
            } break;

            default: { };
        };
        checkRightsIntegrityFunc();
    };

    /* Create account */
    const createAccountFunc = async (x: { type: 'admin' | 'callCenter' | 'customer' }) => {
        if (canCreateAccount.current) {
            canCreateAccount.current = false;
            refIdStore.current['uiBlockerRef'].current.renderFunc({ render: true });

            let inputTab = [];
            try {
                const type = x.type;

                const domainCorrect = isDomainInputCorrect.current;
                const companyNameCorrect = isCompanyNameInputCorrect.current;
                const emailCorrect = isEmailInputCorrect.current;
                const phoneCorrect = isPhoneInputCorrect.current;
                const expirationCorrect = isExpirationInputCorrect.current;

                const fullnameCorrect = isFullNameInputCorrect.current;
                const usernameCorrect = isUsernameInputCorrect.current;
                const passwordCorrect = isPasswordInputCorrect.current;
                const confirmCorrect = isConfirmInputCorrect.current;

                const domain: string = dataStoreRootControllerRef.current.currentUserData.current.domain;

                switch (type) {
                    case 'admin': {
                        const tab = [fullnameCorrect, usernameCorrect, passwordCorrect, confirmCorrect];
                        const arr = [fullnameInputRef, usernameInputRef, passwordInputRef, confirmInputRef];

                        /* Check if form is fill */
                        if (tab.includes(false)) {
                            for (let i = 0; i < tab.length; i++) { tab[i] === false && inputTab.push(arr[i]) }
                            throw new Error(_incompleteForm_);
                        }

                        /* - */
                        refIdStore.current['accountLoadingRef'].current.showLoadingFunc({ show: true });
                        $('.acrw_btn_container').css({ opacity: 0.4 });

                        /* create account */
                        const accountData = { id: generateIdFunc(), fullname: fullnameValueRef.current, username: usernameValueRef.current, ssm: passwordValueRef.current, type: 'main_admin', rights: optionCheckingState.current, domain: domain };
                        const res: any = await requestRootControllerRef.current.createAccountFunc({ type: type, data: accountData });
                        (res.status === _success_) ? refId.current.onAccountCreationSuccessFunc({ data: res.data, type: type }) : refId.current.onAccountCreationFailedFunc({ status: res.status, data: res.data });
                    } break;

                    case 'callCenter': {
                        const tab = [fullnameCorrect, usernameCorrect, passwordCorrect, confirmCorrect];
                        const arr = [fullnameInputRef, usernameInputRef, passwordInputRef, confirmInputRef];

                        /* Check if form is fill */
                        if (tab.includes(false)) {
                            for (let i = 0; i < tab.length; i++) { tab[i] === false && inputTab.push(arr[i]) }
                            throw new Error(_incompleteForm_);
                        }

                        /* - */
                        refIdStore.current['accountLoadingRef'].current.showLoadingFunc({ show: true });
                        $('.acrw_btn_container').css({ opacity: 0.4 });

                        /* Create account */
                        const accountData = { id: generateIdFunc(), fullname: fullnameValueRef.current, username: usernameValueRef.current, ssm: passwordValueRef.current, type: 'call_center', domain: domain };
                        const res: any = await requestRootControllerRef.current.createAccountFunc({ type: type, data: accountData });
                        (res.status === _success_) ? refId.current.onAccountCreationSuccessFunc({ data: res.data, type: type }) : refId.current.onAccountCreationFailedFunc({ status: res.status, data: res.data });
                    } break;

                    case 'customer': {
                        const tab = [domainCorrect, companyNameCorrect, emailCorrect, phoneCorrect, expirationCorrect, fullnameCorrect, usernameCorrect, passwordCorrect, confirmCorrect];
                        const arr = [domainInputRef, companyNameInputRef, emailInputRef, phoneInputRef, expirationInputRef, fullnameInputRef, usernameInputRef, passwordInputRef, confirmInputRef];

                        /* Check if form is fill */
                        if (tab.includes(false)) {
                            for (let i = 0; i < tab.length; i++) { tab[i] === false && inputTab.push(arr[i]) }
                            throw new Error(_incompleteForm_);
                        }

                        /* - */
                        refIdStore.current['accountLoadingRef'].current.showLoadingFunc({ show: true });
                        $('.acrw_btn_container').css({ opacity: 0.4 });

                        /* Create account */
                        const exp_ms = new Date(expirationValueRef.current).getTime();
                        const accountData = { id: generateIdFunc(), companyName: companyNameValueRef.current, email: emailValueRef.current, phone: phoneValueRef.current, expiration: expirationValueRef.current, expiration_ms: exp_ms, adminId: generateIdFunc(), fullname: fullnameValueRef.current, username: usernameValueRef.current, ssm: passwordValueRef.current, type: 'customer', domain: domainValueRef.current };

                        /* create account */
                        const res: any = await requestRootControllerRef.current.createAccountFunc({ type: type, data: accountData });
                        (res.status === _success_) ? refId.current.onAccountCreationSuccessFunc({ data: res.data, type: type }) : refId.current.onAccountCreationFailedFunc({ status: res.status, data: res.data, source: 'customer' });
                    } break;

                    default: { };
                };

            } catch (e: any) {
                const msg = e.message;

                /* Hide loading */
                refIdStore.current['accountLoadingRef'].current.showLoadingFunc({ show: false });

                /* - */
                refIdStore.current['uiBlockerRef'].current.renderFunc({ render: false });
                canCreateAccount.current = true;

                /* Start shaking */
                $('#acrw_container').addClass('shakeX');

                /* - */
                switch (msg) {
                    case _incompleteForm_: { for (let i = 0; i < inputTab.length; i++) { inputTab[i].current.setInputStateFunc({ state: 'error' }) } } break;
                    default: { };
                };

                /* Stop shaking */
                setTimeout(() => { $('#acrw_container').removeClass('shakeX') }, 1200);
            }
        }
    };

    /* Cancel */
    const cancelFunc = () => { refId.current.resetFormFunc() };

    /* Reset form */
    const resetFormFunc = () => {
        refIdStore.current['accountLoadingRef'].current.showLoadingFunc({ show: false });
        $('.acrw_btn_container').css({ opacity: 1 });

        refIdStore.current['uiBlockerRef'].current.renderFunc({ render: false });
        canCreateAccount.current = true;

        /* - */
        for (let i = 0; i < inputRefTab.length; i++) {
            const target = inputRefTab[i];
            if (typeof target === 'object' && target.current !== undefined) {
                target.current.setInputStateFunc({ state: 'empty' });
                target.current.clearTextFunc();
            }
        }
        for (let n = 0; n < correctTab.length; n++) { correctTab[n].current = false }
        for (let m = 0; m < valueTab.length; m++) { valueTab[m].current = '' }
    };

    /* If account creation success */
    const onAccountCreationSuccessFunc = (x: { data: any, type: 'admin' | 'callCenter' | 'customer' }) => {
        try {
            const data = x.data, type = x.type;
            refId.current.resetFormFunc();
            switch (type) {
                case 'admin': {
                    const adminASPMainControllerRef: refIdType = mainRootControllerRef.current.refIdStore.current.adminASPMainControllerRef;
                    adminASPMainControllerRef.current.renderAccountFunc({ data: data });
                } break;

                case 'callCenter': {
                    const callCSPMainControllerRef: refIdType = mainRootControllerRef.current.refIdStore.current.callCSPMainControllerRef;
                    callCSPMainControllerRef.current.renderAccountFunc({ data: data });
                } break;

                case 'customer': {
                    const customerSPMainControllerRef: refIdType = mainRootControllerRef.current.refIdStore.current.customerSPMainControllerRef;
                    customerSPMainControllerRef.current.renderAccountFunc({ data: data });
                } break;

                default: { };
            };

        } catch (e: any) { return catchErrorFunc({ err: e.message }) }
    };

    /* If account creation failed */
    const onAccountCreationFailedFunc = (x: { status: any, data: any, customer: 'admin' | 'callCenter' | 'customer' }) => {
        const status = x.status, data = x.data, customer = x.customer;

        /* - */
        refIdStore.current['accountLoadingRef'].current.showLoadingFunc({ show: false });
        $('.acrw_btn_container').css({ opacity: 1 });

        /* - */
        switch (status) {
            case _cipherFailed_: {
                console.log('cipher failed ::', data);
            } break;

            case _decipherFailed_: {
                console.log('decipher failed ::', data);
            } break;

            case _requestFailed_: {
                const isJson: any = isJsonFunc({ data: data });
                if (isJson.status === _success_ && isJson.data.type === 'array') {
                    const arr: any[] = isJson.data.parsedData;

                    const tab: any[] = [
                        { err: _domainExists_, refId: domainInputRef, correct: isDomainInputCorrect, msg: 't0033' },
                        { err: _companyNameExists_, refId: companyNameInputRef, correct: isCompanyNameInputCorrect, msg: 't0035' },
                        { err: _emailExists_, refId: emailInputRef, correct: isEmailInputCorrect, msg: 't0029' },
                        { err: _phoneExists_, refId: phoneInputRef, correct: isEmailInputCorrect, msg: 't0036' },
                        { err: _fullnameExists_, refId: fullnameInputRef, correct: isFullNameInputCorrect, msg: 't0027' },
                        { err: _usernameExists_, refId: usernameInputRef, correct: isUsernameInputCorrect, msg: 't0028' }
                    ];

                    for (let i = 0; i < tab.length; i++) {
                        const err = tab[i].err;
                        const refId = tab[i].refId;
                        const correct = tab[i].correct;
                        const msg = tab[i].msg;
                        if (arr.indexOf(err) !== -1) {
                            refId.current.setErrorMsgFunc({ msg: traduction.current[msg] });
                            correct.current = false;
                        }
                    }
                } else {
                    /* Unexpected error */
                }
            } break;

            default: { };
        };
        canCreateAccount.current = true;
        refIdStore.current['uiBlockerRef'].current.renderFunc({ render: false });
    };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Imperative handler */
    useImperativeHandle(ref, () => ({
        addRefIdFunc(x: any) { addRefIdFunc(x) },
        deleteRefIdFunc(x: any) { deleteRefIdFunc(x) },

        setTextValueFunc(x: any) { setTextValueFunc(x) },
        setTraductionFunc(x: any) { setTraductionFunc(x) },

        onMainOptionClickedFunc(x: any) { onMainOptionClickedFunc(x) },
        onSubOptionClickedFunc(x: any) { onSubOptionClickedFunc(x) },
        createAccountFunc(x: any) { createAccountFunc(x) },
        cancelFunc() { cancelFunc() },
        resetFormFunc() { resetFormFunc() },
        onAccountCreationSuccessFunc(x: any) { onAccountCreationSuccessFunc(x) },
        onAccountCreationFailedFunc(x: any) { onAccountCreationFailedFunc(x) }
    }), []);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            broadcastIndex.current = mainRootControllerRef.current.addToBroadcastDomainFunc({ wid: wid, refId: refId });
            // mainRootControllerRef.current.addRefIdFunc({ wid: wid, refId: refId });
            (controllerRef?.current !== undefined) && controllerRef.current.addRefIdFunc({ wid: wid, refId: refId });
        }
        return () => unmountFunc();
    }, []);


    /* - */
    return (<></>);
});
const Controller = memo(__Controller);


































/* ----------------------------------------------------- Direct Children Components ----------------------------------------------------- */

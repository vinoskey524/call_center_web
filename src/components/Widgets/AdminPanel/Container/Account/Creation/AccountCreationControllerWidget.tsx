/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import { refIdType } from '../../../../../Tools/type';
import { generateIdFunc, catchErrorFunc, checkEmailFunc, isJsonFunc, replaceAllOccurenceFunc, replaceConsecutiveSpacesByOneFunc } from '../../../../../Tools/methodForest';
import {
    _defaultLanguage_, _cipherFailed_, _decipherFailed_, _emailExists_, _incompleteForm_, _requestFailed_, _usernameExists_, _fullnameExists_, _success_,
    _domainExists_, _companyNameExists_, _phoneExists_
} from '../../../../../Tools/constants';
import { language } from '../../../../../Tools/language';

/* Widget */
type optionCheckingType = {
    full: { isChecked: boolean },
    create: {
        isChecked: boolean,
        subOptions: { adminIsChecked: boolean, callCenterIsChecked: boolean, customerIsChecked: boolean }
    },
    enableDisable: {
        isChecked: boolean,
        subOptions: { adminIsChecked: boolean, callCenterIsChecked: boolean, customerIsChecked: boolean }
    },
    edit: {
        isChecked: boolean,
        subOptions: { adminIsChecked: boolean, callCenterIsChecked: boolean, customerIsChecked: boolean }
    },
    delete: {
        isChecked: boolean,
        subOptions: { adminIsChecked: boolean, callCenterIsChecked: boolean, customerIsChecked: boolean }
    },
    readOnly: { isChecked: boolean }
};
type propsType = {
    $data: {
        /** Every change made to "wid" affect controller */
        wid: string,
        refId: refIdType,
        controllerRef?: refIdType,
        rootControllers: any
    }
};
const AccountCreationControllerWidget = (props: propsType, ref: any) => {
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

    const accountLoadingRef = useRef<any>(undefined);
    const uiBlockerRef = useRef<any>(undefined);

    /* - */

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

    /* Add widget ref */
    const addWidgetRefFunc = (x: { wid: string, refId: any }) => {
        const wid = x.wid, refId = x.refId;
        switch (wid) {
            case 'domainInputRef': { domainInputRef.current = refId.current } break;
            case 'companyNameInputRef': { companyNameInputRef.current = refId.current } break;
            case 'fullnameInputRef': { fullnameInputRef.current = refId.current } break;
            case 'usernameInputRef': { usernameInputRef.current = refId.current } break;
            case 'emailInputRef': { emailInputRef.current = refId.current } break;
            case 'phoneInputRef': { phoneInputRef.current = refId.current } break;
            case 'passwordInputRef': { passwordInputRef.current = refId.current } break;
            case 'confirmInputRef': { confirmInputRef.current = refId.current } break;
            case 'expirationInputRef': { expirationInputRef.current = refId.current } break;
            /* rights */
            case 'adminFullRightsCheckboxRef': { adminFullRightsCheckboxRef.current = refId.current } break;
            case 'adminCreateRightsCheckboxRef': { adminCreateRightsCheckboxRef.current = refId.current } break;
            case 'adminEnableDisableRightsCheckboxRef': { adminEnableDisableRightsCheckboxRef.current = refId.current } break;
            case 'adminEditRightsCheckboxRef': { adminEditRightsCheckboxRef.current = refId.current } break;
            case 'adminDeleteRightsCheckboxRef': { adminDeleteRightsCheckboxRef.current = refId.current } break;
            case 'adminReadOnlyRightsCheckboxRef': { adminReadOnlyRightsCheckboxRef.current = refId.current } break;
            /* - */
            case 'accountLoadingRef': { accountLoadingRef.current = refId.current } break;
            case 'uiBlockerRef': { uiBlockerRef.current = refId.current } break;
            default: { };
        };
    };

    /* Set text value from inputs */
    const setTextValueFunc = (x: { wid: string, text: string }) => {
        const wid = x.wid, t = (x.text).replaceAll("'", '’').trimStart(), text = replaceConsecutiveSpacesByOneFunc(t), l = text.length;
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
                const state = (l === 0) ? 'empty' : (l >= 2) ? 'correct' : 'error';
                companyNameValueRef.current = text;
                companyNameInputRef.current.setTextFunc({ text: text });
                companyNameInputRef.current.setInputStateFunc({ state: state });
                isCompanyNameInputCorrect.current = (state === 'correct') ? true : false;
            } break;

            case 'fullnameInputRef': {
                const state = (l === 0) ? 'empty' : (l >= 2) ? 'correct' : 'error';
                fullnameValueRef.current = text;
                fullnameInputRef.current.setTextFunc({ text: text });
                fullnameInputRef.current.setInputStateFunc({ state: state });
                isFullNameInputCorrect.current = (state === 'correct') ? true : false;
            } break;

            case 'usernameInputRef': {
                const state = (l === 0) ? 'empty' : (l >= 2) ? 'correct' : 'error';
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
                const state = (l === 0) ? 'empty' : (l >= 8) ? 'correct' : 'error';
                phoneValueRef.current = text;
                phoneInputRef.current.setTextFunc({ text: text });
                phoneInputRef.current.setInputStateFunc({ state: state });
                isPhoneInputCorrect.current = (state === 'correct') ? true : false;
            } break;

            case 'passwordInputRef': {
                const state = (l === 0) ? 'empty' : (l >= 8) ? 'correct' : 'error';
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
                const state = (l === 0) ? 'empty' : (l >= 8 && (passwordValueRef.current === text)) ? 'correct' : 'error';
                confirmValueRef.current = text;
                confirmInputRef.current.setTextFunc({ text: text });
                confirmInputRef.current.setInputStateFunc({ state: state });
                isConfirmInputCorrect.current = (state === 'correct') ? true : false;
            } break;

            case 'expirationInputRef': {
                const state = (l === 0) ? 'empty' : (l >= 2) ? 'correct' : 'error';
                expirationValueRef.current = text;
                expirationInputRef.current.setTextFunc({ text: text });
                expirationInputRef.current.setInputStateFunc({ state: state });
                isExpirationInputCorrect.current = (state === 'correct') ? true : false;
            } break;

            default: { };
        };
    };

    /* On window size change */
    const onWindowSizeChangeFunc = () => { setWindowWidth(window.innerWidth); setWindowHeight(window.innerHeight) };

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
            uiBlockerRef.current.renderFunc({ render: true });

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

                const domain: string = dataStoreControllerRef.current.currentUserData.current.domain;

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
                        accountLoadingRef.current.showLoadingFunc({ show: true });
                        $('.acrw_btn_container').css({ opacity: 0.4 });

                        /* create account */
                        const accountData = { id: generateIdFunc(), fullname: fullnameValueRef.current, username: usernameValueRef.current, ssm: passwordValueRef.current, type: 'main_admin', rights: optionCheckingState.current, domain: domain };
                        const res: any = await requestControllerRef.current.createAccountFunc({ type: type, data: accountData });
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
                        accountLoadingRef.current.showLoadingFunc({ show: true });
                        $('.acrw_btn_container').css({ opacity: 0.4 });

                        /* Create account */
                        const accountData = { id: generateIdFunc(), fullname: fullnameValueRef.current, username: usernameValueRef.current, ssm: passwordValueRef.current, type: 'call_center', domain: domain };
                        const res: any = await requestControllerRef.current.createAccountFunc({ type: type, data: accountData });
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
                        accountLoadingRef.current.showLoadingFunc({ show: true });
                        $('.acrw_btn_container').css({ opacity: 0.4 });

                        /* Create account */
                        const exp_ms = new Date(expirationValueRef.current).getTime();
                        const accountData = { id: generateIdFunc(), companyName: companyNameValueRef.current, email: emailValueRef.current, phone: phoneValueRef.current, expiration: expirationValueRef.current, expiration_ms: exp_ms, adminId: generateIdFunc(), fullname: fullnameValueRef.current, username: usernameValueRef.current, ssm: passwordValueRef.current, type: 'customer', domain: domainValueRef.current };

                        /* create account */
                        const res: any = await requestControllerRef.current.createAccountFunc({ type: type, data: accountData });
                        (res.status === _success_) ? refId.current.onAccountCreationSuccessFunc({ data: res.data, type: type }) : refId.current.onAccountCreationFailedFunc({ status: res.status, data: res.data, source: 'customer' });
                    } break;

                    default: { };
                };

            } catch (e: any) {
                const msg = e.message;

                /* Hide loading */
                accountLoadingRef.current.showLoadingFunc({ show: false });

                /* - */
                uiBlockerRef.current.renderFunc({ render: false });
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
        accountLoadingRef.current.showLoadingFunc({ show: false });
        $('.acrw_btn_container').css({ opacity: 1 });

        uiBlockerRef.current.renderFunc({ render: false });
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
                    const adminASPMainControllerRef: refIdType = mainControllerRef.current.adminASPMainControllerRef;
                    adminASPMainControllerRef.current.renderAccountFunc({ data: data });
                } break;

                case 'callCenter': {
                    const callCSPMainControllerRef: refIdType = mainControllerRef.current.callCSPMainControllerRef;
                    callCSPMainControllerRef.current.renderAccountFunc({ data: data });
                } break;

                case 'customer': {
                    const customerSPMainControllerRef: refIdType = mainControllerRef.current.customerSPMainControllerRef;
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
        accountLoadingRef.current.showLoadingFunc({ show: false });
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
                            refId.current.setErrorMsgFunc({ msg: traduction[msg] });
                            correct.current = false;
                        }
                    }
                }
            } break;

            default: { };
        };
        canCreateAccount.current = true;
        uiBlockerRef.current.renderFunc({ render: false });
    };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        addWidgetRefFunc(x: any) { addWidgetRefFunc(x) },
        setTextValueFunc(x: any) { setTextValueFunc(x) },
        onMainOptionClickedFunc(x: any) { onMainOptionClickedFunc(x) },
        onSubOptionClickedFunc(x: any) { onSubOptionClickedFunc(x) },
        createAccountFunc(x: any) { createAccountFunc(x) },
        cancelFunc() { cancelFunc() },
        resetFormFunc() { resetFormFunc() },
        onAccountCreationSuccessFunc(x: any) { onAccountCreationSuccessFunc(x) },
        onAccountCreationFailedFunc(x: any) { onAccountCreationFailedFunc(x) }
    }), [refresh]);

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

export default forwardRef(AccountCreationControllerWidget);
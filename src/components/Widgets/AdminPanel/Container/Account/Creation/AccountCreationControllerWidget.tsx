/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import { refIdType } from '../../../../../Tools/type';
import { generateIdFunc } from '../../../../../Tools/methodForest';
import { _defaultLanguage_, _cipherFailed_, _decipherFailed_, _emailExists_, _incompleteForm_, _requestFailed_, _usernameExists_, _fullnameExists_ } from '../../../../../Tools/constants';
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

    const fullNameInputRef = useRef<any>(undefined);
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

    const inputRefTab = [fullNameInputRef, usernameInputRef, emailInputRef, phoneInputRef, passwordInputRef, confirmInputRef, expirationInputRef];
    const correctTab = [isFullNameInputCorrect, isUsernameInputCorrect, isEmailInputCorrect, isPhoneInputCorrect, isPasswordInputCorrect, isConfirmInputCorrect, isExpirationInputCorrect];

    const adminFullRightsCheckboxRef = useRef<any>(undefined);
    const adminCreateRightsCheckboxRef = useRef<any>(undefined);
    const adminEnableDisableRightsCheckboxRef = useRef<any>(undefined);
    const adminEditRightsCheckboxRef = useRef<any>(undefined);
    const adminDeleteRightsCheckboxRef = useRef<any>(undefined);
    const adminReadOnlyRightsCheckboxRef = useRef<any>(undefined);

    const accountLoadingRef = useRef<any>(undefined);
    const uiBlockerRef = useRef<any>(undefined);

    /* - */

    const fullNameValueRef = useRef('');
    const usernameValueRef = useRef('');
    const emailValueRef = useRef('');
    const phoneValueRef = useRef('');
    const passwordValueRef = useRef('');
    const confirmValueRef = useRef('');
    const expirationValueRef = useRef('');

    const checkboxTab = [adminFullRightsCheckboxRef, adminCreateRightsCheckboxRef, adminEnableDisableRightsCheckboxRef, adminEditRightsCheckboxRef, adminDeleteRightsCheckboxRef, adminReadOnlyRightsCheckboxRef];
    const valueTab = [fullNameValueRef, usernameValueRef, emailValueRef, phoneValueRef, passwordValueRef, confirmValueRef, expirationValueRef];

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
            case 'fullNameInputRef': { fullNameInputRef.current = refId.current } break;
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
        const wid = x.wid, text = (x.text).replaceAll("'", '’').trimStart(), l = text.length;
        switch (wid) {
            case 'fullNameInputRef': {
                const state = (l === 0) ? 'empty' : (l >= 2) ? 'correct' : 'error';
                fullNameValueRef.current = text;
                fullNameInputRef.current.setTextFunc({ text: text });
                fullNameInputRef.current.setInputStateFunc({ state: state });
                isFullNameInputCorrect.current = (state === 'correct') ? true : false;
            } break;

            case 'usernameInputRef': {
                const state = (l === 0) ? 'empty' : (l >= 2) ? 'correct' : 'error';
                usernameValueRef.current = text;
                usernameInputRef.current.setTextFunc({ text: text });
                usernameInputRef.current.setInputStateFunc({ state: state });
                isUsernameInputCorrect.current = (state === 'correct') ? true : false;
            } break;

            case 'emailInputRef': {
                const state = (l === 0) ? 'empty' : (l >= 2) ? 'correct' : 'error';
                emailValueRef.current = text;
                emailInputRef.current.setTextFunc({ text: text });
                emailInputRef.current.setInputStateFunc({ state: state });
                isEmailInputCorrect.current = (state === 'correct') ? true : false;
            } break;

            case 'phoneInputRef': {
                const state = (l === 0) ? 'empty' : (l >= 2) ? 'correct' : 'error';
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
    const createAccountFunc = (x: { type: 'admin' | 'callCenter' | 'customer' }) => {
        if (canCreateAccount.current) {
            canCreateAccount.current = false;
            uiBlockerRef.current.renderFunc({ render: true });

            let inputTab = [];
            try {
                const type = x.type;
                const fullNameCorrect = isFullNameInputCorrect.current;
                const usernameCorrect = isUsernameInputCorrect.current;
                const passwordCorrect = isPasswordInputCorrect.current;
                const confirmCorrect = isConfirmInputCorrect.current;

                const domain: string = dataStoreControllerRef.current.currentUserData.current.domain;

                switch (type) {
                    case 'admin': {
                        const tab = [fullNameCorrect, usernameCorrect, passwordCorrect, confirmCorrect];
                        const arr = [fullNameInputRef, usernameInputRef, passwordInputRef, confirmInputRef];

                        if (tab.includes(false)) {
                            for (let i = 0; i < tab.length; i++) { tab[i] === false && inputTab.push(arr[i]) }
                            throw new Error(_incompleteForm_);
                        }

                        accountLoadingRef.current.showLoadingFunc({ show: true });

                        const accountData = { id: generateIdFunc(), fullname: fullNameValueRef.current, username: usernameValueRef.current, ssm: passwordValueRef.current, type: 'main_admin', rights: optionCheckingState.current, domain: domain };
                        requestControllerRef.current.createAccountFunc({ type: type, data: accountData, controllerRef: refId });
                    } break;

                    case 'callCenter': { } break;

                    case 'customer': { } break;

                    default: { };
                }

            } catch (e: any) {
                accountLoadingRef.current.showLoadingFunc({ show: false });

                uiBlockerRef.current.renderFunc({ render: false });
                canCreateAccount.current = true;

                const msg = e.message;
                $('#acrw_container').addClass('shakeX');

                switch (msg) {
                    case _incompleteForm_: { for (let i = 0; i < inputTab.length; i++) { inputTab[i].current.setInputStateFunc({ state: 'error' }) } } break;
                    default: { };
                }

                setTimeout(() => { $('#acrw_container').removeClass('shakeX') }, 1200);
            }
        }
    };

    /* Cancel */
    const cancelFunc = () => {
        accountLoadingRef.current.showLoadingFunc({ show: false });

        for (let i = 0; i < inputRefTab.length; i++) {
            const target = inputRefTab[i];
            if (typeof target === 'object' && target.current !== undefined) {
                target.current.setInputStateFunc({ state: 'empty' });
                target.current.clearTextFunc();
            }
        }
        for (let n = 0; n < correctTab.length; n++) { correctTab[n].current = false }
        for (let m = 0; m < valueTab.length; m++) { valueTab[m].current = '' }

        // $('#acrw_input_classname').va
    };

    /* Get account creation feedback */
    const getAccountCreationFeedbackFunc = (x: { data: any }) => {
        const data = x.data;
        refId.current.cancelFunc();

        canCreateAccount.current = true;
        uiBlockerRef.current.renderFunc({ render: false });

        console.log('account created ::', data);
    };

    /* Handler account creation error */
    const handleAccountCreationErrorFunc = (x: { status: any, data: any }) => {
        const status = x.status, data = x.data;
        accountLoadingRef.current.showLoadingFunc({ show: false });
        switch (status) {
            case _cipherFailed_: {
                console.log('cipher failed ::', data);
            } break;

            case _decipherFailed_: {
                console.log('decipher failed ::', data);
            } break;

            case _requestFailed_: {
                (data === _fullnameExists_) && fullNameInputRef.current.setErrorMsgFunc({ msg: traduction['t0027'] });
                (data === _usernameExists_) && usernameInputRef.current.setErrorMsgFunc({ msg: traduction['t0028'] });
                (data === _emailExists_) && emailInputRef.current.setErrorMsgFunc({ msg: traduction['t0029'] });
            } break;

            default: { };
        }
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
        getAccountCreationFeedbackFunc(x: any) { getAccountCreationFeedbackFunc(x) },
        handleAccountCreationErrorFunc(x: any) { handleAccountCreationErrorFunc(x) }
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


    return (<></>);
};

export default forwardRef(AccountCreationControllerWidget);
/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

/* Custom packages */
import { refIdType } from '../../../../../Tools/type';

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

    const adminFullRightsCheckboxRef = useRef<any>(undefined);

    const adminCreateRightsCheckboxRef = useRef<any>(undefined);

    const adminEnableDisableRightsCheckboxRef = useRef<any>(undefined);

    const adminEditRightsCheckboxRef = useRef<any>(undefined);

    const adminDeleteRightsCheckboxRef = useRef<any>(undefined);

    const adminReadOnlyRightsCheckboxRef = useRef<any>(undefined);

    /* - */

    const checkboxTab = [adminFullRightsCheckboxRef, adminCreateRightsCheckboxRef, adminEnableDisableRightsCheckboxRef, adminEditRightsCheckboxRef, adminDeleteRightsCheckboxRef, adminReadOnlyRightsCheckboxRef];

    const optionCheckingState = useRef<any>({
        full: { isChecked: false },
        create: { isChecked: false, subOptions: { adminIsChecked: false, callCenterIsChecked: false, customerIsChecked: false } },
        enableDisable: { isChecked: false, subOptions: { adminIsChecked: false, callCenterIsChecked: false, customerIsChecked: false } },
        edit: { isChecked: false, subOptions: { adminIsChecked: false, callCenterIsChecked: false, customerIsChecked: false } },
        delete: { isChecked: false, subOptions: { adminIsChecked: false, callCenterIsChecked: false, customerIsChecked: false } },
        readOnly: { isChecked: false }
    });

    // ' {full: { isChecked: true }, create: { isChecked: true, subOptions: { adminIsChecked: true, callCenterIsChecked: true, customerIsChecked: true } },  enableDisable: { isChecked: false, subOptions: { adminIsChecked: false, callCenterIsChecked: false, customerIsChecked: false } },  }'


    /* ------------------------------------ Methods ------------------------------------- */

    /* Add widget ref */
    const addWidgetRefFunc = (x: { wid: string, refId: any }) => {
        const wid = x.wid, refId = x.refId;
        switch (wid) {
            case 'adminFullRightsCheckboxRef': { adminFullRightsCheckboxRef.current = refId.current } break;
            case 'adminCreateRightsCheckboxRef': { adminCreateRightsCheckboxRef.current = refId.current } break;
            case 'adminEnableDisableRightsCheckboxRef': { adminEnableDisableRightsCheckboxRef.current = refId.current } break;
            case 'adminEditRightsCheckboxRef': { adminEditRightsCheckboxRef.current = refId.current } break;
            case 'adminDeleteRightsCheckboxRef': { adminDeleteRightsCheckboxRef.current = refId.current } break;
            case 'adminReadOnlyRightsCheckboxRef': { adminReadOnlyRightsCheckboxRef.current = refId.current } break;
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


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        addWidgetRefFunc(x: any) { addWidgetRefFunc(x) },
        setTextValueFunc(x: any) { setTextValueFunc(x) },
        onMainOptionClickedFunc(x: any) { onMainOptionClickedFunc(x) },
        onSubOptionClickedFunc(x: any) { onSubOptionClickedFunc(x) }
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
/* Standard packages */
import React, { useRef, memo, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import { refIdType } from '../../Tools/type';
import { _success_, _dev_, _defaultLanguage_, _requestFailed_, _fullnameExists_, _usernameExists_, _complaintObjectExists_, _agencyExists_ } from '../../Tools/constants';
import { catchErrorFunc, generateIdFunc, isJsonFunc, replaceConsecutiveSpacesByOneFunc, sortStringFunc } from '../../Tools/methodForest';


/** Every change made to "wid" affect controller */
type propsType = { $data: { wid: string, controllerRef?: refIdType, rootControllers: any } };
const CustomerMainControllerWidget = forwardRef((props: propsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const refId: refIdType = ref;

    const windowWidth = useRef(window.innerWidth);
    const windowHeight = useRef(window.innerHeight);

    const isMounted = useRef(false);
    const mountCount = useRef(0);
    const render = useRef(true);

    const emptyRef = useRef<any>(undefined);
    const consumerRef = useRef<any>(undefined);
    const prototypeControllerRef = useRef<any>(undefined);

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

    /* refId store */

    const refIdStore = useRef<any>({});

    const customerHomeDashboardRef = useRef<any>(undefined);
    const customerProductDashboardRef = useRef<any>(undefined);
    const customerComplaintDashboardRef = useRef<any>(undefined);
    const customerConfigDashboardRef = useRef<any>(undefined);

    const productDashboardMainRef = useRef<any>(undefined);
    const productFeedListRef = useRef<any>(undefined);
    const productFeedListControllerRef = useRef<any>(undefined);
    const productFeedSearchListRef = useRef<any>(undefined);
    const productFeedSearchListControllerRef = useRef<any>(undefined);

    const complaintDashboardMainRef = useRef<any>(undefined);
    const complaintDashboardControllerRef = useRef<any>(undefined);
    const complaintFeedListRef = useRef<any>(undefined);
    const complaintFeedSearchListRef = useRef<any>(undefined);

    const homeDashboardIsInitalized = useRef(false);
    const productDashboardIsInitalized = useRef(false);
    const complaintDashboardIsInitalized = useRef(false);
    const configDashboardIsInitalized = useRef(false);

    const currentProductSelectedWid = useRef<any>(undefined);
    const currentProductSelectedRef = useRef<any>(undefined);

    const configFeedAccountListRef = useRef<any>(undefined);
    const configFeedAccountListControllerRef = useRef<any>(undefined);
    const configFeedObjectListRef = useRef<any>(undefined);
    const configFeedObjectListControllerRef = useRef<any>(undefined);
    const configFeedAgencyListRef = useRef<any>(undefined);
    const configFeedAgencyListControllerRef = useRef<any>(undefined);

    const customerConfigFormLoadingRef = useRef<any>(undefined);

    const objectStatsFeedListRef = useRef<any>(undefined);
    const objectStatsFeedListControllerRef = useRef<any>(undefined);
    const productStatsFeedListRef = useRef<any>(undefined);
    const productStatsFeedListControllerRef = useRef<any>(undefined);

    /* - */

    const dashboardTab = { home: customerHomeDashboardRef, product: customerProductDashboardRef, complaint: customerComplaintDashboardRef, config: customerConfigDashboardRef };

    const currentDashboardType = useRef('');
    const currentDashboardRef = useRef<any>(undefined);

    const productSearchText = useRef<string>('');
    const timer = useRef<any>(undefined);

    /* Admin account */

    const aaFullnameInputVal = useRef('');
    const aaFullnameInputCorrect = useRef(false);

    const aaUsernameInputVal = useRef('');
    const aaUsernameInputCorrect = useRef(false);

    const aaPasswordInputVal = useRef('');
    const aaPasswordInputCorrect = useRef(false);

    const aaConfirmInputVal = useRef('');
    const aaConfirmInputCorrect = useRef(false);

    const objNameInputVal = useRef('');
    const objNameInputCorrect = useRef(false);

    const agencyNameInputVal = useRef('');
    const agencyNameInputCorrect = useRef(false);

    const formInputTab = [
        { id: 'cuscdw_fullname_input_id', correct: aaFullnameInputCorrect, val: aaFullnameInputVal, type: 'account' },
        { id: 'cuscdw_username_input_id', correct: aaUsernameInputCorrect, val: aaUsernameInputVal, type: 'account' },
        { id: 'cuscdw_password_input_id', correct: aaPasswordInputCorrect, val: aaPasswordInputVal, type: 'account' },
        { id: 'cuscdw_confirm_input_id', correct: aaConfirmInputCorrect, val: aaConfirmInputVal, type: 'account' },
        { id: 'cuscdw_object_name_input_id', correct: objNameInputCorrect, val: objNameInputVal, type: 'object' },
        { id: 'cuscdw_agency_name_input_id', correct: agencyNameInputCorrect, val: agencyNameInputVal, type: 'agency' },
    ];

    /* - */

    const traduction = useRef(dataStoreRootControllerRef.current.traduction.current);

    const emptyColor = '#4B4E55';
    const correctColor = '#007aff';
    const errorColor = '#fa315a';

    const editionModeActive = useRef(false);

    const currentEditingAccountRef = useRef<any>(undefined);
    const currentEditingAccountData = useRef<any>(undefined);

    const currentEditingObjectRef = useRef<any>(undefined);
    const currentEditingObjectData = useRef<any>(undefined);

    const currentEditingAgencyRef = useRef<any>(undefined);
    const currentEditingAgencyData = useRef<any>(undefined);

    const canCreatingUpdatingAccount = useRef(true);
    const canCreatingUpdatingObject = useRef(true);
    const canCreatingUpdatingAgency = useRef(true);


    /* ------------------------------------ Methods ------------------------------------- */

    /* Add widget home: ref */
    const addRefIdFunc = (x: { wid: string, refId: any }) => {
        const wid = x.wid, refId = x.refId;
        refIdStore.current[wid] = refId;
        switch (wid) {
            case 'customerHomeDashboardRef': { customerHomeDashboardRef.current = refId.current } break;
            case 'customerProductDashboardRef': { customerProductDashboardRef.current = refId.current } break;
            case 'customerComplaintDashboardRef': { customerComplaintDashboardRef.current = refId.current } break;
            case 'customerConfigDashboardRef': { customerConfigDashboardRef.current = refId.current } break;

            case 'productDashboardMainRef': { productDashboardMainRef.current = refId.current } break;
            case 'productFeedListRef': { productFeedListRef.current = refId.current } break;
            case 'productFeedListControllerRef': { productFeedListControllerRef.current = refId.current } break;
            case 'productFeedSearchListRef': { productFeedSearchListRef.current = refId.current } break;
            case 'productFeedSearchListControllerRef': { productFeedSearchListControllerRef.current = refId.current } break;

            case 'complaintDashboardMainRef': { complaintDashboardMainRef.current = refId.current } break;
            case 'complaintDashboardControllerRef': { complaintDashboardControllerRef.current = refId.current } break;
            case 'complaintFeedListRef': { complaintFeedListRef.current = refId.current } break;
            case 'complaintFeedSearchListRef': { complaintFeedSearchListRef.current = refId.current } break;

            case 'configFeedAccountListRef': { configFeedAccountListRef.current = refId.current } break;
            case 'configFeedAccountListControllerRef': { configFeedAccountListControllerRef.current = refId.current } break;
            case 'configFeedObjectListRef': { configFeedObjectListRef.current = refId.current } break;
            case 'configFeedObjectListControllerRef': { configFeedObjectListControllerRef.current = refId.current } break;
            case 'configFeedAgencyListRef': { configFeedAgencyListRef.current = refId.current } break;
            case 'configFeedAgencyListControllerRef': { configFeedAgencyListControllerRef.current = refId.current } break;

            case 'customerConfigFormLoadingRef': { customerConfigFormLoadingRef.current = refId.current } break;

            case 'objectStatsFeedListRef': { objectStatsFeedListRef.current = refId.current } break;
            case 'objectStatsFeedListControllerRef': { objectStatsFeedListControllerRef.current = refId.current } break;
            case 'productStatsFeedListRef': { productStatsFeedListRef.current = refId.current } break;
            case 'productStatsFeedListControllerRef': { productStatsFeedListControllerRef.current = refId.current } break;

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

        let borderBottomColor = (len === 0) ? emptyColor : (len >= 2) ? correctColor : errorColor;
        let borderBottomColor2 = (len === 0) ? emptyColor : (len >= 8) ? correctColor : errorColor;

        switch (wid) {
            case 'ctmpdw_h_input_box_id': {
                productSearchText.current = lowerText;
                $('#ctmpdw_h_input_box_id').val(productSearchText.current);
                refId.current.findProductFunc({ text: productSearchText.current });
            } break;

            /* Admin account */

            case 'cuscdw_fullname_input_id': {
                aaFullnameInputVal.current = text.trimEnd();
                $('#cuscdw_fullname_input_id').val(text);
                $('#cuscdw_fullname_input_id').css({ 'border-bottom': `1px solid ${borderBottomColor}` });
                aaFullnameInputCorrect.current = (borderBottomColor === correctColor) ? true : false;
                $('#cuscdw_fullname_error_container').text(''); /* remove existing data error */
            } break;

            case 'cuscdw_username_input_id': {
                aaUsernameInputVal.current = lowerText.trimEnd();
                $('#cuscdw_username_input_id').val(aaUsernameInputVal.current);
                $('#cuscdw_username_input_id').css({ 'border-bottom': `1px solid ${borderBottomColor}` });
                aaUsernameInputCorrect.current = (borderBottomColor === correctColor) ? true : false;
                $('#cuscdw_username_error_container').text(''); /* remove existing data error */
            } break;

            case 'cuscdw_password_input_id': {
                aaPasswordInputVal.current = text;
                $('#cuscdw_password_input_id').val(text);
                $('#cuscdw_password_input_id').css({ 'border-bottom': `1px solid ${borderBottomColor2}` });
                aaPasswordInputCorrect.current = (borderBottomColor2 === correctColor) ? true : false;

                /* confirm check */
                if (aaConfirmInputVal.current.length > 0) {
                    const corr = (aaConfirmInputVal.current !== text) ? false : true;
                    $('#cuscdw_confirm_input_id').css({ 'border-bottom': `1px solid ${corr ? correctColor : errorColor}` });
                    aaConfirmInputCorrect.current = corr ? true : false;
                }
            } break;

            case 'cuscdw_confirm_input_id': {
                if (aaPasswordInputVal.current.length > 0 && (text !== aaPasswordInputVal.current)) borderBottomColor2 = errorColor;
                aaConfirmInputVal.current = text;
                $('#cuscdw_confirm_input_id').val(text);
                $('#cuscdw_confirm_input_id').css({ 'border-bottom': `1px solid ${borderBottomColor2}` });
                aaConfirmInputCorrect.current = (borderBottomColor2 === correctColor) ? true : false;
            } break;

            /* complaint object */

            case 'cuscdw_object_name_input_id': {
                objNameInputVal.current = text.trimEnd();
                $('#cuscdw_object_name_input_id').val(text);
                $('#cuscdw_object_name_input_id').css({ 'border-bottom': `1px solid ${borderBottomColor}` });
                objNameInputCorrect.current = (borderBottomColor === correctColor) ? true : false;
                $('#cuscdw_unknown_error_container').text('');
            } break;

            /* Agency */

            case 'cuscdw_agency_name_input_id': {
                agencyNameInputVal.current = text.trimEnd();
                $('#cuscdw_agency_name_input_id').val(text);
                $('#cuscdw_agency_name_input_id').css({ 'border-bottom': `1px solid ${borderBottomColor}` });
                agencyNameInputCorrect.current = (borderBottomColor === correctColor) ? true : false;
                $('#cuscdw_unknown_error_container').text('');
            } break;

            default: { _dev_ && console.warn(`unknown id "${wid}"`) };
        };

        refId.current.formCheckerFunc();
    };

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
        controllerRef?.current?.deleteRefIdFunc({ wid: wid, refId: refId });
    };







    /* account form checker */
    const formCheckerFunc = () => {
        let correct = false;

        /* - */
        const currentPageType = customerConfigDashboardRef.current.currentPageType.current;
        switch (currentPageType) {
            case 'account': {
                /* For account creation */
                if (!editionModeActive.current) {
                    const tab = formInputTab.findIndex((e) => e.correct.current === false && e.type === 'account');
                    correct = (tab === -1) ? true : false;
                }
                /* For account update */
                else {
                    const vtab = (aaPasswordInputVal.current.length > 0 || aaConfirmInputVal.current.length > 0) ? formInputTab : [formInputTab[0], formInputTab[1]];
                    const tab = vtab.findIndex((e) => e.correct.current === false);
                    correct = (tab === -1) ? true : false;
                }
            } break;

            case 'object': { correct = objNameInputCorrect.current ? true : false } break;

            case 'agency': { correct = agencyNameInputCorrect.current ? true : false } break;

            default: { };
        };

        /* - */
        $('#cuscdw_submit_btn_id').css({ opacity: correct ? 1 : 0.5 });
        canCreatingUpdatingAccount.current = correct ? true : false;
        canCreatingUpdatingObject.current = correct ? true : false;
        canCreatingUpdatingAgency.current = correct ? true : false;

        return correct;
    };

    /* Reset form */
    const resetFormFunc = () => {
        /* - */
        canCreatingUpdatingAccount.current = true;
        canCreatingUpdatingObject.current = true;
        canCreatingUpdatingAgency.current = true;

        /* Hide loading */
        customerConfigFormLoadingRef.current.showLoadingFunc({ show: false });

        /* Enable left menu btn */
        customerConfigDashboardRef.current.disableLeftMenuBtnFunc({ disable: false });

        /* Disactivate edition mode */
        editionModeActive.current = false;

        /* reset current editing account ref & data */
        currentEditingAccountRef.current = undefined;
        currentEditingAccountData.current = undefined;

        /* Reset input placeholder */
        $('#cuscdw_password_input_id').attr({ 'placeholder': 'Mot de passe' });

        /* Rename back submit btn into create */
        $('#cuscdw_submit_btn_id').text(traduction.current['t0025']);

        /* Reset form inputs */
        $('.cuscdw_input_box').val('');
        $('.cuscdw_input_box').css({ 'border-bottom': `1px solid ${emptyColor}` });
        formInputTab.forEach((e) => {
            e.correct.current = false;
            e.val.current = '';
        });
        refId.current.formCheckerFunc();
    };

    /* Show dashboard */
    const showDashboardFunc = (x: { type: 'home' | 'product' | 'complaint' | 'config' }) => {
        const target = dashboardTab[x.type];

        if (target.current !== undefined && currentDashboardType.current !== x.type) {
            target.current.showFunc({ show: true });
            (currentDashboardRef.current !== undefined) && currentDashboardRef.current.showFunc({ show: false });
            currentDashboardRef.current = target.current;
            currentDashboardType.current = x.type;

            /* - */
            switch (x.type) {
                case 'home': { if (!homeDashboardIsInitalized.current) refId.current.initDashboardFunc({ type: 'home' }) } break;
                case 'product': { if (!productDashboardIsInitalized.current) refId.current.initDashboardFunc({ type: 'product' }) } break;
                case 'complaint': { if (!complaintDashboardIsInitalized.current) refId.current.initDashboardFunc({ type: 'complaint' }) } break;
                case 'config': { if (!configDashboardIsInitalized.current) refId.current.initDashboardFunc({ type: 'config' }) } break;
                default: { };
            };
        }
    };







    /* Init dashboard */
    const initDashboardFunc = async (x: { type: 'home' | 'product' | 'complaint' | 'config' }) => {
        try {
            const currentCustomerData = dataStoreRootControllerRef.current.currentCustomerData;
            const domain = currentCustomerData.current.domain;

            switch (x.type) {
                /* home */
                case 'home': {
                    const statsParams = { domain: domain, year: new Date().getUTCFullYear() };
                    const otherParams = { domain: domain, state: 'new', timestamp_ms: 0 };
                    const params = { statsParams: statsParams, agencyParams: otherParams, productParams: otherParams, complaintObjectParams: otherParams };

                    /* req pg */
                    const res = await requestRootControllerRef.current.customerInitFetchFunc({ data: params });
                    if (res.status !== _success_) throw new Error(JSON.stringify(res));

                    console.log('home init ::', res.data);
                } break;


                /* product */
                case 'product': {
                    const tmp = dataStoreRootControllerRef.current.customerProductNewerTimestamp_ms.current;

                    /* - */
                    const data = { domain: domain, timestamp_ms: tmp, state: 'new' };
                    const product = await requestRootControllerRef.current.fetchProductFunc({ data: data });
                    const feed: any[] = product.data;

                    /* Store data into data store */
                    dataStoreRootControllerRef.current.setDataFunc({ type: 'customerProduct', data: feed });

                    /* Render feed */
                    productFeedListControllerRef.current.setDataFunc({ data: feed, position: 'top' });

                    /* - */
                    productDashboardIsInitalized.current = true;
                } break;


                /* complaint */
                case 'complaint': {
                    const tmp = dataStoreRootControllerRef.current.customerComplaintNewerTimestamp_ms.current;
                    const data = { domain: domain, timestamp_ms: tmp, state: 'new' };
                    complaintDashboardControllerRef.current.initFunc({ data: data });
                } break;


                /* config */
                case 'config': { } break;


                /* - */
                default: { };
            };

        } catch (e: any) { return catchErrorFunc({ err: e.message }) }
    };

    /* Init component */
    const initComponentFunc = async (x: { type: 'account' | 'object' | 'agency' }) => {
        try {
            const currentUserData = dataStoreRootControllerRef.current.currentUserData;
            const uid = currentUserData.current.id;
            const domain = currentUserData.current.domain;

            switch (x.type) {
                case 'account': {
                    configFeedAccountListControllerRef.current.showLoadingFunc({ show: true, position: 'top' });

                    const tmp = dataStoreRootControllerRef.current.customerAccountNewerTimestamp_ms.current;

                    /* Fetch customer admin account */
                    const data = { domain: domain, type: 'customer_admin', state: 'new', timestamp_ms: tmp };
                    const res = await requestRootControllerRef.current.fetchUsersFunc({ data: data });
                    if (res.status !== _success_) throw new Error(JSON.stringify(res));

                    /* - */
                    const resData: [] = res.data;

                    /* remove cuurent account from retrieved data */
                    const index = resData.findIndex((e: any) => e.id === uid);
                    if (index !== -1) resData.splice(index, 1);

                    /* Get accounts */
                    const accounts: any[] = [currentUserData.current, ...resData];

                    /* store data in data store */
                    dataStoreRootControllerRef.current.setDataFunc({ type: 'customerAccount', data: accounts });

                    /* render accounts */
                    configFeedAccountListControllerRef.current.setDataFunc({ data: accounts, position: 'top' });

                    /* hide laoding */
                    configFeedAccountListControllerRef.current.showLoadingFunc({ show: false, position: 'top' });

                } break;

                case 'object': {
                    configFeedObjectListControllerRef.current.showLoadingFunc({ show: true, position: 'top' });

                    const tmp = dataStoreRootControllerRef.current.customerComplaintObjectNewerTimestamp_ms.current;

                    /* Fecth complaint object */
                    const data = { domain: domain, state: 'new', timestamp_ms: tmp };
                    const res = await requestRootControllerRef.current.fetchComplaintObjectFunc({ data: data });
                    if (res.status !== _success_) throw new Error(JSON.stringify(res));

                    /* - */
                    const dt: any[] = res.data;

                    /* If no data found, send msg and stop code */
                    if (dt.length === 0) {
                        configFeedObjectListControllerRef.current.showLoadingFunc({ show: false, position: 'top' });
                        configFeedObjectListControllerRef.current.displayMessageFunc({ text: traduction.current['t0043'], position: 'top' });
                        return;
                    }

                    /* Store data in data store */
                    dataStoreRootControllerRef.current.setDataFunc({ type: 'customerComplaintObject', data: dt });
                    console.log('data ::', dataStoreRootControllerRef.current.customerComplaintObjectData.current);

                    /* Render object */
                    configFeedObjectListControllerRef.current.setDataFunc({ data: dt, position: 'top' });

                    /* Hide loading */
                    configFeedObjectListControllerRef.current.showLoadingFunc({ show: false, position: 'top' });

                } break;

                case 'agency': {
                    configFeedAgencyListControllerRef.current.showLoadingFunc({ show: true, position: 'top' });

                    const tmp = dataStoreRootControllerRef.current.customerAgencyNewerTimestamp_ms.current;

                    /* Fecth complaint object */
                    const data = { domain: domain, state: 'new', timestamp_ms: tmp };
                    const res = await requestRootControllerRef.current.fetchAgencyFunc({ data: data });
                    if (res.status !== _success_) throw new Error(JSON.stringify(res));

                    /* - */
                    const dt: any[] = res.data;

                    /* - */
                    if (dt.length === 0) {
                        configFeedAgencyListControllerRef.current.showLoadingFunc({ show: false, position: 'top' });
                        configFeedAgencyListControllerRef.current.displayMessageFunc({ text: traduction.current['t0046'], position: 'top' });
                        return;
                    }

                    /* Store data in data store */
                    dataStoreRootControllerRef.current.setDataFunc({ type: 'customerAgency', data: dt });

                    /* Render object */
                    configFeedAgencyListControllerRef.current.setDataFunc({ data: dt, position: 'top' });

                    /* Hide loading */
                    configFeedAgencyListControllerRef.current.showLoadingFunc({ show: false, position: 'top' });

                } break;

                default: { _dev_ && console.error(`Unknown type "${x.type}"`) };
            };

        } catch (e: any) { }
    };

    /* Handle existing data error */
    const handleExistingDataErrorFunc = (x: { error: any }) => {
        const err = catchErrorFunc({ err: x.error });
        const dataIsJson: any = isJsonFunc({ data: err.data });
        if (dataIsJson.status === _success_ && dataIsJson.data.type === 'array') {
            const tab = dataIsJson.data.parsedData;
            tab.forEach((e: string) => {
                if (e === _fullnameExists_) {
                    aaFullnameInputCorrect.current = false;
                    $('#cuscdw_fullname_input_id').css({ 'border-bottom': `1px solid ${errorColor}` });
                    $('#cuscdw_fullname_error_container').text(traduction.current['t0027']);

                } else if (e === _usernameExists_) {
                    aaUsernameInputCorrect.current = false;
                    $('#cuscdw_username_input_id').css({ 'border-bottom': `1px solid ${errorColor}` });
                    $('#cuscdw_username_error_container').text(traduction.current['t0028']);

                } else if (e === _complaintObjectExists_) {
                    $('#cuscdw_object_name_input_id').css({ 'border-bottom': `1px solid ${errorColor}` });
                    $('#cuscdw_unknown_error_container').text(traduction.current['t0044']);

                } else if (e === _agencyExists_) {
                    $('#cuscdw_agency_name_input_id').css({ 'border-bottom': `1px solid ${errorColor}` });
                    $('#cuscdw_unknown_error_container').text(traduction.current['t0045']);

                } else { }
            });

            /* Disable submit action */
            $('#cuscdw_submit_btn_id').css({ opacity: 0.5 });
            canCreatingUpdatingAccount.current = false;
            canCreatingUpdatingObject.current = false;
            canCreatingUpdatingAgency.current = false;

        } else {
            /* Unknown error */
            $('#cuscdw_unknown_error_container').text(traduction.current['t0016']);
        }
    };







    /* Add product */
    const addProductFunc = () => {
        const currentCustomerData = dataStoreRootControllerRef.current.currentCustomerData;
        const id = currentCustomerData.current.id;
        const domain = currentCustomerData.current.domain;

        const productCreationMainRef: refIdType = mainRootControllerRef.current.productCreationMainRef;
        productCreationMainRef.current.showFunc({ show: true, currentControllerRef: refId, customerId: id, customerDomain: domain });
    };

    /* On product created  */
    const onProductCreatedFunc = (x: { data: any }) => { productFeedListControllerRef.current.setDataFunc({ data: [x.data], position: 'top' }) };

    /* Find product */
    const findProductFunc = async (x: { text: string }) => {
        try {
            const text = x.text;
            const len = text.length;

            productDashboardMainRef.current.showSearchListFunc({ show: (len > 0) ? true : false });
            productFeedSearchListControllerRef.current.showLoadingFunc({ show: (len > 0) ? true : false, position: 'top' });

            if (len > 0) {
                /* Find product */
                const productTab: any[] = dataStoreRootControllerRef.current.customerProductData.current;
                const res = productTab.filter((e: any, i: number) => (e.name).includes(text) === true);
                if (res.length > 0) {
                    const tab = (res.length > 1) ? res.sort((a: any, b: any) => sortStringFunc({ a: a.name, b: b.name })) : res;
                    productFeedSearchListControllerRef.current.resetListFunc();
                    setTimeout(() => { productFeedSearchListControllerRef.current.setDataFunc({ data: tab, position: 'top' }) }, 60);

                    /* Hide top loading */
                    timer.current = setTimeout(() => { productFeedSearchListControllerRef.current.showLoadingFunc({ show: false, position: 'top' }) }, 300);
                } else {
                    productFeedSearchListControllerRef.current.resetListFunc();
                    setTimeout(() => {
                        productFeedSearchListControllerRef.current.showLoadingFunc({ show: false, position: 'top' });
                        productFeedSearchListControllerRef.current.displayMessageFunc({ text: traduction.current['t0040'], position: 'top' });
                    }, 60);
                    _dev_ && console.log('nothing found');
                }

            } else {
                productFeedSearchListControllerRef.current.showLoadingFunc({ show: false, position: 'top' });
                productFeedSearchListControllerRef.current.displayMessageFunc({ text: '', position: 'top' });
                productFeedSearchListControllerRef.current.resetListFunc();
            }

        } catch (e: any) {
            const err = catchErrorFunc({ err: e.message });
        }
    };

    /* Select product */
    const selectProductFunc = (x: { wid: string, targetRef: refIdType }) => {
        if (currentProductSelectedRef.current !== undefined) currentProductSelectedRef.current.selectFunc({ select: false });
        (x.targetRef).current.selectFunc({ select: true });

        currentProductSelectedWid.current = x.wid;
        currentProductSelectedRef.current = (x.targetRef).current;
    };







    /* Add complaint */
    const addComplaintFunc = () => {
        const currentCustomerData = dataStoreRootControllerRef.current.currentCustomerData;
        const id = currentCustomerData.current.id;
        const domain = currentCustomerData.current.domain;

        const complaintCreationRef: refIdType = mainRootControllerRef.current.complaintCreationRef;
        complaintCreationRef.current.showFunc({ show: true, currentControllerRef: complaintDashboardControllerRef, customerId: id, customerDomain: domain });
    };

    /* On complaint creation */
    // const onComplaintCreatedFunc = (x: { data: any }) => { complaintFeedLisControllerRef.current.setDataFunc({ data: [x.data], position: 'top' }) };







    /* Create admin account */
    const createAccountFunc = async () => {
        /* Check if can create or update data */
        if (canCreatingUpdatingAccount.current) {
            canCreatingUpdatingAccount.current = false;

            /* Check form is correct */
            const check = refId.current.formCheckerFunc();
            if (!check) {
                canCreatingUpdatingAccount.current = true;
                return;
            }

            /* Update account instead if editionModeActive is true */
            if (editionModeActive.current) {
                refId.current.updateAccountFunc();
                return;
            }


            try {
                /* Show loading */
                customerConfigFormLoadingRef.current.showLoadingFunc({ show: true });

                /* Disable left menu btn */
                customerConfigDashboardRef.current.disableLeftMenuBtnFunc({ disable: true });

                const domain = dataStoreRootControllerRef.current.currentUserData.current.domain;

                const data = { id: generateIdFunc(), fullname: aaFullnameInputVal.current, username: aaUsernameInputVal.current, ssm: aaPasswordInputVal.current, rights: {}, type: 'customer_admin', domain: domain };
                const res = await requestRootControllerRef.current.createAccountFunc({ type: 'customer_admin', data: data });
                if (res.status !== _success_) throw new Error(JSON.stringify({ status: _requestFailed_, data: res.data }));

                /* - */
                const userData = res.data.userData;
                const accountData = res.data.accountData;
                const dt = [Object.assign(accountData, userData)];

                /* Store data in dataStore */
                dataStoreRootControllerRef.current.setDataFunc({ type: 'customerAccount', data: dt });

                /* Render created account */
                configFeedAccountListControllerRef.current.setDataFunc({ data: dt, position: 'top' });

                /* reset form */
                refId.current.resetFormFunc();

            } catch (e: any) {
                canCreatingUpdatingAccount.current = true;

                /* Hide loading */
                customerConfigFormLoadingRef.current.showLoadingFunc({ show: false });

                /* Enable left menu btn */
                customerConfigDashboardRef.current.disableLeftMenuBtnFunc({ disable: false });

                /* handle existing data error */
                handleExistingDataErrorFunc({ error: e.message });
            }
        }
    };

    /* Edit account */
    const editAccountFunc = (x: { edit: boolean, targetRef: refIdType, data?: any }) => {
        const targetRef = x.targetRef;
        if (x.edit) {
            const data = x.data;

            /* set current editing account data */
            currentEditingAccountData.current = data;

            /* Disable edit mode if another el is already selected */
            if (currentEditingAccountRef.current !== undefined) currentEditingAccountRef.current.setEditModeFunc({ edit: false });

            /* Activate edition mode */
            editionModeActive.current = true;

            /* Set edit mode and store el ref  */
            targetRef.current.setEditModeFunc({ edit: true });

            /* Store wid & refId */
            currentEditingAccountRef.current = targetRef.current;

            /* Set data into form */
            formInputTab.forEach((e) => {
                if (e.id === 'cuscdw_fullname_input_id') { /* fullname */
                    $(`#${e.id}`).val(data.fullname);
                    $(`#${e.id}`).css({ 'border-bottom': `1px solid ${correctColor}` });
                    e.correct.current = true;
                    e.val.current = data.fullname;
                } else if (e.id === 'cuscdw_username_input_id') { /* username */
                    $(`#${e.id}`).val(data.username);
                    $(`#${e.id}`).css({ 'border-bottom': `1px solid ${correctColor}` });
                    e.correct.current = true;
                    e.val.current = data.username;
                }
            });

            /* Change password input placeholder */
            $('#cuscdw_password_input_id').attr({ 'placeholder': 'Nouveau mot de passe' });

            /* Rename submit btn into modify */
            $('#cuscdw_submit_btn_id').text(traduction.current['t0013']);

            /* Set submit btn opacity to 1 */
            $('#cuscdw_submit_btn_id').css({ opacity: 1 });

            /* Disable left menu btn */
            customerConfigDashboardRef.current.disableLeftMenuBtnFunc({ disable: true });

        } else {
            /* Disable edit mode */
            targetRef.current.setEditModeFunc({ edit: false });

            /* reset form */
            refId.current.resetFormFunc();

            /* Enable left menu btn */
            customerConfigDashboardRef.current.disableLeftMenuBtnFunc({ disable: false });
        }
    };

    /* update account */
    const updateAccountFunc = async () => {
        try {
            /* Stop operation if new data is equal to old data */
            if (aaFullnameInputVal.current === currentEditingAccountData.current.fullname && aaUsernameInputVal.current === currentEditingAccountData.current.username && (aaPasswordInputVal.current.length === 0 && aaConfirmInputVal.current.length === 0)) {
                customerConfigDashboardRef.current.disableLeftMenuBtnFunc({ disable: false });
                currentEditingAccountRef.current.setEditModeFunc({ edit: false });
                refId.current.resetFormFunc();
                return;
            }

            /* Show loading */
            customerConfigFormLoadingRef.current.showLoadingFunc({ show: true });

            /* Disable left menu btn */
            customerConfigDashboardRef.current.disableLeftMenuBtnFunc({ disable: true });

            /* - */
            const curr = currentEditingAccountData.current;
            const data = {
                id: curr.id,
                fullname: aaFullnameInputVal.current,
                username: aaUsernameInputVal.current,
                ssm: (aaPasswordInputVal.current.length >= 8 && aaConfirmInputCorrect.current) ? aaPasswordInputVal.current : curr.ssm,
                type: curr.type,
                domain: curr.domain
            };
            const res = await requestRootControllerRef.current.updateAccountFunc({ type: 'customer_admin', data: data });
            if (res.status !== _success_) throw new Error(JSON.stringify(res));

            /* new account data */
            const newAccountData = Object.assign(currentEditingAccountData.current, data);

            /* Update data into data store  */
            dataStoreRootControllerRef.current.setDataFunc({ type: 'customerAccount', data: [newAccountData], update: true });

            /* Update component */
            currentEditingAccountRef.current.updateDataFunc({ data: newAccountData });

            /* ------ Reset ------ */

            /* Disable edit mode */
            currentEditingAccountRef.current.setEditModeFunc({ edit: false });

            /* Reset form */
            refId.current.resetFormFunc();

        } catch (e: any) {
            canCreatingUpdatingAccount.current = true;

            /* Hide loading */
            customerConfigFormLoadingRef.current.showLoadingFunc({ show: false });

            /* handle existing data error */
            handleExistingDataErrorFunc({ error: e.message });
        }
    };

    /* Delet account */
    const deleteAccountFunc = async (x: { targetWid: string, data: any }) => {
        /* Ask user to confirm deletion */
        const canDelete = window.confirm(`${traduction.current['t0042']}`);
        if (!canDelete) return false;

        try {
            /* Then delete account */
            const $target = $(`#${x.targetWid}`);
            const res = await requestRootControllerRef.current.deleteAccountFunc({ data: x.data });
            if (res.status !== _success_) throw new Error(JSON.stringify(res));

            /* Remove data from data store */
            dataStoreRootControllerRef.current.removeDataFunc({ type: 'customerAccount', data: [x.data] });

            /* Delete el from DOM */
            $target.hide();

            return true;

        } catch (e: any) {
            // const err = catchErrorFunc({ err: e.message });
            return false;
        }
    };







    /* Create object*/
    const createObjectFunc = async () => {
        if (canCreatingUpdatingObject.current) {
            canCreatingUpdatingObject.current = false;

            /* Check form is correct */
            const check = refId.current.formCheckerFunc();
            if (!check) {
                canCreatingUpdatingObject.current = true;
                return;
            }

            /* Update object instead if editionModeActive is true */
            if (editionModeActive.current) {
                refId.current.updateObjectFunc();
                return;
            }

            try {
                /* Show loading */
                customerConfigFormLoadingRef.current.showLoadingFunc({ show: true });

                /* Disable left menu btn */
                customerConfigDashboardRef.current.disableLeftMenuBtnFunc({ disable: true });

                /* current customer */
                const currentCustomerData = dataStoreRootControllerRef.current.currentCustomerData;
                const id = currentCustomerData.current.id;
                const domain = currentCustomerData.current.domain;

                const data = { id: generateIdFunc(), customerId: id, domain: domain, name: objNameInputVal.current };
                const res = await requestRootControllerRef.current.createComplaintObjectFunc({ data: data });
                if (res.status !== _success_) throw new Error(JSON.stringify(res));

                const resData = [res.data];

                /* store in data store */
                dataStoreRootControllerRef.current.setDataFunc({ type: 'customerComplaintObject', data: resData });

                /* Render data */
                configFeedObjectListControllerRef.current.setDataFunc({ data: resData, position: 'top' });

                /* Hide loading */
                customerConfigFormLoadingRef.current.showLoadingFunc({ show: false });

                /* Reset form */
                refId.current.resetFormFunc();

            } catch (e: any) {
                canCreatingUpdatingObject.current = true;

                /* Hide loading */
                customerConfigFormLoadingRef.current.showLoadingFunc({ show: false });

                /* Enable left menu btn */
                customerConfigDashboardRef.current.disableLeftMenuBtnFunc({ disable: false });

                /* handle existing data error */
                handleExistingDataErrorFunc({ error: e.message });
            }
        }
    };

    /* Edit object */
    const editObjectFunc = (x: { edit: boolean, targetRef: refIdType, data?: any }) => {
        const targetRef = x.targetRef;
        if (x.edit) {
            const data = x.data;

            /* set current editing object data */
            currentEditingObjectData.current = data;

            /* Disable edit mode if another el is already selected */
            if (currentEditingObjectRef.current !== undefined) currentEditingObjectRef.current.setEditModeFunc({ edit: false });

            /* Activate edition mode */
            editionModeActive.current = true;

            /* Set edit mode and store el ref  */
            targetRef.current.setEditModeFunc({ edit: true });

            /* Store wid & refId */
            currentEditingObjectRef.current = targetRef.current;

            /* Set data into form */
            $('#cuscdw_object_name_input_id').val(data.name);
            $('#cuscdw_object_name_input_id').css({ 'border-bottom': `1px solid ${correctColor}` });
            objNameInputCorrect.current = true;
            objNameInputVal.current = data.name;

            /* Rename submit btn into modify */
            $('#cuscdw_submit_btn_id').text(traduction.current['t0013']);

            /* Set submit btn opacity to 1 */
            $('#cuscdw_submit_btn_id').css({ opacity: 1 });

            /* Disable left menu btn */
            customerConfigDashboardRef.current.disableLeftMenuBtnFunc({ disable: true });

        } else {
            /* Disable edit mode */
            targetRef.current.setEditModeFunc({ edit: false });

            /* reset form */
            refId.current.resetFormFunc();

            /* Enable left menu btn */
            customerConfigDashboardRef.current.disableLeftMenuBtnFunc({ disable: false });
        }
    };

    /* Update object */
    const updateObjectFunc = async () => {
        try {
            /* Stop operation if new data is equal to old data */
            if (objNameInputVal.current === currentEditingObjectData.current.name) {
                customerConfigDashboardRef.current.disableLeftMenuBtnFunc({ disable: false });
                currentEditingObjectRef.current.setEditModeFunc({ edit: false });
                refId.current.resetFormFunc();
                return;
            }

            /* Show loading */
            customerConfigFormLoadingRef.current.showLoadingFunc({ show: true });

            /* Disable left menu btn */
            customerConfigDashboardRef.current.disableLeftMenuBtnFunc({ disable: true });

            const data = { id: currentEditingObjectData.current.id, name: objNameInputVal.current, domain: currentEditingObjectData.current.domain };
            const res = await requestRootControllerRef.current.updateComplaintObjectFunc({ data: data });
            if (res.status !== _success_) throw new Error(JSON.stringify(res));

            /* new object data */
            const newObjectData = Object.assign(currentEditingObjectData.current, { name: objNameInputVal.current });

            /* Update data into data store  */
            dataStoreRootControllerRef.current.setDataFunc({ type: 'customerComplaintObject', data: [newObjectData], update: true });

            /* Update component */
            currentEditingObjectRef.current.updateDataFunc({ data: newObjectData });

            /* ------ Reset ------ */

            /* Disable edit mode */
            currentEditingObjectRef.current.setEditModeFunc({ edit: false });

            /* Reset form */
            refId.current.resetFormFunc();

        } catch (e: any) {
            canCreatingUpdatingObject.current = true;

            /* Hide loading */
            customerConfigFormLoadingRef.current.showLoadingFunc({ show: false });

            /* handle existing data error */
            handleExistingDataErrorFunc({ error: e.message });
        }
    };

    /* Delete object */
    const deleteObjectFunc = async (x: { targetWid: string, data: { id: string, daomain: string } }) => {
        /* Ask user to confirm deletion */
        const canDelete = window.confirm(`${traduction.current['t0042']}`);
        if (!canDelete) return false;

        try {
            /* Then delete object */
            const $target = $(`#${x.targetWid}`);
            const res = await requestRootControllerRef.current.deleteComplaintObjectFunc({ data: x.data });
            if (res.status !== _success_) throw new Error(JSON.stringify(res));

            /* Remove data from data store */
            dataStoreRootControllerRef.current.removeDataFunc({ type: 'customerComplaintObject', data: [x.data] });

            /* Delete el from DOM */
            $target.hide();

            return true;

        } catch (e: any) {
            // const err = catchErrorFunc({ err: e.message });
            return false;
        }
    };







    /* Create agency*/
    const createAgencyFunc = async () => {
        if (canCreatingUpdatingAgency.current) {
            canCreatingUpdatingAgency.current = false;

            /* Check form is correct */
            const check = refId.current.formCheckerFunc();
            if (!check) {
                canCreatingUpdatingAgency.current = true;
                return;
            }

            /* Update agence instead if editionModeActive is true */
            if (editionModeActive.current) {
                refId.current.updateAgencyFunc();
                return;
            }

            /* - */
            try {
                /* Show loading */
                customerConfigFormLoadingRef.current.showLoadingFunc({ show: true });

                /* Disable left menu btn */
                customerConfigDashboardRef.current.disableLeftMenuBtnFunc({ disable: true });

                /* current customer */
                const currentCustomerData = dataStoreRootControllerRef.current.currentCustomerData;
                const id = currentCustomerData.current.id;
                const domain = currentCustomerData.current.domain;

                const data = { id: generateIdFunc(), customerId: id, domain: domain, name: agencyNameInputVal.current };
                const res = await requestRootControllerRef.current.createAgencyFunc({ data: data });
                if (res.status !== _success_) throw new Error(JSON.stringify(res));

                const resData = [res.data];

                /* store in data store */
                dataStoreRootControllerRef.current.setDataFunc({ type: 'customerAgency', data: resData });

                /* Render data */
                configFeedAgencyListControllerRef.current.setDataFunc({ data: resData, position: 'top' });

                /* Hide loading */
                customerConfigFormLoadingRef.current.showLoadingFunc({ show: false });

                /* Reset form */
                refId.current.resetFormFunc();

            } catch (e: any) {
                canCreatingUpdatingAgency.current = true;

                /* Hide loading */
                customerConfigFormLoadingRef.current.showLoadingFunc({ show: false });

                /* Enable left menu btn */
                customerConfigDashboardRef.current.disableLeftMenuBtnFunc({ disable: false });

                /* handle existing data error */
                handleExistingDataErrorFunc({ error: e.message });
            }
        }
    };

    /* Edit agency */
    const editAgencyFunc = (x: { edit: boolean, targetRef: refIdType, data?: any }) => {
        const targetRef = x.targetRef;
        if (x.edit) {
            const data = x.data;

            /* set current editing agency data */
            currentEditingAgencyData.current = data;

            /* Disable edit mode if another el is already selected */
            if (currentEditingAgencyRef.current !== undefined) currentEditingAgencyRef.current.setEditModeFunc({ edit: false });

            /* Activate edition mode */
            editionModeActive.current = true;

            /* Set edit mode and store el ref  */
            targetRef.current.setEditModeFunc({ edit: true });

            /* Store wid & refId */
            currentEditingAgencyRef.current = targetRef.current;

            /* Set data into form */
            $('#cuscdw_agency_name_input_id').val(data.name);
            $('#cuscdw_agency_name_input_id').css({ 'border-bottom': `1px solid ${correctColor}` });
            agencyNameInputCorrect.current = true;
            agencyNameInputVal.current = data.name;

            /* Rename submit btn into modify */
            $('#cuscdw_submit_btn_id').text(traduction.current['t0013']);

            /* Set submit btn opacity to 1 */
            $('#cuscdw_submit_btn_id').css({ opacity: 1 });

            /* Disable left menu btn */
            customerConfigDashboardRef.current.disableLeftMenuBtnFunc({ disable: true });

        } else {
            /* Disable edit mode */
            targetRef.current.setEditModeFunc({ edit: false });

            /* reset form */
            refId.current.resetFormFunc();

            /* Enable left menu btn */
            customerConfigDashboardRef.current.disableLeftMenuBtnFunc({ disable: false });
        }
    };

    /* Update agency */
    const updateAgencyFunc = async () => {
        try {
            /* Stop operation if new data is equal to old data */
            if (agencyNameInputVal.current === currentEditingAgencyData.current.name) {
                customerConfigDashboardRef.current.disableLeftMenuBtnFunc({ disable: false });
                currentEditingAgencyRef.current.setEditModeFunc({ edit: false });
                refId.current.resetFormFunc();
                return;
            }

            /* Show loading */
            customerConfigFormLoadingRef.current.showLoadingFunc({ show: true });

            /* Disable left menu btn */
            customerConfigDashboardRef.current.disableLeftMenuBtnFunc({ disable: true });

            const data = { id: currentEditingAgencyData.current.id, name: agencyNameInputVal.current, domain: currentEditingAgencyData.current.domain };
            const res = await requestRootControllerRef.current.updateAgencyFunc({ data: data });
            if (res.status !== _success_) throw new Error(JSON.stringify(res));

            /* new agency data */
            const newAgencyData = Object.assign(currentEditingAgencyData.current, { name: agencyNameInputVal.current });

            /* Update data into data store  */
            dataStoreRootControllerRef.current.setDataFunc({ type: 'customerAgency', data: [newAgencyData], update: true });

            /* Update component */
            currentEditingAgencyRef.current.updateDataFunc({ data: newAgencyData });

            /* ------ Reset ------ */

            /* Disable edit mode */
            currentEditingAgencyRef.current.setEditModeFunc({ edit: false });

            /* Reset form */
            refId.current.resetFormFunc();

        } catch (e: any) {
            canCreatingUpdatingAgency.current = true;

            /* Hide loading */
            customerConfigFormLoadingRef.current.showLoadingFunc({ show: false });

            /* handle existing data error */
            handleExistingDataErrorFunc({ error: e.message });
        }
    };

    /* Delete agency */
    const deleteAgencyFunc = async (x: { targetWid: string, data: { id: string, daomain: string } }) => {
        /* Ask user to confirm deletion */
        const canDelete = window.confirm(`${traduction.current['t0042']}`);
        if (!canDelete) return false;

        try {
            /* Then delete object */
            const $target = $(`#${x.targetWid}`);
            const res = await requestRootControllerRef.current.deleteAgencyFunc({ data: x.data });
            if (res.status !== _success_) throw new Error(JSON.stringify(res));

            /* Remove data from data store */
            dataStoreRootControllerRef.current.removeDataFunc({ type: 'customerAgency', data: [x.data] });

            /* Delete el from DOM */
            $target.hide();

            return true;

        } catch (e: any) {
            // const err = catchErrorFunc({ err: e.message });
            return false;
        }
    };







    /* Set complaint object stats data */
    const setComplaintObjectStatsDataFunc = (x: { data: any[] }) => {
        objectStatsFeedListControllerRef.current.setDataFunc({ data: x.data, position: 'top' });
    };

    /* Set product stats data */
    const setProductStatsDataFunc = (x: { data: any[] }) => {
        productStatsFeedListControllerRef.current.setDataFunc({ data: x.data, position: 'top' });
    };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        productSearchText: productSearchText,

        addRefIdFunc(x: any) { addRefIdFunc(x) },
        deleteRefIdFunc(x: any) { deleteRefIdFunc(x) },
        setTextValueFunc(x: any) { setTextValueFunc(x) },

        formCheckerFunc() { return formCheckerFunc() },
        showDashboardFunc(x: any) { showDashboardFunc(x) },

        initDashboardFunc(x: any) { initDashboardFunc(x) },
        initComponentFunc(x: any) { initComponentFunc(x) },

        resetFormFunc() { resetFormFunc() },

        addProductFunc() { addProductFunc() },
        onProductCreatedFunc(x: any) { onProductCreatedFunc(x) },
        findProductFunc(x: any) { findProductFunc(x) },
        selectProductFunc(x: any) { selectProductFunc(x) },

        addComplaintFunc() { addComplaintFunc() },

        createAccountFunc() { createAccountFunc() },
        editAccountFunc(x: any) { editAccountFunc(x) },
        updateAccountFunc() { updateAccountFunc() },
        deleteAccountFunc(x: any) { return deleteAccountFunc(x) },

        createObjectFunc() { createObjectFunc() },
        editObjectFunc(x: any) { editObjectFunc(x) },
        updateObjectFunc() { updateObjectFunc() },
        deleteObjectFunc(x: any) { return deleteObjectFunc(x) },

        createAgencyFunc() { createAgencyFunc() },
        editAgencyFunc(x: any) { editAgencyFunc(x) },
        updateAgencyFunc() { updateAgencyFunc() },
        deleteAgencyFunc(x: any) { return deleteAgencyFunc(x) },

        setComplaintObjectStatsDataFunc(x: any) { setComplaintObjectStatsDataFunc(x) },
        setProductStatsDataFunc(x: any) { setProductStatsDataFunc(x) },
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
    });


    /* Return */
    return (<></>);

}); export default memo(CustomerMainControllerWidget);
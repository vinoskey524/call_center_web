/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import { refIdType } from '../../Tools/type';
import { _defaultLanguage_, _success_ } from '../../Tools/constants';
import { language } from '../../Tools/language';
import { catchErrorFunc, generateIdFunc, replaceConsecutiveSpacesByOneFunc } from '../../Tools/methodForest';

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
const ComplaintCreationControllerWidget = (props: propsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const parentProps = props;

    const windowWidth = useRef(window.innerWidth);

    const windowHeight = useRef(window.innerHeight);

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

    const complaintNameInputRef = useRef<any>(undefined);
    const isComplaintNameInputCorrect = useRef(false);

    const complaintPhoneInputRef = useRef<any>(undefined);
    const isComplaintPhoneInputCorrect = useRef(false);

    const complaintLocationInputRef = useRef<any>(undefined);
    const isComplaintLocationInputCorrect = useRef(false);

    const complaintObjectInputRef = useRef<any>(undefined);
    const isComplaintObjectInputCorrect = useRef(false);

    const complaintProductInputRef = useRef<any>(undefined);
    const isComplaintProductInputCorrect = useRef(false);

    const complaintAgencyInputRef = useRef<any>(undefined);
    const isComplaintAgencyInputCorrect = useRef(false);

    const complaintDescInputRef = useRef<any>(undefined);
    const isComplaintDescInputCorrect = useRef(false);

    const complaintTopLoadingRef = useRef<any>(undefined);

    /* - */

    const inputTab = [
        { id: 'name', refId: complaintNameInputRef, isCorrect: isComplaintNameInputCorrect },
        { id: 'phone', refId: complaintPhoneInputRef, isCorrect: isComplaintPhoneInputCorrect },
        { id: 'location', refId: complaintLocationInputRef, isCorrect: isComplaintLocationInputCorrect },
        { id: 'object', refId: complaintObjectInputRef, isCorrect: isComplaintObjectInputCorrect },
        { id: 'product', refId: complaintProductInputRef, isCorrect: isComplaintProductInputCorrect },
        { id: 'agence', refId: complaintAgencyInputRef, isCorrect: isComplaintAgencyInputCorrect },
        { id: 'desc', refId: complaintDescInputRef, isCorrect: isComplaintDescInputCorrect }
    ];

    const emptyRef = useRef(undefined);

    const currentControllerRef = useRef<any>(undefined);
    const customerId = useRef<any>(undefined);
    const customerDomain = useRef<any>(undefined);

    const canCreateComplaint = useRef(true);
    const complaintData = useRef({ clientName: '', clientPhone: '', clientLocation: '', object: '', product: '', agency: '', description: '' });


    /* ------------------------------------ Methods ------------------------------------- */

    /* Add widget ref */
    const addWidgetRefFunc = (x: { wid: string, refId: any }) => {
        const wid = x.wid, refId = x.refId;
        switch (wid) {
            case 'complaintTopLoadingRef': { complaintTopLoadingRef.current = refId.current } break;

            case 'complaintNameInputRef': { complaintNameInputRef.current = refId.current } break;
            case 'complaintPhoneInputRef': { complaintPhoneInputRef.current = refId.current } break;
            case 'complaintLocationInputRef': { complaintLocationInputRef.current = refId.current } break;

            case 'complaintObjectInputRef': { complaintObjectInputRef.current = refId.current } break;
            case 'complaintProductInputRef': { complaintProductInputRef.current = refId.current } break;
            case 'complaintAgencyInputRef': { complaintAgencyInputRef.current = refId.current } break;
            case 'complaintDescInputRef': { complaintDescInputRef.current = refId.current } break;

            default: { };
        };
    };

    /* Set text value from inputs */
    const setTextValueFunc = (x: { wid: string, text: string }) => {
        const wid = x.wid, t = (x.text).replaceAll("'", '’').trimStart(), text = replaceConsecutiveSpacesByOneFunc(t), len = text.length;
        const lowerText = text.toLowerCase(), upperText = text.toUpperCase();
        switch (wid) {
            case 'complaintNameInputRef': {
                const state = (len >= 2) ? 'correct' : 'empty';
                isComplaintNameInputCorrect.current = (state == 'correct') ? true : false;
                complaintNameInputRef.current.setInputStateFunc({ state: state });
                complaintNameInputRef.current.setTextFunc({ text: text });
                complaintData.current.clientName = text.trimEnd();
            } break;

            case 'complaintPhoneInputRef': {
                const state = (len >= 8) ? 'correct' : 'empty';
                isComplaintPhoneInputCorrect.current = (state == 'correct') ? true : false;
                complaintPhoneInputRef.current.setTextFunc({ text: text });
                complaintPhoneInputRef.current.setInputStateFunc({ state: state });
                complaintData.current.clientPhone = text.trimEnd();
            } break;

            case 'complaintLocationInputRef': {
                const state = (len >= 2) ? 'correct' : 'optional';
                isComplaintLocationInputCorrect.current = (state == 'correct') ? true : false;
                complaintLocationInputRef.current.setTextFunc({ text: text });
                complaintLocationInputRef.current.setInputStateFunc({ state: state });
                complaintData.current.clientLocation = text.trimEnd();
            } break;

            case 'complaintObjectInputRef': {
                const state = (text !== '...') ? 'correct' : 'empty';
                isComplaintObjectInputCorrect.current = (state == 'correct') ? true : false;
                complaintObjectInputRef.current.setInputStateFunc({ state: state });
                complaintData.current.object = text;
            } break;

            case 'complaintProductInputRef': {
                const state = (text !== '...') ? 'correct' : 'empty';
                isComplaintProductInputCorrect.current = (state == 'correct') ? true : false;
                complaintProductInputRef.current.setInputStateFunc({ state: state });
                complaintData.current.product = text;
            } break;

            case 'complaintAgencyInputRef': {
                const state = (text !== '...') ? 'correct' : 'empty';
                isComplaintAgencyInputCorrect.current = (state == 'correct') ? true : false;
                complaintAgencyInputRef.current.setInputStateFunc({ state: state });
                complaintData.current.agency = text;
            } break;

            case 'complaintDescInputRef': {
                const state = (len >= 2) ? 'correct' : 'empty';
                isComplaintDescInputCorrect.current = (state == 'correct') ? true : false;
                complaintDescInputRef.current.setInputStateFunc({ state: state });
                complaintData.current.description = text.trimEnd();
            } break;

            default: { };
        };
    };

    /* On window size change */
    const onWindowSizeChangeFunc = () => {
        windowWidth.current = window.innerWidth;
        windowHeight.current = window.innerHeight;
    };

    /* Set customer data */
    const setCustomerDataFunc = (x: { currentControllerRef: refIdType, customerId: string, customerDomain: string }) => {
        currentControllerRef.current = x.currentControllerRef.current;
        customerId.current = x.customerId;
        customerDomain.current = x.customerDomain;
    };

    /* Check form */
    const checkFormFunc = () => {
        const tab = inputTab.filter((e: any) => e.isCorrect.current === false);

        /* highlight imcomplete input */
        if (tab.length > 0) {
            tab.forEach((e: any) => { (e.refId).current.setInputStateFunc({ state: 'error' }) });
            $('#comcrw_container').addClass('shakeX');
            setTimeout(() => { $('#comcrw_container').removeClass('shakeX') }, 500);
            return false;
        }

        return true;
    };

    /* Create complaint */
    const createComplaintFunc = async () => {
        const check = refId.current.checkFormFunc();
        if (check && canCreateComplaint.current) {
            canCreateComplaint.current = false;

            $('.comcrw_form_btn').css({ 'opacity': 0.5 });

            try {
                const customerId = dataStoreControllerRef.current.currentCustomerData.current.id;
                const domain = dataStoreControllerRef.current.currentCustomerData.current.domain;
                const creator = dataStoreControllerRef.current.currentUserData.current.fullname;

                /* show loading */
                complaintTopLoadingRef.current.showLoadingFunc({ show: true });

                /* Extract complaint object id */
                const customerComplaintObjectData: any[] = dataStoreControllerRef.current.customerComplaintObjectData.current;
                const objectId = (customerComplaintObjectData.filter((e: any) => e.name === complaintData.current.object))[0].id;

                /* Extract prroduct id */
                const customerProductData: any[] = dataStoreControllerRef.current.customerProductData.current;
                const productId = (customerProductData.filter((e: any) => e.name === complaintData.current.product))[0].id;

                /* Extract agency id */
                const customerAgencyData: any[] = dataStoreControllerRef.current.customerAgencyData.current;
                const agencyId = (customerAgencyData.filter((e: any) => e.name === complaintData.current.agency))[0].id;

                /* pg */
                const data = Object.assign(complaintData.current, {
                    id: generateIdFunc(), /* complaint id */

                    customerId: customerId,
                    domain: domain,
                    creator: creator,

                    complaintObjectId: objectId,
                    productId: productId,
                    agencyId: agencyId,

                    files: JSON.stringify(['file1.mp3', 'file2.mp3'])
                });
                console.log('ft ::', data);
                const res = await requestControllerRef.current.createComplaintFunc({ data: data });
                if (res.status !== _success_) throw new Error(JSON.stringify(res));

                /* add complaint in data store */
                dataStoreControllerRef.current.setDataFunc({ type: 'customerComplaint', data: [res.data] });

                /* send created complaint to current controller to be render */
                currentControllerRef.current.onComplaintCreatedFunc({ data: res.data });

                /* hide loading */
                complaintTopLoadingRef.current.showLoadingFunc({ show: false });

                /* - */
                canCreateComplaint.current = true;
                $('.comcrw_form_btn').css({ 'opacity': 1 });
                refId.current.resetFormFunc();

            } catch (e: any) {
                /* hide loading */
                complaintTopLoadingRef.current.showLoadingFunc({ show: false });

                /* - */
                canCreateComplaint.current = true;
                $('.comcrw_form_btn').css({ 'opacity': 1 });
                const err = catchErrorFunc({ err: e.message });
            }
        }
    };

    /* Reset form */
    const resetFormFunc = () => {
        complaintData.current = { clientName: '', clientPhone: '', clientLocation: '', object: '', product: '', agency: '', description: '' };
        inputTab.forEach((e) => {
            e.refId.current.setInputStateFunc({ state: (e.id === 'location') ? 'optional' : 'empty' });
            e.refId.current.clearTextFunc();
            e.isCorrect.current = false;
        });

        // currentControllerRef.current = undefined;
        // customerId.current = undefined;
        // customerDomain.current = undefined;
    };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        addWidgetRefFunc(x: any) { addWidgetRefFunc(x) },
        setTextValueFunc(x: any) { setTextValueFunc(x) },
        setCustomerDataFunc(x: any) { setCustomerDataFunc(x) },
        checkFormFunc() { return checkFormFunc() },
        createComplaintFunc() { createComplaintFunc() },
        resetFormFunc() { resetFormFunc() }
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

export default forwardRef(ComplaintCreationControllerWidget);
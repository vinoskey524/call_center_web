/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import { refIdType } from '../../Tools/type';
import { _defaultLanguage_, _productNameExists_, _requestFailed_, _success_ } from '../../Tools/constants';
import { language } from '../../Tools/language';
import { generateIdFunc, replaceConsecutiveSpacesByOneFunc, catchErrorFunc } from '../../Tools/methodForest';

/* Widget */
type propsType = {
    $data: {
        /** Every change made to "wid" affect controller */
        wid: string,
        refId: refIdType,
        controllerRef?: refIdType,
        rootControllers: any,
        parentRef: refIdType
    }
};
const ProductCreationControllerWidget = (props: propsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const parentProps = props;

    const windowWidth = useRef(window.innerWidth);

    const windowHeight = useRef(window.innerHeight);

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

    const parentRef = data.parentRef;

    /* Root controllers */

    const mainControllerRef: refIdType = rootControllers.mainControllerRef;

    const requestControllerRef: refIdType = rootControllers.requestControllerRef;

    const dataStoreControllerRef: refIdType = rootControllers.dataStoreControllerRef;

    /* Refs */

    const loadingRef = useRef<any>(undefined);

    const productNameFormInputRef = useRef<any>(undefined);

    const productDescFormInputRef = useRef<any>(undefined);

    /* - */

    const emptyRef = useRef(undefined);

    const productName = useRef<string | undefined>(undefined);
    const fileData = useRef<any>(undefined);

    const currentControllerRef = useRef<any>(undefined);
    const customerId = useRef<string | undefined>(undefined);
    const customerDomain = useRef<string | undefined>(undefined);


    /* ------------------------------------ Methods ------------------------------------- */

    /* Add widget ref */
    const addWidgetRefFunc = (x: { wid: string, refId: any }) => {
        const wid = x.wid, refId = x.refId;
        switch (wid) {
            case 'loadingRef': { loadingRef.current = refId.current } break;
            case 'productNameFormInputRef': { productNameFormInputRef.current = refId.current } break;
            case 'productDescFormInputRef': { productDescFormInputRef.current = refId.current } break;
            default: { };
        };
    };

    /* Set text value from inputs */
    const setTextValueFunc = (x: { wid: string, text: string }) => {
        const wid = x.wid, t = (x.text).replaceAll("'", '’').trimStart(), text = replaceConsecutiveSpacesByOneFunc(t), len = text.length;

        /* Hide error message */
        $('#prcrw_error_msg_container').hide();

        switch (wid) {
            case 'productNameFormInputRef': {
                productName.current = text;
                productNameFormInputRef.current.setTextFunc({ text: text });
                productNameFormInputRef.current.setInputStateFunc({ state: text.length > 0 ? 'correct' : 'empty' });
            } break;

            // case 'productDescFormInputRef': { productDescFormInputRef.current.setInputStateFunc({ state: text.length > 0 ? 'correct' : 'empty' }) } break;

            default: { };
        };
    };

    /* On window size change */
    const onWindowSizeChangeFunc = () => {
        windowWidth.current = window.innerWidth;
        windowHeight.current = window.innerHeight;
    };

    /* Select description file */
    const onDescBtnClickFunc = () => {
        const fileSelectorId = parentRef.current.file_selector_input_id;
        const files: any[] = $(`#${fileSelectorId}`).prop('files');
        if (files.length === 0) {
            $(`#${fileSelectorId}`).prop({ accept: '.pdf', name: 'mojave' });
            $(`#${fileSelectorId}`).trigger('click');
        } else {
            $(`#${fileSelectorId}`).val('');
            productDescFormInputRef.current.deleteDescFileFunc();
        }
    }

    /* Set description file */
    const setDescriptionFileFunc = (x: { fileData: any }) => {
        productDescFormInputRef.current.setInputStateFunc({ state: 'correct' });
        productDescFormInputRef.current.setDescriptionFileFunc({ fileData: x.fileData });
        fileData.current = x.fileData;
    };

    /* Create Product */
    const createProductFunc = async () => {
        try {
            loadingRef.current.showLoadingFunc({ show: true });

            const data = {
                fileData: { id: fileData.current.id, productName: productName.current, customerId: customerId.current, customerDomain: customerDomain.current, filename: fileData.current.filename, pdfFileName: `${customerDomain.current}${generateIdFunc({ length: 12 })}` },
                fileSource: fileData.current.file
            };

            const res = await requestControllerRef.current.createProductFunc({ data: data });
            if (res.status !== _success_) throw new Error(JSON.stringify({ status: _requestFailed_, data: res.data }));

            /* Reset form */
            refId.current.resetFunc({ timeout: 0 });

            /* Send created product data back to current client controller */
            currentControllerRef.current.onProductCreatedFunc({ data: res.data });

        } catch (e: any) {
            const err = catchErrorFunc({ err: e.message, prefix: 'pou' });
            loadingRef.current.showLoadingFunc({ show: false });

            switch (err.data) {
                case _productNameExists_: {
                    productNameFormInputRef.current.setInputStateFunc({ state: 'error' });
                    productNameFormInputRef.current.setErrorMsgFunc({ msg: traduction['t0038'] });
                    setTimeout(() => { $('#prcrw_container').addClass('shakeX') }, 100);
                } break;

                default: {
                    setTimeout(() => { $('#prcrw_container').addClass('shakeX') }, 100);
                    $('#prcrw_error_msg_container').show();
                };
            };
            setTimeout(() => { $('#prcrw_container').removeClass('shakeX') }, 550);
        }
    };

    /* Set current customer data */
    const setCurrentCustomerDataFunc = (x: { currentControllerRef: refIdType, id: string, domain: string }) => {
        currentControllerRef.current = x.currentControllerRef.current;
        customerId.current = x.id;
        customerDomain.current = x.domain;
    };

    /* Check form */
    const checkFormFunc = () => {
        let res: boolean = false;
        const tab = [];

        /* Hide error message */
        $('#prcrw_error_msg_container').hide();

        /* Check product name */
        if (productName.current === undefined) {
            tab.push('name');
            productNameFormInputRef.current?.setInputStateFunc({ state: 'error' });
        };

        /* Check file */
        const descFileData: refIdType = productDescFormInputRef.current.descFileData;
        if (descFileData.current === undefined || fileData.current === undefined) {
            tab.push('file');
            productDescFormInputRef.current?.setInputStateFunc({ state: 'error' });
        }

        /* - */
        if (tab.length > 0) {
            res = false;
            $('#prcrw_container').addClass('shakeX'); /* Start shaking */
            setTimeout(() => { $('#prcrw_container').removeClass('shakeX') }, 500);

        } else { res = true };

        /* - */
        return res;
    };

    /* Reset */
    const resetFunc = (x?: { timeout: number }) => {
        const t = x?.timeout || 300;

        $('#prcrw_container').removeClass('shakeX');
        $('#prcrw_error_msg_container').hide();

        productName.current = undefined;
        fileData.current = undefined;

        loadingRef.current.showLoadingFunc({ show: false });

        productNameFormInputRef.current.setInputStateFunc({ state: 'empty' });
        productNameFormInputRef.current.clearTextFunc();
        productNameFormInputRef.current.removeErrorMsgFunc();

        productDescFormInputRef.current.setInputStateFunc({ state: 'empty' });
        setTimeout(() => {
            productDescFormInputRef.current.deleteDescFileFunc()
            productDescFormInputRef.current.removeErrorMsgFunc();
        }, t);
    };

    /* File too large selected */
    const fileToolargeSelectedFunc = () => { productDescFormInputRef.current.setErrorMsgFunc({ msg: traduction['t0037'] }) };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        addWidgetRefFunc(x: any) { addWidgetRefFunc(x) },
        setTextValueFunc(x: any) { setTextValueFunc(x) },
        onDescBtnClickFunc() { onDescBtnClickFunc() },
        setDescriptionFileFunc(x: any) { setDescriptionFileFunc(x) },
        createProductFunc() { createProductFunc() },
        setCurrentCustomerDataFunc(x: any) { setCurrentCustomerDataFunc(x) },
        checkFormFunc() { return checkFormFunc() },
        resetFunc(x: any) { resetFunc(x) },
        fileToolargeSelectedFunc() { fileToolargeSelectedFunc() }
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

export default forwardRef(ProductCreationControllerWidget);
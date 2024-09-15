/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';
import prettyBytes from 'pretty-bytes';

/* Custom packages */
import './ProductCreationWidget.css';
import { generateIdFunc, animateModalFunc } from '../../Tools/methodForest';
import { language } from '../../Tools/language';
import { refIdType } from '../../Tools/type';
import { _defaultLanguage_, _dev_, _maxProductDescFileSize_ } from '../../Tools/constants';
import ProductCreationControllerWidget from './ProductCreationControllerWidget';
import FormInputWidget from '../Others/FormInputWidget';
import LoadingWidget from '../../Widgets/Others/LoadingWidget';

/* Widget */
type propsType = {
    $data: {
        /** Every change made to "wid" affect controller */
        wid: string,
        refId: refIdType,
        controllerRef: refIdType,
        rootControllers: any
    }
};
const ProductCreationWidget = (props: propsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const parentProps = props;

    const windowWidth = useRef(window.innerWidth);

    const windowHeight = useRef(window.innerHeight);

    const refresher = useRef(false);
    const [refresh, setRefresh] = useState(refresher.current);

    const isMounted = useRef(false);

    const render = useRef(!false);

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

    const productCreationControllerRef = useRef<any>(undefined);

    const productNameFormInputRef = useRef<any>(undefined);

    const productDescFormInputRef = useRef<any>(undefined);

    const file_selector_input_id = useRef(generateIdFunc({ length: 12 })).current;

    const loadingRef = useRef<any>(undefined);


    /* ------------------------------------ Methods ------------------------------------- */

    /* Refresh component */
    const refreshFunc = () => {
        refresher.current = !refresher.current;
        setRefresh(refresher.current);
    };

    /* Set language */
    const setLanguageFunc = (x: { lang: 'en' | 'fr' }) => { lang.current = x.lang; setRefresh(!refresh) };

    /* On window size change */
    const onWindowSizeChangeFunc = () => {
        windowWidth.current = window.innerWidth;
        windowHeight.current = window.innerHeight;
    };

    /* Show */
    const showFunc = (x: { show: boolean, currentControllerRef?: refIdType, customerId?: string, customerDomain?: string }) => {
        animateModalFunc({ scaffold: '#prcrw_scaffold', container: '#prcrw_container', show: x.show });
        (x.currentControllerRef !== undefined) && productCreationControllerRef.current.setCurrentCustomerDataFunc({ currentControllerRef: x.currentControllerRef, id: x.customerId, domain: x.customerDomain });
    };

    /* On desc btn click */
    const onDescBtnClickFunc = () => { productCreationControllerRef.current.onDescBtnClickFunc() };

    /* On file selected */
    const onFileSelectedFunc = (e: any) => {
        const files = $(`#${file_selector_input_id}`).prop('files');
        if (files.length > 0) {
            const file = files[0];
            const size = file.size;

            /* Check file size */
            if (size <= _maxProductDescFileSize_) {
                const filename: string = file.name;
                const lastDotIndex = filename.lastIndexOf('.');

                /*  */
                const ext = filename.substring(lastDotIndex);
                // const tempUrl = URL.createObjectURL(file);

                /* - */
                const fileData = { id: generateIdFunc(), filename: filename, extension: ext, formatedSize: prettyBytes(file.size), file: file };
                productCreationControllerRef.current.setDescriptionFileFunc({ fileData: fileData });
            } else productCreationControllerRef.current.fileToolargeSelectedFunc();
        }
    };

    /* Create Product */
    const createProductFunc = () => {
        const check = productCreationControllerRef.current.checkFormFunc();
        if (check) productCreationControllerRef.current.createProductFunc();
        else { _dev_ && console.warn('incomplete form') }
    };

    /* On Cancel */
    const onCancelFunc = () => {
        refId.current.showFunc({ show: false });
        productCreationControllerRef.current.resetFunc();
    };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        productNameFormInputRef: productNameFormInputRef,
        productDescFormInputRef: productDescFormInputRef,
        file_selector_input_id: file_selector_input_id,
        refreshFunc() { refreshFunc() },
        setLanguageFunc(x: any) { setLanguageFunc(x) },
        showFunc(x: any) { showFunc(x) }
    }), [refresh]);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            (controllerRef.current !== undefined) && controllerRef.current.addWidgetRefFunc({ wid: wid, refId: refId });
        }
    }, []);

    /* On window size change */
    // useEffect(() => {
    //     window.addEventListener('resize', onWindowSizeChangeFunc);
    //     return () => window.removeEventListener('resize', onWindowSizeChangeFunc);
    // }, []);


    /* Return */


    const component = <>
        <ProductCreationControllerWidget ref={productCreationControllerRef} $data={{ wid: 'productCreationControllerRef', refId: productCreationControllerRef, rootControllers: rootControllers, parentRef: refId }} />
        <div id='prcrw_scaffold'>
            <div id='prcrw_container'>
                <div id='prcrw_header_title'>Nouveau produit</div>
                <div id='prcrw_error_msg_container'>{traduction['t0016']}</div>
                <LoadingWidget ref={loadingRef} $data={{ wid: 'loadingRef', refId: loadingRef, controllerRef: productCreationControllerRef }} />

                <div id='prcrw_form_container'>
                    <FormInputWidget /* Name */ ref={productNameFormInputRef} $data={{ wid: 'productNameFormInputRef', refId: productNameFormInputRef, controllerRef: productCreationControllerRef, title: 'Name', type: 'text', inputWidth: '65%' }} />

                    <FormInputWidget /* Description */ ref={productDescFormInputRef} $data={{ wid: 'productDescFormInputRef', refId: productDescFormInputRef, controllerRef: productCreationControllerRef, title: 'Description', type: 'textarea', inputWidth: '65%', enableDescImport: true, desc: traduction['t0039'], immutableDesc: true, onDescBtnClickFunc: onDescBtnClickFunc }} />

                    <div id='prcrw_btn_container'>
                        <button id='prcrw_create_btn' className='btn_opacity' style={{ marginLeft: '35%' }} onClick={createProductFunc}>Create</button>
                        <button id='prcrw_cancel_btn' className='btn_opacity' onClick={onCancelFunc}>Cancel</button>
                    </div>
                </div>

            </div>
        </div>
        <input /* File selector input */ id={file_selector_input_id} style={{ width: 0, height: 0, display: 'none' }} name='mojave' type='file' accept='.docx' onChange={onFileSelectedFunc} />
    </>;
    return (render.current ? component : <></>);
};

export default forwardRef(ProductCreationWidget);
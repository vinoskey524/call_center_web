/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';
import prettyBytes from 'pretty-bytes';

/* Custom packages */
import './ProductCreationMainPage.css';
import { generateIdFunc } from '../../../Tools/methodForest';
import { language } from '../../../Tools/language';
import { refIdType } from '../../../Tools/type';
import { _defaultLanguage_ } from '../../../Tools/constants';
import ProductCreationControllerWidget from './ProductCreationControllerWidget';
import FormInputWidget from '../../../Widgets/Others/FormInputWidget';
// import LoadingWidget from '../../../Widgets/Others/LoadingWidget';

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
const ProductCreationMainPage = (props: propsType, ref: any) => {
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

    const productDesc = 'Ajouter une description depuis un fichier word or html.';

    const loadingRef = useRef<any>(undefined);


    /* ------------------------------------ Methods ------------------------------------- */

    /* Refresh component */
    const refreshFunc = () => {
        refresher.current = refresher.current ? false : true;
        setRefresh(refresher.current);
    };

    /* Set language */
    const setLanguageFunc = (x: { lang: 'en' | 'fr' }) => { lang.current = x.lang; setRefresh(!refresh) };

    /* On window size change */
    const onWindowSizeChangeFunc = () => {
        windowWidth.current = window.innerWidth;
        windowHeight.current = window.innerHeight;
    };

    /* On desc btn click */
    const onDescBtnClickFunc = () => { productCreationControllerRef.current.onDescBtnClickFunc() };

    /* On file selected */
    const onFileSelectedFunc = (e: any) => {
        const files = $(`#${file_selector_input_id}`).prop('files');
        if (files.length > 0) {
            const file = files[0];
            const filename: string = file.name;
            const lastDotIndex = filename.lastIndexOf('.');
            const fileData = { id: generateIdFunc(), name: filename, extension: filename.substring(lastDotIndex), size: file.size, formatedSize: prettyBytes(file.size), tempUrl: URL.createObjectURL(file) };
            productCreationControllerRef.current.setDescriptionFileFunc({ fileData: fileData });
        }
    };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        productNameFormInputRef: productNameFormInputRef,
        productDescFormInputRef: productDescFormInputRef,
        file_selector_input_id: file_selector_input_id,
        refreshFunc() { refreshFunc() },
        setLanguageFunc(x: any) { setLanguageFunc(x) }
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
        <div id='pcmw_scaffold'>
            <div id='pcmv_container'>
                <div id='pcmv_header_title'>Nouveau produit</div>
                {/* <LoadingWidget ref={loadingRef} $data={{ wid: 'loadingRef', refId: loadingRef, controllerRef: productCreationControllerRef }} /> */}
                <div id='pcmv_form_container'>
                    <FormInputWidget /* Name */ ref={productNameFormInputRef} $data={{ wid: 'productNameFormInputRef', refId: productNameFormInputRef, controllerRef: productCreationControllerRef, title: 'Name', type: 'text' }} />
                    <FormInputWidget /* Description */ ref={productDescFormInputRef} $data={{ wid: 'productDescFormInputRef', refId: productDescFormInputRef, controllerRef: productCreationControllerRef, title: 'Description', type: 'textarea', enableDescImport: true, desc: productDesc, onDescBtnClickFunc: onDescBtnClickFunc }} />

                    <div id='pcmv_btn_container'>
                        <div style={{ width: '34%', height: 1 }} />
                        <button id='pcmv_create_btn' className='btn_opacity'>Create</button>
                        <button id='pcmv_cancel_btn' className='btn_opacity'>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
        <input /* File selector input */ id={file_selector_input_id} style={{ width: 0, height: 0, display: 'none' }} type='file' accept='.doc,.docx,.html' onChange={onFileSelectedFunc} />
        <ProductCreationControllerWidget ref={productCreationControllerRef} $data={{ wid: 'productCreationControllerRef', refId: productCreationControllerRef, rootControllers: rootControllers, parentRef: refId }} />
    </>;
    return (render.current ? component : <></>);
};

export default forwardRef(ProductCreationMainPage);
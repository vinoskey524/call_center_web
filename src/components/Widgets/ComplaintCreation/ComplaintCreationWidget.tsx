/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import './ComplaintCreationWidget.css';
import { generateIdFunc, animateModalFunc } from '../../Tools/methodForest';
import { language } from '../../Tools/language';
import { refIdType } from '../../Tools/type';
import { _defaultLanguage_ } from '../../Tools/constants';
import ComplaintCreationControllerWidget from './ComplaintCreationControllerWidget';
import FormInputWidget from '../Others/FormInputWidget';
import ComplaintCreationFileWidget from './ComplaintCreationFileWidget';

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
const ComplaintCreationWidget = (props: propsType, ref: any) => {
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

    const emptyRef = useRef(undefined);

    const complaintNameFormInputRef = useRef(undefined);

    const complaintPhoneFormInputRef = useRef(undefined);

    const complaintLocationFormInputRef = useRef(undefined);

    const complaintObjectFormInputRef = useRef(undefined);

    const complaintProductFormInputRef = useRef(undefined);

    const complaintAgenceFormInputRef = useRef(undefined);

    const complaintDescFormInputRef = useRef(undefined);

    const complaintCreationControllerRef = useRef(undefined);

    const file_selector_input_id = useRef(generateIdFunc()).current;


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
    const setLanguageFunc = (x: { lang: 'en' | 'fr' }) => {
        lang.current = x.lang;
        refreshFunc();
    };

    /* On window size change */
    const onWindowSizeChangeFunc = () => {
        windowWidth.current = window.innerWidth;
        windowHeight.current = window.innerHeight;
    };

    /* Show */
    const showFunc = (x: { show: boolean }) => { animateModalFunc({ scaffold: '#comcrw_scaffold', container: '#comcrw_container', show: x.show }) };

    /* On Create */
    const onCreateFunc = () => { };

    /* On cancel */
    const onCancelFunc = () => { refId.current.showFunc({ show: false }) };

    /* Add files */
    const onAddFilesFunc = () => { };

    /* On file select */
    const onFileSelectedFunc = () => { };


    /* ------------------------------------ jQuery ------------------------------------- */


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        refreshFunc() { refreshFunc() },
        renderFunc(x: any) { renderFunc(x) },
        setLanguageFunc(x: any) { setLanguageFunc(x) },
        showFunc(x: any) { showFunc(x) },
        onCancelFunc() { onCancelFunc() }
    }), []);

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
        <div id='comcrw_scaffold'>
            <div id='comcrw_container'>
                <div id='comcrw_header_title'>Nouvelle plainte</div>
                <div id='comcrw_form_container'>
                    <div className='comcrw_session_title'>Informations client</div>
                    <FormInputWidget /* Name */ ref={complaintNameFormInputRef} $data={{ wid: 'complaintNameFormInputRef', refId: complaintNameFormInputRef, controllerRef: complaintCreationControllerRef, title: 'Name', type: 'text' }} />
                    <FormInputWidget /* Phone */ ref={complaintPhoneFormInputRef} $data={{ wid: 'complaintPhoneFormInputRef', refId: complaintPhoneFormInputRef, controllerRef: complaintCreationControllerRef, title: 'Phone', type: 'number' }} />
                    <FormInputWidget /* Location */ ref={complaintLocationFormInputRef} $data={{ wid: 'complaintLocationFormInputRef', refId: complaintLocationFormInputRef, controllerRef: complaintCreationControllerRef, title: 'Location', type: 'text', isOptional: true }} />

                    <div className='comcrw_session_title'>Informations avancées</div>
                    <FormInputWidget /* Object */ ref={complaintObjectFormInputRef} $data={{ wid: 'complaintObjectFormInputRef', refId: complaintObjectFormInputRef, controllerRef: complaintCreationControllerRef, title: 'Object', type: 'select' }} />
                    <FormInputWidget /* Product */ ref={complaintProductFormInputRef} $data={{ wid: 'complaintProductFormInputRef', refId: complaintProductFormInputRef, controllerRef: complaintCreationControllerRef, title: 'Product', type: 'select' }} />
                    <FormInputWidget /* Agence */ ref={complaintAgenceFormInputRef} $data={{ wid: 'complaintAgenceFormInputRef', refId: complaintAgenceFormInputRef, controllerRef: complaintCreationControllerRef, title: 'Agence', type: 'select' }} />
                    <FormInputWidget /* Description */ ref={complaintDescFormInputRef} $data={{ wid: 'complaintDescFormInputRef', refId: complaintDescFormInputRef, controllerRef: complaintCreationControllerRef, title: 'Description', type: 'textarea' }} />

                    <div className='comcrw_files_container'>
                        <div id='comcrw_files_title'>Pieces jointes</div>
                        <ComplaintCreationFileWidget ref={emptyRef} $data={{ wid: 'emptyRef', refId: emptyRef, controllerRef: complaintCreationControllerRef, rootControllers: rootControllers }} />
                        <ComplaintCreationFileWidget ref={emptyRef} $data={{ wid: 'emptyRef', refId: emptyRef, controllerRef: complaintCreationControllerRef, rootControllers: rootControllers }} />
                    </div>

                    <div id='comcrw_btn_container'>
                        <button id='comcrw_create_btn' className='btn_opacity' onClick={onCreateFunc}>Create</button>
                        <button id='comcrw_cancel_btn' className='btn_opacity' onClick={onCancelFunc}>Cancel</button>
                        <div style={{ flex: 1 }} />
                        <button id='comcrw_add_files_btn' className='btn_opacity' onClick={onAddFilesFunc}>Fichier</button>
                    </div>
                </div>
            </div>
        </div>
        <input /* File selector input */ id={file_selector_input_id} style={{ width: 0, height: 0, display: 'none' }} type='file' accept='.doc,.docx,.pdf,.mp3' onChange={onFileSelectedFunc} />
        <ComplaintCreationControllerWidget ref={complaintCreationControllerRef} $data={{ wid: 'complaintCreationControllerRef', refId: complaintCreationControllerRef, rootControllers: rootControllers }} />
    </>;
    return (render.current ? component : <></>);
};

export default forwardRef(ComplaintCreationWidget);
// @refresh reset

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
import FeedListWidget from '../FeedList/FeedListWidget';
import LoadingWidget from '../Others/LoadingWidget';

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

    const complaintNameInputRef = useRef<any>(undefined);

    const complaintPhoneInputRef = useRef<any>(undefined);

    const complaintLocationInputRef = useRef<any>(undefined);

    const complaintObjectInputRef = useRef<any>(undefined);

    const complaintProductInputRef = useRef<any>(undefined);

    const complaintAgencyInputRef = useRef<any>(undefined);

    const complaintDescInputRef = useRef<any>(undefined);

    const complaintCreationControllerRef = useRef<any>(undefined);

    const searchFeedListRef = useRef<any>(undefined);

    /* - */

    const file_selector_input_id = useRef(generateIdFunc()).current;

    const inputWidth = '68%';

    const objectTab = useRef<string[]>([]);
    const agencyTab = useRef<string[]>([]);

    const complaintTopLoadingRef = useRef<any>(undefined);


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
    const showFunc = (x: { show: boolean, currentControllerRef?: refIdType, customerId?: string, customerDomain?: string }) => {
        if (x.show) {
            const objectData: any[] = dataStoreControllerRef.current.customerComplaintObjectNameTab.current;
            const productData: any[] = dataStoreControllerRef.current.customerProductNameTab.current;
            const agencyData: any[] = dataStoreControllerRef.current.customerAgencyNameTab.current;

            complaintObjectInputRef.current.updateSelectOptionListFunc({ data: objectData });
            complaintProductInputRef.current.updateSelectOptionListFunc({ data: productData });
            complaintAgencyInputRef.current.updateSelectOptionListFunc({ data: agencyData });

            complaintCreationControllerRef.current.setCustomerDataFunc({ currentControllerRef: x.currentControllerRef, customerId: x.customerId, customerDomain: x.customerDomain });
        }

        animateModalFunc({ scaffold: '#comcrw_scaffold', container: '#comcrw_container', show: x.show });
    };

    /* On Create */
    const onCreateFunc = () => { complaintCreationControllerRef.current.createComplaintFunc() };

    /* On cancel */
    const onCancelFunc = () => {
        refId.current.showFunc({ show: false });
        complaintCreationControllerRef.current.resetFormFunc();
    };

    /* Add files */
    const onAddFilesFunc = () => {

    };

    /* On file select */
    const onFileSelectedFunc = () => { };

    /* On search cancel */
    const onSearchCancelFunc = () => {
        // const $main_part_id = $('#comcrw_main_part');
        // const $search_part_id = $('#comcrw_search_part');

        // setTimeout(() => {
        //     $search_part_id.removeClass('comcrw_search_part_show');
        //     $search_part_id.addClass('comcrw_search_part_hide');
        // }, 60);

        // $main_part_id.removeClass('comcrw_main_part_hide');
        // $main_part_id.addClass('comcrw_main_part_show');
    };


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
        <ComplaintCreationControllerWidget ref={complaintCreationControllerRef} $data={{ wid: 'complaintCreationControllerRef', refId: complaintCreationControllerRef, rootControllers: rootControllers }} />
        <div id='comcrw_scaffold'>
            <div id='comcrw_container'>
                <div /* main part */ id='comcrw_main_part' className='comcrw_main_part_show'>
                    <div id='comcrw_header_title'>Nouvelle plainte</div>

                    <LoadingWidget ref={complaintTopLoadingRef} $data={{ wid: 'complaintTopLoadingRef', controllerRef: complaintCreationControllerRef }} />

                    <div id='comcrw_form_container'>
                        <div className='comcrw_session_title'>Informations client</div>
                        <FormInputWidget /* Name */ ref={complaintNameInputRef} $data={{ wid: 'complaintNameInputRef', refId: complaintNameInputRef, controllerRef: complaintCreationControllerRef, rootControllers: rootControllers, title: 'Name', type: 'text', inputWidth: inputWidth }} />
                        <FormInputWidget /* Phone */ ref={complaintPhoneInputRef} $data={{ wid: 'complaintPhoneInputRef', refId: complaintPhoneInputRef, controllerRef: complaintCreationControllerRef, rootControllers: rootControllers, title: 'Phone', type: 'number', inputWidth: inputWidth }} />
                        <FormInputWidget /* Location */ ref={complaintLocationInputRef} $data={{ wid: 'complaintLocationInputRef', refId: complaintLocationInputRef, controllerRef: complaintCreationControllerRef, rootControllers: rootControllers, title: 'Location', type: 'text', placeholder: 'Ex: Cotonou, Benin (Optionel)', inputWidth: inputWidth, isOptional: true }} />

                        <div className='comcrw_session_title'>Informations avancées</div>
                        <FormInputWidget /* Object */ ref={complaintObjectInputRef} $data={{ wid: 'complaintObjectInputRef', refId: complaintObjectInputRef, controllerRef: complaintCreationControllerRef, rootControllers: rootControllers, title: 'Object', type: 'select', inputWidth: inputWidth }} />
                        <FormInputWidget /* Product */ ref={complaintProductInputRef} $data={{ wid: 'complaintProductInputRef', refId: complaintProductInputRef, controllerRef: complaintCreationControllerRef, rootControllers: rootControllers, title: 'Product', type: 'select', inputWidth: inputWidth }} />
                        <FormInputWidget /* Agence */ ref={complaintAgencyInputRef} $data={{ wid: 'complaintAgencyInputRef', refId: complaintAgencyInputRef, controllerRef: complaintCreationControllerRef, rootControllers: rootControllers, title: 'Agence', type: 'select', inputWidth: inputWidth }} />
                        <FormInputWidget /* Description */ ref={complaintDescInputRef} $data={{ wid: 'complaintDescInputRef', refId: complaintDescInputRef, controllerRef: complaintCreationControllerRef, rootControllers: rootControllers, title: 'Description', type: 'textarea', inputWidth: inputWidth }} />

                        <div className='comcrw_files_container'>
                            <div id='comcrw_files_title'>Pieces jointes (0/3)</div>
                            {/* <ComplaintCreationFileWidget ref={emptyRef} $data={{ wid: 'emptyRef', refId: emptyRef, controllerRef: complaintCreationControllerRef, rootControllers: rootControllers }} />
                            <ComplaintCreationFileWidget ref={emptyRef} $data={{ wid: 'emptyRef', refId: emptyRef, controllerRef: complaintCreationControllerRef, rootControllers: rootControllers }} /> */}
                        </div>

                        <div id='comcrw_btn_container'>
                            <button id='comcrw_create_btn' className='comcrw_form_btn btn_opacity' onClick={onCreateFunc}>Create</button>
                            <button id='comcrw_cancel_btn' className='comcrw_form_btn btn_opacity' onClick={onCancelFunc}>Cancel</button>
                            <div style={{ flex: 1 }} />
                            <button id='comcrw_add_files_btn' className='comcrw_form_btn btn_opacity' onClick={onAddFilesFunc}>Fichier</button>
                        </div>
                    </div>
                </div>

                {/* <div  id='comcrw_search_part' className='comcrw_search_part_hide'>
                    <div id='comcrw_search_wrapper'>
                        <div id='comcrw_search_input_container'>
                            <input id='comcrw_search_input_box' />
                            <div id='comcrw_search_input_cancel_btn' className='btn_opacity' onClick={onSearchCancelFunc}>Annuler</div>
                        </div>
                        <div id='comcrw_search_list_contaier'>
                            <FeedListWidget ref={searchFeedListRef} $data={{
                                wid: 'searchFeedListRef', refId: searchFeedListRef, controllerRef: complaintCreationControllerRef, rootControllers: rootControllers,
                                widget: ({ _key, _refId, _data }: any) => { return <></> }
                            }} />
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
        <input /* File selector input */ id={file_selector_input_id} style={{ width: 0, height: 0, display: 'none' }} type='file' accept='.mp3' onChange={onFileSelectedFunc} />
    </>;
    return (render.current ? component : <></>);
};

export default forwardRef(ComplaintCreationWidget);
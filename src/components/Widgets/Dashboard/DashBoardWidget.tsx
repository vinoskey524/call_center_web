/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import './DashBoardWidget.css';
import { generateIdFunc } from '../../Tools/methodForest';
import { language } from '../../Tools/language';
import { refIdType } from '../../Tools/type';
import { _defaultLanguage_ } from '../../Tools/constants';
import search_icon from '../../Assets/png/search.png';
import ProductFeedWidget from '../ProductDashboard/ProductFeedWidget';
import ProductPreviewMainWidget from './Product/ProductPreviewMainWidget';
import DashBoardControllerWidget from './DashBoardControllerWidget';

/* Widget */
type propsType = {
    $data: {
        refId: refIdType,
        controllerRef: refIdType,
        rootControllers: any
    }
};
const DashBoardWidget = (props: propsType, ref: any) => {
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

    const refId = data.refId;

    const controllerRef = data.controllerRef;

    const rootControllers = data.rootControllers;

    /* Root controllers */

    const mainControllerRef: refIdType = rootControllers.mainControllerRef;

    const requestControllerRef: refIdType = rootControllers.requestControllerRef;

    const dataStoreControllerRef: refIdType = rootControllers.dataStoreControllerRef;

    /* - */

    const ccdbw_scaffold_id = useRef(generateIdFunc()).current;

    const ccdbw_product_btn_id = useRef(generateIdFunc()).current;

    const ccdbwcomplaint_btn_id = useRef(generateIdFunc()).current;

    const callCProductRef = useRef(undefined);

    const callCDashBoardControllerRef = useRef(undefined);

    const callCProductPreviewMainRef = useRef(undefined);

    const didAddBtnTouched = useRef(false);

    const didAddBtnSubOptionShown = useRef(false);


    /* ------------------------------------ Methods ------------------------------------- */

    /* Refresh component */
    const refreshFunc = () => {
        refresher.current = !refresher.current;
        setRefresh(refresher.current);
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

    /* On add product or complaint */
    const onAddProduitComplaintFunc = () => {
        didAddBtnSubOptionShown.current = !didAddBtnSubOptionShown.current;
        refreshFunc();
    };

    /* Add product */
    const addProductFunc = () => {
        const productCreationMainRef: refIdType = mainControllerRef.current.productCreationMainRef;
        productCreationMainRef.current.showFunc({ show: true });
        onAddProduitComplaintFunc();
    };

    /* Add complaint */
    const addComplaintFunc = () => {
        const complaintCreationRef: refIdType = mainControllerRef.current.complaintCreationRef;
        complaintCreationRef.current.showFunc({ show: true });
        onAddProduitComplaintFunc();
    };


    /* ------------------------------------ jQuery ------------------------------------- */

    /* - */
    $('body').on('mouseup', () => {
        if (didAddBtnSubOptionShown.current) {
            // didAddBtnSubOptionShown.current = false;
            // refreshFunc();
        }
    });


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        ccdbw_product_btn_id: ccdbw_product_btn_id,
        ccdbwcomplaint_btn_id: ccdbwcomplaint_btn_id,
        refreshFunc() { refreshFunc() },
        setLanguageFunc(x: any) { setLanguageFunc(x) },
        addProductFunc() { addProductFunc() },
        addComplaintFunc() { addComplaintFunc() }
    }), [refresh]);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
        }
    }, []);

    /* On window size change */
    // useEffect(() => {
    //     window.addEventListener('resize', onWindowSizeChangeFunc);
    //     return () => window.removeEventListener('resize', onWindowSizeChangeFunc);
    // }, []);


    /* Return */

    // $('#ccdbw_scaffold').append(`${<ProductFeedWidget ref={callCProductRef} $data={{ wid: 'callCProductRef', refId: callCProductRef, controllerRef: controllerRef, rootControllers: rootControllers }} />}`)

    const component = <>
        <div id={ccdbw_scaffold_id} className='ccdbw_scaffold ccdbw_var'>
            <div /* Header */ className='ccdbw_header glass'>
                <h1 className='ccdbw_enterprise_title'>Pebco</h1>

                <div className='ccdbw_h_btn_container'>
                    <div className='ccdbw_h_btn_title'>Produits</div>
                </div>

                <div className='ccdbw_h_btn_container'>
                    <div className='ccdbw_h_btn_title'>Plaintes</div>
                </div>

                <div className='ccdbw_hv_separator' />

                <div id='ccdbw_h_search_container'>
                    <img id='ccdbw_h_search_icon' src={search_icon} />
                    <input id='ccdbw_h_search_bar' type='text' placeholder='Search' />
                </div>

                <div className='ccdbw_hv_separator' />

                <div id='ccdbw_add_btn_container'>
                    <div id='ccdbw_add_btn_title' className='btn_opacity' onClick={onAddProduitComplaintFunc}>+ Ajouter</div>
                    {didAddBtnSubOptionShown.current &&
                        <div id='ccdbw_add_option_container'>
                            <div className='ccdbw_add_option_title btn_opacity' onClick={addProductFunc} >Produit</div>
                            <div className='ccdbw_title_separator' />
                            <div className='ccdbw_add_option_title btn_opacity' onClick={addComplaintFunc}>Plainte</div>
                        </div>
                    }
                </div>
            </div>

            <div /* Body */ id='ccdbw_body'>
                <div /* Product body */ id='ccdbw_product_body'>
                    <div id='ccdbw_body_left'>
                        {Array(20).fill(undefined).map((_, i) => <ProductFeedWidget key={i} ref={callCProductRef} $data={{ wid: 'callCProductRef', refId: callCProductRef, controllerRef: callCDashBoardControllerRef, rootControllers: rootControllers }} />)}
                    </div>
                    <div id='ccdbw_body_right'>
                        <ProductPreviewMainWidget ref={callCProductPreviewMainRef} $data={{ wid: 'callCProductPreviewMainRef', refId: callCProductPreviewMainRef, controllerRef: callCDashBoardControllerRef, rootControllers: rootControllers }} />
                    </div>
                </div>

                <div /* Complaint body */ id='ccdbw_complaint_body'></div>
            </div>
        </div>
        <DashBoardControllerWidget ref={callCDashBoardControllerRef} $data={{ wid: 'callCDashBoardControllerRef', refId: callCDashBoardControllerRef, parentRef: refId, rootControllers: rootControllers }} />
    </>;
    return (render.current ? component : <></>);
};

export default forwardRef(DashBoardWidget);
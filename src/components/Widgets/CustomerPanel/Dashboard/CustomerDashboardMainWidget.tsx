/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import './CustomerDashboardMainWidget.css';
import { generateIdFunc } from '../../../Tools/methodForest';
import { language } from '../../../Tools/language';
import { refIdType } from '../../../Tools/type';
import { _defaultLanguage_ } from '../../../Tools/constants';
import search_icon from '../../../Assets/png/search_0.png';
import StatsDashboardMainWidget from '../../StatsDashboard/StatsDashboardMainWidget';
import ProductDashboardMainWidget from '../../ProductDashboard/ProductDashboardMainWidget';
import ComplaintDashboardMainWidget from '../../ComplaintDashboard/ComplaintDashboardMainWidget';

/* Widget */
type propsType = {
    $data: {
        refId: refIdType,
        controllerRef: refIdType,
        rootControllers: any
    }
};
const CustomerDashboardMainWidget = (props: propsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const parentProps = props;

    const windowWidth = useRef(window.innerWidth);

    const windowHeight = useRef(window.innerHeight);

    const refresher = useRef(false);
    const [refresh, setRefresh] = useState(refresher.current);

    const isMounted = useRef(false);

    const render = useRef(true);

    const lang = useRef(_defaultLanguage_);

    const traduction = language[lang.current];

    /* $data */

    const data = props.$data;

    const refId = data.refId;

    const controllerRef = data.controllerRef; /* callCMainControllerRef */

    const rootControllers = data.rootControllers;

    /* Root controllers */

    const mainControllerRef: refIdType = rootControllers.mainControllerRef;

    const requestControllerRef: refIdType = rootControllers.requestControllerRef;

    const dataStoreControllerRef: refIdType = rootControllers.dataStoreControllerRef;

    /* - */

    const emptyRef = useRef(undefined);

    const ctmdmw_home_btn_container_id = useRef(generateIdFunc()).current;
    const ctmdmw_home_btn_title_id = useRef(generateIdFunc()).current;

    const ctmdmw_product_btn_container_id = useRef(generateIdFunc()).current;
    const ctmdmw_product_btn_title_id = useRef(generateIdFunc()).current;

    const ctmdmw_complaint_btn_container_id = useRef(generateIdFunc()).current;
    const ctmdmw_complaint_btn_title_id = useRef(generateIdFunc()).current;

    const ctmdmw_scaffold_id = useRef(generateIdFunc()).current;

    const accountType: refIdType = dataStoreControllerRef.current.accountType;

    const didAddBtnTouched = useRef(false);

    const didAddBtnSubOptionShown = useRef(false);

    const statsDashboardMainRef = useRef<any>(undefined);
    const productDashboardMainRef = useRef<any>(undefined);
    const complaintDashboardMainRef = useRef<any>(undefined);

    const currentMenuSelected = useRef<'home' | 'product' | 'complaint'>('home');

    const isComplaintFilterVisible = useRef(false);


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

    /* On add product or complaint */
    const onAddProduitComplaintFunc = () => {
        const current = didAddBtnSubOptionShown.current;
        $('#ctmdmw_add_option_container').animate(current ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }, 200, () => { current && $('#ctmdmw_add_option_container').css({ 'display': 'none' }) });
        !current && $('#ctmdmw_add_option_container').css({ 'display': 'flex' });
        didAddBtnSubOptionShown.current = !didAddBtnSubOptionShown.current; /* update | Must be last line */
    };

    /* Add product */
    const addProductFunc = () => {
        if (didAddBtnSubOptionShown.current) {
            const productCreationMainRef: refIdType = mainControllerRef.current.productCreationMainRef;
            productCreationMainRef.current.showFunc({ show: true });
            onAddProduitComplaintFunc();
        }
    };

    /* Add complaint */
    const addComplaintFunc = () => {
        if (didAddBtnSubOptionShown.current) {
            const complaintCreationRef: refIdType = mainControllerRef.current.complaintCreationRef;
            complaintCreationRef.current.showFunc({ show: true });
            onAddProduitComplaintFunc();
        }
    };

    /* On Home select */
    const onHomeSelectFunc = () => {
        currentMenuSelected.current = 'home';

        /* Home/Stats */
        $(`#${ctmdmw_home_btn_container_id}`).css({ 'background-color': '#007aff' });
        $(`#${ctmdmw_home_btn_title_id}`).css({ 'color': 'white' });

        /* Product */
        $(`#${ctmdmw_product_btn_container_id}`).css({ 'background-color': 'transparent' });
        $(`#${ctmdmw_product_btn_title_id}`).css({ 'color': '#95A6BD' });
        $(`#${ctmdmw_product_btn_container_id}`).removeAttr('style');

        /* Complaint */
        $(`#${ctmdmw_complaint_btn_title_id}`).css({ 'background-color': 'transparent' });
        $(`#${ctmdmw_complaint_btn_title_id}`).css({ 'color': '#95A6BD' });
        $(`#${ctmdmw_complaint_btn_title_id}`).removeAttr('style');

        /* Change placeholder */
        $('#ctmdmw_h_search_bar').attr({ 'placeholder': 'Search products' });

        /* Show */
        complaintDashboardMainRef.current.showFunc({ show: false });
        productDashboardMainRef.current.showFunc({ show: false });
        statsDashboardMainRef.current.showFunc({ show: true });
    };

    /* On product menu selected */
    const onProductSelectFunc = () => {
        currentMenuSelected.current = 'product';

        /* Product */
        $(`#${ctmdmw_product_btn_container_id}`).css({ 'background-color': '#007aff' });
        $(`#${ctmdmw_product_btn_title_id}`).css({ 'color': 'white' });

        /* Home */
        $(`#${ctmdmw_home_btn_container_id}`).css({ 'background-color': 'transparent' });
        $(`#${ctmdmw_home_btn_title_id}`).css({ 'color': '#95A6BD' });
        $(`#${ctmdmw_home_btn_container_id}`).removeAttr('style');

        /* Complaint */
        $(`#${ctmdmw_complaint_btn_title_id}`).css({ 'background-color': 'transparent' });
        $(`#${ctmdmw_complaint_btn_title_id}`).css({ 'color': '#95A6BD' });
        $(`#${ctmdmw_complaint_btn_title_id}`).removeAttr('style');

        /* Change placeholder */
        $('#ctmdmw_h_search_bar').attr({ 'placeholder': 'Search products' });

        /* Show */
        complaintDashboardMainRef.current.showFunc({ show: false });
        statsDashboardMainRef.current.showFunc({ show: false });
        productDashboardMainRef.current.showFunc({ show: true });
    };

    /* On complaint menu selected */
    const onComplaintSelectFunc = () => {
        if (currentMenuSelected.current !== 'complaint') {
            currentMenuSelected.current = 'complaint';

            /* Complaint */
            $(`#${ctmdmw_complaint_btn_title_id}`).css({ 'background-color': '#007aff' });
            $(`#${ctmdmw_complaint_btn_title_id}`).css({ 'color': 'white' });

            /* Product */
            $(`#${ctmdmw_product_btn_container_id}`).css({ 'background-color': 'transparent' });
            $(`#${ctmdmw_product_btn_title_id}`).css({ 'color': '#95A6BD' });
            $(`#${ctmdmw_product_btn_container_id}`).removeAttr('style');

            /* Home/Stats */
            $(`#${ctmdmw_home_btn_container_id}`).css({ 'background-color': 'transparent' });
            $(`#${ctmdmw_home_btn_title_id}`).css({ 'color': '#95A6BD' });
            $(`#${ctmdmw_home_btn_container_id}`).removeAttr('style');

            /* Change placeholder */
            $('#ctmdmw_h_search_bar').attr({ 'placeholder': 'Search complaints' });

            /* Show */
            productDashboardMainRef.current.showFunc({ show: false });
            statsDashboardMainRef.current.showFunc({ show: false });
            complaintDashboardMainRef.current.showFunc({ show: true });
        } else {
            const current = isComplaintFilterVisible.current;
            $('#ctmdmw_complaint_filter_selector').animate(current ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }, 200, () => { current && $('#ctmdmw_complaint_filter_selector').css({ 'display': 'none' }) });
            !current && $('#ctmdmw_complaint_filter_selector').css({ 'display': 'flex' });
            isComplaintFilterVisible.current = !isComplaintFilterVisible.current; /* update | Must be last line */
        }
    };

    /* Set complaint filter */
    const setComplaintFilterFunc = (x: { filter: 'tout' | 'non_traites' | 'en_traitement' | 'traites' }) => {
        if (currentMenuSelected.current === 'complaint') {
            const current = isComplaintFilterVisible.current;
            $('#ctmdmw_complaint_filter_selector').animate({ opacity: 0, scale: 0.8 }, 200, () => { current && $('#ctmdmw_complaint_filter_selector').css({ 'display': 'none' }) });
            isComplaintFilterVisible.current = !isComplaintFilterVisible.current; /* update | Must be last line */
        }
    };


    /* ------------------------------------ jQuery ------------------------------------- */


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        refreshFunc() { refreshFunc() },
        renderFunc(x: any) { renderFunc(x) },
        setLanguageFunc(x: any) { setLanguageFunc(x) }
    }), []);

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


    const component = <>
        <div id={ctmdmw_scaffold_id} className='ctmdmw_scaffold'>
            <div /* Header */ className='ctmdmw_header'>
                <div className='ctmdmw_header_backdrop glass' />
                <div className='ctmdmw_header_container'>
                    <h1 className='ctmdmw_enterprise_title'>Pebco</h1>

                    <div id={ctmdmw_home_btn_container_id} className='ctmdmw_h_btn_container btn_opacity' style={{ backgroundColor: '#007aff' }} onClick={onHomeSelectFunc}>
                        <div id={ctmdmw_home_btn_title_id} className='ctmdmw_h_btn_title' style={{ color: 'white' }}>Acceuil</div>
                    </div>

                    <div id={ctmdmw_complaint_btn_container_id} className='ctmdmw_h_btn_container'>
                        <div id={ctmdmw_complaint_btn_title_id} className='ctmdmw_h_btn_title btn_opacity' onClick={onComplaintSelectFunc}>Plaintes</div>
                        <div id='ctmdmw_complaint_filter_selector' className='glass'>
                            <div className='ctmdmw_complaint_filter_option btn_opacity' onClick={() => setComplaintFilterFunc({ filter: 'non_traites' })}>Non traités <p className='ctmdmw_complaint_filter_opt_count'>(20)</p></div>
                            <div className='ctmdmw_complaint_filter_option btn_opacity' onClick={() => setComplaintFilterFunc({ filter: 'en_traitement' })}>En traitement <p className='ctmdmw_complaint_filter_opt_count'>(10)</p></div>
                            <div className='ctmdmw_complaint_filter_option btn_opacity' onClick={() => setComplaintFilterFunc({ filter: 'traites' })}>Traités <p className='ctmdmw_complaint_filter_opt_count'>(8)</p></div>
                        </div>
                    </div>

                    <div id={ctmdmw_product_btn_container_id} className='ctmdmw_h_btn_container btn_opacity' style={accountType.current !== 'customer' ? { backgroundColor: '#007aff' } : {}} onClick={onProductSelectFunc}>
                        <div id={ctmdmw_product_btn_title_id} className='ctmdmw_h_btn_title' style={accountType.current !== 'customer' ? { color: 'white' } : {}}>Produits</div>
                    </div>

                    <div className='ctmdmw_hv_separator' />

                    <div id='ctmdmw_h_search_container'>
                        <img id='ctmdmw_h_search_icon' src={search_icon} />
                        <input id='ctmdmw_h_search_bar' type='text' placeholder='Search' />
                    </div>

                    <div className='ctmdmw_hv_separator' />

                    <div id='ctmdmw_add_btn_container'>
                        <div id='ctmdmw_add_btn_title' className='btn_opacity' onClick={onAddProduitComplaintFunc}>+ Ajouter</div>
                        <div id='ctmdmw_add_option_container'>
                            <div className='ctmdmw_add_option_title btn_opacity' onClick={addProductFunc}>Produit</div>
                            <div className='ctmdmw_title_separator' />
                            <div className='ctmdmw_add_option_title btn_opacity' onClick={addComplaintFunc}>Plainte</div>
                        </div>
                    </div>
                </div>
            </div>

            <div /* Body */ className='ctmdmw_body'>
                <StatsDashboardMainWidget ref={statsDashboardMainRef} $data={{ wid: 'statsDashboardMainRef', refId: statsDashboardMainRef, controllerRef: controllerRef, rootControllers: rootControllers }} />
                <ProductDashboardMainWidget ref={productDashboardMainRef} $data={{ wid: 'productDashboardMainRef', refId: productDashboardMainRef, controllerRef: controllerRef, rootControllers: rootControllers }} />
                <ComplaintDashboardMainWidget ref={complaintDashboardMainRef} $data={{ wid: 'complaintDashboardMainRef', refId: complaintDashboardMainRef, controllerRef: controllerRef, rootControllers: rootControllers }} />
            </div>
        </div>
    </>;
    return (render.current ? component : <></>);
};

export default forwardRef(CustomerDashboardMainWidget);
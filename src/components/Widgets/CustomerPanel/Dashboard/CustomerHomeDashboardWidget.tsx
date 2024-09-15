/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import './CustomerHomeDashboardWidget.css';
import { generateIdFunc } from '../../../Tools/methodForest';
import { language } from '../../../Tools/language';
import { refIdType } from '../../../Tools/type';
import { _defaultLanguage_ } from '../../../Tools/constants';
import search_icon from '../../../Assets/png/search_0.png';
import StatsDashboardMainWidget from '../../StatsDashboard/StatsDashboardMainWidget';

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
const CustomerHomeDashboardWidget = (props: propsType, ref: any) => {
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

    const wid = data.wid;

    const refId = data.refId;

    const controllerRef = data.controllerRef; /* callCMainControllerRef */

    const rootControllers = data.rootControllers;

    /* Root controllers */

    const mainControllerRef: refIdType = rootControllers.mainControllerRef;

    const requestControllerRef: refIdType = rootControllers.requestControllerRef;

    const dataStoreControllerRef: refIdType = rootControllers.dataStoreControllerRef;

    /* - */

    const emptyRef = useRef(undefined);

    const currentUserData = dataStoreControllerRef.current.currentUserData;

    const ctmdmw_home_btn_container_id = useRef(generateIdFunc()).current;
    const ctmdmw_home_btn_title_id = useRef(generateIdFunc()).current;

    const ctmdmw_product_btn_container_id = useRef(generateIdFunc()).current;
    const ctmdmw_product_btn_title_id = useRef(generateIdFunc()).current;

    const ctmdmw_complaint_btn_container_id = useRef(generateIdFunc()).current;
    const ctmdmw_complaint_btn_title_id = useRef(generateIdFunc()).current;

    const ctmhdw_scaffold_id = useRef(generateIdFunc()).current;

    const didAddBtnTouched = useRef(false);

    const didAddBtnSubOptionShown = useRef(false);

    const statsDashboardMainRef = useRef<any>(undefined);
    const productDashboardMainRef = useRef<any>(undefined);
    const complaintDashboardMainRef = useRef<any>(undefined);

    const currentMenuSelected = useRef<'home' | 'product' | 'complaint'>('home');

    const isComplaintFilterVisible = useRef(false);

    const scaffold_id = useRef(generateIdFunc()).current;


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

    /* Show | Hide */
    const showFunc = (x: { show: boolean }) => {
        $(`#${scaffold_id}`).css({ transform: `translateY(${x.show ? '0%' : '-100%'})` });
    };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        refreshFunc() { refreshFunc() },
        renderFunc(x: any) { renderFunc(x) },
        setLanguageFunc(x: any) { setLanguageFunc(x) },
        showFunc(x: any) { showFunc(x) }
    }), []);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            (controllerRef.current !== undefined) && controllerRef.current.addWidgetRefFunc({ wid: wid, refId: refId });
            controllerRef.current.showDashboardFunc({ type: 'home' });
        }
    }, []);

    /* On window size change */
    // useEffect(() => {
    //     window.addEventListener('resize', onWindowSizeChangeFunc);
    //     return () => window.removeEventListener('resize', onWindowSizeChangeFunc);
    // }, []);
    {/* <StatsDashboardMainWidget ref={statsDashboardMainRef} $data={{ wid: 'statsDashboardMainRef', refId: statsDashboardMainRef, controllerRef: controllerRef, rootControllers: rootControllers }} /> */ }


    /* Return */


    const component = <>
        <div id={scaffold_id} className='ctmhdw_scaffold just_column'>
            <div id='ctmhdw_top_container' className='just_row'>
                <div id='ctmhdw_agence_list_container'>

                </div>

                <div id='ctmhdw_circular_stats_container'>

                </div>
            </div>

            <div id='ctmhdw_bottom_container' className='just_row'></div>
        </div>
    </>;
    return (render.current ? component : <></>);
};

export default forwardRef(CustomerHomeDashboardWidget);
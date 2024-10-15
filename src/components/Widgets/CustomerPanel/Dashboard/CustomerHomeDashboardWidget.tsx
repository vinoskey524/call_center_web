/* Standard packages */
import React, { useState, memo, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { VictoryPie, VictoryLine } from 'victory';
import { AreaChart } from '@mantine/charts';
import { ResponsivePieCanvas } from '@nivo/pie'
import $ from 'jquery';

/* Custom packages */
import './CustomerHomeDashboardWidget.css';
import { generateIdFunc } from '../../../Tools/methodForest';
import { refIdType } from '../../../Tools/type';
import { _defaultLanguage_ } from '../../../Tools/constants';
import FeedListWidget from '../../FeedList/FeedListWidget';
import search_icon from '../../../Assets/png/search_0.png';

const areaData = [
    {
        key: '',
        date: 'Mar 22',
        data: 50,
    },
    {
        key: '',
        date: 'Mar 23',
        data: 60,
    },
    {
        key: '',
        date: 'Mar 24',
        data: 40,
    },
    {
        key: '',
        date: 'Mar 25',
        data: 30,
    },
    {
        key: '',
        date: 'Mar 26',
        data: 0,
    },
    {
        key: '',
        date: 'Mar 27',
        data: 20,
    },
    {
        key: '',
        date: 'Mar 28',
        data: 20,
    },
    {
        key: '',
        date: 'Mar 29',
        data: 10,
    },
];


/** Every change made to "wid" affect controller */
type propsType = { $data: { wid: string, controllerRef: refIdType, rootControllers: any } };
const CustomerHomeDashboardWidget = forwardRef((props: propsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const refId: refIdType = ref;

    const windowWidth = useRef(window.innerWidth);
    const windowHeight = useRef(window.innerHeight);

    const refresher = useRef(false);
    const [refresh, setRefresh] = useState(refresher.current);

    const isMounted = useRef(false);
    const mountCount = useRef(0);
    const render = useRef(true);

    const broadcastIndex = useRef(-1);

    /* $data */
    const $data = props.$data;
    const wid = useRef($data.wid || generateIdFunc()).current;
    const controllerRef = $data.controllerRef;
    const rootControllers = $data.rootControllers || { current: undefined };

    /* Root controllers */
    const mainRootControllerRef: refIdType = rootControllers?.current?.mainRootControllerRef;
    const requestRootControllerRef: refIdType = rootControllers?.current?.requestRootControllerRef;
    const dataStoreRootControllerRef: refIdType = rootControllers?.current?.dataStoreRootControllerRef;

    /* - */

    const traduction = useRef(dataStoreRootControllerRef.current.traduction.current);

    const currentUserData = useRef(dataStoreRootControllerRef.current.currentUserData);

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

    const customerComplaintPerObjectRef = useRef<any>(undefined);
    const customerComplaintPerProductRef = useRef<any>(undefined);
    const customerTopProductRef = useRef<any>(undefined);
    const customerComplaintPieStatsRef = useRef<any>(undefined);
    const customerComplaintTendanceRef = useRef<any>(undefined);
    const customerProductInfoTendanceRef = useRef<any>(undefined);


    /* ------------------------------------ Methods ------------------------------------- */

    /* Refresh component */
    const refreshFunc = () => { refresher.current = !refresher.current; setRefresh(refresher.current) };

    /* Render */
    const renderFunc = (x: { render: boolean }) => { render.current = x.render; refreshFunc() };

    /* Set language */
    const setTraductionFunc = (x: { traduction: any }) => { traduction.current = x.traduction; /* refreshFunc() */ };

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
        mainRootControllerRef?.current?.deleteRefIdFunc({ wid: wid, refId: refId });
        controllerRef?.current?.deleteRefIdFunc({ wid: wid, refId: refId });
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
            const productCreationMainRef: refIdType = mainRootControllerRef.current.productCreationMainRef;
            productCreationMainRef.current.showFunc({ show: true });
            onAddProduitComplaintFunc();
        }
    };

    /* Add complaint */
    const addComplaintFunc = () => {
        if (didAddBtnSubOptionShown.current) {
            const complaintCreationRef: refIdType = mainRootControllerRef.current.complaintCreationRef;
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

    /* Imperative handler */
    useImperativeHandle(ref, () => ({
        refreshFunc() { refreshFunc() },
        renderFunc(x: any) { renderFunc(x) },
        setTraductionFunc(x: any) { setTraductionFunc(x) },
        showFunc(x: any) { showFunc(x) }
    }), []);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            broadcastIndex.current = mainRootControllerRef.current.addToBroadcastDomainFunc({ wid: wid, refId: refId });
            mainRootControllerRef.current.addRefIdFunc({ wid: wid, refId: refId });
            controllerRef?.current?.addRefIdFunc({ wid: wid, refId: refId });
            controllerRef.current.showDashboardFunc({ type: 'home' });
        }
    }, []);

    /* On window size change */
    useEffect(() => {
        // window.addEventListener('resize', onWindowSizeChangeFunc);
        // return () => window.removeEventListener('resize', onWindowSizeChangeFunc);
    }, []);


    /* Return */

    const component = <>
        <div id={scaffold_id} className='ctmhdw_scaffold just_column'>
            <div id='ctmhdw_top_container' className='just_row'>
                <div className='ctmhdw_top_sub_container'>
                    <div className='ctmhdw_tsc_title ellipsis_line_2'>Plaintes</div>
                    <div className='ctmhdw_tsc_subtitle ellipsis_line_2'>145</div>
                </div>

                <div className='ctmhdw_top_sub_container'>
                    <div className='ctmhdw_tsc_title ellipsis_line_2'>Plaintes traitées</div>
                    <div className='ctmhdw_tsc_subtitle ellipsis_line_2'>100</div>
                </div>

                <div className='ctmhdw_top_sub_container'>
                    <div className='ctmhdw_tsc_title ellipsis_line_2'>Plaintes en traitement</div>
                    <div className='ctmhdw_tsc_subtitle ellipsis_line_2'>40</div>
                </div>

                <div className='ctmhdw_top_sub_container'>
                    <div className='ctmhdw_tsc_title ellipsis_line_2'>Plaintes non traitées</div>
                    <div className='ctmhdw_tsc_subtitle ellipsis_line_2'>5</div>
                </div>
            </div>

            <div id='ctmhdw_bottom_container' className='just_row'>
                <div /* complaint */ id='ctmhdw_complaint_stats' className='just_row'>
                    <div id='ctmhdw_complaint_agency' className='just_column'>
                        <CustomerComplaintPerObjectWidget ref={customerComplaintPerObjectRef} $data={{ wid: 'customerComplaintPerObjectRef', controllerRef: controllerRef, rootControllers: rootControllers }} />
                        <CustomerComplaintPerProductWidget ref={customerComplaintPerProductRef} $data={{ wid: 'customerComplaintPerProductRef', controllerRef: controllerRef, rootControllers: rootControllers }} />
                    </div>

                    <div id='ctmhdw_complaint_column' className='just_column'>
                        <CustomerComplaintPieStatsWidget ref={customerComplaintPieStatsRef} $data={{ wid: 'customerComplaintPieStatsRef', controllerRef: controllerRef, rootControllers: rootControllers }} />

                        <div id='ctmhdw_container_under_circle' className='just_row'>
                            <div id='ctmhdw_tendance_container' className='just_column'>
                                <CustomerComplaintTendanceWidget ref={customerComplaintTendanceRef} $data={{ wid: 'customerComplaintTendanceRef', controllerRef: controllerRef, rootControllers: rootControllers }} />
                                <CustomerProductInfoTendanceWidget ref={customerProductInfoTendanceRef} $data={{ wid: 'customerProductInfoTendanceRef', controllerRef: controllerRef, rootControllers: rootControllers }} />
                            </div>

                            <CustomerTopProductWidget ref={customerTopProductRef} $data={{ wid: 'customerTopProductRef', controllerRef: controllerRef, rootControllers: rootControllers }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>;
    return (render.current ? component : <></>);
});
export default (CustomerHomeDashboardWidget);

































/* ----------------------------------------------------- Direct Child Component ----------------------------------------------------- */



const feedData = [
    { title: 'Bohicon', complaintCount: 15 },
    { title: 'Nikki', complaintCount: 8 },
    { title: 'Cotonou', complaintCount: 5 },
    { title: 'Calavi', complaintCount: 2 },
    { title: 'Calavi', complaintCount: 2 },
    { title: 'Calavi', complaintCount: 2 },
    { title: 'Calavi', complaintCount: 2 },
    { title: 'Calavi', complaintCount: 2 },
    { title: 'Calavi', complaintCount: 2 },
    { title: 'Calavi', complaintCount: 2 },
    { title: 'Calavi', complaintCount: 2 },
    { title: 'Calavi', complaintCount: 2 },
    { title: 'Calavi', complaintCount: 2 },
    { title: 'Calavi', complaintCount: 2 },
    { title: 'Calavi', complaintCount: 2 },
    { title: 'Calavi', complaintCount: 2 },
    { title: 'Calavi', complaintCount: 2 },
    { title: 'Calavi', complaintCount: 2 },
];















/* Complaint per object */
type ccpowPropsType = { $data: { wid: string, controllerRef: refIdType, rootControllers: any } };
const __customerComplaintPerObjectWidget = forwardRef((props: ccpowPropsType, ref: any) => {
    /* ----------------------------------------------------------- Constants ----------------------------------------------------------- */

    const refId: refIdType = ref;

    const isMounted = useRef(false);
    const mountCount = useRef(0);
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

    /* - */
    const objectStatsFeedListRef = useRef<any>(undefined);


    /* ----------------------------------------------------------- Methods ------------------------------------------------------------ */

    /* Unmount */
    const unmountFunc = () => {
        /* Prevent from first unmounting caused by "strictMode" */
        mountCount.current += 1; if (mountCount.current === 1) return;

        /* unmount logic */
        mainRootControllerRef?.current?.deleteFromBroadcastDomainFunc({ index: broadcastIndex.current });
        mainRootControllerRef?.current?.deleteRefIdFunc({ wid: wid, refId: refId });
        controllerRef?.current?.deleteRefIdFunc({ wid: wid, refId: refId });
    };


    /* ----------------------------------------------------------- Hooks ----------------------------------------------------------- */

    /* Imperative handler */
    useImperativeHandle(ref, () => ({
    }), []);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            broadcastIndex.current = mainRootControllerRef.current.addToBroadcastDomainFunc({ wid: wid, refId: refId });
            mainRootControllerRef.current.addRefIdFunc({ wid: wid, refId: refId });
            controllerRef?.current?.addRefIdFunc({ wid: wid, refId: refId });

            setTimeout(() => { controllerRef.current.setComplaintObjectStatsDataFunc({ data: feedData }) }, 100);
        }
        return () => unmountFunc();
    }, []);


    /* return */

    const component = <>
        <div id='ctmhdw_n_complaint_per_object'>
            <div className='ctmhdw_n_complaint_per_x_header'>
                <div className='ctmhdw_n_complaint_per_x_title'>Nombre de plaintes par object</div>
            </div>
            <div className='ctmhdw_n_complaint_per_x_body'>
                <FeedListWidget ref={objectStatsFeedListRef} $data={{
                    wid: 'objectStatsFeedListRef', controllerRef: controllerRef, rootControllers: rootControllers, customerControllerWid: 'objectStatsFeedListControllerRef', paddingTop: 35,
                    widget: ({ _key, _refId, _data }: any) => { return <StatsAgencyFeedWidget key={_key} ref={_refId} $data={{ controllerRef: controllerRef, rootControllers: rootControllers, feed: _data }} /> }
                }} />
            </div>
        </div>
    </>;
    return (component);
});
const CustomerComplaintPerObjectWidget = memo(__customerComplaintPerObjectWidget);















/* Complaint per product */
type ccppwPropsType = { $data: { wid: string, controllerRef: refIdType, rootControllers: any } };
const CustomerComplaintPerProductWidget = forwardRef((props: ccppwPropsType, ref: any) => {
    /* ----------------------------------------------------------- Constants ----------------------------------------------------------- */

    const refId: refIdType = ref;

    const isMounted = useRef(false);
    const mountCount = useRef(0);
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

    /* - */
    const productStatsFeedListRef = useRef<any>(undefined);


    /* ----------------------------------------------------------- Methods ----------------------------------------------------------- */

    /* Unmount */
    const unmountFunc = () => {
        /* Prevent from first unmounting caused by "strictMode" */
        mountCount.current += 1; if (mountCount.current === 1) return;

        /* unmount logic */
        mainRootControllerRef?.current?.deleteFromBroadcastDomainFunc({ index: broadcastIndex.current });
        mainRootControllerRef?.current?.deleteRefIdFunc({ wid: wid, refId: refId });
        controllerRef?.current?.deleteRefIdFunc({ wid: wid, refId: refId });
    };


    /* ----------------------------------------------------------- Hooks ----------------------------------------------------------- */

    /* Imperative handler */
    useImperativeHandle(ref, () => ({
    }), []);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            broadcastIndex.current = mainRootControllerRef.current.addToBroadcastDomainFunc({ wid: wid, refId: refId });
            mainRootControllerRef.current.addRefIdFunc({ wid: wid, refId: refId });
            controllerRef?.current?.addRefIdFunc({ wid: wid, refId: refId });

            setTimeout(() => { controllerRef.current.setProductStatsDataFunc({ data: feedData }) }, 100);
        }
        return () => unmountFunc();
    }, []);


    /* Return */

    const component = <>
        <div id='ctmhdw_n_complaint_per_product'>
            <div className='ctmhdw_n_complaint_per_x_header'>
                <div className='ctmhdw_n_complaint_per_x_title'>Nombre de plaintes par product</div>
            </div>
            <div className='ctmhdw_n_complaint_per_x_body'>
                <FeedListWidget ref={productStatsFeedListRef} $data={{
                    wid: 'productStatsFeedListRef', controllerRef: controllerRef, rootControllers: rootControllers, customerControllerWid: 'productStatsFeedListControllerRef', paddingTop: 35,
                    widget: ({ _key, _refId, _data }: any) => { return <StatsAgencyFeedWidget key={_key} ref={_refId} $data={{ controllerRef: controllerRef, rootControllers: rootControllers, feed: _data }} /> }
                }} />
            </div>
        </div>
    </>
    return (component);
});















/* Complaint pie stats */
type ccpswPropsType = { $data: { wid: string, controllerRef: refIdType, rootControllers: any } };
const CustomerComplaintPieStatsWidget = forwardRef((props: ccpswPropsType, ref: any) => {
    /* ----------------------------------------------------------- Constants ----------------------------------------------------------- */

    const refId: refIdType = ref;

    const isMounted = useRef(false);
    const mountCount = useRef(0);
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

    /* - */
    const pieData = [
        {
            "id": "Agence de hack",
            "label": "Agence de hack",
            "value": 502,
            "color": "hsl(116, 70%, 50%)"
        },
        {
            "id": "Agence de css",
            "label": "Agence de css",
            "value": 472,
            "color": "hsl(246, 70%, 50%)"
        },
        {
            "id": "Agence de sass",
            "label": "Agence de sass",
            "value": 462,
            "color": "hsl(81, 70%, 50%)"
        },
        {
            "id": "Agence de rust",
            "label": "Agence de rust",
            "value": 97,
            "color": "hsl(246, 70%, 50%)"
        },
        {
            "id": "Agence de haskell",
            "label": "Agence de haskell",
            "value": 421,
            "color": "hsl(68, 70%, 50%)"
        },
        {
            "id": "Agence de elixir",
            "label": "Agence de elixir",
            "value": 41,
            "color": "hsl(213, 70%, 50%)"
        },
        {
            "id": "Agence de scala",
            "label": "Agence de scala",
            "value": 239,
            "color": "hsl(316, 70%, 50%)"
        },
        {
            "id": "Agence de ruby",
            "label": "Agence de ruby",
            "value": 363,
            "color": "hsl(193, 70%, 50%)"
        },
        {
            "id": "Agence de javascript",
            "label": "Agence de javascript",
            "value": 412,
            "color": "hsl(169, 70%, 50%)"
        },
        {
            "id": "Agence de stylus",
            "label": "Agence de stylus",
            "value": 507,
            "color": "hsl(271, 70%, 50%)"
        },
        {
            "id": "Agence de c",
            "label": "Agence de c",
            "value": 535,
            "color": "hsl(252, 70%, 50%)"
        },
        {
            "id": "Agence de python",
            "label": "Agence de python",
            "value": 105,
            "color": "hsl(34, 70%, 50%)"
        },
        {
            "id": "Agence de erlang",
            "label": "Agence de erlang",
            "value": 90,
            "color": "hsl(112, 70%, 50%)"
        },
        {
            "id": "Agence de php",
            "label": "Agence de php",
            "value": 272,
            "color": "hsl(63, 70%, 50%)"
        },
        {
            "id": "Agence de java",
            "label": "Agence de java",
            "value": 125,
            "color": "hsl(200, 70%, 50%)"
        },
        {
            "id": "Agence de go",
            "label": "Agence de go",
            "value": 154,
            "color": "hsl(193, 70%, 50%)"
        },
        {
            "id": "Agence de make",
            "label": "Agence de make",
            "value": 402,
            "color": "hsl(210, 70%, 50%)"
        },
        {
            "id": "Agence de lisp",
            "label": "Agence de lisp",
            "value": 264,
            "color": "hsl(10, 70%, 50%)"
        }
    ];

    /* ----------------------------------------------------------- Methods ----------------------------------------------------------- */

    /* Unmount */
    const unmountFunc = () => {
        /* Prevent from first unmounting caused by "strictMode" */
        mountCount.current += 1; if (mountCount.current === 1) return;

        /* unmount logic */
        mainRootControllerRef?.current?.deleteFromBroadcastDomainFunc({ index: broadcastIndex.current });
        mainRootControllerRef?.current?.deleteRefIdFunc({ wid: wid, refId: refId });
        controllerRef?.current?.deleteRefIdFunc({ wid: wid, refId: refId });
    };


    /* ----------------------------------------------------------- Hooks ----------------------------------------------------------- */

    /* Imperative handler */
    useImperativeHandle(ref, () => ({
    }), []);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            broadcastIndex.current = mainRootControllerRef.current.addToBroadcastDomainFunc({ wid: wid, refId: refId });
            mainRootControllerRef.current.addRefIdFunc({ wid: wid, refId: refId });
            controllerRef?.current?.addRefIdFunc({ wid: wid, refId: refId });

            setTimeout(() => { controllerRef.current.setProductStatsDataFunc({ data: feedData }) }, 100);
        }
        return () => unmountFunc();
    }, []);


    /* Return */

    const component = <>
        <div id='ctmhdw_complaint_circle'>
            <ResponsivePieCanvas
                data={pieData}
                margin={{ top: 40, right: 200, bottom: 40, left: 80 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                colors={{ scheme: 'paired' }}
                borderColor={{ from: 'color', modifiers: [['darker', 0.6]] }}

                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#9e9e9e"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color' }}
                arcLinkLabelsStraightLength={12}

                arcLabelsSkipAngle={10}
                arcLabelsTextColor="#333333"

                legends={[
                    {
                        anchor: 'right',
                        direction: 'column',
                        justify: false,
                        translateX: 140,
                        translateY: 0,
                        itemsSpacing: 2,
                        itemWidth: 60,
                        itemHeight: 14,
                        itemTextColor: '#999',
                        itemDirection: 'left-to-right',
                        itemOpacity: 1,
                        symbolSize: 14,
                        symbolShape: 'circle'
                    }
                ]}
            />
        </div>
    </>
    return (component);
});















/* Complaint tendance */
type cctwPropsType = { $data: { wid: string, controllerRef: refIdType, rootControllers: any } };
const __customerComplaintTendanceWidget = forwardRef((props: cctwPropsType, ref: any) => {
    /* ----------------------------------------------------------- Constants ----------------------------------------------------------- */

    const refId: refIdType = ref;

    const isMounted = useRef(false);
    const mountCount = useRef(0);
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

    /* - */


    /* ----------------------------------------------------------- Methods ----------------------------------------------------------- */

    /* Unmount */
    const unmountFunc = () => {
        /* Prevent from first unmounting caused by "strictMode" */
        mountCount.current += 1; if (mountCount.current === 1) return;

        /* unmount logic */
        mainRootControllerRef?.current?.deleteFromBroadcastDomainFunc({ index: broadcastIndex.current });
        mainRootControllerRef?.current?.deleteRefIdFunc({ wid: wid, refId: refId });
        controllerRef?.current?.deleteRefIdFunc({ wid: wid, refId: refId });
    };


    /* ----------------------------------------------------------- Hooks ----------------------------------------------------------- */

    /* Imperative handler */
    useImperativeHandle(ref, () => ({
    }), []);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            broadcastIndex.current = mainRootControllerRef.current.addToBroadcastDomainFunc({ wid: wid, refId: refId });
            mainRootControllerRef.current.addRefIdFunc({ wid: wid, refId: refId });
            controllerRef?.current?.addRefIdFunc({ wid: wid, refId: refId });

            setTimeout(() => { controllerRef.current.setProductStatsDataFunc({ data: feedData }) }, 100);
        }
        return () => unmountFunc();
    }, []);


    /* Return */

    const component = <>
        <div id='ctmhdw_complaint_tendance'>
            <AreaChart
                w={'90%'}
                h={100}
                data={areaData}
                dataKey='date'
                xAxisProps={{ padding: { left: 10, right: 10 } }}
                yAxisProps={{ domain: [0, 100] }}
                withXAxis={false}
                withYAxis={false}
                series={[{ name: 'data', color: 'indigo.6' }]}
            />
        </div>
    </>;
    return (component);
});
const CustomerComplaintTendanceWidget = memo(__customerComplaintTendanceWidget);














/* Product info tendance */
type cpitwPropsType = { $data: { wid: string, controllerRef: refIdType, rootControllers: any } };
const __customerProductInfoTendanceWidget = forwardRef((props: cpitwPropsType, ref: any) => {
    /* ----------------------------------------------------------- Constants ----------------------------------------------------------- */

    const refId: refIdType = ref;

    const isMounted = useRef(false);
    const mountCount = useRef(0);
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

    /* - */


    /* ----------------------------------------------------------- Methods ----------------------------------------------------------- */

    /* Unmount */
    const unmountFunc = () => {
        /* Prevent from first unmounting caused by "strictMode" */
        mountCount.current += 1; if (mountCount.current === 1) return;

        /* unmount logic */
        mainRootControllerRef?.current?.deleteFromBroadcastDomainFunc({ index: broadcastIndex.current });
        mainRootControllerRef?.current?.deleteRefIdFunc({ wid: wid, refId: refId });
        controllerRef?.current?.deleteRefIdFunc({ wid: wid, refId: refId });
    };


    /* ----------------------------------------------------------- Hooks ----------------------------------------------------------- */

    /* Imperative handler */
    useImperativeHandle(ref, () => ({
    }), []);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            broadcastIndex.current = mainRootControllerRef.current.addToBroadcastDomainFunc({ wid: wid, refId: refId });
            mainRootControllerRef.current.addRefIdFunc({ wid: wid, refId: refId });
            controllerRef?.current?.addRefIdFunc({ wid: wid, refId: refId });

            setTimeout(() => { controllerRef.current.setProductStatsDataFunc({ data: feedData }) }, 100);
        }
        return () => unmountFunc();
    }, []);


    /* Return */

    const component = <>
        <div id='ctmhdw_info_tendance'>
            <AreaChart
                w={'90%'}
                h={100}
                data={areaData}
                dataKey='date'
                xAxisProps={{ padding: { left: 10, right: 10 } }}
                yAxisProps={{ domain: [0, 100] }}
                withXAxis={false}
                withYAxis={false}
                series={[{ name: 'data', color: 'red.6' }]}
            />
        </div>
    </>;
    return (component);
});
const CustomerProductInfoTendanceWidget = memo(__customerProductInfoTendanceWidget);

















/* Complaint per product */
type ctpwPropsType = { $data: { wid: string, controllerRef: refIdType, rootControllers: any } };
const __customerTopProductWidget = forwardRef((props: ctpwPropsType, ref: any) => {
    /* ----------------------------------------------------------- Constants ----------------------------------------------------------- */

    const refId: refIdType = ref;

    const isMounted = useRef(false);
    const mountCount = useRef(0);
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

    /* - */


    /* ----------------------------------------------------------- Methods ----------------------------------------------------------- */

    /* Unmount */
    const unmountFunc = () => {
        /* Prevent from first unmounting caused by "strictMode" */
        mountCount.current += 1; if (mountCount.current === 1) return;

        /* unmount logic */
        mainRootControllerRef?.current?.deleteFromBroadcastDomainFunc({ index: broadcastIndex.current });
        mainRootControllerRef?.current?.deleteRefIdFunc({ wid: wid, refId: refId });
        controllerRef?.current?.deleteRefIdFunc({ wid: wid, refId: refId });
    };


    /* ----------------------------------------------------------- Hooks ----------------------------------------------------------- */

    /* Imperative handler */
    useImperativeHandle(ref, () => ({
    }), []);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            broadcastIndex.current = mainRootControllerRef.current.addToBroadcastDomainFunc({ wid: wid, refId: refId });
            mainRootControllerRef.current.addRefIdFunc({ wid: wid, refId: refId });
            controllerRef?.current?.addRefIdFunc({ wid: wid, refId: refId });

            setTimeout(() => { controllerRef.current.setProductStatsDataFunc({ data: feedData }) }, 100);
        }
        return () => unmountFunc();
    }, []);


    /* Return */

    const component = <>
        <div id='ctmhdw_product_info'>
            <div className='ctmhdw_n_complaint_per_x_header'>
                <div className='ctmhdw_n_complaint_per_x_title'>Top 100 des produits ou services qui intéressent les clients</div>
            </div>
            <div className='ctmhdw_n_complaint_per_x_body'></div>
        </div>
    </>
    return (component);
});
const CustomerTopProductWidget = memo(__customerTopProductWidget);
















/* Agency Feed */
type safwPropsType = { $data: { wid?: string, controllerRef: refIdType, rootControllers: any, feed: any } };
const __statsAgencyFeedWidget = forwardRef((props: safwPropsType, ref: any) => {
    /* ----------------------------------------------------------- Constants ----------------------------------------------------------- */

    const refId: refIdType = ref;

    const isMounted = useRef(false);
    const mountCount = useRef(0);
    const broadcastIndex = useRef(-1);

    /* $data */
    const $data = props.$data;
    const wid = useRef($data.wid || generateIdFunc()).current;
    const controllerRef = $data.controllerRef;
    const rootControllers = $data.rootControllers;
    const feed = useRef($data.feed);

    /* Root controllers */
    const mainRootControllerRef: refIdType = rootControllers?.current?.mainRootControllerRef;
    const requestRootControllerRef: refIdType = rootControllers?.current?.requestRootControllerRef;
    const dataStoreRootControllerRef: refIdType = rootControllers?.current?.dataStoreRootControllerRef;

    /* - */


    /* ----------------------------------------------------------- Methods ----------------------------------------------------------- */

    /* Unmount */
    const unmountFunc = () => {
        /* Prevent from first unmounting caused by "strictMode" */
        mountCount.current += 1; if (mountCount.current === 1) return;

        /* unmount logic */
        mainRootControllerRef?.current?.deleteFromBroadcastDomainFunc({ index: broadcastIndex.current });
        mainRootControllerRef?.current?.deleteRefIdFunc({ wid: wid, refId: refId });
        controllerRef?.current?.deleteRefIdFunc({ wid: wid, refId: refId });
    };


    /* ----------------------------------------------------------- Hooks ----------------------------------------------------------- */

    /* Imperative handler */
    useImperativeHandle(ref, () => ({
    }), []);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            broadcastIndex.current = mainRootControllerRef.current.addToBroadcastDomainFunc({ wid: wid, refId: refId });
            mainRootControllerRef.current.addRefIdFunc({ wid: wid, refId: refId });
            controllerRef?.current?.addRefIdFunc({ wid: wid, refId: refId });

            setTimeout(() => { controllerRef.current.setProductStatsDataFunc({ data: feedData }) }, 100);
        }
        return () => unmountFunc();
    }, []);


    /* Return */

    const component = <>
        <div className='ctmhdw_sa_scaffold'>
            <div className='ctmhdw_sa_title_container'>
                <div className='ctmhdw_sa_title ellipsis_line_1'>{feed.current.title}</div>
                <div className='ctmhdw_sa_count'>{feed.current.complaintCount}</div>
            </div>
            <div className='ctmhdw_sa_per'><div className='ctmhdw_sa_per_jauge' style={{ width: '40' + '%', backgroundColor: '#4D6EF6' }} /></div>
        </div>
    </>
    return (component);
});
const StatsAgencyFeedWidget = memo(__statsAgencyFeedWidget);
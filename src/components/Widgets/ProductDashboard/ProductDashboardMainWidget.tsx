/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import './ProductDashboardMainWidget.css';
import { generateIdFunc } from '../../Tools/methodForest';
import { language } from '../../Tools/language';
import { refIdType } from '../../Tools/type';
import { _defaultLanguage_ } from '../../Tools/constants';
import ProductFeedWidget from './ProductFeedWidget';
import ProductDashboardControllerWidget from './ProductDashboardControllerWidget';
import FeedListWidget from '../FeedList/FeedListWidget';

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
const ProductDashboardMainWidget = (props: propsType, ref: any) => {
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

    const controllerRef = data.controllerRef;

    const rootControllers = data.rootControllers;

    /* Root controllers */

    const mainControllerRef: refIdType = rootControllers.mainControllerRef;

    const requestControllerRef: refIdType = rootControllers.requestControllerRef;

    const dataStoreControllerRef: refIdType = rootControllers.dataStoreControllerRef;

    /* - */

    const prodmw_scaffold_id = useRef(generateIdFunc()).current;

    const emptyRef = useRef(undefined);

    const productFeedListRef = useRef<any>(undefined);

    const productFeedSearchListRef = useRef<any>(undefined);

    const productDashboardControllerRef = useRef(undefined);

    const prodmw_feed_search_list_id = useRef(generateIdFunc()).current;


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
    const showFunc = (x: { show: boolean }) => { $(`#${prodmw_scaffold_id}`).css({ 'z-index': x.show ? 1 : 0 }) };

    /* Show search list container */
    const showSearchListFunc = (x: { show: boolean }) => {
        $(`#${prodmw_feed_search_list_id}`).css({ transform: `translateX(${x.show ? '0%' : '100%'})` });
    };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        refreshFunc() { refreshFunc() },
        renderFunc(x: any) { renderFunc(x) },
        setLanguageFunc(x: any) { setLanguageFunc(x) },
        showFunc(x: any) { showFunc(x) },
        showSearchListFunc(x: any) { showSearchListFunc(x) },
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
        <div id={prodmw_scaffold_id} className='prodmw_scaffold'>
            <div className='prodmw_feed_list_container'>
                <div /* main list */ className='prodmw_feed_default_list'>
                    <FeedListWidget ref={productFeedListRef} $data={{
                        wid: 'productFeedListRef', refId: productFeedListRef, controllerRef: controllerRef, rootControllers: rootControllers, paddingTop: 60,
                        widget: ({ _key, _refId, _data }: any) => { return <ProductFeedWidget key={_key} ref={_refId} $data={{ refId: _refId, controllerRef: controllerRef, rootControllers: rootControllers, feed: _data }} /> }
                    }} />
                </div>

                <div /* search list */ id={prodmw_feed_search_list_id} className='prodmw_feed_search_list'>
                    <FeedListWidget ref={productFeedSearchListRef} $data={{
                        wid: 'productFeedSearchListRef', refId: productFeedSearchListRef, controllerRef: controllerRef, rootControllers: rootControllers, paddingTop: 60,
                        widget: ({ _key, _refId, _data }: any) => { return <ProductFeedWidget key={_key} ref={_refId} $data={{ refId: _refId, controllerRef: controllerRef, rootControllers: rootControllers, feed: _data }} /> }
                    }} />
                </div>

                <div className='prodmw_right_bar' />
            </div>

            <div /* preview */ id='prodmw_feed_preview'>
                <div id='prodmw_feed_preview_wrapper' className='enable_select'></div>
            </div>
        </div>
        {/* <ProductDashboardControllerWidget ref={productDashboardControllerRef} $data={{ wid: 'productDashboardControllerRef', refId: productDashboardControllerRef, rootControllers: rootControllers }} /> */}
    </>;
    return (render.current ? component : <></>);
};

export default forwardRef(ProductDashboardMainWidget);
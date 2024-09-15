/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import './FeedListWidget.css';
import { generateIdFunc } from '../../Tools/methodForest';
import { _success_, _error_, _requestFailed_ } from '../../Tools/constants';
import { language } from '../../Tools/language';
import { refIdType } from '../../Tools/type';
import { _defaultLanguage_ } from '../../Tools/constants';
import FeedListControllerWidget from './FeedListControllerWidget';
import FeedContainerWidget from './FeedContainerWidget';
import LoadingWidget from '../Others/LoadingWidget';
import FeedListLoaderWidget from './FeedListLoaderWidget';
import FeedSubContainerWidget from './FeedSubContainerWidget';

/* Widget */
type propsType = {
    $data: {
        /** Every change made to "wid" affect controller */
        wid: string,
        refId: refIdType,
        controllerRef: refIdType,
        rootControllers: any,
        widget: any,
        initialFeed?: any[],
        paddingTop?: number
    }
};
const FeedListWidget = (props: propsType, ref: any) => {
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

    const widget = data.widget;

    const initialFeed = data.initialFeed || [];

    const paddingTop = data.paddingTop || 0;

    /* Root controllers */

    const mainControllerRef: refIdType = rootControllers.mainControllerRef;

    const requestControllerRef: refIdType = rootControllers.requestControllerRef;

    const dataStoreControllerRef: refIdType = rootControllers.dataStoreControllerRef;

    /* - */

    const emptyRef = useRef(undefined);

    const flw_scaffold_id = useRef(generateIdFunc()).current;

    const flw_top_msg_container_id = useRef(generateIdFunc()).current;
    const flw_bottom_msg_container_id = useRef(generateIdFunc()).current;

    const feedListControllerRef = useRef<any>(undefined);

    const feedMainSubContainerRef = useRef<any>(undefined);

    const flwTopLoadingRef = useRef<any>(undefined);
    const flwBottomLoadingRef = useRef<any>(undefined);

    const feedListLoaderRef = useRef<any>(undefined);


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

    /* Render feed */
    const renderFeedFunc = (x: { feed: any[], position: 'top' | 'bottom' }) => {
        const feed = x.feed, position = x.position;
        if (position.match(/top|bottom/)) {
        } else { console.error(`Position "${position}", isn't supported.`); }
    };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        flw_top_msg_container_id: flw_top_msg_container_id,
        flw_bottom_msg_container_id: flw_bottom_msg_container_id,

        refreshFunc() { refreshFunc() },
        renderFunc(x: any) { renderFunc(x) },
        setLanguageFunc(x: any) { setLanguageFunc(x) },
        renderFeedFunc(x: any) { renderFeedFunc(x) }
    }), [refresh]);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            (controllerRef.current !== undefined) && controllerRef.current.addWidgetRefFunc({ wid: wid, refId: feedListControllerRef }); /* controllerRef passed instead */
        }
    }, []);

    /* On window size change */
    // useEffect(() => {
    //     window.addEventListener('resize', onWindowSizeChangeFunc);
    //     return () => window.removeEventListener('resize', onWindowSizeChangeFunc);
    // }, []);


    /* Return */


    const component = <>
        <div id={flw_scaffold_id} className='flw_scaffold' style={{ paddingTop: paddingTop }}>
            <LoadingWidget ref={flwTopLoadingRef} $data={{ wid: 'flwTopLoadingRef', refId: flwTopLoadingRef, controllerRef: feedListControllerRef }} />
            <div id={flw_top_msg_container_id} className='flw_top_msg_container'></div>

            <FeedSubContainerWidget ref={feedMainSubContainerRef} $data={{ wid: 'feedMainSubContainerRef', refId: feedMainSubContainerRef, controllerRef: feedListControllerRef, rootControllers: rootControllers, widget: widget, position: 'top' }} />

            <div id={flw_bottom_msg_container_id} className='flw_top_msg_container'></div>
            <LoadingWidget ref={flwBottomLoadingRef} $data={{ wid: 'flwBottomLoadingRef', refId: flwBottomLoadingRef, controllerRef: feedListControllerRef }} />
        </div>

        <FeedListLoaderWidget ref={feedListLoaderRef} $data={{ wid: 'feedListLoaderRef', refId: feedListLoaderRef, controllerRef: feedListControllerRef }} />
        <FeedListControllerWidget ref={feedListControllerRef} $data={{ wid: 'feedListControllerRef', refId: feedListControllerRef, parentRef: refId, rootControllers: rootControllers, initialFeed: initialFeed }} />
    </>;
    return (render.current ? component : <></>);
};

export default forwardRef(FeedListWidget);
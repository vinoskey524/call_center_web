/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
// import './FeedSubContainerWidget.css';
import { generateIdFunc } from '../../Tools/methodForest';
import { _success_, _error_, _requestFailed_, _dev_ } from '../../Tools/constants';
import { language } from '../../Tools/language';
import { refIdType } from '../../Tools/type';
import { _defaultLanguage_ } from '../../Tools/constants';
import FeedContainerWidget from './FeedContainerWidget';

/* Widget */
type propsType = {
    $data: {
        /** Every change made to "wid" affect controller */
        wid: string,
        refId: refIdType,
        controllerRef: refIdType,
        rootControllers: any,
        widget: any,
        feed?: any[],
        position: 'top' | 'middle' | 'bottom'
    }
};
const FeedSubContainerWidget = (props: propsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const parentProps = props;

    const windowWidth = useRef(window.innerWidth);

    const windowHeight = useRef(window.innerHeight);

    const refresher = useRef(false);
    const [refresh, setRefresh] = useState(refresher.current);

    const isMounted = useRef(false);

    const render = useRef(false);

    const lang = useRef(_defaultLanguage_);

    const traduction = language[lang.current];

    /* $data */

    const data = props.$data;

    const wid = data.wid;

    const refId = data.refId;

    const controllerRef = data.controllerRef;

    const rootControllers = data.rootControllers;

    const widget = data.widget;

    const feed = data.feed || [];

    const position = data.position;

    /* Root controllers */

    const mainControllerRef: refIdType = rootControllers.mainControllerRef;

    const requestControllerRef: refIdType = rootControllers.requestControllerRef;

    const dataStoreControllerRef: refIdType = rootControllers.dataStoreControllerRef;

    /* - */

    const emptyRef = useRef(undefined);

    const Component = widget;

    const fscw_scaffold_id = useRef(generateIdFunc()).current;

    const feedContainerWid = useRef(generateIdFunc()).current;
    const feedContainerRef = useRef<any>(undefined);

    const feedData = useRef<any[]>(feed);
    const feedWidgetTab = useRef<any[]>([]);
    const refIdTab = useRef<refIdType[]>([]);

    const renderFeed = useRef(false);
    const renderContainer = useRef(false);


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
    const renderFeedFunc = (x: { data: any[] }) => {
        if (position === 'middle') {
            renderFeed.current = true;
            render.current = true;

            feedData.current = x.data;
            refIdTab.current = Array(feedData.current.length).fill(undefined).map(() => React.createRef());

            refreshFunc();

        } else { _dev_ && console.error(`Only a middle subcontainer can't render feeds !`) }
    };

    /* Render container */
    const renderContainerFunc = (x: { data: any[] }) => {
        if (position !== 'middle') {
            feedData.current = x.data;
            renderContainer.current = true;
            render.current = true;
            refreshFunc();

        } else { _dev_ && console.error(`A middle subcontainer can't render a container !`) }
    };

    /* Reset */
    const resetListFunc = () => {
        feedData.current = [];
        render.current = false;
        refreshFunc();
    };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        refreshFunc() { refreshFunc() },
        renderFunc(x: any) { renderFunc(x) },
        setLanguageFunc(x: any) { setLanguageFunc(x) },
        renderFeedFunc(x: any) { renderFeedFunc(x) },
        renderContainerFunc(x: any) { renderContainerFunc(x) },
        resetListFunc() { resetListFunc() }
    }), []);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            (controllerRef.current !== undefined) && controllerRef.current.addWidgetRefFunc({ wid: wid, refId: refId });

            /* Render feed if exists on mount */
            (feedData.current.length > 0 && position === 'middle') && refId.current.renderFeedFunc({ data: feedData.current });
        }
    }, []);

    /* On window size change */
    // useEffect(() => {
    //     window.addEventListener('resize', onWindowSizeChangeFunc);
    //     return () => window.removeEventListener('resize', onWindowSizeChangeFunc);
    // }, []);


    /* Return */


    /* Create feed */
    if (position === 'middle' && renderFeed.current && feedWidgetTab.current.length === 0) for (let i = 0; i < feedData.current.length; i++) feedWidgetTab.current.push(<Component key={i} _key={i} _refId={refIdTab.current[i]} _data={feedData.current[i]} />);

    /* - */
    const component = <>
        {/* <div id={fscw_scaffold_id} className='feed_subcontainer_scaffold' data-refid={refId} /> */}
        {renderFeed.current && <>{feedWidgetTab.current}</>}
        {(renderContainer.current && position !== 'middle') && <FeedContainerWidget ref={feedContainerRef} $data={{ wid: feedContainerWid, refId: feedContainerRef, controllerRef: controllerRef, rootControllers: rootControllers, widget: widget, position: position, feed: feedData.current }} />}
    </>;
    return (render.current ? component : <></>);
};

export default forwardRef(FeedSubContainerWidget);
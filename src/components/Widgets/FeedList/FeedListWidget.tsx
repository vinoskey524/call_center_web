/* Standard packages */
import React, { useState, memo, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import './FeedListWidget.css';
import { generateIdFunc, replaceConsecutiveSpacesByOneFunc } from '../../Tools/methodForest';
import { _dev_, _defaultLanguage_, _appEmitterType_, _success_, _error_, _requestFailed_ } from '../../Tools/constants';
import { refIdType } from '../../Tools/type';
import LoadingWidget from '../Others/LoadingWidget';

/* Widget */
type propsType = {
    $data: {
        /** Every change made to "wid" affect controller */
        wid: string,
        customerControllerWid?: string,
        controllerRef: refIdType,
        rootControllers: any,
        widget: any,
        initialFeed?: any[],
        paddingTop?: number
    }
};
const FeedListWidget = forwardRef((props: propsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const refId: refIdType = ref;

    const windowWidth = useRef(window.innerWidth);
    const windowHeight = useRef(window.innerHeight);

    const refresher = useRef(false);
    const [refresh, setRefresh] = useState(refresher.current);

    const isMounted = useRef(false);
    const mountCount = useRef(0);
    const render = useRef(true);

    const emptyRef = useRef<any>(undefined);
    const feedListControllerRef = useRef<any>(undefined);

    const broadcastIndex = useRef(-1);

    /* $data */
    const $data = props.$data;
    const wid = useRef($data.wid || generateIdFunc()).current;
    const controllerRef = $data.controllerRef;
    const rootControllers = $data.rootControllers || { current: undefined };
    const customerControllerWid = $data.customerControllerWid || 'feedListControllerRef';
    const widget = $data.widget;
    const initialFeed = $data.initialFeed || [];
    const paddingTop = $data.paddingTop || 0;

    /* Root controllers */
    const mainRootControllerRef: refIdType = rootControllers?.current?.mainRootControllerRef;
    const requestRootControllerRef: refIdType = rootControllers?.current?.requestRootControllerRef;
    const dataStoreRootControllerRef: refIdType = rootControllers?.current?.dataStoreRootControllerRef;

    /* - */

    const traduction = useRef(dataStoreRootControllerRef.current.traduction.current);

    const flw_scaffold_id = useRef(generateIdFunc()).current;

    const flw_top_msg_container_id = useRef(generateIdFunc()).current;
    const flw_bottom_msg_container_id = useRef(generateIdFunc()).current;

    const feedMainSubContainerRef = useRef<any>(undefined);

    const flwTopLoadingRef = useRef<any>(undefined);
    const flwBottomLoadingRef = useRef<any>(undefined);

    const feedListLoaderRef = useRef<any>(undefined);


    /* ------------------------------------ Methods ------------------------------------- */

    /* Refresh component */
    const refreshFunc = () => { refresher.current = !refresher.current; setRefresh(refresher.current) };

    /* Render */
    const renderFunc = (x: { render: boolean }) => { render.current = x.render; refreshFunc() };

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

        controllerRef: feedListControllerRef,

        refreshFunc() { refreshFunc() },
        renderFunc(x: any) { renderFunc(x) },
        renderFeedFunc(x: any) { renderFeedFunc(x) }
    }), []);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            broadcastIndex.current = mainRootControllerRef.current.addToBroadcastDomainFunc({ wid: wid, refId: refId });
            mainRootControllerRef.current.addRefIdFunc({ wid: wid, refId: refId });
            controllerRef?.current?.addRefIdFunc({ wid: wid, refId: refId });
        }
        return () => unmountFunc();
    }, []);

    /* On window size change */
    useEffect(() => {
        // window.addEventListener('resize', onWindowSizeChangeFunc);
        // return () => window.removeEventListener('resize', onWindowSizeChangeFunc);
    }, []);


    /* Return */

    const component = <>
        <Controller ref={feedListControllerRef} $data={{ wid: customerControllerWid, controllerRef: controllerRef, parentRef: refId, rootControllers: rootControllers, initialFeed: initialFeed }} />

        <div id={flw_scaffold_id} className='flw_scaffold' style={{ paddingTop: paddingTop }}>
            <LoadingWidget ref={flwTopLoadingRef} $data={{ wid: 'flwTopLoadingRef', controllerRef: feedListControllerRef }} />
            <div id={flw_top_msg_container_id} className='flw_top_msg_container'></div>

            <FeedSubContainerWidget ref={feedMainSubContainerRef} $data={{ wid: 'feedMainSubContainerRef', controllerRef: feedListControllerRef, rootControllers: rootControllers, widget: widget, position: 'top' }} />

            <div id={flw_bottom_msg_container_id} className='flw_top_msg_container'></div>
            <LoadingWidget ref={flwBottomLoadingRef} $data={{ wid: 'flwBottomLoadingRef', controllerRef: feedListControllerRef }} />
        </div>

        <FeedListLoaderWidget ref={feedListLoaderRef} $data={{ wid: 'feedListLoaderRef', controllerRef: feedListControllerRef, rootControllers: rootControllers }} />
    </>;
    return (<>{render.current && component}</>);

}); export default memo(FeedListWidget);
















































/* ----------------------------------------------------- Controller ----------------------------------------------------- */

/* Controller */
type ctrlType = { $data: { wid?: string, controllerRef?: refIdType, consumerRef?: refIdType, parentRef: refIdType, rootControllers: any, initialFeed: any } };
const __Controller = forwardRef((props: ctrlType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const refId: refIdType = ref;

    const windowWidth = useRef(window.innerWidth);
    const windowHeight = useRef(window.innerHeight);

    const isMounted = useRef(false);
    const mountCount = useRef(0);
    const emptyRef = useRef<any>(undefined);

    const broadcastIndex = useRef(-1);

    /* $data */
    const $data = props.$data;
    const wid = useRef($data.wid || generateIdFunc()).current;
    const consumerRef = $data.consumerRef;
    const parentRef = $data.parentRef;
    const controllerRef = $data.controllerRef;
    const rootControllers = $data.rootControllers;
    const initialFeed = $data.initialFeed || [];

    /* Root controllers */
    const mainRootControllerRef: refIdType = rootControllers?.current?.mainRootControllerRef;
    const requestRootControllerRef: refIdType = rootControllers?.current?.requestRootControllerRef;
    const dataStoreRootControllerRef: refIdType = rootControllers?.current?.dataStoreRootControllerRef;

    /* refId store */
    const refIdStore = useRef<any>({});

    /* - */

    const traduction = useRef(dataStoreRootControllerRef.current.traduction.current);

    const subContainerMap = useRef<refIdType[]>([]);


    /* ------------------------------------ Methods ------------------------------------- */

    /* Add refId */
    const addRefIdFunc = (x: { wid: string, refId: any }) => { refIdStore.current[x.wid] = x.refId };

    /* Delete refId */
    const deleteRefIdFunc = (x: { wid: string | string[] }) => {
        const wid = (typeof x.wid === 'string') ? [x.wid] : x.wid;
        for (let i = 0; i < wid.length; i++) { delete refIdStore.current[wid[i]] }
    };

    /* Set text value from inputs */
    const setTextValueFunc = (x: { wid: string, text: string }) => {
        const wid = x.wid, t = (x.text).replaceAll("'", '’').trimStart(), text = replaceConsecutiveSpacesByOneFunc(t), len = text.length;
        const lowerText = text.toLowerCase(), upperText = text.toUpperCase();
        switch (wid) {
            case '': { } break;
            default: { };
        }
    };

    /* Set traduction */
    const setTraductionFunc = (x: { traduction: any }) => { traduction.current = x.traduction };

    /* Unmount */
    const unmountFunc = () => {
        /* Prevent from first unmounting caused by "strictMode" */
        mountCount.current += 1; if (mountCount.current === 1) return;

        /* unmount logic */
        mainRootControllerRef?.current?.deleteFromBroadcastDomainFunc({ index: broadcastIndex.current });
        // mainRootControllerRef?.current?.addRefIdFunc({ wid: wid });
        controllerRef?.current?.deleteRefIdFunc({ wid: wid });
    };

    /* On window size change */
    const onWindowSizeChangeFunc = () => {
        windowWidth.current = window.innerWidth;
        windowHeight.current = window.innerHeight;
    };

    /* Show | hide loading */
    const showLoaderFunc = (x: { show: boolean }) => { refIdStore.current['feedListLoaderRef'].current.showLoaderFunc({ show: x.show }) };

    /* Shoe loading */
    const showLoadingFunc = (x: { show: boolean, position: 'top' | 'bottom' }) => {
        const show = x.show, position = x.position;
        switch (position) {
            case 'top': { refIdStore.current['flwTopLoadingRef'].current.showLoadingFunc({ show: show }) } break;
            case 'bottom': { refIdStore.current['flwBottomLoadingRef'].current.showLoadingFunc({ show: show }) } break;
            default: { console.error(`Position "${position}", doesn't exists !`) }
        };
    };

    /* Display message */
    const displayMessageFunc = (x: { text: string, position: 'top' | 'bottom' }) => {
        const flw_top_msg_container_id = parentRef.current.flw_top_msg_container_id;
        const flw_bottom_msg_container_id = parentRef.current.flw_bottom_msg_container_id;
        switch (x.position) {
            case 'top': { $(`#${flw_top_msg_container_id}`).text(x.text) } break;
            case 'bottom': { $(`#${flw_bottom_msg_container_id}`).text(x.text) } break;
            default: { console.error(`Position "${x.position}", doesn't exists !`) }
        };
    };

    /* Set message into loader */
    const setMessageFunc = (x: { text: string, type?: 'message' | 'warning' | 'error' }) => { refIdStore.current['feedListLoaderRef'].current.setMessageFunc(x) };

    /* Set data */
    const setDataFunc = (x: { data: any[], position: 'top' | 'bottom' }) => {
        try {
            const data = (typeof x.data === 'object' && Array.isArray(x.data)) ? x.data : [x.data];
            const position = x.position;
            if (data.length > 0) {
                const len = subContainerMap.current.length;

                if (len === 0) {
                    refIdStore.current['feedMainSubContainerRef'].current.renderContainerFunc({ data: data });

                } else if (len > 0) {
                    const subContainerRef = (position === 'top') ? subContainerMap.current[0] : subContainerMap.current[len - 1];
                    subContainerRef.current.renderContainerFunc({ data: data });

                } else { _dev_ && console.log(`There'less than 3 subContainer =>`, subContainerMap) }

                /* Hide loader */
                refIdStore.current['feedListLoaderRef'].current.showLoaderFunc({ show: false });
            }

        } catch (e: any) {
            console.log('feed err 0 ::', e.message);
            console.log('feed err 1 ::', subContainerMap.current.length, subContainerMap.current[0]);
        }
    };

    /* Set subContainer */
    const setSubContainerFunc = (x: { data: refIdType[], position: 'top' | 'bottom' }) => {
        const data = x.data, position = x.position;
        const tab = (position === 'top') ? [...data, ...subContainerMap.current] : [...subContainerMap.current, ...data];
        subContainerMap.current = tab;
    };

    /* Reset */
    const resetListFunc = () => {
        subContainerMap.current = [];
        refIdStore.current['feedMainSubContainerRef'].current.resetListFunc();
    };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Imperative handler */
    useImperativeHandle(ref, () => ({
        refIdStore: refIdStore,

        addRefIdFunc(x: any) { addRefIdFunc(x) },
        deleteRefIdFunc(x: any) { deleteRefIdFunc(x) },

        setTextValueFunc(x: any) { setTextValueFunc(x) },

        showLoaderFunc(x: any) { showLoaderFunc(x) },
        showLoadingFunc(x: any) { showLoadingFunc(x) },

        displayMessageFunc(x: any) { displayMessageFunc(x) },
        setDataFunc(x: any) { setDataFunc(x) },
        setSubContainerFunc(x: any) { setSubContainerFunc(x) },
        setMessageFunc(x: any) { setMessageFunc(x) },
        resetListFunc() { resetListFunc() }
    }), []);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            broadcastIndex.current = mainRootControllerRef.current.addToBroadcastDomainFunc({ wid: wid, refId: refId });
            controllerRef?.current?.addRefIdFunc({ wid: wid, refId: refId });
        }
        return () => unmountFunc();
    }, []);

    /* On window size change */
    useEffect(() => {
        // window.addEventListener('resize', onWindowSizeChangeFunc);
        // return () => window.removeEventListener('resize', onWindowSizeChangeFunc);
    }, []);


    /* - */
    return (<></>);
});
const Controller = memo(__Controller);





















































/* ----------------------------------------------------- Direct Children Components ----------------------------------------------------- */

/* Loader */
type feedLoaderPropsType = { $data: { wid?: string, controllerRef: refIdType, rootControllers: any } };
const FeedListLoaderWidget = forwardRef((props: feedLoaderPropsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const refId: refIdType = ref;

    const windowWidth = useRef(window.innerWidth);
    const windowHeight = useRef(window.innerHeight);

    const refresher = useRef(false);
    const [refresh, setRefresh] = useState(refresher.current);

    const emptyRef = useRef(undefined);

    const isMounted = useRef(false);
    const mountCount = useRef(0);
    const render = useRef(false);

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

    const traduction = useRef(dataStoreRootControllerRef.current.traduction.current);

    const fllwLoadingRef = useRef<any>(undefined);

    const fllw_scaffold_id = useRef(generateIdFunc()).current;
    const fllw_msg_container_id = useRef(generateIdFunc()).current;


    /* ------------------------------------ Methods ------------------------------------- */

    /* Refresh component */
    const refreshFunc = () => { refresher.current = !refresher.current; setRefresh(refresher.current) };

    /* Render */
    const renderFunc = (x: { render: boolean }) => { render.current = x.render; refreshFunc() };

    /* Set language */
    const setTraductionFunc = (x: { traduction: any }) => { traduction.current = x.traduction; refreshFunc() };

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

    /* Show loading */
    const showLoadingFunc = (x: { show: boolean }) => { fllwLoadingRef?.current?.showLoadingFunc({ show: x.show }) };

    /* Set msg */
    const setMessageFunc = (x: { text: string, type?: 'message' | 'warning' | 'error' }) => {
        const text = x.text, type = x.type ? x.type : 'message';
        refId.current.showLoadingFunc({ show: false });
        $(`#${fllw_msg_container_id}`).text(text);
    };

    /* Show | hide loader */
    const showLoaderFunc = (x: { show: boolean }) => {
        // renderFunc({ render: x.show });
        $(`#${fllw_scaffold_id}`).css({ display: x.show ? 'flex' : 'none' });
        if (!x.show) { refId.current.setMessageFunc({ text: `${traduction.current['t0031']}...` }) }
    };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        render: render,
        refreshFunc() { refreshFunc() },
        renderFunc(x: any) { renderFunc(x) },
        setTraductionFunc(x: any) { setTraductionFunc(x) },
        showLoadingFunc(x: any) { showLoadingFunc(x) },
        setMessageFunc(x: any) { setMessageFunc(x) },
        showLoaderFunc(x: any) { showLoaderFunc(x) }
    }), []);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            broadcastIndex.current = mainRootControllerRef.current.addToBroadcastDomainFunc({ wid: wid, refId: refId });
            (controllerRef.current !== undefined) && controllerRef.current.addRefIdFunc({ wid: wid, refId: refId });
        }
        return () => unmountFunc();
    }, []);

    /* On window size change */
    useEffect(() => {
        // window.addEventListener('resize', onWindowSizeChangeFunc);
        // return () => window.removeEventListener('resize', onWindowSizeChangeFunc);
    }, []);


    /* Return */

    const component = <>
        <div id={fllw_scaffold_id} className='fllw_scaffold'>
            <div id={fllw_msg_container_id} className='fllw_msg_container'>{traduction.current['t0031']}...</div>
            <LoadingWidget ref={fllwLoadingRef} $data={{ wid: 'fllwLoadingRef', controllerRef: controllerRef, visible: true }} />
        </div>
    </>;
    return (<>{component}</>);
});















































/* Container */
type containerPropsType = {
    $data: {
        /** Every change made to "wid" affect controller */
        wid: string,
        controllerRef: refIdType,
        rootControllers: any,
        widget: any,
        feed?: any[],
        position: 'top' | 'bottom'
    }
};
const FeedContainerWidget = forwardRef((props: containerPropsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const refId = ref;

    const windowWidth = useRef(window.innerWidth);
    const windowHeight = useRef(window.innerHeight);

    const refresher = useRef(false);
    const [refresh, setRefresh] = useState(refresher.current);

    const isMounted = useRef(false);
    const render = useRef(true);

    /* $data */
    const $data = props.$data;
    const wid = $data.wid;
    const controllerRef = $data.controllerRef;
    const rootControllers = $data.rootControllers;
    const widget = $data.widget;
    const feed = $data.feed || [];
    const position = $data.position;

    /* - */

    const topSubContainerWid = useRef(generateIdFunc()).current;
    const middleSubContainerWid = useRef(generateIdFunc()).current;
    const bottomSubContainerWid = useRef(generateIdFunc()).current;

    const topSubContainerRef = useRef<any>(undefined);
    const middleSubContainerRef = useRef<any>(undefined);
    const bottomSubContainerRef = useRef<any>(undefined);

    const tab = [topSubContainerRef, middleSubContainerRef, bottomSubContainerRef];


    /* ------------------------------------ Methods ------------------------------------- */

    /* Refresh component */
    const refreshFunc = () => { refresher.current = !refresher.current; setRefresh(refresher.current) };

    /* Render */
    const renderFunc = (x: { render: boolean }) => { render.current = x.render; refreshFunc() };

    /* Set sub container */
    const setSubContainerFunc = () => { controllerRef.current.setSubContainerFunc({ data: tab, position: position }) };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        refreshFunc() { refreshFunc() },
        renderFunc(x: any) { renderFunc(x) },
    }), []);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            (controllerRef.current !== undefined) && controllerRef.current.addRefIdFunc({ wid: wid, refId: refId });
            setSubContainerFunc();
        }
    }, []);


    /* Return */

    const component = <>
        <FeedSubContainerWidget ref={topSubContainerRef} $data={{ wid: topSubContainerWid, controllerRef: controllerRef, rootControllers: rootControllers, widget: widget, position: 'top' }} />
        <FeedSubContainerWidget ref={middleSubContainerRef} $data={{ wid: middleSubContainerWid, controllerRef: controllerRef, rootControllers: rootControllers, widget: widget, position: 'middle', feed: feed }} />
        <FeedSubContainerWidget ref={bottomSubContainerRef} $data={{ wid: bottomSubContainerWid, controllerRef: controllerRef, rootControllers: rootControllers, widget: widget, position: 'bottom' }} />
    </>;
    return (<>{render.current && component}</>);
});
















































/* Subcontainer */
type subContainerPropsType = {
    $data: {
        /** Every change made to "wid" affect controller */
        wid: string,
        controllerRef: refIdType,
        rootControllers: any,
        widget: any,
        feed?: any[],
        position: 'top' | 'middle' | 'bottom'
    }
};
const FeedSubContainerWidget = forwardRef((props: subContainerPropsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const refId = ref;

    const windowWidth = useRef(window.innerWidth);
    const windowHeight = useRef(window.innerHeight);

    const refresher = useRef(false);
    const [refresh, setRefresh] = useState(refresher.current);

    const isMounted = useRef(false);
    const render = useRef(false);

    const emptyRef = useRef(undefined);

    const broadcastIndex = useRef(-1);

    /* $data */
    const $data = props.$data;
    const wid = useRef($data.wid || generateIdFunc()).current;
    const controllerRef = $data.controllerRef;
    const rootControllers = $data.rootControllers || { current: undefined };
    const widget = $data.widget;
    const feed = $data.feed || [];
    const position = $data.position;

    /* Root controllers */
    const mainRootControllerRef: refIdType = rootControllers?.current?.mainRootControllerRef;
    const requestRootControllerRef: refIdType = rootControllers?.current?.requestRootControllerRef;
    const dataStoreRootControllerRef: refIdType = rootControllers?.current?.dataStoreRootControllerRef;

    /* - */

    const traduction = useRef(dataStoreRootControllerRef.current.traduction.current);

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
    const setLanguageFunc = (x: { traduction: any }) => {
        traduction.current = x.traduction;
        // setRefresh(!refresh);
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
            (controllerRef.current !== undefined) && controllerRef.current.addRefIdFunc({ wid: wid, refId: refId });

            /* Render feed if exists on mount */
            (feedData.current.length > 0 && position === 'middle') && refId.current.renderFeedFunc({ data: feedData.current });
        }
    }, []);

    /* On window size change */
    useEffect(() => {
        window.addEventListener('resize', onWindowSizeChangeFunc);
        return () => window.removeEventListener('resize', onWindowSizeChangeFunc);
    }, []);


    /* Return */


    /* Create feed */
    if (position === 'middle' && renderFeed.current && feedWidgetTab.current.length === 0) for (let i = 0; i < feedData.current.length; i++) feedWidgetTab.current.push(<Component key={i} _key={i} _refId={refIdTab.current[i]} _data={feedData.current[i]} />);

    /* - */
    const component = <>
        {renderFeed.current && <>{feedWidgetTab.current}</>}
        {(renderContainer.current && position !== 'middle') && <FeedContainerWidget ref={feedContainerRef} $data={{ wid: feedContainerWid, controllerRef: controllerRef, rootControllers: rootControllers, widget: widget, position: position, feed: feedData.current }} />}
    </>;
    return (render.current ? component : <></>);
});
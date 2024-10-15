/* Standard packages */
import React, { useState, memo, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import './ProductDashboardMainWidget.css';
import { generateIdFunc, replaceConsecutiveSpacesByOneFunc } from '../../Tools/methodForest';
import { refIdType } from '../../Tools/type';
import { _defaultLanguage_ } from '../../Tools/constants';
import FeedListWidget from '../FeedList/FeedListWidget';
import edit_2_icon from '../../Assets/png/edit_2.png';
import trash_1_icon from '../../Assets/png/trash_1.png';


/** Every change made to "wid" affect controller */
type propsType = { $data: { wid: string, controllerRef: refIdType, rootControllers: any } };
const ProductDashboardMainWidget = forwardRef((props: propsType, ref: any) => {
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
    const consumerRef = useRef<any>(undefined);
    const controllerRef = useRef<any>(undefined);

    const broadcastIndex = useRef(-1);

    /* $data */
    const $data = props.$data;
    const wid = useRef($data.wid || generateIdFunc()).current;
    const parentControllerRef = $data.controllerRef;
    const rootControllers = $data.rootControllers;

    /* Root controllers */
    const mainRootControllerRef: refIdType = rootControllers?.current?.mainRootControllerRef;
    const requestRootControllerRef: refIdType = rootControllers?.current?.requestRootControllerRef;
    const dataStoreRootControllerRef: refIdType = rootControllers?.current?.dataStoreRootControllerRef;

    /* - */

    const traduction = useRef(dataStoreRootControllerRef.current.traduction.current);

    const prodmw_scaffold_id = useRef(generateIdFunc()).current;

    const productFeedListRef = useRef<any>(undefined);

    const productFeedSearchListRef = useRef<any>(undefined);

    const prodmw_feed_search_list_id = useRef(generateIdFunc()).current;


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
        parentControllerRef?.current?.deleteRefIdFunc({ wid: wid, refId: refId });
    };

    /* Show */
    const showFunc = (x: { show: boolean }) => { $(`#${prodmw_scaffold_id}`).css({ 'z-index': x.show ? 1 : 0 }) };

    /* Show search list container */
    const showSearchListFunc = (x: { show: boolean }) => {
        $(`#${prodmw_feed_search_list_id}`).css({ transform: `translateX(${x.show ? '0%' : '100%'})` });
    };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Imperative handler */
    useImperativeHandle(ref, () => ({
        refreshFunc() { refreshFunc() },
        renderFunc(x: any) { renderFunc(x) },
        setTraductionFunc(x: any) { setTraductionFunc(x) },
        showFunc(x: any) { showFunc(x) },
        showSearchListFunc(x: any) { showSearchListFunc(x) },
    }), []);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            broadcastIndex.current = mainRootControllerRef.current.addToBroadcastDomainFunc({ wid: wid, refId: refId });
            mainRootControllerRef.current.addRefIdFunc({ wid: wid, refId: refId });
            parentControllerRef?.current?.addRefIdFunc({ wid: wid, refId: refId });
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
        <Controller ref={controllerRef} $data={{ wid: 'productDashboardControllerRef', rootControllers: rootControllers }} />

        <div id={prodmw_scaffold_id} className='prodmw_scaffold'>
            <div className='prodmw_feed_list_container'>
                <div /* main list */ className='prodmw_feed_default_list'>
                    <FeedListWidget ref={productFeedListRef} $data={{
                        wid: 'productFeedListRef', controllerRef: parentControllerRef, rootControllers: rootControllers, customerControllerWid: 'productFeedListControllerRef', paddingTop: 60,
                        widget: ({ _key, _refId, _data }: any) => { return <ProductFeedWidget key={_key} ref={_refId} $data={{ controllerRef: parentControllerRef, rootControllers: rootControllers, feed: _data }} /> }
                    }} />
                </div>

                <div /* search list */ id={prodmw_feed_search_list_id} className='prodmw_feed_search_list'>
                    <FeedListWidget ref={productFeedSearchListRef} $data={{
                        wid: 'productFeedSearchListRef', controllerRef: parentControllerRef, rootControllers: rootControllers, customerControllerWid: 'productFeedSearchListControllerRef', paddingTop: 60,
                        widget: ({ _key, _refId, _data }: any) => { return <ProductFeedWidget key={_key} ref={_refId} $data={{ controllerRef: parentControllerRef, rootControllers: rootControllers, feed: _data }} /> }
                    }} />
                </div>

                <div className='prodmw_right_bar' />
            </div>

            <div /* preview */ id='prodmw_feed_preview'>
                {/* <iframe src={`http://localhost:8811/Assets/pdf/cisco58kupIT5tY5p8aXIjoIBIYNz.pdf`} width='100%' height='100%'></iframe> */}
            </div>
        </div>
    </>;
    return (<>{render.current && component}</>);

}); export default (ProductDashboardMainWidget);






















































/* ----------------------------------------------------- Context Consumer & Controller ----------------------------------------------------- */

/* controller */
type pdcpropsType = { $data: { wid: string, controllerRef?: refIdType, rootControllers: any } };
const __controller = forwardRef((props: pdcpropsType, ref: any) => {
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
    const wid = $data.wid;
    const controllerRef = $data.controllerRef;
    const rootControllers = $data.rootControllers;

    /* Root controllers */
    const mainRootControllerRef: refIdType = rootControllers?.current?.mainRootControllerRef;
    const requestRootControllerRef: refIdType = rootControllers?.current?.requestRootControllerRef;
    const dataStoreRootControllerRef: refIdType = rootControllers?.current?.dataStoreRootControllerRef;

    /* refId store */
    const refIdStore = useRef<any>({});

    /* - */

    const traduction = useRef(dataStoreRootControllerRef.current.traduction.current);


    /* ------------------------------------ Methods ------------------------------------- */

    /* Add refId */
    const addRefIdFunc = (x: { wid: string, refId: refIdType }) => {
        const wid = x.wid, refId = x.refId;
        refIdStore.current[wid] = refId;
        switch (wid) {
            case 'emptyRef': { emptyRef.current = refId.current } break;
            default: { };
        };
    };

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
        };
    };

    /* Set traduction */
    const setTraductionFunc = (x: { traduction: any }) => { traduction.current = x.traduction };

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
        mainRootControllerRef?.current?.addRefIdFunc({ wid: wid });
        controllerRef?.current?.deleteRefIdFunc({ wid: wid });
    };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        addRefIdFunc(x: any) { addRefIdFunc(x) },
        deleteRefIdFunc(x: any) { deleteRefIdFunc(x) },
        setTextValueFunc(x: any) { setTextValueFunc(x) },
        setTraductionFunc(x: any) { setTraductionFunc(x) }
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
    });


    /* Return */
    return (<></>);
});
const Controller = memo(__controller);































































/* ----------------------------------------------------- Direct Children Components ----------------------------------------------------- */

/* ProductFeedWidget */
type pfType = { $data: { wid?: string, controllerRef: refIdType, rootControllers: any, feed: any } };
const ProductFeedWidget = forwardRef((props: pfType, ref: any) => {
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

    const traduction = useRef(dataStoreRootControllerRef.current.traduction.current);

    const prfew_scaffold_id = useRef(generateIdFunc()).current;

    const prfew_name_id = useRef(generateIdFunc()).current;

    const isSelected = useRef(false);

    const accountType = dataStoreRootControllerRef.current.currentUserData.current.type;


    /* ------------------------------------ Methods ------------------------------------- */

    /* Refresh component */
    const refreshFunc = () => { refresher.current = !refresher.current; setRefresh(refresher.current) };

    /* Render */
    const renderFunc = (x: { render: boolean }) => { render.current = x.render; refreshFunc() };

    /* Set traduction */
    const setTraductionFunc = (x: { traduction: any }) => { traduction.current = x.traduction };

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
        mainRootControllerRef?.current?.deleteRefIdFunc({ wid: wid });
        controllerRef?.current?.deleteRefIdFunc({ wid: wid });
    };

    /* OnSelect */
    const onClickFunc = () => { controllerRef.current.selectProductFunc({ wid: wid, targetRef: refId }) };

    /* Select */
    const selectFunc = (x: { select: boolean }) => {
        isSelected.current = x.select;

        const $target = $(`#${prfew_scaffold_id}`);
        $target.css({ backgroundColor: x.select ? 'rgba(149, 167, 189, 0.12)' : 'transparent' });
        !x.select && $target.removeAttr('style');

        // if (isSelected.current) {
        //     const html = feed.current.html_description;
        //     $('#prodmw_feed_preview_wrapper').show();
        //     $('#prodmw_feed_preview_wrapper').empty();
        //     $('#prodmw_feed_preview_wrapper').append(html);
        //     $('#prodmw_feed_preview').scrollTop(0);
        // }
    };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Imperative handler */
    useImperativeHandle(ref, () => ({
        isSelected: isSelected,
        refreshFunc() { refreshFunc() },
        renderFunc(x: any) { renderFunc(x) },
        setTraductionFunc(x: any) { setTraductionFunc(x) },
        selectFunc(x: any) { selectFunc(x) }
    }), []);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            broadcastIndex.current = mainRootControllerRef.current.addToBroadcastDomainFunc({ wid: wid, refId: refId });
            mainRootControllerRef.current.addRefIdFunc({ wid: wid, refId: refId });
            controllerRef?.current?.addRefIdFunc({ wid: wid, refId: refId });

            /* Highlight */
            const searchString: string = controllerRef.current.productSearchText.current;
            if (searchString.length > 0) {
                const reg = new RegExp(`(${searchString})`, 'gi'); /* Use a regular expression to find the search term */
                const highlightedText = (feed.current.name).replace(reg, '<strong style="color: #007aff" >$1</strong>'); /* Replace the search term with bold HTML tags */
                $(`#${prfew_name_id}`).html(highlightedText); /* Update */
            }
        }
        return () => unmountFunc();
    }, []);

    /* On window size change */
    useEffect(() => {
        // window.addEventListener('resize', onWindowSizeChangeFunc);
        // return () => window.removeEventListener('resize', onWindowSizeChangeFunc);
    }, []);


    /* return */

    const component = <>
        <div id={prfew_scaffold_id} className='prfew_scaffold'>
            <div className='prfew_container btn_opacity' onClick={onClickFunc}>
                <div className='prfew_img_container'>
                    {/* <img className='prfew_img' src='logo192.png' /> */}
                </div>

                <div style={{ flex: 1, marginLeft: 6 }}>
                    <div id={prfew_name_id} className='prfew_name ellipsis_line_2'>{feed.current.name}</div>
                    <div className='prfew_bottom_line' />
                </div>
            </div>

            {accountType === 'customer_admin' && <>
                <div className='prfew_btn_container' style={{ right: 40 }}>
                    <img width={16} height={16} src={edit_2_icon} />
                </div>

                <div className='prfew_btn_container' style={{ right: 5 }}>
                    <img width={16} height={16} src={trash_1_icon} />
                </div>
            </>}
        </div>
    </>;
    return (<>{render.current && component}</>);
});
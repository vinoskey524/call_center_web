/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import './CallCMenuMainContainerWidget.css';
import { generateIdFunc, replaceConsecutiveSpacesByOneFunc } from '../../../Tools/methodForest';
import search_icon from '../../../Assets/png/search_0.png';
import { refIdType } from '../../../Tools/type';
import FeedListWidget from '../../FeedList/FeedListWidget';


/** Every change made to "wid" affect controller */
type propsType = { $data: { wid: string, controllerRef: refIdType, rootControllers: any } };
const CallCMenuMainContainerWidget = forwardRef((props: propsType, ref: any) => {
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
    const prototypeControllerRef = useRef<any>(undefined);

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

    const callCMenuCustomerFeedListRef = useRef<any>(undefined);

    const callCMenuCustomerSearchFeedListRef = useRef<any>(undefined);


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

    /* On search menu input change */
    const onMenuSearchInputChangeFunc = () => {
        const $input = $('#ccmmcw_input');
        const val = String($input.val());
        const parsedValue = (val !== undefined) ? replaceConsecutiveSpacesByOneFunc(val).trimStart() : '';

        /* Update input */
        $input.val(parsedValue);

        /* - */
        controllerRef.current.setMenuSearchTextFunc({ text: parsedValue });
    };

    /* Show search menu container */
    const showSearchMenuContainerFunc = (x: { show: boolean }) => { $('#ccmmcw_search_feed_list_container').css({ left: x.show ? '0%' : '100%' }) };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        refreshFunc() { refreshFunc() },
        setTraductionFunc(x: any) { setTraductionFunc(x) },
        showSearchMenuContainerFunc(x: any) { showSearchMenuContainerFunc(x) }
    }), []);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            broadcastIndex.current = mainRootControllerRef.current.addToBroadcastDomainFunc({ wid: wid, refId: refId });
            mainRootControllerRef.current.addRefIdFunc({ wid: wid, refId: refId });
            controllerRef?.current?.addRefIdFunc({ wid: wid, refId: refId });
            controllerRef?.current?.initFunc(); /* init */
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
        <div id='ccmmcw_scaffold'>
            <div /* Search bar */ id='ccmmcw_input_container' className='glass'>
                <img id='ccmmcw_icon' src={search_icon} />
                <input id='ccmmcw_input' type='text' placeholder='Search' onChange={onMenuSearchInputChangeFunc} />
            </div>

            <div id='ccmmcw_feed_list_container'>
                <FeedListWidget ref={callCMenuCustomerFeedListRef} $data={{
                    wid: 'callCMenuCustomerFeedListRef', customerControllerWid: 'callCMenuCustomerFeedListControllerRef', controllerRef: controllerRef, rootControllers: rootControllers, paddingTop: 97,
                    widget: ({ _key, _refId, _data }: any) => { return <CallCMenuFeedWidget key={_key} ref={_refId} $data={{ controllerRef: controllerRef, rootControllers: rootControllers, accountData: _data }} /> }
                }} />
            </div>

            <div id='ccmmcw_search_feed_list_container'>
                <FeedListWidget ref={callCMenuCustomerSearchFeedListRef} $data={{
                    wid: 'callCMenuCustomerSearchFeedListRef', customerControllerWid: 'callCMenuCustomerSearchFeedListControllerRef', controllerRef: controllerRef, rootControllers: rootControllers, paddingTop: 97,
                    widget: ({ _key, _refId, _data }: any) => { return <CallCMenuFeedWidget key={_key} ref={_refId} $data={{ controllerRef: controllerRef, rootControllers: rootControllers, accountData: _data }} /> }
                }} />
            </div>
        </div>
    </>;
    return (<>{render.current && component}</>);

}); export default (CallCMenuMainContainerWidget);
































































/* ----------------------------------------------------- Direct Children Components ----------------------------------------------------- */

/* CallCMenuFeedWidget */
type callCMenuFeedPropsType = { $data: { wid?: string, controllerRef: refIdType, rootControllers: any, accountData: any } };
const CallCMenuFeedWidget = forwardRef((props: callCMenuFeedPropsType, ref: any) => {
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
    const accountData = useRef($data.accountData);

    /* Root controllers */
    const mainRootControllerRef: refIdType = rootControllers?.current?.mainRootControllerRef;
    const requestRootControllerRef: refIdType = rootControllers?.current?.requestRootControllerRef;
    const dataStoreRootControllerRef: refIdType = rootControllers?.current?.dataStoreRootControllerRef;

    /* - */

    const traduction = useRef(dataStoreRootControllerRef.current.traduction.current);

    const ccmfwi_title_id = useRef(generateIdFunc()).current;


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

    /* On press */
    const onPressFunc = () => { controllerRef.current.showPageFunc({ data: accountData }) };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Imperative handler */
    useImperativeHandle(ref, () => ({
        refreshFunc() { refreshFunc() },
        renderFunc(x: any) { renderFunc(x) },
        setTraductionFunc(x: any) { setTraductionFunc(x) },
    }), []);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            broadcastIndex.current = mainRootControllerRef.current.addToBroadcastDomainFunc({ wid: wid, refId: refId });
            mainRootControllerRef.current.addRefIdFunc({ wid: wid, refId: refId });
            (controllerRef?.current !== undefined) && controllerRef.current.addRefIdFunc({ wid: wid, refId: refId });

            /* Highlight */
            const searchString: string = controllerRef.current.searchString.current;
            if (searchString.length > 0) {
                const reg = new RegExp(`(${searchString})`, 'gi'); /* Use a regular expression to find the search term */
                const highlightedText = (accountData.current.company_name).replace(reg, '<strong style="color: #007aff" >$1</strong>'); /* Replace the search term with bold HTML tags */
                $(`#${ccmfwi_title_id}`).html(highlightedText); /* Update */
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
        <div className='ccmfwi_scaffold btn_opacity' onClick={onPressFunc}>
            <img className='ccmfwi_logo' src='logo192.png' />
            <div className='ccmfwi_container'>
                <span id={ccmfwi_title_id} className='ccmfwi_title ellipsis_line_1'>{accountData.current.company_name}</span>
                <div className='ccmfwi_bottom_line' />
            </div>
        </div>
    </>;
    return (<>{render.current && component}</>);
});
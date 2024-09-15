/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import './CallCMenuMainContainerWidget.css';
import { generateIdFunc, replaceConsecutiveSpacesByOneFunc } from '../../../Tools/methodForest';
import search_icon from '../../../Assets/png/search_0.png';
import { language } from '../../../Tools/language';
import { refIdType } from '../../../Tools/type';
import { _defaultLanguage_ } from '../../../Tools/constants';
import CallCMenuFeedWidget from './CallCMenuFeedWidget';
import FeedListWidget from '../../FeedList/FeedListWidget';

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
const CallCMenuMainContainerWidget = (props: propsType, ref: any) => {
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

    const callCMenuCustomerFeedListRef = useRef<any>(undefined);

    const callCMenuCustomerSearchFeedListRef = useRef<any>(undefined);


    /* ------------------------------------ Methods ------------------------------------- */

    /* Refresh component */
    const refreshFunc = () => {
        refresher.current = refresher.current ? false : true;
        setRefresh(refresher.current);
    };

    /* Set language */
    const setLanguageFunc = (x: { lang: 'en' | 'fr' }) => { lang.current = x.lang; setRefresh(!refresh) };

    /* On window size change */
    const onWindowSizeChangeFunc = () => {
        windowWidth.current = window.innerWidth;
        windowHeight.current = window.innerHeight;
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
        setLanguageFunc(x: any) { setLanguageFunc(x) },
        showSearchMenuContainerFunc(x: any) { showSearchMenuContainerFunc(x) }
    }), [refresh]);

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
        <div id='ccmmcw_scaffold'>
            <div /* Search bar */ id='ccmmcw_input_container' className='glass'>
                <img id='ccmmcw_icon' src={search_icon} />
                <input id='ccmmcw_input' type='text' placeholder='Search' onChange={onMenuSearchInputChangeFunc} />
            </div>

            <div id='ccmmcw_feed_list_container'>
                <FeedListWidget ref={callCMenuCustomerFeedListRef} $data={{
                    wid: 'callCMenuCustomerFeedListRef', refId: callCMenuCustomerFeedListRef, controllerRef: controllerRef, rootControllers: rootControllers, paddingTop: 97,
                    widget: ({ _key, _refId, _data }: any) => { return <CallCMenuFeedWidget key={_key} ref={_refId} $data={{ refId: _refId, controllerRef: controllerRef, rootControllers: rootControllers, accountData: _data }} /> }
                }} />
            </div>

            <div id='ccmmcw_search_feed_list_container'>
                <FeedListWidget ref={callCMenuCustomerSearchFeedListRef} $data={{
                    wid: 'callCMenuCustomerSearchFeedListRef', refId: callCMenuCustomerSearchFeedListRef, controllerRef: controllerRef, rootControllers: rootControllers, paddingTop: 97,
                    widget: ({ _key, _refId, _data }: any) => { return <CallCMenuFeedWidget key={_key} ref={_refId} $data={{ refId: _refId, controllerRef: controllerRef, rootControllers: rootControllers, accountData: _data }} /> }
                }} />
            </div>
        </div>
    </>;
    return (render.current ? component : <></>);
};

export default forwardRef(CallCMenuMainContainerWidget);
// @refresh reset

/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import './FeedListLoaderWidget.css';
import { generateIdFunc } from '../../Tools/methodForest';
import { _success_, _error_, _requestFailed_ } from '../../Tools/constants';
import { language } from '../../Tools/language';
import { refIdType } from '../../Tools/type';
import { _defaultLanguage_ } from '../../Tools/constants';
import LoadingWidget from '../Others/LoadingWidget';

/* Widget */
type propsType = {
    $data: {
        /** Every change made to "wid" affect controller */
        wid: string,
        refId: refIdType,
        controllerRef: refIdType,
    }
};
const FeedListLoaderWidget = (props: propsType, ref: any) => {
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

    /* - */

    const emptyRef = useRef(undefined);

    const fllwLoadingRef = useRef<any>(undefined);

    const fllw_scaffold_id = useRef(generateIdFunc()).current;

    const fllw_msg_container_id = useRef(generateIdFunc()).current;


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

    /* Show loading */
    const showLoadingFunc = (x: { show: boolean }) => {
        fllwLoadingRef.current.showLoadingFunc({ show: x.show });
    };

    /* Set msg */
    const setMessageFunc = (x: { text: string, type?: 'message' | 'warning' | 'error' }) => {
        const text = x.text, type = x.type ? x.type : 'message';

        refId.current.showLoadingFunc({ show: false });

        const $msg = $(`#${fllw_msg_container_id}`);
        $msg.text(text);
    };

    /* Show | hide loader */
    const showLoaderFunc = (x: { show: boolean }) => {
        render.current = x.show;
        refreshFunc();

        if (!x.show) { refId.current.setMessageFunc({ msg: `${traduction['t0031']}...` }) }
    };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        render: render,
        refreshFunc() { refreshFunc() },
        renderFunc(x: any) { renderFunc(x) },
        setLanguageFunc(x: any) { setLanguageFunc(x) },
        showLoadingFunc(x: any) { showLoadingFunc(x) },
        setMessageFunc(x: any) { setMessageFunc(x) },
        showLoaderFunc(x: any) { showLoaderFunc(x) }
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
        <div id={fllw_scaffold_id} className='fllw_scaffold'>
            <div id={fllw_msg_container_id} className='fllw_msg_container'>{traduction['t0031']}...</div>
            <LoadingWidget ref={fllwLoadingRef} $data={{ wid: 'fllwLoadingRef', refId: fllwLoadingRef, visible: true }} />
        </div>
    </>;
    return (render.current ? component : <></>);
};

export default forwardRef(FeedListLoaderWidget);
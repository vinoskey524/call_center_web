/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import './StatsAgencyFeedWidget.css';
import { generateIdFunc } from '../../../Tools/methodForest';
import { language } from '../../../Tools/language';
import { refIdType } from '../../../Tools/type';
import { _defaultLanguage_ } from '../../../Tools/constants';

/* Widget */
type propsType = {
    $data: {
        refId: refIdType,
        controllerRef: refIdType,
        feedData: { title: string, per: number },
    }
};
const StatsAgencyFeedWidget = (props: propsType, ref: any) => {
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

    const refId = data.refId;

    const controllerRef = data.controllerRef;

    const feedData = data.feedData;

    /* - */

    const emptyRef = useRef(undefined);

    const title = useRef(feedData.title);
    const per = useRef(feedData.per);


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


    /* ------------------------------------ jQuery ------------------------------------- */


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        refreshFunc() { refreshFunc() },
        renderFunc(x: any) { renderFunc(x) },
        setLanguageFunc(x: any) { setLanguageFunc(x) }
    }), []);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            // (controllerRef.current !== undefined) && controllerRef.current.addWidgetRefFunc({ wid: wid, refId: refId });
        }
    }, []);

    /* On window size change */
    // useEffect(() => {
    //     window.addEventListener('resize', onWindowSizeChangeFunc);
    //     return () => window.removeEventListener('resize', onWindowSizeChangeFunc);
    // }, []);


    /* Return */


    const component = <>
        <div className='stagcfw_scaffold btn_opacity'>
            <div className='stagcfw_title_container'>
                <div className='stagcfw_title ellipsis_line_1'>{title.current}</div>
                <div className='stagcfw_complaint_count'>70</div>
            </div>
            <div className='stagcfw_per_container'><div className='stagcfw_per_jauge' style={{ width: per.current + '%', backgroundColor: 'yellow' }} /></div>
        </div>
    </>;
    return (render.current ? component : <></>);
};

export default forwardRef(StatsAgencyFeedWidget);
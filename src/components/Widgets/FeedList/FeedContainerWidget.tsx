/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
// import './FeedContainerWidget.css';
import { generateIdFunc } from '../../Tools/methodForest';
import { _success_, _error_, _requestFailed_ } from '../../Tools/constants';
import { language } from '../../Tools/language';
import { refIdType } from '../../Tools/type';
import { _defaultLanguage_ } from '../../Tools/constants';
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
        feed?: any[],
        position: 'top' | 'bottom'
    }
};
const FeedContainerWidget = (props: propsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const parentProps = props;

    const windowWidth = useRef(window.innerWidth);

    const windowHeight = useRef(window.innerHeight);

    const refresher = useRef(false);
    const [refresh, setRefresh] = useState(refresher.current);

    const isMounted = useRef(false);

    const render = useRef(true);

    /* $data */

    const data = props.$data;

    const wid = data.wid;

    const refId = data.refId;

    const controllerRef = data.controllerRef;

    const rootControllers = data.rootControllers;

    const widget = data.widget;

    const feed = data.feed || [];

    const position = data.position;

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
    const refreshFunc = () => {
        refresher.current = !refresher.current;
        setRefresh(refresher.current);
    };

    /* Render */
    const renderFunc = (x: { render: boolean }) => {
        render.current = x.render;
        refreshFunc();
    };

    /* Set sub container */
    const setSubContainerFunc = () => { controllerRef.current.setSubContainerFunc({ data: tab, position: position }) };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        refreshFunc() { refreshFunc() },
        renderFunc(x: any) { renderFunc(x) },
    }), [refresh]);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            (controllerRef.current !== undefined) && controllerRef.current.addWidgetRefFunc({ wid: wid, refId: refId });
            setSubContainerFunc();
        }
    }, []);


    /* Return */


    const component = <>
        <FeedSubContainerWidget ref={topSubContainerRef} $data={{ wid: topSubContainerWid, refId: topSubContainerRef, controllerRef: controllerRef, rootControllers: rootControllers, widget: widget, position: 'top' }} />
        <FeedSubContainerWidget ref={middleSubContainerRef} $data={{ wid: middleSubContainerWid, refId: middleSubContainerRef, controllerRef: controllerRef, rootControllers: rootControllers, widget: widget, position: 'middle', feed: feed }} />
        <FeedSubContainerWidget ref={bottomSubContainerRef} $data={{ wid: bottomSubContainerWid, refId: bottomSubContainerRef, controllerRef: controllerRef, rootControllers: rootControllers, widget: widget, position: 'bottom' }} />
    </>;
    return (render.current ? component : <></>);
};

export default forwardRef(FeedContainerWidget);
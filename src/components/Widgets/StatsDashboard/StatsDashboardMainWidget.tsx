/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';
import { VictoryPie, VictoryBar, VictoryChart } from 'victory';

/* Custom packages */
import './StatsDashboardMainWidget.css';
import { generateIdFunc } from '../../Tools/methodForest';
import { language } from '../../Tools/language';
import { refIdType } from '../../Tools/type';
import { _defaultLanguage_, _colorPalette_ } from '../../Tools/constants';
import StatsAgencyContainerWidget from './Agency/StatsAgencyContainerWidget';
import StatsChartContainerWidget from './Chart/StatsChartContainerWidget';
import StatsFilterContainerWidget from './Filter/StatsFilterContainerWidget';
import StatsDashboardControllerWidget from './StatsDashboardControllerWidget';

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
const StatsDashboardMainWidget = (props: propsType, ref: any) => {
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

    const emptyRef = useRef(undefined);

    const statsAgencyContainerRef = useRef(undefined);
    const statsChartContainerRef = useRef(undefined);
    const statsFilterContainerRef = useRef(undefined);

    const statsDashboardControllerRef = useRef(undefined);

    const stdmcw_scaffold_id = useRef(generateIdFunc()).current;



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
    const showFunc = (x: { show: boolean }) => { $(`#${stdmcw_scaffold_id}`).css({ 'z-index': x.show ? 1 : 0 }) };


    /* ------------------------------------ jQuery ------------------------------------- */


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        refreshFunc() { refreshFunc() },
        renderFunc(x: any) { renderFunc(x) },
        setLanguageFunc(x: any) { setLanguageFunc(x) },
        showFunc(x: any) { showFunc(x) }
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
        <div id={stdmcw_scaffold_id} className='stdmcw_scaffold'>
            <div id='stdmcw_container'>
                <StatsAgencyContainerWidget ref={statsAgencyContainerRef} $data={{ wid: 'statsAgencyContainerRef', refId: statsAgencyContainerRef, controllerRef: statsDashboardControllerRef }} />
                <StatsChartContainerWidget ref={statsChartContainerRef} $data={{ wid: 'statsChartContainerRef', refId: statsChartContainerRef, controllerRef: statsDashboardControllerRef }} />
                <StatsFilterContainerWidget ref={statsFilterContainerRef} $data={{ wid: 'statsFilterContainerRef', refId: statsFilterContainerRef, controllerRef: statsDashboardControllerRef }} />
            </div>
        </div>
        <StatsDashboardControllerWidget ref={statsDashboardControllerRef} $data={{ wid: 'statsDashboardControllerRef', refId: statsDashboardControllerRef, rootControllers: rootControllers }} />
    </>;
    return (render.current ? component : <></>);
};

export default forwardRef(StatsDashboardMainWidget);
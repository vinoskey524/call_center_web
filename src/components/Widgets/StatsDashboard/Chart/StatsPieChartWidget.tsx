/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';
import { VictoryPie } from 'victory';

/* Custom packages */
import './StatsPieChartWidget.css';
import { generateIdFunc } from '../../../Tools/methodForest';
import { language } from '../../../Tools/language';
import { refIdType } from '../../../Tools/type';
import { _defaultLanguage_, _colorPalette_ } from '../../../Tools/constants';

/* Widget */
type propsType = {
    $data: {
        /** Every change made to "wid" affect controller */
        wid: string,
        refId: refIdType,
        controllerRef: refIdType
    }
};
const StatsPieChartWidget = (props: propsType, ref: any) => {
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

    /* - */

    const emptyRef = useRef(undefined);

    const chartData = [
        { x: "Bohicon", y: 56 },
        { x: "Calavi", y: 25 },
        { x: "Cotonou", y: 50 },
        { x: "Parakou", y: 15 },
        { x: "Seme", y: 24 },
        { x: "Kandi", y: 7 },
    ];


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

    /* On chart click */
    const onChartClickFunc = (e: any) => {
        console.log(e);
        return [
            {
                target: 'data',
                mutation: (e: any) => {
                    return e.style.fill === '#c43a31' ? null : { style: { fill: '#c43a31' } };
                }
            },
            {
                target: 'labels',
                mutation: (e: any) => {
                    return e.text === 'clicked' ? null : { text: 'clicked' };
                }
            }
        ];
    }


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
        <div id='stpicw_scaffold'>
            <div id='stpicw_container'>
                <VictoryPie
                    width={600}
                    height={460}
                    data={chartData}
                    style={{ data: { stroke: '#23272F', strokeWidth: 2 }, labels: { fontSize: 12.5, fill: '#007aff' } }}
                    colorScale={_colorPalette_}
                    events={[{
                        target: 'data',
                        eventHandlers: { onClick: onChartClickFunc }
                    }]}
                />
            </div>
        </div>
    </>;
    return (render.current ? component : <></>);
};

export default forwardRef(StatsPieChartWidget);
/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import './ComplaintFeedWidget.css';
import { generateIdFunc } from '../../Tools/methodForest';
import { language } from '../../Tools/language';
import { refIdType } from '../../Tools/type';
import { _defaultLanguage_ } from '../../Tools/constants';
import star_icon from '../../Assets/png/star.png';
import more_icon from '../../Assets/png/more.png';
import target_icon from '../../Assets/png/target.png';
import location_icon from '../../Assets/png/location.png';
import clock_icon from '../../Assets/png/clock.png';

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
const ComplaintFeedWidget = (props: propsType, ref: any) => {
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

    const controllerRef = data.controllerRef;

    const rootControllers = data.rootControllers;

    /* Root controllers */

    const mainControllerRef: refIdType = rootControllers.mainControllerRef;

    const requestControllerRef: refIdType = rootControllers.requestControllerRef;

    const dataStoreControllerRef: refIdType = rootControllers.dataStoreControllerRef;

    /* - */


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


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        refreshFunc() { refreshFunc() },
        setLanguageFunc(x: any) { setLanguageFunc(x) }
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
        <div className='comfew_scaffold btn_opacity'>
            <div style={{ flex: 1, marginLeft: 6 }}>
                <div className='comfew_object_container'>
                    <div className='comfew_object_title ellipsis_line_1'>Objet de la plainte</div>
                    <div className='comfew_action_container'>
                        <div className='comfew_action_btn_wrapper'><img className='comfew_action_btn_icon' src={star_icon} /></div>
                        <div className='comfew_action_separator' />
                        <div className='comfew_action_btn_wrapper'><img className='comfew_action_btn_icon' src={more_icon} /></div>
                    </div>
                </div>

                <div className='comfew_container'>
                    <div className='comfew_icon_container'><img className='comfew_icon' src={target_icon} /></div>
                    <div className='comfew_title ellipsis_line_1'>Produit concerné</div>
                </div>

                <div className='comfew_container'>
                    <div className='comfew_icon_container'><img className='comfew_agence_icon' src={location_icon} /></div>
                    <div className='comfew_title ellipsis_line_1'>Agence concerné</div>
                </div>

                <div className='comfew_container'>
                    <div className='comfew_icon_container'><img className='comfew_Timestamp_icon' src={clock_icon} /></div>
                    <div className='comfew_title ellipsis_line_1'>17/07/2024 • 12h30 • Hamet kevin</div>
                </div>

                <div className='comfew_bottom_line' />
            </div>
        </div>
    </>;
    return (render.current ? component : <></>);
};

export default forwardRef(ComplaintFeedWidget);
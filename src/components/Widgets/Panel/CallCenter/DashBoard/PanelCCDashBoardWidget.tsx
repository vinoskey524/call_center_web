/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import './PanelCCDashBoardWidget.css';
import { generateIdFunc } from '../../../../Tools/methodForest';
import { language } from '../../../../Tools/language';
import { refIdType } from '../../../../Tools/type';
import { _defaultLanguage_ } from '../../../../Tools/constants';
import search_icon from '../../../../Assets/png/search.png';
import PanelCCProductMainWidget from '../Product/PanelCCProductMainWidget';

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
const PanelCCDashBoardWidget = (props: propsType, ref: any) => {
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

    const panelCCProductMainRef = useRef(undefined);


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
        <div className='pccdbw_scaffold'>
            <div /* Header */ className='pccdbw_header glass'>
                <h1 className='pccdbw_enterprise_title'>Pebco</h1>

                <div className='pccdbw_h_btn_container'>
                    <div className='pccdbw_h_btn_title'>Produits</div>
                </div>

                <div className='pccdbw_h_btn_container'>
                    <div className='pccdbw_h_btn_title'>Plaintes</div>
                </div>

                <div className='pccdbw_hv_separator' />

                <div className='pccdbw_h_search_container'>
                    <img className='pccdbw_h_search_icon' src={search_icon} />
                    <input className='pccdbw_h_search_bar' type='text' placeholder='Search' />
                </div>

                <div className='pccdbw_hv_separator' />

                <div className='pccdbw_add_btn_container'>
                    <div className='pccdbw_add_btn_title btn_opacity'>+ Ajouter</div>
                </div>

            </div>

            <div /* Body */ className='pccdbw_body'>
                <div className='pccdbw_body_left'>
                    <PanelCCProductMainWidget ref={panelCCProductMainRef} $data={{ wid: 'panelCCProductMainRef', refId: panelCCProductMainRef, controllerRef: controllerRef, rootControllers: rootControllers }} />
                </div>

                <div className='pccdbw_body_right'></div>
            </div>
        </div>
    </>;
    return (render.current ? component : <></>);
};

export default forwardRef(PanelCCDashBoardWidget);
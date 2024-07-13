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

    const didAddBtnTouched = useRef(false);

    const didAddBtnSubOptionShown = useRef(false);


    /* ------------------------------------ Methods ------------------------------------- */

    /* Refresh component */
    const refreshFunc = () => {
        refresher.current = !refresher.current;
        setRefresh(refresher.current);
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

    /* On add product or complaint */
    const onAddProduitComplaintFunc = () => {
        didAddBtnSubOptionShown.current = !didAddBtnSubOptionShown.current;
        refreshFunc();
    };


    /* ------------------------------------ jQuery ------------------------------------- */

    /* - */
    $('body').on('mouseup', () => {
        if (didAddBtnSubOptionShown.current) {
            // didAddBtnSubOptionShown.current = false;
            // refreshFunc();
        }
    });


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
        <div id='pccdbw_scaffold' className='pccdbw_var'>
            <div /* Header */ id='pccdbw_header' className='glass'>
                <h1 id='pccdbw_enterprise_title'>Pebco</h1>

                <div className='pccdbw_h_btn_container'>
                    <div className='pccdbw_h_btn_title'>Produits</div>
                </div>

                <div className='pccdbw_h_btn_container'>
                    <div className='pccdbw_h_btn_title'>Plaintes</div>
                </div>

                <div className='pccdbw_hv_separator' />

                <div id='pccdbw_h_search_container'>
                    <img id='pccdbw_h_search_icon' src={search_icon} />
                    <input id='pccdbw_h_search_bar' type='text' placeholder='Search' />
                </div>

                <div className='pccdbw_hv_separator' />

                <div id='pccdbw_add_btn_container'>
                    <div id='pccdbw_add_btn_title' className='btn_opacity' onClick={onAddProduitComplaintFunc}>+ Ajouter</div>
                    {didAddBtnSubOptionShown.current &&
                        <div id='pccdbw_add_option_container'>
                            <div className='pccdbw_add_option_title btn_opacity'>Produit</div>
                            <div className='pccdbw_title_separator' />
                            <div className='pccdbw_add_option_title btn_opacity'>Plainte</div>
                        </div>
                    }
                </div>
            </div>

            <div /* Body */ id='pccdbw_body'>
                <div id='pccdbw_body_left'>
                    {Array(20).fill(undefined).map(() => <PanelCCProductMainWidget ref={panelCCProductMainRef} $data={{ wid: 'panelCCProductMainRef', refId: panelCCProductMainRef, controllerRef: controllerRef, rootControllers: rootControllers }} />)}
                </div>

                <div id='pccdbw_body_right'></div>
            </div>
        </div>
    </>;
    return (render.current ? component : <></>);
};

export default forwardRef(PanelCCDashBoardWidget);
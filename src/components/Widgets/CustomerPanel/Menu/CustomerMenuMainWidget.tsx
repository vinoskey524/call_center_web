/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import './CustomerMenuMainWidget.css';
import { generateIdFunc } from '../../../Tools/methodForest';
import { _success_, _error_, _requestFailed_ } from '../../../Tools/constants';
import { language } from '../../../Tools/language';
import { refIdType } from '../../../Tools/type';
import { _defaultLanguage_ } from '../../../Tools/constants';
import home_icon from '../../../Assets/png/home.png'
import cart_icon from '../../../Assets/png/cart.png'
import warn_icon from '../../../Assets/png/warn.png'
import acc_icon from '../../../Assets/png/acc.png'

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
const CustomerMenuMainWidget = (props: propsType, ref: any) => {
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

    const ctmmmw_home_btn_container_id = useRef(generateIdFunc()).current;

    const ctmmmw_complaint_btn_container_id = useRef(generateIdFunc()).current;

    const ctmmmw_product_btn_container_id = useRef(generateIdFunc()).current;

    const ctmmmw_account_btn_container_id = useRef(generateIdFunc()).current;

    const sourceTab = { home: ctmmmw_home_btn_container_id, complaint: ctmmmw_complaint_btn_container_id, product: ctmmmw_product_btn_container_id, account: ctmmmw_account_btn_container_id };

    const currentMenuBtnId = useRef('');


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

    /* Select menu */
    const selectMenuFunc = (x: { source: 'home' | 'complaint' | 'product' | 'account' }) => {
        const source = sourceTab[x.source];
        const $target = $(`#${source}`);
        const $targetTitle = $(`#${source} .ctmmmw_btn_title`);

        /* Unselect current menu  */
        if (currentMenuBtnId.current !== '') {
            const $currentMenuBtn = $(`#${currentMenuBtnId.current}`);
            const $currentMenuBtnTitle = $(`#${currentMenuBtnId.current} .ctmmmw_btn_title`);
            $currentMenuBtn.css({ backgroundColor: 'transparent' });
            $currentMenuBtnTitle.css({ color: '#9e9e9e' });
        }

        /* Select next menu & current target id */
        $target.css({ backgroundColor: '#4F586A' });
        $targetTitle.css({ color: 'white' });
        currentMenuBtnId.current = source;

        /* Show selected menu dashboard */
        controllerRef.current.showDashboardFunc({ type: x.source });
    };


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

            /* - */
            selectMenuFunc({ source: 'home' });
        }
    }, []);

    /* On window size change */
    // useEffect(() => {
    //     window.addEventListener('resize', onWindowSizeChangeFunc);
    //     return () => window.removeEventListener('resize', onWindowSizeChangeFunc);
    // }, []);


    /* Return */


    const component = <>
        <div id='ctmmmw_scaffold'>
            <div /* Home */ id={ctmmmw_home_btn_container_id} className='ctmmmw_btn_container btn_opacity' onClick={() => selectMenuFunc({ source: 'home' })}>
                <img className='ctmmmw_btn_icon' src={home_icon} />
                <div className='ctmmmw_btn_title'>Acceuil</div>
            </div>

            <div /* Product */ id={ctmmmw_product_btn_container_id} className='ctmmmw_btn_container btn_opacity' onClick={() => selectMenuFunc({ source: 'product' })}>
                <img className='ctmmmw_btn_icon' src={cart_icon} />
                <div className='ctmmmw_btn_title'>Produits / Services</div>
            </div>

            <div /* Complaint */ id={ctmmmw_complaint_btn_container_id} className='ctmmmw_btn_container btn_opacity' onClick={() => selectMenuFunc({ source: 'complaint' })}>
                <img className='ctmmmw_btn_icon' src={warn_icon} />
                <div className='ctmmmw_btn_title'>Plaintes</div>
            </div>

            <div /* Account */ id={ctmmmw_account_btn_container_id} className='ctmmmw_btn_container btn_opacity' onClick={() => selectMenuFunc({ source: 'account' })}>
                <img className='ctmmmw_btn_icon' src={acc_icon} />
                <div className='ctmmmw_btn_title'>Accounts</div>
            </div>
        </div>
    </>;
    return (render.current ? component : <></>);
};

export default forwardRef(CustomerMenuMainWidget);
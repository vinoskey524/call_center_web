/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import './CustomerMenuMainWidget.css';
import { generateIdFunc } from '../../../Tools/methodForest';
import { _success_, _error_, _requestFailed_ } from '../../../Tools/constants';
import { refIdType } from '../../../Tools/type';
import { _defaultLanguage_ } from '../../../Tools/constants';
import home_icon from '../../../Assets/png/home.png';
import chart_icon from '../../../Assets/png/chart_1.png';
import cart_icon from '../../../Assets/png/cart.png';
import warn_icon from '../../../Assets/png/warn.png';
import config_icon from '../../../Assets/png/config.png';


/** Every change made to "wid" affect controller */
type propsType = { $data: { wid: string, controllerRef: refIdType, rootControllers: any } };
const CustomerMenuMainWidget = forwardRef((props: propsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const refId: refIdType = ref;

    const windowWidth = useRef(window.innerWidth);
    const windowHeight = useRef(window.innerHeight);

    const refresher = useRef(false);
    const [refresh, setRefresh] = useState(refresher.current);

    const isMounted = useRef(false);
    const mountCount = useRef(0);
    const render = useRef(true);

    const emptyRef = useRef<any>(undefined);
    const consumerRef = useRef<any>(undefined);
    const prototypeControllerRef = useRef<any>(undefined);

    const broadcastIndex = useRef(-1);

    /* $data */
    const $data = props.$data;
    const wid = useRef($data.wid || generateIdFunc()).current;
    const controllerRef = $data.controllerRef;
    const rootControllers = $data.rootControllers || { current: undefined };

    /* Root controllers */
    const mainRootControllerRef: refIdType = rootControllers?.current?.mainRootControllerRef;
    const requestRootControllerRef: refIdType = rootControllers?.current?.requestRootControllerRef;
    const dataStoreRootControllerRef: refIdType = rootControllers?.current?.dataStoreRootControllerRef;

    /* - */

    const traduction = useRef(dataStoreRootControllerRef.current.traduction.current);

    const ctmmmw_home_btn_container_id = useRef(generateIdFunc()).current;
    const ctmmmw_complaint_btn_container_id = useRef(generateIdFunc()).current;
    const ctmmmw_product_btn_container_id = useRef(generateIdFunc()).current;
    const ctmmmw_config_btn_container_id = useRef(generateIdFunc()).current;

    const sourceTab = { home: ctmmmw_home_btn_container_id, complaint: ctmmmw_complaint_btn_container_id, product: ctmmmw_product_btn_container_id, config: ctmmmw_config_btn_container_id };

    const currentMenuBtnId = useRef('');


    /* ------------------------------------ Methods ------------------------------------- */

    /* Refresh component */
    const refreshFunc = () => { refresher.current = !refresher.current; setRefresh(refresher.current) };

    /* Render */
    const renderFunc = (x: { render: boolean }) => { render.current = x.render; refreshFunc() };

    /* Set language */
    const setTraductionFunc = (x: { traduction: any }) => { traduction.current = x.traduction; refreshFunc() };

    /* On window size change */
    const onWindowSizeChangeFunc = () => {
        windowWidth.current = window.innerWidth;
        windowHeight.current = window.innerHeight;
    };

    /* Unmount */
    const unmountFunc = () => {
        /* Prevent from first unmounting caused by "strictMode" */
        mountCount.current += 1; if (mountCount.current === 1) return;

        /* unmount logic */
        mainRootControllerRef?.current?.deleteFromBroadcastDomainFunc({ index: broadcastIndex.current });
        mainRootControllerRef?.current?.deleteRefIdFunc({ wid: wid, refId: refId });
        controllerRef?.current?.deleteRefIdFunc({ wid: wid, refId: refId });
    };

    /* Select menu */
    const selectMenuFunc = (x: { source: 'home' | 'complaint' | 'product' | 'config' }) => {
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
        setTraductionFunc(x: any) { setTraductionFunc(x) }
    }), []);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            broadcastIndex.current = mainRootControllerRef.current.addToBroadcastDomainFunc({ wid: wid, refId: refId });
            mainRootControllerRef.current.addRefIdFunc({ wid: wid, refId: refId });
            controllerRef?.current?.addRefIdFunc({ wid: wid, refId: refId });
            /* - */
            selectMenuFunc({ source: 'home' });
        }
        return () => unmountFunc();
    }, []);

    /* On window size change */
    useEffect(() => {
        // window.addEventListener('resize', onWindowSizeChangeFunc);
        // return () => window.removeEventListener('resize', onWindowSizeChangeFunc);
    }, []);


    /* Return */

    const component = <>
        <div id='ctmmmw_scaffold'>
            <div /* Home */ id={ctmmmw_home_btn_container_id} className='ctmmmw_btn_container btn_opacity' onClick={() => selectMenuFunc({ source: 'home' })}>
                <img className='ctmmmw_btn_icon' src={chart_icon} />
                <div className='ctmmmw_btn_title'>Statisques</div>
            </div>

            <div /* Product */ id={ctmmmw_product_btn_container_id} className='ctmmmw_btn_container btn_opacity' onClick={() => selectMenuFunc({ source: 'product' })}>
                <img className='ctmmmw_btn_icon' src={cart_icon} />
                <div className='ctmmmw_btn_title'>Produits / Services</div>
            </div>

            <div /* Complaint */ id={ctmmmw_complaint_btn_container_id} className='ctmmmw_btn_container btn_opacity' onClick={() => selectMenuFunc({ source: 'complaint' })}>
                <img className='ctmmmw_btn_icon' src={warn_icon} />
                <div className='ctmmmw_btn_title'>Plaintes</div>
            </div>

            <div /* Account */ id={ctmmmw_config_btn_container_id} className='ctmmmw_btn_container btn_opacity' onClick={() => selectMenuFunc({ source: 'config' })}>
                <img className='ctmmmw_btn_icon' style={{ transform: 'scale(1.15)' }} src={config_icon} />
                <div className='ctmmmw_btn_title'>Configuration</div>
            </div>
        </div>
    </>;
    return (render.current ? component : <></>);

}); export default (CustomerMenuMainWidget);
/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import './CustomerProductDashboardWidget.css';
import { generateIdFunc } from '../../../Tools/methodForest';
import { _success_, _error_, _requestFailed_ } from '../../../Tools/constants';
import { refIdType } from '../../../Tools/type';
import { _defaultLanguage_ } from '../../../Tools/constants';
import ProductDashboardMainWidget from '../../ProductDashboard/ProductDashboardMainWidget';
import search_icon from '../../../Assets/png/search_0.png';
import add_icon from '../../../Assets/png/add.png';


/** Every change made to "wid" affect controller */
type propsType = { $data: { wid: string, controllerRef: refIdType, rootControllers: any } };
const CustomerProductDashboardWidget = forwardRef((props: propsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const refId: refIdType = ref;

    const windowWidth = useRef(window.innerWidth);
    const windowHeight = useRef(window.innerHeight);

    const refresher = useRef(false);
    const [refresh, setRefresh] = useState(refresher.current);

    const isMounted = useRef(false);
    const mountCount = useRef(0);
    const render = useRef(true);

    const broadcastIndex = useRef(-1);

    /* $data */
    const $data = props.$data;
    const wid = $data.wid;
    const controllerRef = $data.controllerRef;
    const rootControllers = $data.rootControllers;

    /* Root controllers */
    const mainRootControllerRef: refIdType = rootControllers?.current?.mainRootControllerRef;
    const requestRootControllerRef: refIdType = rootControllers?.current?.requestRootControllerRef;
    const dataStoreRootControllerRef: refIdType = rootControllers?.current?.dataStoreRootControllerRef;

    /* - */

    const traduction = useRef(dataStoreRootControllerRef.current.traduction.current);

    const productDashboardMainRef = useRef<any>(undefined);

    const scaffold_id = useRef(generateIdFunc()).current;

    const ctmpdw_h_input_box_id = useRef(generateIdFunc()).current;


    /* ------------------------------------ Methods ------------------------------------- */

    /* Refresh component */
    const refreshFunc = () => { refresher.current = !refresher.current; setRefresh(refresher.current) };

    /* Render */
    const renderFunc = (x: { render: boolean }) => { render.current = x.render; refreshFunc() };

    /* Set language */
    const setTraductionFunc = (x: { traduction: any }) => { traduction.current = x.traduction; /* refreshFunc() */ };

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

    /* Show | Hide */
    const showFunc = (x: { show: boolean }) => {
        $(`#${scaffold_id}`).css({ transform: `translateY(${x.show ? '0%' : '-100%'})` });
    };

    /* Add product */
    const addProductFunc = () => { controllerRef.current.addProductFunc() };

    /* On change */
    const onChangeFunc = () => {
        const val = $('#ctmpdw_h_input_box_id').val();
        controllerRef.current.setTextValueFunc({ wid: 'ctmpdw_h_input_box_id', text: val });
    };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        refreshFunc() { refreshFunc() },
        renderFunc(x: any) { renderFunc(x) },
        setTraductionFunc(x: any) { setTraductionFunc(x) },
        showFunc(x: any) { showFunc(x) },
    }), []);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            broadcastIndex.current = mainRootControllerRef.current.addToBroadcastDomainFunc({ wid: wid, refId: refId });
            mainRootControllerRef.current.addRefIdFunc({ wid: wid, refId: refId });
            controllerRef?.current?.addRefIdFunc({ wid: wid, refId: refId });
        }
        return () => unmountFunc();
    }, []);

    /* On window size change */
    // useEffect(() => {
    //     window.addEventListener('resize', onWindowSizeChangeFunc);
    //     return () => window.removeEventListener('resize', onWindowSizeChangeFunc);
    // }, []);


    /* Return */

    const component = <>
        <div id={scaffold_id} className='ctmpdw_scaffold'>
            <div className='ctmpdw_header'>
                <div className='ctmpdw_h_back_blur glass' />
                <div className='ctmpdw_h_container'>

                    <div className='ctmpdw_h_subcontainer'>
                        <div className='crmpdw_h_input_container'>
                            <img className='ctmpdw_h_input_icon' src={search_icon} />
                            <input id='ctmpdw_h_input_box_id' className='ctmpdw_h_input_box' placeholder='Search...' onChange={onChangeFunc} />
                        </div>

                        <div className='ctmpdw_h_add_btn_container btn' onClick={addProductFunc}>
                            <img className='ctmpdw_h_add_btn_icon' src={add_icon} />
                        </div>
                    </div>

                </div>
            </div>

            <ProductDashboardMainWidget ref={productDashboardMainRef} $data={{ wid: 'productDashboardMainRef', controllerRef: controllerRef, rootControllers: rootControllers }} />
        </div>
    </>;
    return (render.current ? component : <></>);

}); export default (CustomerProductDashboardWidget);
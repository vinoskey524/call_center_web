/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import './CustomerComplaintDashboardWidget.css';
import { generateIdFunc } from '../../../Tools/methodForest';
import { _success_, _error_, _requestFailed_ } from '../../../Tools/constants';
import { refIdType } from '../../../Tools/type';
import { _defaultLanguage_ } from '../../../Tools/constants';
import ComplaintDashboardMainWidget from '../../ComplaintDashboard/ComplaintDashboardMainWidget';
import search_icon from '../../../Assets/png/search_0.png';
import add_icon from '../../../Assets/png/add.png';
import arrow_white_icon from '../../../Assets/png/arrow_white.png';


/** Every change made to "wid" affect controller */
type propsType = { $data: { wid: string, controllerRef: refIdType, rootControllers: any } };
const CustomerComplaintDashboardWidget = forwardRef((props: propsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const refId: refIdType = ref;

    const windowWidth = useRef(window.innerWidth);
    const windowHeight = useRef(window.innerHeight);

    const refresher = useRef(false);
    const [refresh, setRefresh] = useState(refresher.current);

    const isMounted = useRef(false);
    const mountCount = useRef(0);
    const render = useRef(true);

    const emptyRef = useRef(undefined);

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

    const complaintDashboardMainRef = useRef<any>(undefined);

    const scaffold_id = useRef(generateIdFunc()).current;


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

    /* Add complaint */
    const addComplaintFunc = () => { controllerRef.current.addComplaintFunc() };


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
    useEffect(() => {
        // window.addEventListener('resize', onWindowSizeChangeFunc);
        // return () => window.removeEventListener('resize', onWindowSizeChangeFunc);
    }, []);


    /* Return */

    const component = <>
        <div id={scaffold_id} className='ctmcdw_scaffold'>
            <div className='ctmcdw_header'>
                <div className='ctmcdw_h_back_blur glass' />
                <div className='ctmcdw_h_container'>

                    <div className='ctmcdw_h_subcontainer'>
                        <div className='ctmpdw_h_filter_container'>
                            <select className='ctmpdw_h_filter_select'>
                                <option>All</option>
                                <option>En traitement</option>
                                <option>Traités</option>
                                <option>Non traités</option>
                                <option>Favoris</option>
                            </select>
                            <img className='ctmpdw_h_arrow' src={arrow_white_icon} />
                        </div>

                        <div style={{ width: 1, height: 18, backgroundColor: '#3B3F47', marginInline: 15 }} />

                        <div className='crmpdw_h_input_container'>
                            <img className='ctmcdw_h_input_icon' src={search_icon} />
                            <input className='ctmcdw_h_input_box' placeholder='Search...' />
                        </div>

                        <div className='ctmcdw_h_add_btn_container btn' onClick={addComplaintFunc}>
                            <img className='ctmcdw_h_add_btn_icon' src={add_icon} />
                        </div>
                    </div>

                </div>
            </div>

            <ComplaintDashboardMainWidget ref={complaintDashboardMainRef} $data={{ wid: 'complaintDashboardMainRef', controllerRef: controllerRef, rootControllers: rootControllers }} />
        </div>
    </>;
    return (<>{render.current && component}</>);

}); export default (CustomerComplaintDashboardWidget);
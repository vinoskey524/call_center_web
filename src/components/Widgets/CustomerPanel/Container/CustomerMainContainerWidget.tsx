/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import './CustomerMainContainerWidget.css';
import { generateIdFunc } from '../../../Tools/methodForest';
import { refIdType } from '../../../Tools/type';
import { _defaultLanguage_ } from '../../../Tools/constants';
import CustomerHomeDashboardWidget from '../Dashboard/CustomerHomeDashboardWidget';
import CustomerProductDashboardWidget from '../Dashboard/CustomerProductDashboardWidget';
import CustomerComplaintDashboardWidget from '../Dashboard/CustomerComplaintDashboardWidget';
import CustomerConfigDashboardWidget from '../Dashboard/CustomerConfigDashboardWidget';


/** Every change made to "wid" affect controller */
type propsType = { $data: { wid: string, controllerRef: refIdType, rootControllers: any } };
const CustomerMainContainerWidget = forwardRef((props: propsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const refId: refIdType = ref;

    const windowWidth = useRef(window.innerWidth);
    const windowHeight = useRef(window.innerHeight);

    const refresher = useRef(false);
    const [refresh, setRefresh] = useState(refresher.current);

    const isMounted = useRef(false);
    const mountCount = useRef(0);
    const render = useRef(!false);

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

    const customerHomeDashboardRef = useRef<any>(undefined);
    const customerProductDashboardRef = useRef<any>(undefined);
    const customerComplaintDashboardRef = useRef<any>(undefined);
    const customerConfigDashboardRef = useRef<any>(undefined);


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
        <div id='ctmmcw_scaffold'>
            <CustomerHomeDashboardWidget ref={customerHomeDashboardRef} $data={{ wid: 'customerHomeDashboardRef', controllerRef: controllerRef, rootControllers: rootControllers }} />
            <CustomerProductDashboardWidget ref={customerProductDashboardRef} $data={{ wid: 'customerProductDashboardRef', controllerRef: controllerRef, rootControllers: rootControllers }} />
            <CustomerComplaintDashboardWidget ref={customerComplaintDashboardRef} $data={{ wid: 'customerComplaintDashboardRef', controllerRef: controllerRef, rootControllers: rootControllers }} />
            <CustomerConfigDashboardWidget ref={customerConfigDashboardRef} $data={{ wid: 'customerConfigDashboardRef', controllerRef: controllerRef, rootControllers: rootControllers }} />
        </div>
    </>;
    return (<>{render.current && component}</>);

}); export default (CustomerMainContainerWidget);
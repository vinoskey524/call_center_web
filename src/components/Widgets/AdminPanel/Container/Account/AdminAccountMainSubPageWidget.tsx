/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import './AdminAccountMainSubPageWidget.css';
import { generateIdFunc } from '../../../../Tools/methodForest';
import { refIdType } from '../../../../Tools/type';
import { _appEmitterType_, _defaultLanguage_ } from '../../../../Tools/constants';
import AdminASPMainContainerWidget from './AdminAccountSubPage/AdminASPMainContainerWidget';
import CallCSPMainContainerWidget from './CallCenterSubPage/CallCSPMainContainerWidget';
import CustomerSPMainContainerWidget from './CustomerSubPage/CustomerSPMainContainerWidget';

/** Every change made to "wid" affect controller */
type propsType = { $data: { wid: string, controllerRef: refIdType, rootControllers: any } };
const AdminAccountMainSubPageWidget = (props: propsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const refId = ref;

    const windowWidth = useRef(window.innerWidth);
    const windowHeight = useRef(window.innerHeight);

    const refresher = useRef(false);
    const [refresh, setRefresh] = useState(refresher.current);

    const isMounted = useRef(false);
    const mountCount = useRef(0);
    const render = useRef(!false);

    const broadcastIndex = useRef(-1);

    /* $data */
    const $data = props.$data;
    const wid = useRef($data.wid || generateIdFunc()).current;
    const parentControllerRef = $data.controllerRef;
    const rootControllers = $data.rootControllers;

    /* Root controllers */
    const mainRootControllerRef: refIdType = rootControllers?.current?.mainRootControllerRef;
    const requestRootControllerRef: refIdType = rootControllers?.current?.requestRootControllerRef;
    const dataStoreRootControllerRef: refIdType = rootControllers?.current?.dataStoreRootControllerRef;

    /* - */

    const traduction = useRef(dataStoreRootControllerRef.current.traduction.current);

    const adminASPMainContainerRef = useRef(undefined);

    const callCSPMainContainerRef = useRef(undefined);

    const customerSPMainContainerRef = useRef(undefined);


    /* ------------------------------------ Methods ------------------------------------- */

    /* Refresh component */
    const refreshFunc = () => {
        refresher.current = refresher.current ? false : true;
        setRefresh(refresher.current);
    };

    /* Render */
    const renderFunc = (x: { render: boolean }) => {
        render.current = x.render;
        refreshFunc();
    };

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
        mainRootControllerRef?.current?.deleteRefIdFunc({ wid: wid, refId: refId });
        parentControllerRef?.current?.deleteRefIdFunc({ wid: wid, refId: refId });
        renderFunc({ render: false });
    };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        refreshFunc() { refreshFunc() },
        setTraductionFunc(x: any) { setTraductionFunc(x) }
    }), []);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            mainRootControllerRef.current.addRefIdFunc({ wid: wid, refId: refId });
            (parentControllerRef?.current !== undefined) && parentControllerRef.current.addRefIdFunc({ wid: wid, refId: refId });
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
        <div id='aamspw_scaffold'>
            <AdminASPMainContainerWidget ref={adminASPMainContainerRef} $data={{ wid: 'adminASPMainContainerRef', controllerRef: parentControllerRef, rootControllers: rootControllers }} />
            <CallCSPMainContainerWidget ref={callCSPMainContainerRef} $data={{ wid: 'callCSPMainContainerRef', controllerRef: parentControllerRef, rootControllers: rootControllers }} />
            <CustomerSPMainContainerWidget ref={customerSPMainContainerRef} $data={{ wid: 'customerSPMainContainerRef', controllerRef: parentControllerRef, rootControllers: rootControllers }} />
        </div>
    </>;
    return (<>{render.current && component}</>);
};

export default forwardRef(AdminAccountMainSubPageWidget);
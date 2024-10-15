/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import './CallCMainContainerWidget.css';
import { generateIdFunc } from '../../../Tools/methodForest';
import { refIdType } from '../../../Tools/type';
import { _defaultLanguage_ } from '../../../Tools/constants';
import CallCDashboardMainWidget from '../Dashboard/CallCDashboardMainWidget';
import headphone_icon from '../../../Assets/png/c1.png';
import FeedListWidget from '../../FeedList/FeedListWidget';


/** Every change made to "wid" affect controller */
type propsType = { $data: { wid: string, controllerRef: refIdType, rootControllers: any } };
const CallCMainContainerWidget = forwardRef((props: propsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const refId: refIdType = ref;

    const windowWidth = useRef(window.innerWidth);
    const windowHeight = useRef(window.innerHeight);

    const refresher = useRef(false);
    const [refresh, setRefresh] = useState(refresher.current);

    const isMounted = useRef(false);
    const mountCount = useRef(0);
    const render = useRef(!false);

    const emptyRef = useRef<any>(undefined);

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

    const callCenterDashboardFeedListRef = useRef(undefined);


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
            (controllerRef.current !== undefined) && controllerRef.current.addRefIdFunc({ wid: wid, refId: refId });
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
        <div id='ccmcw_scaffold'>
            <div id='ccmcw_background_image_container'>
                <div id='ccmcw_main_title'>Solution de Gestion de la Clientèle</div>
                <img width={300} height={300 / 1.1986} src={headphone_icon} />
                <div id='ccmcw_subtitle'>Chaque appel compte, et votre travail fait la différence.</div>
            </div>

            <div id='ccmcw_body'>
                <FeedListWidget ref={callCenterDashboardFeedListRef} $data={{
                    wid: 'callCenterDashboardFeedListRef', controllerRef: controllerRef, customerControllerWid: 'callCenterDashboardFeedListControllerRef', rootControllers: rootControllers, paddingTop: 0,
                    widget: ({ _key, _refId, _data }: any) => { return <CallCDashboardMainWidget key={_key} ref={_refId} $data={{ controllerRef: controllerRef, rootControllers: rootControllers, customerData: _data }} /> }
                }} />
            </div>
        </div>
    </>;
    return (<>{render.current && component}</>);

}); export default (CallCMainContainerWidget);
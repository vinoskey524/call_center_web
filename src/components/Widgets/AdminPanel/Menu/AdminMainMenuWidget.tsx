/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import './AdminMainMenuWidget.css';
import { generateIdFunc } from '../../../Tools/methodForest';
import { _appEmitterType_ } from '../../../Tools/constants';
import white_arrow_icon from '../../../Assets/png/arrow_white.png';
import { refIdType } from '../../../Tools/type';


/* Widget */
type propsType = {
    $data: {
        /** Every change made to "wid" affect controller */
        wid: string,
        controllerRef: refIdType,
        rootControllers: any,
        menuData: { container: { id: string, title: string }, children: Array<{ id: string, iconUri: string, title: string }> }
    }
};
const AdminMainMenuWidget = forwardRef((props: propsType, ref: any) => {
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
    const controllerRef = $data.controllerRef;
    const rootControllers = $data.rootControllers || { current: undefined };
    const menuData = $data.menuData;

    /* Root controllers */
    const mainRootControllerRef: refIdType = rootControllers?.current?.mainRootControllerRef;
    const requestRootControllerRef: refIdType = rootControllers?.current?.requestRootControllerRef;
    const dataStoreRootControllerRef: refIdType = rootControllers?.current?.dataStoreRootControllerRef;

    /* - */

    const traduction = useRef(dataStoreRootControllerRef.current.traduction.current);

    const containerData = menuData.container;
    const childrenData = menuData.children;

    const childrenRefTab = Array(childrenData.length).fill(undefined).map(() => React.createRef());


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
        // mainRootControllerRef?.current?.deleteRefIdFunc({ wid: wid, refId: refId });
        // controllerRef?.current?.deleteRefIdFunc({ wid: wid, refId: refId });
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
        }
        return () => unmountFunc();
    }, []);

    /* On window size change */
    useEffect(() => {
        // window.addEventListener('resize', onWindowSizeChangeFunc);
        // return () => window.removeEventListener('resize', onWindowSizeChangeFunc);
    }, []);


    /* Return */

    /* Create Children components */
    const childrenComp = [];
    if (childrenComp.length === 0) for (let i = 0; i < childrenData.length; i++) childrenComp.push(<AdminMenuBtnWidget key={i} ref={childrenRefTab[i]} $data={{ controllerRef: controllerRef, rootControllers: rootControllers, btnData: childrenData[i] }} />);

    /* - */
    const component = <>
        <div className='ammw_scaffold'>
            <button className='ammw_main_btn'>
                <p className='ammw_main_title'>{containerData.title}</p>
                <img className='ammw_main_icon' src={white_arrow_icon} />
            </button>
            {childrenComp}
        </div>
    </>;
    return (<>{render.current && component}</>);

}); export default (AdminMainMenuWidget);














































/* ----------------------------------------------------- Direct Children Components ----------------------------------------------------- */

/* Feed */
type adminMenuPropsType = { $data: { wid?: string, controllerRef: refIdType, rootControllers: any, btnData: { id: string, iconUri: string, title: string } } };
const AdminMenuBtnWidget = forwardRef((props: adminMenuPropsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const refId = ref;

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
    const wid = useRef($data.wid || generateIdFunc()).current;
    const controllerRef = $data.controllerRef;
    const rootControllers = $data.rootControllers || { current: undefined };
    const btnData = $data.btnData;

    /* Root controllers */
    const mainRootControllerRef: refIdType = rootControllers?.current?.mainRootControllerRef;
    const requestRootControllerRef: refIdType = rootControllers?.current?.requestRootControllerRef;
    const dataStoreRootControllerRef: refIdType = rootControllers?.current?.dataStoreRootControllerRef;

    /* - */

    const traduction = useRef(dataStoreRootControllerRef.current.traduction.current);

    const scaffoldId = useRef(generateIdFunc({ length: 6 })).current;
    const titleId = useRef(generateIdFunc({ length: 6 })).current;

    const isSelected = useRef(false);


    /* ------------------------------------ Methods ------------------------------------- */

    /* Refresh component */
    const refreshFunc = () => { refresher.current = refresher.current ? false : true; setRefresh(refresher.current) };

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
        // mainRootControllerRef?.current?.deleteRefIdFunc({ wid: wid, refId: refId });
        // controllerRef?.current?.deleteRefIdFunc({ wid: wid, refId: refId });
    };

    /* Select */
    const selectFunc = (x: { select: boolean }) => {
        const select = x.select;

        isSelected.current = select;

        $(`#${titleId}`).css({ 'color': select ? 'white' : '#99A1B3' });
        !select && $(`#${titleId}`).removeAttr('style');

        $(`#${scaffoldId}`).css({ 'backgroundColor': select ? '#4F586A' : 'transparent' });
        !select && $(`#${scaffoldId}`).removeAttr('style');
    };

    /* on click */
    const onClickFunc = () => { controllerRef.current.showMenuPageFunc({ id: btnData.id, refId: refId }) };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        refreshFunc() { refreshFunc() },
        renderFunc(x: any) { renderFunc(x) },
        setTraductionFunc(x: any) { setTraductionFunc(x) },
        selectFunc(x: any) { selectFunc(x) }
    }), []);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            broadcastIndex.current = mainRootControllerRef.current.addToBroadcastDomainFunc({ wid: wid, refId: refId });
        }
        return () => unmountFunc();
    }, []);


    /* Return */

    const component = <>
        <button id={scaffoldId} className='ambw_scaffold' onClick={onClickFunc}>
            <img className='ambw_icon' src={btnData.iconUri} />
            <p id={titleId} className='ambw_title'>{btnData.title}</p>
        </button>
    </>;
    return (<>{render.current && component}</>);
});
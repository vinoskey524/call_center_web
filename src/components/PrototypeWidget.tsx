/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import { generateIdFunc } from './Tools/methodForest';
import { language } from './Tools/language';
import { refIdType } from './Tools/type';

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
const PrototypeWidget = (props: propsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const parentProps = props;

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const [windowHeight, setWindowHeight] = useState(window.innerHeight);

    const [refresh, setRefresh] = useState(false);

    const isMounted = useRef(false);

    const render = useRef(!false);

    const zIndex = useRef(0);

    const lang = useRef('fr');

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


    /* ------------------------------------ Methods ------------------------------------- */

    /* Refresh component */
    const refreshFunc = () => { setRefresh(!refresh) };

    /* Set language */
    const setLanguageFunc = (x: { lang: 'en' | 'fr' }) => { lang.current = x.lang; setRefresh(!refresh) };

    /* On window size change */
    const onWindowSizeChangeFunc = () => { setWindowWidth(window.innerWidth); setWindowHeight(window.innerHeight) };


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
        }
    }, []);

    /* On window size change */
    // useEffect(() => {
    //     window.addEventListener('resize', onWindowSizeChangeFunc);
    //     return () => window.removeEventListener('resize', onWindowSizeChangeFunc);
    // }, []);


    /* Return */


    const component = <>
        <div style={{ zIndex: zIndex.current }}></div>
    </>;
    return (render.current ? component : <></>);
};

export default forwardRef(PrototypeWidget);
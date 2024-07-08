/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import './PanelMenuBtnWidget.css';
import { generateIdFunc } from '../../../Tools/methodForest';
import { language } from '../../../Tools/language';
import { refIdType } from '../../../Tools/type';

/* Widget */
type propsType = {
    $data: {
        refId: refIdType,
        controllerRef: refIdType,
        rootControllers: any,
        btnData: { id: string, iconUri: string, title: string }
    }
};
const PanelMenuBtnWidget = (props: propsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const parentProps = props;

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const [windowHeight, setWindowHeight] = useState(window.innerHeight);

    const refresher = useRef(false);
    const [refresh, setRefresh] = useState(refresher.current);

    const isMounted = useRef(false);

    const render = useRef(!false);

    const lang = useRef('en');

    const traduction = language[lang.current];

    /* $data */

    const data = props.$data;

    const refId = data.refId;

    const controllerRef = data.controllerRef;

    const rootControllers = data.rootControllers;

    const btnData = data.btnData;

    /* Root controllers */

    const mainControllerRef: refIdType = rootControllers.mainControllerRef;

    const requestControllerRef: refIdType = rootControllers.requestControllerRef;

    const dataStoreControllerRef: refIdType = rootControllers.dataStoreControllerRef;

    /* - */

    const scaffoldId = useRef(generateIdFunc({ length: 6 })).current;

    const titlId = useRef(generateIdFunc({ length: 6 })).current;

    const isSelected = useRef(false);


    /* ------------------------------------ Methods ------------------------------------- */

    /* Refresh component */
    const refreshFunc = () => {
        refresher.current = refresher.current ? false : true;
        setRefresh(refresher.current);
    };

    /* Set language */
    const setLanguageFunc = (x: { lang: 'en' | 'fr' }) => { lang.current = x.lang; setRefresh(!refresh) };

    /* On window size change */
    const onWindowSizeChangeFunc = () => { setWindowWidth(window.innerWidth); setWindowHeight(window.innerHeight) };

    /* Select */
    const selectFunc = (x: { select: boolean }) => {
        const select = x.select;

        isSelected.current = select;

        $(`#${titlId}`).css({ 'color': select ? 'white' : '#99A1B3' });
        !select && $(`#${titlId}`).removeAttr('style');

        $(`#${scaffoldId}`).css({ 'backgroundColor': select ? '#4F586A' : 'transparent' });
        !select && $(`#${scaffoldId}`).removeAttr('style');
    };

    /* on click */
    const onClickFunc = () => { controllerRef.current.selectMenuFunc({ id: btnData.id, refId: refId }) };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        refreshFunc() { refreshFunc() },
        setLanguageFunc(x: any) { setLanguageFunc(x) },
        selectFunc(x: any) { selectFunc(x) }
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
        <button id={scaffoldId} className='pmb_scaffold' onClick={onClickFunc}>
            <img className='pmb_icon' src={btnData.iconUri} />
            <p id={titlId} className='pmb_title'>{btnData.title}</p>
        </button>
    </>;
    return (render.current ? component : <></>);
};

export default forwardRef(PanelMenuBtnWidget);
// @refresh reset

/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import './SwitchWidget.css';
import { generateIdFunc } from '../../Tools/methodForest';
import { language } from '../../Tools/language';
import { refIdType } from '../../Tools/type';
import { _defaultLanguage_ } from '../../Tools/constants';

/* Widget */
type propsType = {
    className?: string,
    $data: {
        /** Every change made to "wid" affect controller */
        wid: string,
        refId: refIdType,
        controllerRef: refIdType,
        style: { width: number, height: number, backgroundColor: string },
        sliderColor?: string,
        switched?: boolean,
        title?: string
    }
};
const SwitchWidget = (props: propsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const parentProps = props;

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const [windowHeight, setWindowHeight] = useState(window.innerHeight);

    const refresher = useRef(false);
    const [refresh, setRefresh] = useState(refresher.current);

    const isMounted = useRef(false);

    const render = useRef(true);

    const lang = useRef(_defaultLanguage_);

    const traduction = language[lang.current];

    /* - */

    const className = props.className;

    /* $data */

    const data = props.$data;

    const wid = data.wid;

    const refId = data.refId;

    const controllerRef = data.controllerRef;

    const style = data.style;

    const sliderColor = data.sliderColor || '#9e9e9e';

    const switched = data.switched || false;

    const title = data.title || 'Switch button';

    /* - */

    const sliderDim = (style.height * 88) / 100;

    const isSwitched = useRef(switched);

    const scaffold_id = useRef(generateIdFunc({ length: 6 })).current;

    const pusher_id = useRef(generateIdFunc({ length: 6 })).current;

    const slider_id = useRef(generateIdFunc({ length: 6 })).current;


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

    /* Switch */
    const switchFunc = (x: { switch: boolean }) => {
        isSwitched.current = x.switch;
        $(`#${scaffold_id}`).css({ 'background-color': isSwitched.current ? '#1B76D0' : style.backgroundColor });
        $(`#${slider_id}`).css({ 'background-color': isSwitched.current ? '#fff' : '#9e9e9e' });
        $(`#${slider_id}`).animate({ 'marginLeft': isSwitched.current ? (style.width - (sliderDim + 4)) : 0 }, 200); /* 4 => padding-inline */
    };

    /* On switch */
    const onSwitchFunc = () => {
        isSwitched.current = !isSwitched.current;
        $(`#${scaffold_id}`).css({ 'background-color': isSwitched.current ? '#1B76D0' : style.backgroundColor });
        $(`#${slider_id}`).css({ 'background-color': isSwitched.current ? '#fff' : '#9e9e9e' });
        $(`#${slider_id}`).animate({ 'marginLeft': isSwitched.current ? (style.width - (sliderDim + 4)) : 0 }, 200); /* 4 => padding-inline */
    };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        refreshFunc() { refreshFunc() },
        setLanguageFunc(x: any) { setLanguageFunc(x) },
        switchFunc(x: any) { switchFunc(x) }
    }), [refresh]);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            (controllerRef.current !== undefined) && controllerRef.current.addWidgetRefFunc({ wid: wid, refId: refId });
            switched && switchFunc({ switch: true });
        }
    }, []);

    /* On window size change */
    // useEffect(() => {
    //     window.addEventListener('resize', onWindowSizeChangeFunc);
    //     return () => window.removeEventListener('resize', onWindowSizeChangeFunc);
    // }, []);


    /* Return */


    const component = <>
        <div id={scaffold_id} className={`sw_scaffold ${className}`} style={style} onClick={onSwitchFunc} title={title}>
            <div id={slider_id} className='sw_slider' style={{ width: sliderDim, height: sliderDim }} />
        </div>
    </>;
    return (component);
};

export default forwardRef(SwitchWidget);
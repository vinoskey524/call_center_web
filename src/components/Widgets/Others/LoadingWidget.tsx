/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle, memo } from 'react';
import $ from 'jquery';

/* Custom packages */
import './LoadingWidget.css';
import { generateIdFunc } from '../../Tools/methodForest';
import { refIdType } from '../../Tools/type';
import { _defaultLanguage_ } from '../../Tools/constants';
import loading_0_gif from '../../Assets/gif/loading0.gif';

/** Every change made to "wid" affect controller */
type propsType = { $data: { wid: string, controllerRef?: refIdType, visible?: boolean } };
const LoadingWidget = forwardRef((props: propsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const refId: refIdType = ref;

    const windowWidth = useRef(window.innerWidth);
    const windowHeight = useRef(window.innerHeight);

    const refresher = useRef(false);
    const [refresh, setRefresh] = useState(refresher.current);

    const isMounted = useRef(false);
    const render = useRef(true);

    /* $data */
    const $data = props.$data;
    const wid = $data.wid;
    const controllerRef = $data.controllerRef;
    const visible = $data.visible || false;

    /* - */

    const loadw_img_id = useRef(generateIdFunc()).current;

    const dim = 50;


    /* ------------------------------------ Methods ------------------------------------- */

    /* Refresh component */
    const refreshFunc = () => { refresher.current = !refresher.current; setRefresh(refresher.current) };

    /* On window size change */
    const onWindowSizeChangeFunc = () => {
        windowWidth.current = window.innerWidth;
        windowHeight.current = window.innerHeight;
    };

    /* Show loading */
    const showLoadingFunc = (x: { show: boolean }) => { $(`#${loadw_img_id}`).animate(x.show ? { width: dim, height: dim } : { width: 0, height: 0 }, 300) };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        refreshFunc() { refreshFunc() },
        showLoadingFunc(x: any) { showLoadingFunc(x) }
    }), []);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            controllerRef?.current?.addRefIdFunc({ wid: wid, refId: refId });
            visible && $(`#${loadw_img_id}`).css({ width: dim, height: dim });
        }
    }, []);

    /* On window size change */
    useEffect(() => {
        // window.addEventListener('resize', onWindowSizeChangeFunc);
        // return () => window.removeEventListener('resize', onWindowSizeChangeFunc);
    }, []);


    /* Return */

    const component = <>
        <div className='loadw_scaffold'>
            <img id={loadw_img_id} className='loadw_img' src={loading_0_gif} />
        </div>
    </>;
    return (<>{render.current && component}</>);

}); export default memo(LoadingWidget);
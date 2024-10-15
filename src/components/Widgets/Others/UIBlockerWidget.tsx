/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import './UIBlockerWidget.css';
import { refIdType } from '../../Tools/type';

/** Every change made to "wid" affect controller */
type propsType = { $data: { wid: string, controllerRef: refIdType } };
const UIBlockerWidget = forwardRef((props: propsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const refId: refIdType = ref;

    const windowWidth = useRef(window.innerWidth);
    const windowHeight = useRef(window.innerHeight);

    const refresher = useRef(false);
    const [refresh, setRefresh] = useState(refresher.current);

    const isMounted = useRef(false);
    const render = useRef(false);

    /* $data */
    const $data = props.$data;
    const wid = $data.wid;
    const controllerRef = $data.controllerRef;


    /* ------------------------------------ Methods ------------------------------------- */

    /* Refresh component */
    const refreshFunc = () => { refresher.current = !refresher.current; setRefresh(refresher.current) };

    /* Render */
    const renderFunc = (x: { render: boolean }) => { render.current = x.render; refreshFunc() };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        refreshFunc() { refreshFunc() },
        renderFunc(x: any) { renderFunc(x) },
    }), []);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            (controllerRef.current !== undefined) && controllerRef.current.addRefIdFunc({ wid: wid, refId: refId });
        }
    }, []);


    /* Return */

    const component = <>
        <div className='uiBlockerScaffold'></div>
    </>;
    return (render.current ? component : <></>);
}); export default (UIBlockerWidget);
/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

/* Custom packages */
import { refIdType } from '../../Tools/type';

/* Widget */
type propsType = {
    id?: string,
    className?: string,
    children?: any,
    $data: {
        /** Every change made to "wid" affect controller */
        wid: string,
        refId: refIdType,
        controllerRef: refIdType,
        type?: 'text' | 'email' | 'password' | 'number' | 'tel',
    }
};
const TextInputWidget = (props: propsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const parentProps = props;

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const [windowHeight, setWindowHeight] = useState(window.innerHeight);

    const [refresh, setRefresh] = useState(false);

    const isMounted = useRef(false);

    const render = useRef(false);

    /* - */

    const id = props.id || '';

    const className = props.className || '';

    const children = props.children || <></>;

    /* $data */

    const data = props.$data;

    const wid = data.wid;

    const refId = data.refId;

    const controllerRef = data.controllerRef;

    const type = data.type || 'text';

    /* - */


    /* ------------------------------------ Methods ------------------------------------- */

    /* Refresh component */
    const refreshFunc = () => { setRefresh(!refresh) };

    /* On window size change */
    const onWindowSizeChangeFunc = () => { setWindowWidth(window.innerWidth); setWindowHeight(window.innerHeight) };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        refreshFunc() { refreshFunc() }
    }), [refresh]);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
        }
    }, []);

    /* On window size change */
    useEffect(() => {
        window.addEventListener('resize', onWindowSizeChangeFunc);
        return () => window.removeEventListener('resize', onWindowSizeChangeFunc);
    }, []);


    /* Return */


    const component = <>
        <div id={id} className={className}>
            <input style={{ flex: 1 }} type={type} />
        </div>
    </>;
    return (render.current ? component : <></>);
};

export default forwardRef(TextInputWidget);
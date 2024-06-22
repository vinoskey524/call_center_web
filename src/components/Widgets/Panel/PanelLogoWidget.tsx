/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

/* Custom packages */
import './PanelLogoWidget.css';
import logo from '../../Assets/png/google.png';
import { language } from '../../Tools/language';
import { refIdType } from '../../Tools/type';

/* Widget */
type propsType = {
    $data: {
        /** Every change made to "wid" affect controller */
        wid: string,
        refId: refIdType,
    }
};
const PanelLogoWidget = (props: propsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const parentProps = props;

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const [windowHeight, setWindowHeight] = useState(window.innerHeight);

    const [refresh, setRefresh] = useState(false);

    const isMounted = useRef(false);

    const render = useRef(true);

    const zIndex = useRef(0);

    const lang = useRef('fr');

    const traduction = language[lang.current];

    /* $data */

    const data = props.$data;

    const wid = data.wid;

    const refId = data.refId;

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
        <div id='pl_scaffold' className='prevent_select' style={{ zIndex: zIndex.current }}>
            <img id='pl_logo_icon' src={logo} />
            <p id='pl_app_name'>Google</p>
        </div>
    </>;
    return (render.current ? component : <></>);
};

export default forwardRef(PanelLogoWidget);
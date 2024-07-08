/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

/* Custom packages */
import './PanelMenuContainerWidget.css';
import white_arrow_icon from '../../../Assets/png/arrow_white.png';
import { language } from '../../../Tools/language';
import { refIdType } from '../../../Tools/type';
import PanelMenuBtnWidget from './PanelMenuBtnWidget';

/* Widget */
type propsType = {
    $data: {
        /** Every change made to "wid" affect controller */
        wid: string,
        refId: refIdType,
        controllerRef: refIdType,
        rootControllers: any,
        menuData: {
            container: { id: string, title: string },
            children: Array<{ id: string, iconUri: string, title: string }>
        }
    }
};
const PrototypeWidget = (props: propsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const parentProps = props;

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const [windowHeight, setWindowHeight] = useState(window.innerHeight);

    const refresher = useRef(false);
    const [refresh, setRefresh] = useState(refresher.current);

    const isMounted = useRef(false);

    const render = useRef(!false);

    const lang = useRef('fr');

    const traduction = language[lang.current];

    /* $data */

    const data = props.$data;

    const wid = data.wid;

    const refId = data.refId;

    const controllerRef = data.controllerRef;

    const rootControllers = data.rootControllers;

    const menuData = data.menuData;

    /* Root controllers */

    const mainControllerRef: refIdType = rootControllers.mainControllerRef;

    const requestControllerRef: refIdType = rootControllers.requestControllerRef;

    const dataStoreControllerRef: refIdType = rootControllers.dataStoreControllerRef;

    /* - */

    const containerData = menuData.container;

    const childrenData = menuData.children;

    /* - */

    const childrenRefTab = Array(childrenData.length).fill(undefined).map(() => React.createRef());


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
    useEffect(() => {
        window.addEventListener('resize', onWindowSizeChangeFunc);
        return () => window.removeEventListener('resize', onWindowSizeChangeFunc);
    }, []);


    /* Return */


    /* Create Children components */
    const childrenComp = [];
    if (childrenComp.length === 0) for (let i = 0; i < childrenData.length; i++) childrenComp.push(<PanelMenuBtnWidget key={i} ref={childrenRefTab[i]} $data={{ refId: childrenRefTab[i], controllerRef: controllerRef, rootControllers: rootControllers, btnData: childrenData[i] }} />);
    /* - */
    const component = <>
        <div className='pmc_scaffold prevent_select'>
            <button className='pmc_main_btn'>
                <p className='pmc_main_title'>{containerData.title}</p>
                <img className='pmc_main_icon' src={white_arrow_icon} />
            </button>
            {childrenComp}
        </div>
    </>;
    return (render.current ? component : <></>);
};

export default forwardRef(PrototypeWidget);
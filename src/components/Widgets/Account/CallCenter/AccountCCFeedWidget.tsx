/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import './AccountCCFeedWidget.css';
import trash_icon from '../../../Assets/png/trash.png';
import edit_icon from '../../../Assets/png/ed.png';
import logo_h_icon from '../../../Assets/png/logo_h.png';
import logo_f_icon from '../../../Assets/png/logo_f.png';
import { generateIdFunc } from '../../../Tools/methodForest';
import { language } from '../../../Tools/language';
import { refIdType } from '../../../Tools/type';
import { _defaultLanguage_ } from '../../../Tools/constants';
import SwitchWidget from '../../Others/SwitchWidget';

/* Widget */
type propsType = {
    $data: {
        refId: refIdType,
        controllerRef: refIdType,
        rootControllers: any,
        accountData: { id: string, fullName: string, username: string, ssm: string, rights: string, status: string }
    }
};
const AccountCCFeedWidget = (props: propsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const parentProps = props;

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const [windowHeight, setWindowHeight] = useState(window.innerHeight);

    const [refresh, setRefresh] = useState(false);

    const isMounted = useRef(false);

    const render = useRef(!false);

    const lang = useRef(_defaultLanguage_);

    const traduction = language[lang.current];

    /* $data */

    const data = props.$data;

    const refId = data.refId;

    const controllerRef = data.controllerRef;

    const rootControllers = data.rootControllers;

    const accountData = data.accountData;

    /* Root controllers */

    const mainControllerRef: refIdType = rootControllers.mainControllerRef;

    const requestControllerRef: refIdType = rootControllers.requestControllerRef;

    const dataStoreControllerRef: refIdType = rootControllers.dataStoreControllerRef;

    /* - */

    const switchRef = useRef(undefined);


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
        <div className='accfw_scaffold prevent_select'>
            <div className='accfw_checkbox_container'>
                <input className='accfw_checkbox' type='checkbox' />
                <img className='accfw_icon' src={logo_h_icon} />
            </div>
            <div className='accfw_hyphen' />

            <p className='accfw_full_name one_line'>{accountData.fullName}</p>
            <div className='accfw_hyphen' />

            <p className='accfw_username one_line'>{accountData.username}</p>
            <div className='accfw_hyphen' />

            <p className='accfw_status one_line'>{accountData.status}</p>
            <div className='accfw_hyphen' />

            <div className='accfw_action_btn_container'>
                <SwitchWidget ref={switchRef} $data={{ wid: 'switchRef', refId: switchRef, controllerRef: { current: undefined }, style: { width: 40, height: 21, backgroundColor: 'white' }, title: traduction['t0012'] }} />
                <img className='accfw_action_btn_icon btn_opacity' style={{ marginInline: 20 }} src={edit_icon} onClick={() => { }} />
                <img className='accfw_action_btn_icon btn_opacity' src={trash_icon} title='Delete' onClick={() => { }} />
            </div>
        </div>
    </>;
    return (render.current ? component : <></>);
};

export default forwardRef(AccountCCFeedWidget);
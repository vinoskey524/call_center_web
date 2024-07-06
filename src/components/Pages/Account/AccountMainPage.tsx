/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import './AccountMainPage.css';
import { generateIdFunc } from '../../Tools/methodForest';
import { language } from '../../Tools/language';
import { refIdType } from '../../Tools/type';
import { _defaultLanguage_ } from '../../Tools/constants';
import AccountAdminPage from './AccountAdminPage';
import AccountCallCenterPage from './AccountCallCenterPage';
import AccountCustomerPage from './AccountCustomerPage';
import AccountMainControllerWidget from '../../Widgets/Account/AccountMainControllerWidget';

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
const AccountMainPage = (props: propsType, ref: any) => {
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

    const wid = data.wid;

    const refId = data.refId;

    const controllerRef = data.controllerRef; /* panelMainControllerRef */

    const rootControllers = data.rootControllers;

    /* Root controllers */

    const mainControllerRef: refIdType = rootControllers.mainControllerRef;

    const requestControllerRef: refIdType = rootControllers.requestControllerRef;

    const dataStoreControllerRef: refIdType = rootControllers.dataStoreControllerRef;

    /* - */

    const accountAdminRef = useRef(undefined);

    const accountCallCenterRef = useRef(undefined);

    const accountCustomerRef = useRef(undefined);

    const accountMainControllerRef = useRef(undefined);


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
        <div id='am_scaffold'>
            <AccountAdminPage ref={accountAdminRef} $data={{ wid: 'accountAdminRef', refId: accountAdminRef, controllerRef: accountMainControllerRef, rootControllers: rootControllers }} />
            <AccountCallCenterPage ref={accountCallCenterRef} $data={{ wid: 'accountCallCenterRef', refId: accountCallCenterRef, controllerRef: accountMainControllerRef, rootControllers: rootControllers }} />
            <AccountCustomerPage ref={accountCustomerRef} $data={{ wid: 'accountCustomerRef', refId: accountCustomerRef, controllerRef: accountMainControllerRef, rootControllers: rootControllers }} />
        </div>
        <AccountMainControllerWidget ref={accountMainControllerRef} $data={{ wid: 'accountMainControllerRef', refId: accountMainControllerRef, controllerRef: controllerRef, rootControllers: rootControllers }} />
    </>;
    return (render.current ? component : <></>);
};

export default forwardRef(AccountMainPage);
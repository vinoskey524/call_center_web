/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import './CustomerSPMainContainerWidget.css';
import { generateIdFunc } from '../../../../../Tools/methodForest';
import { language } from '../../../../../Tools/language';
import { refIdType } from '../../../../../Tools/type';
import { _defaultLanguage_ } from '../../../../../Tools/constants';
import CustomerSPFeedWidget from './CustomerSPFeedWidget';
import CustomerSPMainControllerWidget from './CustomerSPMainControllerWidget';

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
const CustomerSPMainContainerWidget = (props: propsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const parentProps = props;

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const [windowHeight, setWindowHeight] = useState(window.innerHeight);

    const refresher = useRef(false);
    const [refresh, setRefresh] = useState(refresher.current);

    const isMounted = useRef(false);

    const render = useRef(!false);

    const lang = useRef(_defaultLanguage_);

    const traduction = language[lang.current];

    /* $data */

    const data = props.$data;

    const wid = data.wid;

    const refId = data.refId;

    const controllerRef = data.controllerRef; /* accountMainControllerRef */

    const rootControllers = data.rootControllers;

    /* Root controllers */

    const mainControllerRef: refIdType = rootControllers.mainControllerRef;

    const requestControllerRef: refIdType = rootControllers.requestControllerRef;

    const dataStoreControllerRef: refIdType = rootControllers.dataStoreControllerRef;

    /* - */

    const customerSPMainControllerRef = useRef(undefined);

    const testFeed = Array(41).fill(undefined).map((_, i: number) => { return { id: `id_${i}`, fullName: 'Kevin ODOUTAN', email: 'entreprise@gmail.com', phone: '+229 96986123', expiration: '26 jours', active: false } })

    const feedRef = Array(5).fill(undefined).map(() => React.createRef());


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

    /* Show or hide */
    const showFunc = (x: { show: boolean }) => {
        $('#cspmcw_scaffold').css({ 'z-index': x.show ? 5 : 1 });
        !x.show && $('#cspmcw_scaffold').removeAttr('style');
    };

    /* Create new account */
    const createNewAccountFunc = () => {
        const accountCreationRef: refIdType = mainControllerRef.current.accountCreationRef;
        accountCreationRef.current.showFunc({ show: true, sourcePage: 'customer' });
    };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        refreshFunc() { refreshFunc() },
        setLanguageFunc(x: any) { setLanguageFunc(x) },
        showFunc(x: any) { showFunc(x) }
    }), [refresh]);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            controllerRef.current.addWidgetRefFunc({ wid: wid, refId: refId });
        }
    }, []);

    /* On window size change */
    // useEffect(() => {
    //     window.addEventListener('resize', onWindowSizeChangeFunc);
    //     return () => window.removeEventListener('resize', onWindowSizeChangeFunc);
    // }, []);


    /* Return */


    /* Create feed */
    const callCenterFeed = [];
    if (callCenterFeed.length === 0) for (let i = 0; i < testFeed.length; i++) callCenterFeed.push(<CustomerSPFeedWidget key={i} ref={feedRef[i]} $data={{ refId: feedRef[i], controllerRef: customerSPMainControllerRef, rootControllers: rootControllers, accountData: testFeed[i] }} />);
    /* - */
    const component = <>
        <div id='cspmcw_scaffold' className='prevent_select'>
            <div id='cspmcw_header' className='glass'>
                <div id='cspmcw_title_container'>
                    <h1 id='cspmcw_title'>{traduction['t0010']}</h1>
                    <button id='cspmcw_add_account_btn_container' className='btn_opacity' onClick={createNewAccountFunc}>
                        <p id='cspmcw_add_account_btn_title'>+ {traduction['t0011']}</p>
                    </button>
                </div>

                <div id='cspmcw_table_header'>
                    <div className='cspfw_checkbox_container'>
                        <input className='cspfw_checkbox' type='checkbox' />
                    </div>
                    <div className='cspfw_hyphen' />

                    <p className='cspfw_full_name one_line'>Name</p>
                    <div className='cspfw_hyphen' />

                    <p className='cspfw_email one_line'>Email</p>
                    <div className='cspfw_hyphen' />

                    <p className='cspfw_phone one_line'>Phone</p>
                    <div className='cspfw_hyphen' />

                    <p className='cspfw_expiration one_line'>Expire dans</p>
                    <div className='cspfw_hyphen' />

                    <p className='cspfw_action_btn_container' style={{ justifyContent: 'center' }}>Actions</p>
                </div>
            </div>

            <div id='cspmcw_container'>
                {callCenterFeed}
            </div>
        </div>
        <CustomerSPMainControllerWidget ref={customerSPMainControllerRef} $data={{ wid: 'customerSPMainControllerRef', refId: customerSPMainControllerRef, rootControllers: rootControllers }} />
    </>;
    return (render.current ? component : <></>);
};

export default forwardRef(CustomerSPMainContainerWidget);
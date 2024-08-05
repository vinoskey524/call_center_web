/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import './CallCSPMainContainerWidget.css';
import { generateIdFunc } from '../../../../../Tools/methodForest';
import { language } from '../../../../../Tools/language';
import { refIdType } from '../../../../../Tools/type';
import { _defaultLanguage_ } from '../../../../../Tools/constants';
import CallCSPFeedWidget from './CallCSPFeedWidget';
import CallCSPMainControllerWidget from './CallCSPMainControllerWidget';

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
const CallCSPMainContainerWidget = (props: propsType, ref: any) => {
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

    const controllerRef = data.controllerRef; /* AdminMainControllerWidget */

    const rootControllers = data.rootControllers;

    /* Root controllers */

    const mainControllerRef: refIdType = rootControllers.mainControllerRef;

    const requestControllerRef: refIdType = rootControllers.requestControllerRef;

    const dataStoreControllerRef: refIdType = rootControllers.dataStoreControllerRef;

    /* - */

    const callCSPMainControllerRef = useRef(undefined);

    const testFeed = Array(41).fill(undefined).map((_, i: number) => { return { id: `id_${i}`, fullName: 'Kevin ODOUTAN', username: 'o.kevin', ssm: 'kh!jnox.e$', rights: 'Full', status: 'connected', active: false } })

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
        $('#ccspmcw_scaffold').css({ 'z-index': x.show ? 5 : 1 });
        !x.show && $('#ccspmcw_scaffold').removeAttr('style');
    };

    /* Create new account */
    const createNewAccountFunc = () => {
        const accountCreationRef: refIdType = mainControllerRef.current.accountCreationRef;
        accountCreationRef.current.showFunc({ show: true, sourcePage: 'callCenter' });
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
            (controllerRef?.current !== undefined) && controllerRef.current.addWidgetRefFunc({ wid: wid, refId: refId });
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
    if (callCenterFeed.length === 0) for (let i = 0; i < testFeed.length; i++) callCenterFeed.push(<CallCSPFeedWidget key={i} ref={feedRef[i]} $data={{ refId: feedRef[i], controllerRef: callCSPMainControllerRef, rootControllers: rootControllers, accountData: testFeed[i] }} />);
    /* - */
    const component = <>
        <div id='ccspmcw_scaffold' className='prevent_select'>
            <div id='ccspmcw_header' className='glass'>
                <div id='ccspmcw_title_container'>
                    <h1 id='ccspmcw_title'>{traduction['t0009']}</h1>
                    <button id='ccspmcw_add_account_btn_container' className='btn_opacity' onClick={createNewAccountFunc}>
                        <p id='ccspmcw_add_account_btn_title'>+ {traduction['t0011']}</p>
                    </button>
                </div>

                <div id='ccspmcw_table_header'>
                    <div className='ccspfw_checkbox_container'>
                        <input className='ccspfw_checkbox' type='checkbox' />
                    </div>
                    <div className='ccspfw_hyphen' />

                    <p className='ccspfw_full_name one_line'>Name</p>
                    <div className='ccspfw_hyphen' />

                    <p className='ccspfw_username one_line'>Username</p>
                    <div className='ccspfw_hyphen' />

                    <p className='ccspfw_status one_line'>Status</p>
                    <div className='ccspfw_hyphen' />

                    <p className='ccspfw_action_btn_container' style={{ justifyContent: 'center' }}>Actions</p>
                </div>
            </div>

            <div id='ccspmcw_container'>
                {callCenterFeed}
            </div>
        </div>
        <CallCSPMainControllerWidget ref={callCSPMainControllerRef} $data={{ wid: 'callCSPMainControllerRef', refId: callCSPMainControllerRef, rootControllers: rootControllers }} />
    </>;
    return (render.current ? component : <></>);
};

export default forwardRef(CallCSPMainContainerWidget);
/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import './AdminASPMainContainerWidget.css';
import { generateIdFunc } from '../../../../../../Tools/methodForest';
import { language } from '../../../../../../Tools/language';
import { refIdType } from '../../../../../../Tools/type';
import { _defaultLanguage_ } from '../../../../../../Tools/constants';
import AdminSPFeedWidget from './AdminASPFeedWidget';
import SwitchWidget from '../../../../../Others/SwitchWidget';
import AdminASPMainControllerWidget from './AdminASPMainControllerWidget';

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
const AdminASPMainContainerWidget = (props: propsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const parentProps = props;

    const windowWidth = useRef(window.innerWidth);

    const windowHeight = useRef(window.innerHeight);

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

    const testFeed = Array(100).fill(undefined).map((_, i: number) => { return { id: `id_${i}`, fullName: 'Kevin ODOUTAN', username: 'o.kevin', ssm: 'kh!jnox.e$', rights: 'Full', status: 'connected', active: false } })

    const feedRef = Array(5).fill(undefined).map(() => React.createRef());

    const switchRef = useRef(undefined);

    const adminASPMainControllerRef = useRef(undefined);


    /* ------------------------------------ Methods ------------------------------------- */

    /* Refresh component */
    const refreshFunc = () => {
        refresher.current = refresher.current ? false : true;
        setRefresh(refresher.current);
    };

    /* Set language */
    const setLanguageFunc = (x: { lang: 'en' | 'fr' }) => { lang.current = x.lang; setRefresh(!refresh) };

    /* On window size change */
    const onWindowSizeChangeFunc = () => {
        windowWidth.current = window.innerWidth;
        windowHeight.current = window.innerHeight;
    };

    /* Show or hide */
    const showFunc = (x: { show: boolean }) => {
        $('#aap_scaffold').css({ 'z-index': x.show ? 5 : 2 });
        !x.show && $('#accp_scaffold').removeAttr('style');
    };

    /* Create new account */
    const createNewAccountFunc = () => {
        const accountCreationRef: refIdType = mainControllerRef.current.accountCreationRef;
        accountCreationRef.current.showFunc({ show: true, sourcePage: 'admin' });
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
    useEffect(() => {
        window.addEventListener('resize', onWindowSizeChangeFunc);
        return () => window.removeEventListener('resize', onWindowSizeChangeFunc);
    }, []);


    /* Return */


    /* Create feed */
    const adminFeed = [];
    if (adminFeed.length === 0) for (let i = 0; i < testFeed.length; i++) adminFeed.push(<AdminSPFeedWidget key={i} ref={feedRef[i]} $data={{ refId: feedRef[i], controllerRef: adminASPMainControllerRef, rootControllers: rootControllers, accountData: testFeed[i] }} />);
    /* - */
    const component = <>
        <div id='aaspmw_scaffold' className='prevent_select'>
            <div id='aaspmw_header' className='glass'>
                <div id='aaspmv_title_container'>
                    <h1 id='aaspmw_title'>{traduction['t0008']}</h1>
                    <button id='aaspmw_add_account_btn_container' className='btn_opacity' onClick={createNewAccountFunc}>
                        <p id='aaspmw_add_account_btn_title'>+ {traduction['t0011']}</p>
                    </button>
                </div>

                <div id='aaspmw_table_header'>
                    <div className='aaspfw_checkbox_container'>
                        <input className='aaspfw_checkbox' type='checkbox' />
                    </div>
                    <div className='aaspfw_hyphen' />

                    <p className='aaspfw_full_name one_line'>Name</p>
                    <div className='aaspfw_hyphen' />

                    <p className='aaspfw_username one_line'>Username</p>
                    <div className='aaspfw_hyphen' />

                    <p className='aaspfw_rights one_line'>Rights</p>
                    <div className='aaspfw_hyphen' />

                    <p className='aaspfw_status one_line'>Status</p>
                    <div className='aaspfw_hyphen' />

                    <p className='aaspfw_action_btn_container' style={{ justifyContent: 'center' }}>Actions</p>
                </div>
            </div>

            <div id='aaspmw_container'>
                {adminFeed}
            </div>
        </div>
        <AdminASPMainControllerWidget ref={adminASPMainControllerRef} $data={{ wid: 'adminASPMainControllerRef', refId: adminASPMainControllerRef, rootControllers: rootControllers }} />
    </>;
    return (render.current ? component : <></>);
};

export default forwardRef(AdminASPMainContainerWidget);
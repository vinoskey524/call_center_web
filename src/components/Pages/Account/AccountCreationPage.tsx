/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import './AccountCreationPage.css';
import { generateIdFunc } from '../../Tools/methodForest';
import { language } from '../../Tools/language';
import { refIdType } from '../../Tools/type';
import { _defaultLanguage_ } from '../../Tools/constants';
import AdminRightsCheckboxWidget from '../../Widgets/Account/Admin/AdminRightsCheckboxWidget';
import AccountCreationControllerWidget from '../../Widgets/Account/Admin/AccountCreationControllerWidget';

/* Widget */
type propsType = {
    $data: {
        /** Every change made to "wid" affect controller */
        wid: string,
        refId: refIdType,
        controllerRef?: refIdType,
        rootControllers: any
    }
};
const AccountCreationPage = (props: propsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const parentProps = props;

    const windowWidth = useRef(window.innerWidth);

    const windowHeight = useRef(window.innerHeight);

    const [refresh, setRefresh] = useState(false);

    const isMounted = useRef(false);

    const render = useRef(!false);

    const lang = useRef(_defaultLanguage_);

    const traduction = language[lang.current];

    /* $data */

    const data = props.$data;

    const wid = data.wid;

    const refId = data.refId;

    const controllerRef = data.controllerRef;

    const rootControllers = data.rootControllers;

    /* Root controllers */

    const mainControllerRef: refIdType = rootControllers.mainControllerRef;

    const requestControllerRef: refIdType = rootControllers.requestControllerRef;

    const dataStoreControllerRef: refIdType = rootControllers.dataStoreControllerRef;

    /* - */

    const adminRightsCheckboxRef = useRef(undefined);

    const adminFullRightsCheckboxRef = useRef(undefined);

    const adminCreateRightsCheckboxRef = useRef(undefined);

    const adminEnableDisableRightsCheckboxRef = useRef(undefined);

    const adminEditRightsCheckboxRef = useRef(undefined);

    const adminDeleteRightsCheckboxRef = useRef(undefined);

    const adminReadOnlyRightsCheckboxRef = useRef(undefined);

    const accountCreationControllerRef = useRef(undefined);

    const sourcePageType = useRef<'admin' | 'callCenter' | 'customer'>('admin');

    const pageTitle = { admin: 'Admin', callCenter: 'Call Center', customer: 'Customer' };


    /* ------------------------------------ Methods ------------------------------------- */

    /* Refresh component */
    const refreshFunc = () => { setRefresh(!refresh) };

    /* Set language */
    const setLanguageFunc = (x: { lang: 'en' | 'fr' }) => { lang.current = x.lang; setRefresh(!refresh) };

    /* On window size change */
    const onWindowSizeChangeFunc = () => {
        windowWidth.current = window.innerWidth;
        windowHeight.current = window.innerHeight;
    };

    /* Show */
    const showFunc = (x: { show: boolean, sourcePage?: 'admin' | 'callCenter' | 'customer' }) => {
        const show = x.show, sourcePage = x.sourcePage;
        sourcePage !== undefined && (sourcePageType.current = sourcePage);
        setRefresh(!refresh);
        $('#acrp_container').animate({
            scale: show ? 1 : 1.3,
            opacity: show ? 1 : 0
        }, 50);
        $('#acrp_scaffold').css({ 'top': show ? 0 : '100vh' });
    };

    /* On create */
    const onCreateFunc = () => { };

    /* On Edit */
    const onEditFunc = () => { };

    /* On cancel */
    const onCancelFunc = () => { showFunc({ show: false }) };


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


    const component = <>
        <div id='acrp_scaffold' className='prevent_select'>
            <div id='acrp_background' />
            <div id='acrp_container'>
                <div id='acrp_container_content'>
                    <p id='acrp_title'>New account ({pageTitle[sourcePageType.current]})</p>

                    <div /* Full name */ className='acrp_input_container'>
                        <div className='acrp_input_title'>Full name :</div>
                        <div className='acrp_input_content'>
                            <input className='acrp_input_box' type='text' />
                        </div>
                    </div>

                    {sourcePageType.current !== 'customer' && <div /* Username */ className='acrp_input_container'>
                        <div className='acrp_input_title'>Username :</div>
                        <div className='acrp_input_content'>
                            <input className='acrp_input_box' type='text' />
                        </div>
                    </div>}

                    {sourcePageType.current === 'customer' && <>
                        <div /* Email */ className='acrp_input_container'>
                            <div className='acrp_input_title'>Email :</div>
                            <div className='acrp_input_content'>
                                <input className='acrp_input_box' type='email' />
                            </div>
                        </div>

                        <div /* Phone */ className='acrp_input_container'>
                            <div className='acrp_input_title'>Phone :</div>
                            <div className='acrp_input_content'>
                                <input className='acrp_input_box' type='number' />
                            </div>
                        </div>
                    </>}

                    <div /* Password */ className='acrp_input_container'>
                        <div className='acrp_input_title'>Password :</div>
                        <div className='acrp_input_content'>
                            <input className='acrp_input_box' type='text' />
                        </div>
                    </div>

                    <div /* Password comfirmation */ className='acrp_input_container'>
                        <div className='acrp_input_title'>Confirmation :</div>
                        <div className='acrp_input_content'>
                            <input className='acrp_input_box' type='text' />
                        </div>
                    </div>

                    {sourcePageType.current === 'customer' &&
                        <div /* Expiration date */ className='acrp_input_container'>
                            <div className='acrp_input_title'>Expiration :</div>
                            <div className='acrp_input_content'>
                                <input className='acrp_input_box' type='date' />
                            </div>
                        </div>
                    }

                    {sourcePageType.current === 'admin' &&
                        <div /* Rights */ className='acrp_input_checkbox_container'>
                            <div className='acrp_input_title'>Rights :</div>
                            <div className='acrp_input_checkbox_content'>
                                <AdminRightsCheckboxWidget /* Full */ ref={adminFullRightsCheckboxRef} $data={{
                                    wid: 'adminFullRightsCheckboxRef',
                                    refId: adminFullRightsCheckboxRef,
                                    controllerRef: accountCreationControllerRef,
                                    scaffoldWidth: '92%',
                                    optionHeight: 20,
                                    mainOption: { id: 'fullMainOption', title: 'Full', fontSize: 13.5, isChecked: false },
                                }} />

                                <AdminRightsCheckboxWidget /* Create */ ref={adminCreateRightsCheckboxRef} $data={{
                                    wid: 'adminCreateRightsCheckboxRef',
                                    refId: adminCreateRightsCheckboxRef,
                                    controllerRef: accountCreationControllerRef,
                                    scaffoldWidth: '92%',
                                    optionHeight: 20,
                                    mainOption: { id: 'createMainOption', title: 'Create', fontSize: 13.5, isChecked: false },
                                    subOptions: [
                                        { id: 'createAdminSubOption', subId: 'admin', title: 'Administrators', color: '#9e9e9e', isChecked: false },
                                        { id: 'createCallCenterSubOption', subId: 'callCenter', title: 'Call center', color: '#9e9e9e', isChecked: false },
                                        { id: 'createCustomerSubOption', subId: 'customer', title: 'Customers', color: '#9e9e9e', isChecked: false }
                                    ]
                                }} />

                                <AdminRightsCheckboxWidget /* Enable/Disable */ ref={adminEnableDisableRightsCheckboxRef} $data={{
                                    wid: 'adminEnableDisableRightsCheckboxRef',
                                    refId: adminEnableDisableRightsCheckboxRef,
                                    controllerRef: accountCreationControllerRef,
                                    scaffoldWidth: '92%',
                                    optionHeight: 20,
                                    mainOption: { id: 'enDisMainOption', title: 'Enable/Disable', fontSize: 13.5, isChecked: false },
                                    subOptions: [
                                        { id: 'enDisAdminSubOption', subId: 'admin', title: 'Administrators', color: '#9e9e9e', isChecked: false },
                                        { id: 'enDisCallCenterSubOption', subId: 'callCenter', title: 'Call center', color: '#9e9e9e', isChecked: false },
                                        { id: 'enDisCustomerSubOption', subId: 'customer', title: 'Customers', color: '#9e9e9e', isChecked: false }
                                    ]
                                }} />

                                <AdminRightsCheckboxWidget /* Edit */ ref={adminEditRightsCheckboxRef} $data={{
                                    wid: 'adminEditRightsCheckboxRef',
                                    refId: adminEditRightsCheckboxRef,
                                    controllerRef: accountCreationControllerRef,
                                    scaffoldWidth: '92%',
                                    optionHeight: 20,
                                    mainOption: { id: 'editMainOption', title: 'Edit', fontSize: 13.5, isChecked: false },
                                    subOptions: [
                                        { id: 'editAdminSubOption', subId: 'admin', title: 'Administrators', color: '#9e9e9e', isChecked: false },
                                        { id: 'editCallCenterSubOption', subId: 'callCenter', title: 'Call center', color: '#9e9e9e', isChecked: false },
                                        { id: 'editCustomerSubOption', subId: 'customer', title: 'Customers', color: '#9e9e9e', isChecked: false }
                                    ]
                                }} />

                                <AdminRightsCheckboxWidget /* Delete */ ref={adminDeleteRightsCheckboxRef} $data={{
                                    wid: 'adminDeleteRightsCheckboxRef',
                                    refId: adminDeleteRightsCheckboxRef,
                                    controllerRef: accountCreationControllerRef,
                                    scaffoldWidth: '92%',
                                    optionHeight: 20,
                                    mainOption: { id: 'deleteMainOption', title: 'Delete', fontSize: 13.5, isChecked: false },
                                    subOptions: [
                                        { id: 'deleteAdminSubOption', subId: 'admin', title: 'Administrators', color: '#9e9e9e', isChecked: false },
                                        { id: 'deleteCallCenterSubOption', subId: 'callCenter', title: 'Call center', color: '#9e9e9e', isChecked: false },
                                        { id: 'deleteCustomerSubOption', subId: 'customer', title: 'Customers', color: '#9e9e9e', isChecked: false }
                                    ]
                                }} />

                                <div style={{ width: 30, height: 1, backgroundColor: 'rgba(95, 95, 95, 0.5)', marginLeft: 18, marginBlock: 5 }} />

                                <AdminRightsCheckboxWidget /* Read only */ ref={adminReadOnlyRightsCheckboxRef} $data={{
                                    wid: 'adminReadOnlyRightsCheckboxRef',
                                    refId: adminReadOnlyRightsCheckboxRef,
                                    controllerRef: accountCreationControllerRef,
                                    scaffoldWidth: '92%',
                                    optionHeight: 20,
                                    mainOption: { id: 'readOnlyMainOption', title: 'Read only', fontSize: 13.5, isChecked: true }
                                }} />

                            </div>
                        </div>
                    }

                    <button className='acrp_btn_container btn_opacity' onClick={onCreateFunc}>
                        <p className='acrp_btn_title'>Create</p>
                    </button>

                    <button className='acrp_btn_container btn_opacity' style={{ backgroundColor: 'transparent', marginBottom: 15 }} onClick={onCancelFunc}>
                        <p className='acrp_btn_title' style={{ color: '#fa315a' }}>Annuler</p>
                    </button>

                </div>
            </div>
        </div>
        <AccountCreationControllerWidget ref={accountCreationControllerRef} $data={{ wid: 'accountCreationControllerRef', refId: accountCreationControllerRef, rootControllers: rootControllers }} />
    </>;
    return (render.current ? component : <></>);
};

export default forwardRef(AccountCreationPage);
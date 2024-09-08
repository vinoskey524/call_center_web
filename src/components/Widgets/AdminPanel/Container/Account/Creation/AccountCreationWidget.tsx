// @refresh reset

/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import './AccountCreationWidget.css';
import { generateIdFunc, animateModalFunc } from '../../../../../Tools/methodForest';
import { language } from '../../../../../Tools/language';
import { refIdType } from '../../../../../Tools/type';
import { _defaultLanguage_ } from '../../../../../Tools/constants';
import AdminRightsCheckboxWidget from './AdminRightsCheckboxWidget';
import AccountCreationControllerWidget from './AccountCreationControllerWidget';
import FormInputWidget from '../../../../Others/FormInputWidget';
import LoadingWidget from '../../../../Others/LoadingWidget';
import UIBlockerWidget from '../../../../Others/UIBlockerWidget';

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
const AccountCreationWidget = (props: propsType, ref: any) => {
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

    const controllerRef = data.controllerRef;

    const rootControllers = data.rootControllers;

    /* Root controllers */

    const mainControllerRef: refIdType = rootControllers.mainControllerRef;

    const requestControllerRef: refIdType = rootControllers.requestControllerRef;

    const dataStoreControllerRef: refIdType = rootControllers.dataStoreControllerRef;

    /* - */

    const adminRightsCheckboxRef = useRef<any>(undefined);

    const adminFullRightsCheckboxRef = useRef<any>(undefined);

    const adminCreateRightsCheckboxRef = useRef<any>(undefined);

    const adminEnableDisableRightsCheckboxRef = useRef<any>(undefined);

    const adminEditRightsCheckboxRef = useRef<any>(undefined);

    const adminDeleteRightsCheckboxRef = useRef<any>(undefined);

    const adminReadOnlyRightsCheckboxRef = useRef<any>(undefined);

    const accountCreationControllerRef = useRef<any>(undefined);

    const sourcePageType = useRef<'admin' | 'callCenter' | 'customer'>('admin');

    const pageTitle = { admin: 'Admin', callCenter: 'Call Center', customer: 'Customer' };

    const fullNameInputRef = useRef<any>(undefined);

    const usernameInputRef = useRef<any>(undefined);

    const emailInputRef = useRef<any>(undefined);

    const phoneInputRef = useRef<any>(undefined);

    const passwordInputRef = useRef<any>(undefined);

    const confirmInputRef = useRef<any>(undefined);

    const expirationInputRef = useRef<any>(undefined);

    const accountLoadingRef = useRef<any>(undefined);

    const uiBlockerRef = useRef<any>(undefined);

    /* - */

    const acrw_input_classname = useRef<string>('acrw_input_classname');


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

    /* Show */
    const showFunc = (x: { show: boolean, sourcePage?: 'admin' | 'callCenter' | 'customer' }) => {
        const show = x.show, sourcePage = x.sourcePage;
        (sourcePage !== undefined) && (sourcePageType.current = sourcePage);
        setRefresh(!refresh);
        animateModalFunc({ scaffold: '#acrw_scaffold', container: '#acrw_container', show: x.show });
    };

    /* On create */
    const onCreateFunc = () => { accountCreationControllerRef.current.createAccountFunc({ type: sourcePageType.current }) };

    /* On Edit */
    const onEditFunc = () => { };

    /* On cancel */
    const onCancelFunc = () => {
        $('#acrw_container').removeClass('shakeX');
        setTimeout(() => { showFunc({ show: false }) }, 0);
        accountCreationControllerRef.current.cancelFunc();
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


    const component = <>
        <div id='acrw_scaffold' className='prevent_select'>
            <div id='acrw_background' />
            <div id='acrw_container'>
                <div id='acrw_container_content'>
                    <p id='acrw_title'>New account ({pageTitle[sourcePageType.current]})</p>

                    <LoadingWidget ref={accountLoadingRef} $data={{ wid: 'accountLoadingRef', refId: accountLoadingRef, controllerRef: accountCreationControllerRef }} />

                    <div className='acrw_input_container'>
                        <FormInputWidget /* Full name */ ref={fullNameInputRef} $data={{ wid: 'fullNameInputRef', refId: fullNameInputRef, controllerRef: accountCreationControllerRef, className: acrw_input_classname.current, title: traduction['t0018'], type: 'text' }} />
                        {sourcePageType.current !== 'customer' && <FormInputWidget /* Username */ ref={usernameInputRef} $data={{ wid: 'usernameInputRef', refId: usernameInputRef, controllerRef: accountCreationControllerRef, className: acrw_input_classname.current, title: traduction['t0019'], type: 'text' }} />}
                        {sourcePageType.current === 'customer' && <>
                            <FormInputWidget /* Email */ ref={emailInputRef} $data={{ wid: 'emailInputRef', refId: emailInputRef, controllerRef: accountCreationControllerRef, className: acrw_input_classname.current, title: traduction['t0020'], type: 'email' }} />
                            <FormInputWidget /* Phone */ ref={phoneInputRef} $data={{ wid: 'phoneInputRef', refId: phoneInputRef, controllerRef: accountCreationControllerRef, className: acrw_input_classname.current, title: traduction['t0021'], type: 'number' }} />
                        </>}
                        <FormInputWidget /* Password */ ref={passwordInputRef} $data={{ wid: 'passwordInputRef', refId: passwordInputRef, controllerRef: accountCreationControllerRef, className: acrw_input_classname.current, title: traduction['t0022'], type: 'password' }} />
                        <FormInputWidget /* confirmation */ ref={confirmInputRef} $data={{ wid: 'confirmInputRef', refId: confirmInputRef, controllerRef: accountCreationControllerRef, className: acrw_input_classname.current, title: traduction['t0023'], type: 'password' }} />
                        {sourcePageType.current === 'customer' && <FormInputWidget /* Expiration date */ ref={expirationInputRef} $data={{ wid: 'expirationInputRef', refId: expirationInputRef, controllerRef: accountCreationControllerRef, className: acrw_input_classname.current, title: traduction['t0024'], type: 'date' }} />}
                    </div>

                    {sourcePageType.current === 'admin' &&
                        <div /* Rights */ className='acrw_input_checkbox_container'>
                            <div id='acrw_input_title'>Rights :</div>
                            <div className='acrw_input_checkbox_content'>
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

                    <div id='acrw_btn_area' className='just_row'>
                        <div id='acrw_btn_wrapper' className='just_row'>
                            <button className='acrw_btn_container btn_opacity' onClick={onCreateFunc}>
                                <p className='acrw_btn_title'>{traduction['t0025']}</p>
                            </button>

                            <button className='acrw_btn_container btn_opacity' style={{ backgroundColor: 'transparent', marginLeft: 5 }} onClick={onCancelFunc}>
                                <p className='acrw_btn_title' style={{ color: '#fa315a' }}>{traduction['t0026']}</p>
                            </button>
                        </div>
                    </div>
                </div>
                <UIBlockerWidget ref={uiBlockerRef} $data={{ wid: 'uiBlockerRef', refId: uiBlockerRef, controllerRef: accountCreationControllerRef }} />
            </div>
        </div>
        <AccountCreationControllerWidget ref={accountCreationControllerRef} $data={{ wid: 'accountCreationControllerRef', refId: accountCreationControllerRef, rootControllers: rootControllers }} />
    </>;
    return (render.current ? component : <></>);
};

export default forwardRef(AccountCreationWidget);
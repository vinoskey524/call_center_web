/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import './AdminRightsCheckboxWidget.css';
import { generateIdFunc } from '../../../../../Tools/methodForest';
import { language } from '../../../../../Tools/language';
import { refIdType } from '../../../../../Tools/type';
import { _defaultLanguage_ } from '../../../../../Tools/constants';

/* Widget */
type propsType = {
    $data: {
        /** Every change made to "wid" affect controller */
        wid: string,
        refId: refIdType,
        controllerRef: refIdType,
        rootControllers: any,
        scaffoldWidth: number | string,
        optionHeight: number,
        mainOption: { id: string, title: string, isChecked: boolean, color?: string, fontSize?: number },
        subOptions?: Array<{ id: string, subId: string, title: string, isChecked: boolean, color?: string }>
    }
};
const AdminRightsCheckboxWidget = forwardRef((props: propsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const refId = ref;

    const windowWidth = useRef(window.innerWidth);
    const windowHeight = useRef(window.innerHeight);

    const refresher = useRef(false);
    const [refresh, setRefresh] = useState(refresher.current);

    const isMounted = useRef(false);
    const mountCount = useRef(0);
    const render = useRef(!false);

    const broadcastIndex = useRef(-1);

    /* $data */
    const $data = props.$data;
    const wid = useRef($data.wid || generateIdFunc()).current;
    const controllerRef = $data.controllerRef;
    const rootControllers = $data.rootControllers || { current: undefined };
    const scaffoldWidth = $data.scaffoldWidth;
    const optionHeight = $data.optionHeight;
    const mainOption = $data.mainOption;
    const subOptions = $data.subOptions || [];

    /* Root controllers */
    const mainRootControllerRef: refIdType = rootControllers?.current?.mainRootControllerRef;
    const requestRootControllerRef: refIdType = rootControllers?.current?.requestRootControllerRef;
    const dataStoreRootControllerRef: refIdType = rootControllers?.current?.dataStoreRootControllerRef;

    /* - */

    const traduction = useRef(dataStoreRootControllerRef.current.traduction.current);

    const arcw_scaffold_id = useRef(generateIdFunc({ length: 8 })).current;
    const arcw_main_option_id = useRef(generateIdFunc({ length: 8 })).current;

    const sub_options_class_name = useRef(generateIdFunc({ length: 8 })).current;

    const admin_sub_option_id = (subOptions.length > 0) ? subOptions[subOptions.findIndex((e) => e.subId === 'admin')].id : '';
    const call_center_sub_option_id = (subOptions.length > 0) ? subOptions[subOptions.findIndex((e) => e.subId === 'callCenter')].id : '';
    const customer_sub_option_id = (subOptions.length > 0) ? subOptions[subOptions.findIndex((e) => e.subId === 'customer')].id : '';

    /* - */

    const isMainOptionChecked = useRef(false);
    const isAdminSubOptionChecked = useRef(false);
    const isCallCenterSubOptionChecked = useRef(false);
    const isCustomerSubOptionChecked = useRef(false);

    const checkboxSize = (optionHeight * 66) / 100;

    const subPaddingLeft = checkboxSize + 4;

    const subOptionsLength = useRef(subOptions.length);


    /* ------------------------------------ Methods ------------------------------------- */

    /* Refresh component */
    const refreshFunc = () => { refresher.current = !refresher.current; setRefresh(refresher.current) };

    /* Render */
    const renderFunc = (x: { render: boolean }) => { render.current = x.render; refreshFunc() };

    /* Set language */
    const setTraductionFunc = (x: { traduction: any }) => { traduction.current = x.traduction; refreshFunc() };

    /* On window size change */
    const onWindowSizeChangeFunc = () => {
        windowWidth.current = window.innerWidth;
        windowHeight.current = window.innerHeight;
    };

    /* Unmount */
    const unmountFunc = () => {
        /* Prevent from first unmounting caused by "strictMode" */
        mountCount.current += 1; if (mountCount.current === 1) return;

        /* unmount logic */
        mainRootControllerRef?.current?.deleteFromBroadcastDomainFunc({ index: broadcastIndex.current });
        // mainRootControllerRef?.current?.deleteRefIdFunc({ wid: wid, refId: refId });
        controllerRef?.current?.deleteRefIdFunc({ wid: wid, refId: refId });
    };

    /* On click main option */
    const onClickMainOptionFunc = () => {
        if (isMainOptionChecked.current) {
            isMainOptionChecked.current = false;
            isAdminSubOptionChecked.current = false;
            isCallCenterSubOptionChecked.current = false;
            isCustomerSubOptionChecked.current = false;
            $(`#${arcw_main_option_id} :input`).prop({ 'checked': false });
            $(`.${sub_options_class_name} :input`).prop({ 'checked': false });
        } else {
            isMainOptionChecked.current = true;
            isAdminSubOptionChecked.current = true;
            isCallCenterSubOptionChecked.current = true;
            isCustomerSubOptionChecked.current = true;
            $(`#${arcw_main_option_id} :input`).prop({ 'checked': true });
            $(`.${sub_options_class_name} :input`).prop({ 'checked': true });
        }
        controllerRef.current.onMainOptionClickedFunc({ id: mainOption.id, checked: isMainOptionChecked.current });
        if (subOptionsLength.current > 0) $(`#${arcw_scaffold_id}`).animate({ 'height': (isMainOptionChecked.current) ? (optionHeight * (subOptionsLength.current + 1)) : optionHeight }, 100);
    };

    /* On click sub option */
    const onClickSubOptionFunc = (x: { id: string, subId: string }) => {
        const id = x.id, subId = x.subId;
        switch (subId) {
            case 'admin': {
                const check = !isAdminSubOptionChecked.current;
                isAdminSubOptionChecked.current = check;
                $(`#${admin_sub_option_id} :input`).prop({ 'checked': check });
                controllerRef.current.onSubOptionClickedFunc({ id: id, parentId: mainOption.id, checked: isAdminSubOptionChecked.current });
            } break;

            case 'callCenter': {
                const check = !isCallCenterSubOptionChecked.current;
                isCallCenterSubOptionChecked.current = check;
                $(`#${call_center_sub_option_id} :input`).prop({ 'checked': check });
                controllerRef.current.onSubOptionClickedFunc({ id: id, parentId: mainOption.id, checked: isCallCenterSubOptionChecked.current });
            } break;

            case 'customer': {
                const check = !isCustomerSubOptionChecked.current;
                isCustomerSubOptionChecked.current = check;
                $(`#${customer_sub_option_id} :input`).prop({ 'checked': check });
                controllerRef.current.onSubOptionClickedFunc({ id: id, parentId: mainOption.id, checked: isCustomerSubOptionChecked.current });
            } break;

            default: { };
        };
    };

    /* Check all */
    const checkAllFunc = (x: { check: boolean }) => {
        const check = x.check;
        isMainOptionChecked.current = check;
        isAdminSubOptionChecked.current = check;
        isCallCenterSubOptionChecked.current = check;
        isCustomerSubOptionChecked.current = check;
        $(`#${arcw_main_option_id} :input`).prop({ 'checked': check });
        $(`.${sub_options_class_name} :input`).prop({ 'checked': check });
        if (subOptionsLength.current > 0) $(`#${arcw_scaffold_id}`).animate({ 'height': check ? (optionHeight * (subOptionsLength.current + 1)) : optionHeight }, 100);
    };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        refreshFunc() { refreshFunc() },
        setTraductionFunc(x: any) { setTraductionFunc(x) },
        checkAllFunc(x: any) { checkAllFunc(x) }
    }), []);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            broadcastIndex.current = mainRootControllerRef.current.addToBroadcastDomainFunc({ wid: wid, refId: refId });
            (controllerRef.current !== undefined) && controllerRef.current.addRefIdFunc({ wid: wid, refId: refId });
        }
        return () => unmountFunc();
    }, []);


    /* Return */

    /* Create sub options */
    const subChildrenComponents = useRef<any>([]);
    if (subChildrenComponents.current.length === 0 && subOptionsLength.current > 0) for (let i = 0; i < subOptionsLength.current; i++) subChildrenComponents.current.push(
        <div key={i} id={subOptions[i].id} className={`arcw_sub_option ${sub_options_class_name}`} style={{ height: optionHeight, minHeight: optionHeight, maxHeight: optionHeight, paddingLeft: subPaddingLeft }} onClick={() => { onClickSubOptionFunc({ id: subOptions[i].id, subId: subOptions[i].subId }) }}>
            <input className={`arcw_checkbox`} type='checkbox' style={{ width: checkboxSize, height: checkboxSize }} defaultChecked={subOptions[i].isChecked} />
            <div className={`arcw_title one_line`} style={{ color: subOptions[i].color ? subOptions[i].color : 'white', fontSize: mainOption.fontSize ? mainOption.fontSize : 14 }}>{subOptions[i].title}</div>
        </div>
    );

    /* - */
    const component = <>
        <div id={arcw_scaffold_id} className={`arcw_scaffold ${scaffoldWidth}`} style={{ height: optionHeight }}>
            <div id={arcw_main_option_id} className={`arcw_main_option`} style={{ height: optionHeight, minHeight: optionHeight, maxHeight: optionHeight }} onClick={onClickMainOptionFunc}>
                <input className={`arcw_checkbox`} type='checkbox' style={{ width: checkboxSize, height: checkboxSize }} defaultChecked={mainOption.isChecked} />
                <div className={`arcw_title one_line`} style={{ color: mainOption.color ? mainOption.color : 'white', fontSize: mainOption.fontSize ? mainOption.fontSize : 14 }}>{mainOption.title}</div>
            </div>

            {subChildrenComponents.current}
        </div>
    </>;
    return (<>{render.current && component}</>);

}); export default (AdminRightsCheckboxWidget);
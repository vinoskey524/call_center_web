/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import './FormInputWidget.css';
import { generateIdFunc, replaceConsecutiveSpacesByOneFunc } from '../../Tools/methodForest';
import { language } from '../../Tools/language';
import { refIdType } from '../../Tools/type';
import { _defaultLanguage_ } from '../../Tools/constants';
import import_icon from '../../Assets/png/import.png';
import trash_0_icon from '../../Assets/png/trash_0.png';
import pdf_icon from '../../Assets/png/pdf.png';
import html_icon from '../../Assets/png/html.png';

/* Select option list widget */
const SelectOptionListWidget = forwardRef((props: { $data: { initData: string[] } }, ref: any) => {
    const refresher = useRef(false);
    const [refresh, setRefresh] = useState(refresher.current);
    const initData = props.$data.initData || [];
    const feed = useRef<string[]>(['...', ...initData]);

    /* Refresh component */
    const refreshFunc = () => {
        refresher.current = refresher.current ? false : true;
        setRefresh(refresher.current);
    };

    /* set data & update list */
    const setDataFunc = (x: { data: string[] }) => {
        feed.current = ['...', ...x.data];
        refreshFunc();
    };

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        refreshFunc() { refreshFunc() },
        setDataFunc(x: any) { setDataFunc(x) }
    }), []);

    /* create options */
    let tab = [];
    for (let i = 0; i < feed.current.length; i++) tab.push(<option key={i} value={feed.current[i]}>{feed.current[i]}</option>);

    /* return */
    const component = <>{tab}</>;
    return (component);
});

/* Widget */
type propsType = {
    $data: {
        /** Every change made to "wid" affect controller */
        wid: string,
        refId: refIdType,
        controllerRef: refIdType,
        rootControllers: any,
        title: string,
        type: 'text' | 'textarea' | 'select' | 'email' | 'date' | 'password' | 'number',
        defaultValue?: string,
        inputWidth?: string,
        readonly?: boolean,
        className?: string,
        placeholder?: string,
        marginBottom?: number,
        enableDescImport?: boolean,
        desc?: string,
        immutableDesc?: boolean,
        onDescBtnClickFunc?: any,
        isOptional?: boolean
    }
};
const FormInputWidget = forwardRef((props: propsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const refId: refIdType = ref;

    const windowWidth = useRef(window.innerWidth);
    const windowHeight = useRef(window.innerHeight);

    const refresher = useRef(false);
    const [refresh, setRefresh] = useState(refresher.current);

    const isMounted = useRef(false);
    const mountCount = useRef(0);
    const render = useRef(true);

    const emptyRef = useRef<any>(undefined);
    const consumerRef = useRef<any>(undefined);
    const prototypeControllerRef = useRef<any>(undefined);

    const broadcastIndex = useRef(-1);

    /* $data */
    const $data = props.$data;
    const wid = useRef($data.wid || generateIdFunc()).current;
    const controllerRef = $data.controllerRef;
    const rootControllers = $data.rootControllers || { current: undefined };
    const title = $data.title;
    const className = $data.className || '';
    const inputType = $data.type;
    const inputWidth = $data.inputWidth;
    const defaultValue = $data.defaultValue || 'no default value';
    const readonly = useRef($data.readonly || false);
    const placeholder = $data.placeholder || '';
    const marginBottom = $data.marginBottom || 8;
    const enableDescImport = $data.enableDescImport || false;
    const desc = $data.desc;
    const immutableDesc = $data.immutableDesc || false;
    const onDescBtnClickFunc = $data.onDescBtnClickFunc;
    const isOptional = $data.isOptional || false;

    /* Root controllers */
    const mainRootControllerRef: refIdType = rootControllers?.current?.mainRootControllerRef;
    const requestRootControllerRef: refIdType = rootControllers?.current?.requestRootControllerRef;
    const dataStoreRootControllerRef: refIdType = rootControllers?.current?.dataStoreRootControllerRef;

    /* - */

    const traduction = useRef(dataStoreRootControllerRef.current.traduction.current);

    const selectOptionListRef = useRef<any>(undefined);

    const formiw_input_import_desc_id = useRef(generateIdFunc({ length: 8 })).current;
    const formiw_input_state_id = useRef(generateIdFunc({ length: 8 })).current;
    const formiw_input_box_id = useRef(generateIdFunc({ length: 8 })).current;
    const formiw_input_error_id = useRef(generateIdFunc({ length: 8 })).current;

    const descImportBtnIcon = useRef(import_icon);
    const descImportBtnTitle = useRef(traduction.current['t0041']);

    const previewDescFile = useRef(false);
    const previewDescIcon = useRef(pdf_icon);

    const descFileData = useRef<any>({});

    const inputStateColor: any = {
        'optional': '#B28235',
        'empty': '#333A45',
        'correct': '#00FF36',
        'error': '#FF315A'
    };

    const defaultInputStateColor = inputStateColor[isOptional ? 'optional' : 'empty'];

    const isTextarea = inputType === 'textarea' ? true : false;
    const isSelect = inputType === 'select' ? true : false;

    const readonlyText = useRef(defaultValue);


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
        mainRootControllerRef?.current?.deleteRefIdFunc({ wid: wid, refId: refId });
        (controllerRef?.current !== undefined) && controllerRef.current.deleteRefIdFunc({ wid: wid, refId: refId });
    };

    /* Set input state */
    const setInputStateFunc = (x: { state: 'optional' | 'empty' | 'correct' | 'error' }) => {
        const state = x.state;
        if (state.match(/optional|empty|correct|error/)) {
            $(`#${formiw_input_state_id}`).css({ 'background-color': inputStateColor[state] });
        } else { console.error(`Input state '${state}' don't match 'empty|correct|error'. From 'FormInputWidget.tsx' => setInputStateFunc()`) }
    };

    /* Set description file */
    const setDescriptionFileFunc = (x: { fileData: any }) => {
        const fileData = x.fileData;
        descFileData.current = fileData;
        previewDescFile.current = true;
        previewDescIcon.current = (fileData.extension !== '.html') ? pdf_icon : html_icon;
        descImportBtnTitle.current = 'Remove';

        descImportBtnIcon.current = trash_0_icon;
        $(`#${formiw_input_import_desc_id}`).css({ 'background-color': '#fa315a' });

        /* Remove error message */
        $(`#${formiw_input_error_id}`).css({ display: 'none' });
        $(`#${formiw_input_error_id}`).text('');

        refreshFunc();
    };

    /* Delete desc file */
    const deleteDescFileFunc = () => {
        descFileData.current = undefined;
        previewDescFile.current = false;
        descImportBtnTitle.current = 'Importer (.docx or .html)';
        descImportBtnIcon.current = import_icon;
        $(`#${formiw_input_import_desc_id}`).css({ 'background-color': '#007aff' });
        refId.current.setInputStateFunc({ state: 'empty' });
        refreshFunc();
    };

    /* On change */
    const onChangeFunc = () => {
        const val = $(`#${formiw_input_box_id}`).val();
        controllerRef.current.setTextValueFunc({ wid: wid, text: val });

        /* Remove error message */
        $(`#${formiw_input_error_id}`).css({ display: 'none' });
        $(`#${formiw_input_error_id}`).text('');
    };

    /* Set text */
    const setTextFunc = (x: { text: string }) => { $(`#${formiw_input_box_id}`).val(x.text) };

    /* Clear text */
    const clearTextFunc = () => {
        (inputType === 'select') ? $(`#${formiw_input_box_id} option:first`).prop('selected', true) : $(`#${formiw_input_box_id}`).val('');
        refId.current.setInputStateFunc({ state: isOptional ? 'optional' : 'empty' });
    };

    /* Set error message */
    const setErrorMsgFunc = (x: { msg: string }) => {
        refId.current.setInputStateFunc({ state: 'error' });
        $(`#${formiw_input_error_id}`).text(x.msg);
        $(`#${formiw_input_error_id}`).css({ display: 'flex' });
    };

    /* Remove error ms */
    const removeErrorMsgFunc = () => {
        refId.current.setInputStateFunc({ state: isOptional ? 'optional' : 'empty' });
        $(`#${formiw_input_error_id}`).css({ display: 'none' });
        $(`#${formiw_input_error_id}`).text('');
    };

    /* Update readonly state */
    const updateReadonlyStateFunc = (x: { readonly: boolean, text?: string }) => {
        readonly.current = x.readonly;
        readonlyText.current = (x.text && x.readonly) ? x.text : defaultValue;
        setInputStateFunc({ state: x.readonly ? 'correct' : 'empty' });
        refreshFunc();
    };

    /* Update select option list */
    const updateSelectOptionListFunc = (x: { data: string[] }) => { selectOptionListRef?.current?.setDataFunc({ data: x.data }) };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        descFileData: descFileData,
        refreshFunc() { refreshFunc() },
        setTraductionFunc(x: any) { setTraductionFunc(x) },
        setInputStateFunc(x: any) { setInputStateFunc(x) },
        setDescriptionFileFunc(x: any) { setDescriptionFileFunc(x) },
        deleteDescFileFunc() { deleteDescFileFunc() },
        setTextFunc(x: any) { setTextFunc(x) },
        clearTextFunc() { clearTextFunc() },
        setErrorMsgFunc(x: any) { setErrorMsgFunc(x) },
        removeErrorMsgFunc() { removeErrorMsgFunc() },
        updateReadonlyStateFunc(x: any) { updateReadonlyStateFunc(x) },
        updateSelectOptionListFunc(x: any) { updateSelectOptionListFunc(x) }
    }), []);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            broadcastIndex.current = mainRootControllerRef.current.addToBroadcastDomainFunc({ wid: wid, refId: refId });
            mainRootControllerRef.current.addRefIdFunc({ wid: wid, refId: refId });
            controllerRef?.current?.addRefIdFunc({ wid: wid, refId: refId });

            /* - */
            readonly.current && refId.current.setInputStateFunc({ state: 'correct' });
        }
        return () => unmountFunc();
    }, []);

    /* On window size change */
    // useEffect(() => {
    //     window.addEventListener('resize', onWindowSizeChangeFunc);
    //     return () => window.removeEventListener('resize', onWindowSizeChangeFunc);
    // }, []);


    /* Return */


    const component = <>
        <div className='formiw_input_container' title={isOptional ? 'Optional' : ''} style={Object.assign({ marginBottom: marginBottom })}>
            <div className={`just_row ${isTextarea ? '' : 'center_all'}`}>
                <div id={formiw_input_state_id} className='formiw_input_state' style={Object.assign({ backgroundColor: defaultInputStateColor }, isTextarea && { marginTop: 10 })} />

                <div className='formiw_input_title ellipsis_line_1' style={isTextarea ? { alignItems: 'start' } : {}}>{title}</div>
                <div className='formiw_input_vdot'>:</div>

                <div className='formiw_input_content' style={inputWidth ? { width: inputWidth, minWidth: inputWidth } : {}}>
                    {readonly.current && <div className='formiw_input_box formiw_readonly_input'>{readonlyText.current}</div>}

                    {!readonly.current && <>
                        {!previewDescFile.current && <>
                            {(!isTextarea && !isSelect) && <input /* Input */ id={formiw_input_box_id} className={`formiw_input_box ${className}`} type={inputType} autoCorrect='off' placeholder={placeholder} onChange={onChangeFunc} />}

                            {isTextarea && <textarea /* Textarea */ id={formiw_input_box_id} autoCorrect='off' className={`formiw_textarea_input_box ${className}`} placeholder={placeholder} onChange={onChangeFunc} readOnly={immutableDesc} />}

                            {isSelect && <select /* Select */ id={formiw_input_box_id} className={`formiw_input_box ${className}`} onChange={onChangeFunc}>
                                <SelectOptionListWidget ref={selectOptionListRef} $data={{ initData: ['...'] }} />
                            </select>}
                        </>}

                        {(previewDescFile.current && isTextarea) && <>
                            <div className='formiw_input_desc_preview_container'>
                                <img className='formiw_input_desc_preview_icon' src={previewDescIcon.current} />
                                <div className='formiw_input_desc_preview_info_container'>
                                    <p className='formiw_input_desc_preview_info_title'>{descFileData.current.filename}</p>
                                    <p className='formiw_input_desc_preview_info_size'>{descFileData.current.formatedSize}</p>
                                </div>
                            </div>
                        </>}

                        {(isTextarea && enableDescImport) && <>
                            <button id={formiw_input_import_desc_id} className='formiw_input_import_desc btn_opacity' onClick={onDescBtnClickFunc}>
                                <img className='formiw_input_import_desc_icon' src={descImportBtnIcon.current} />
                                <p className='formiw_input_import_desc_title'>{descImportBtnTitle.current}</p>
                            </button>
                        </>}
                    </>}
                </div>
            </div>

            <div id='formiw_bottom_desc_container' style={inputWidth ? { width: inputWidth, minWidth: inputWidth } : {}}>
                {desc && <p className='formiw_input_desc'>{desc}</p>}
                <div id={formiw_input_error_id} className='formiw_input_error'></div>
            </div>
        </div>
    </>;
    return (render.current ? component : <></>);

}); export default (FormInputWidget);
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
import word_icon from '../../Assets/png/word.png';
import html_icon from '../../Assets/png/html.png';

/* Widget */
type propsType = {
    $data: {
        /** Every change made to "wid" affect controller */
        wid: string,
        refId: refIdType,
        controllerRef: refIdType,
        title: string,
        type: 'text' | 'textarea' | 'select' | 'email' | 'date' | 'password' | 'number',
        defaultValue?: string,
        readonly?: boolean,
        className?: string,
        placeholder?: string,
        marginBottom?: number,
        enableDescImport?: boolean,
        desc?: string,
        onDescBtnClickFunc?: any,
        isOptional?: boolean
    }
};
const FormInputWidget = (props: propsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const parentProps = props;

    const windowWidth = useRef(window.innerWidth);

    const windowHeight = useRef(window.innerHeight);

    const refresher = useRef(false);
    const [refresh, setRefresh] = useState(refresher.current);

    const isMounted = useRef(false);

    const render = useRef(true);

    const lang = useRef(_defaultLanguage_);

    const traduction = language[lang.current];

    /* $data */

    const data = props.$data;

    const wid = data.wid;

    const refId = data.refId;

    const controllerRef = data.controllerRef;

    const title = data.title;

    const className = data.className || '';

    const inputType = data.type;

    const defaultValue = data.defaultValue || 'no default value';

    const readonly = useRef(data.readonly || false);

    const placeholder = data.placeholder || '';

    const marginBottom = data.marginBottom || 8;

    const enableDescImport = data.enableDescImport || false;

    const desc = data.desc;

    const onDescBtnClickFunc = data.onDescBtnClickFunc;

    const isOptional = data.isOptional || false;

    /* - */

    const formiw_input_import_desc_id = useRef(generateIdFunc({ length: 8 })).current;

    const formiw_input_state_id = useRef(generateIdFunc({ length: 8 })).current;

    const formiw_input_box_id = useRef(generateIdFunc({ length: 8 })).current;

    const formiw_input_error_id = useRef(generateIdFunc({ length: 8 })).current;

    const descImportBtnIcon = useRef(import_icon);

    const descImportBtnTitle = useRef('Importer (.docx or .html)');

    const previewDescFile = useRef(false);

    const previewDescIcon = useRef(word_icon);

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
    const refreshFunc = () => {
        refresher.current = refresher.current ? false : true;
        setRefresh(refresher.current);
    };

    /* Set language */
    const setLanguageFunc = (x: { lang: 'en' | 'fr' }) => { lang.current = x.lang; refreshFunc() };

    /* On window size change */
    const onWindowSizeChangeFunc = () => {
        windowWidth.current = window.innerWidth;
        windowHeight.current = window.innerHeight;
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
        previewDescIcon.current = (fileData.extension !== '.html') ? word_icon : html_icon;
        descImportBtnTitle.current = 'Remove';
        descImportBtnIcon.current = trash_0_icon;
        $(`#${formiw_input_import_desc_id}`).css({ 'background-color': '#fa315a' });
        refreshFunc();
    };

    /* Delete desc file */
    const deleteDescFileFunc = () => {
        descFileData.current = undefined;
        previewDescFile.current = false;
        descImportBtnTitle.current = 'Importer (.docx or .html)';
        descImportBtnIcon.current = import_icon;
        $(`#${formiw_input_import_desc_id}`).css({ 'background-color': '#007aff' });
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

    /* On select */
    const onSelectFunc = () => { };

    /* Set text */
    const setTextFunc = (x: { text: string }) => { $(`#${formiw_input_box_id}`).val(x.text) };

    /* Clear text */
    const clearTextFunc = () => { $(`#${formiw_input_box_id}`).val('') };

    /* Set error message */
    const setErrorMsgFunc = (x: { msg: string, value: string }) => {
        refId.current.setInputStateFunc({ state: 'error' });
        $(`#${formiw_input_error_id}`).text(x.msg);
        $(`#${formiw_input_error_id}`).css({ display: 'flex' });
    };

    /* Update readonly state */
    const updateReadonlyStateFunc = (x: { readonly: boolean, text?: string }) => {
        readonly.current = x.readonly;
        readonlyText.current = (x.text && x.readonly) ? x.text : defaultValue;
        setInputStateFunc({ state: x.readonly ? 'correct' : 'empty' });
        refreshFunc();
    };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        refreshFunc() { refreshFunc() },
        setLanguageFunc(x: any) { setLanguageFunc(x) },
        setInputStateFunc(x: any) { setInputStateFunc(x) },
        setDescriptionFileFunc(x: any) { setDescriptionFileFunc(x) },
        deleteDescFileFunc() { deleteDescFileFunc() },
        setTextFunc(x: any) { setTextFunc(x) },
        clearTextFunc() { clearTextFunc() },
        setErrorMsgFunc(x: any) { setErrorMsgFunc(x) },
        updateReadonlyStateFunc(x: any) { updateReadonlyStateFunc(x) }
    }), [refresh]);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            (controllerRef.current !== undefined) && controllerRef.current.addWidgetRefFunc({ wid: wid, refId: refId });

            /* - */
            readonly.current && refId.current.setInputStateFunc({ state: 'correct' });
        }
    }, []);

    /* On window size change */
    // useEffect(() => {
    //     window.addEventListener('resize', onWindowSizeChangeFunc);
    //     return () => window.removeEventListener('resize', onWindowSizeChangeFunc);
    // }, []);

    /* jQuery */
    useEffect(() => {
    }, []);


    /* Return */


    const component = <>
        <div className='formiw_input_container' title={isOptional ? 'Optional' : ''} style={Object.assign({ marginBottom: marginBottom }, isTextarea && { alignItems: 'start' })}>
            <div className='just_row center_all'>
                <div id={formiw_input_state_id} className='formiw_input_state' style={Object.assign({ backgroundColor: defaultInputStateColor }, isTextarea && { marginTop: 10 })} />

                <div className='formiw_input_title ellipsis_line_1'>{title}</div>
                <div className='formiw_input_vdot'>:</div>

                <div className='formiw_input_content'>
                    {readonly.current && <div className='formiw_input_box formiw_readonly_input'>{readonlyText.current}</div>}

                    {!readonly.current && <>
                        {!previewDescFile.current && <>
                            {(!isTextarea && !isSelect) && <input /* Input */ id={formiw_input_box_id} className={`formiw_input_box ${className}`} type={inputType} placeholder={placeholder} onChange={onChangeFunc} />}

                            {isTextarea && <textarea /* Textarea */ id={formiw_input_box_id} className={`formiw_textarea_input_box ${className}`} placeholder={placeholder} onChange={onChangeFunc} />}

                            {isSelect && <select /* Select */ id={formiw_input_box_id} className={`formiw_input_box ${className}`} onSelect={onSelectFunc}>
                                <option>a</option>
                                <option>b</option>
                                <option>c</option>
                                <option>d</option>
                            </select>}
                        </>}

                        {(previewDescFile.current && isTextarea) && <>
                            <div className='formiw_input_desc_preview_container'>
                                <img className='formiw_input_desc_preview_icon' src={previewDescIcon.current} />
                                <div className='formiw_input_desc_preview_info_container'>
                                    <p className='formiw_input_desc_preview_info_title'>{descFileData.current.name}</p>
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

            <div id='formiw_bottom_desc_container'>
                {desc && <p className='formiw_input_desc'>{desc}</p>}
                <div id={formiw_input_error_id} className='formiw_input_error'></div>
            </div>
        </div>
    </>;
    return (render.current ? component : <></>);
};

export default forwardRef(FormInputWidget);
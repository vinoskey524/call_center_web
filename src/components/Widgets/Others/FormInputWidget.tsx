/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import './FormInputWidget.css';
import { generateIdFunc } from '../../Tools/methodForest';
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
        type: 'text' | 'textarea' | 'email' | 'date' | 'password',
        enableDescImport?: boolean,
        desc?: string,
        onDescBtnClickFunc?: any
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

    const inputType = data.type;

    const onDescBtnClickFunc = data.onDescBtnClickFunc;

    const enableDescImport = data.enableDescImport || false;

    const desc = data.desc;

    /* - */

    const formiw_input_import_desc_id = useRef(generateIdFunc({ length: 8 })).current;

    const formiw_input_state_id = useRef(generateIdFunc({ length: 8 })).current;

    const formiw_input_box_id = useRef(generateIdFunc({ length: 8 })).current;

    const descImportBtnIcon = useRef(import_icon);

    const descImportBtnTitle = useRef('Importer (.docx or .html)');

    const previewDescFile = useRef(false);

    const previewDescIcon = useRef(word_icon);

    const descFileData = useRef<any>({});

    const inputStateColor: any = {
        'empty': '#333A45',
        'correct': '#00FF36',
        'error': '#FF315A'
    };


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
    const setInputStateFunc = (x: { state: 'empty' | 'correct' | 'error' }) => {
        const state = x.state;
        if (state.match(/empty|correct|error/)) {
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
    };

    /* Set text */
    const setTextFunc = (x: { text: string }) => { $(`#${formiw_input_box_id}`).val(x.text) };

    /* Clear text */
    const clearTextFunc = () => { $(`#${formiw_input_box_id}`).val('') };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        refreshFunc() { refreshFunc() },
        setLanguageFunc(x: any) { setLanguageFunc(x) },
        setInputStateFunc(x: any) { setInputStateFunc(x) },
        setDescriptionFileFunc(x: any) { setDescriptionFileFunc(x) },
        deleteDescFileFunc() { deleteDescFileFunc() },
        setTextFunc(x: any) { setTextFunc(x) },
        clearTextFunc() { clearTextFunc() }
    }), [refresh]);

    useEffect(() => { console.log('Refr ::', refresh) }, [refresh]);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            (controllerRef.current !== undefined) && controllerRef.current.addWidgetRefFunc({ wid: wid, refId: refId });
        }
    }, []);

    /* On window size change */
    // useEffect(() => {
    //     window.addEventListener('resize', onWindowSizeChangeFunc);
    //     return () => window.removeEventListener('resize', onWindowSizeChangeFunc);
    // }, []);


    /* Return */


    const component = <>
        <div className='formiw_input_container' style={inputType === 'textarea' ? { alignItems: 'start' } : {}}>
            <div id={formiw_input_state_id} className='formiw_input_state' style={inputType === 'textarea' ? { marginTop: 10 } : {}} />
            <div className='formiw_input_title'>{title} :</div>
            <div className='formiw_input_content'>
                {!previewDescFile.current && <>{inputType !== 'textarea' ? <input id={formiw_input_box_id} className='formiw_input_box' type={inputType} onChange={onChangeFunc} /> : <textarea id={formiw_input_box_id} className='formiw_textarea_input_box' onChange={onChangeFunc} />}</>}

                {(previewDescFile.current && inputType === 'textarea') &&
                    <div className='formiw_input_desc_preview_container'>
                        <img className='formiw_input_desc_preview_icon' src={previewDescIcon.current} />
                        <div className='formiw_input_desc_preview_info_container'>
                            <p className='formiw_input_desc_preview_info_title'>{descFileData.current.name}</p>
                            <p className='formiw_input_desc_preview_info_size'>{descFileData.current.formatedSize}</p>
                        </div>
                    </div>
                }

                {(inputType === 'textarea' && enableDescImport) &&
                    <button id={formiw_input_import_desc_id} className='formiw_input_import_desc btn_opacity' onClick={onDescBtnClickFunc}>
                        <img className='formiw_input_import_desc_icon' src={descImportBtnIcon.current} />
                        <p className='formiw_input_import_desc_title'>{descImportBtnTitle.current}</p>
                    </button>
                }

                {desc && <p className='formiw_input_desc'>{desc}</p>}
            </div>
        </div>
    </>;
    return (render.current ? component : <></>);
};

export default forwardRef(FormInputWidget);
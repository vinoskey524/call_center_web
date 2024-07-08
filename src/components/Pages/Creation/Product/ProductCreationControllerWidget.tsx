/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import { refIdType } from '../../../Tools/type';

/* Widget */
type propsType = {
    $data: {
        /** Every change made to "wid" affect controller */
        wid: string,
        refId: refIdType,
        controllerRef?: refIdType,
        rootControllers: any,
        parentRef: refIdType
    }
};
const ProductCreationControllerWidget = (props: propsType, ref: any) => {
    /* ------------------------------------ Constants ------------------------------------- */

    const parentProps = props;

    const windowWidth = useRef(window.innerWidth);

    const windowHeight = useRef(window.innerHeight);

    const [refresh, setRefresh] = useState(false);

    const isMounted = useRef(false);

    const render = useRef(false);

    /* $data */

    const data = props.$data;

    const wid = data.wid;

    const refId = data.refId;

    const controllerRef = data.controllerRef;

    const rootControllers = data.rootControllers;

    const parentRef = data.parentRef;

    /* Root controllers */

    const mainControllerRef: refIdType = rootControllers.mainControllerRef;

    const requestControllerRef: refIdType = rootControllers.requestControllerRef;

    const dataStoreControllerRef: refIdType = rootControllers.dataStoreControllerRef;

    /* Refs */

    const loadingRef = useRef<any>(undefined);

    const productNameFormInputRef = useRef<any>(undefined);

    const productDescFormInputRef = useRef<any>(undefined);

    /* - */

    const emptyRef = useRef(undefined);


    /* ------------------------------------ Methods ------------------------------------- */

    /* Add widget ref */
    const addWidgetRefFunc = (x: { wid: string, refId: any }) => {
        const wid = x.wid, refId = x.refId;
        switch (wid) {
            case 'loadingRef': { loadingRef.current = refId.current } break;
            case 'productNameFormInputRef': { productNameFormInputRef.current = refId.current } break;
            case 'productDescFormInputRef': { productDescFormInputRef.current = refId.current } break;
            default: { };
        };
    };

    /* Set text value from inputs */
    const setTextValueFunc = (x: { wid: string, text: string }) => {
        const wid = x.wid, text = x.text;
        switch (wid) {
            case 'productNameFormInputRef': {
                productNameFormInputRef.current.setInputStateFunc({ state: text.length > 0 ? 'correct' : 'empty' });
            } break;

            case 'productDescFormInputRef': {
                productDescFormInputRef.current.setInputStateFunc({ state: text.length > 0 ? 'correct' : 'empty' });
            } break;

            default: { };
        };
    };

    /* On window size change */
    const onWindowSizeChangeFunc = () => {
        windowWidth.current = window.innerWidth;
        windowHeight.current = window.innerHeight;
    };

    /* Select description file */
    const onDescBtnClickFunc = () => {
        const fileSelectorId = parentRef.current.file_selector_input_id;
        const files: any[] = $(`#${fileSelectorId}`).prop('files');
        if (files.length === 0) {
            $(`#${fileSelectorId}`).prop({ 'accept': '.doc,.docx,.html' });
            $(`#${fileSelectorId}`).trigger('click');
        } else {
            $(`#${fileSelectorId}`).val('');
            productDescFormInputRef.current.deleteDescFileFunc();
        }
    }

    /* Set description file */
    const setDescriptionFileFunc = (x: { fileData: any }) => {
        productDescFormInputRef.current.setDescriptionFileFunc({ fileData: x.fileData });
    };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        addWidgetRefFunc(x: any) { addWidgetRefFunc(x) },
        setTextValueFunc(x: any) { setTextValueFunc(x) },
        onDescBtnClickFunc() { onDescBtnClickFunc() },
        setDescriptionFileFunc(x: any) { setDescriptionFileFunc(x) },
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
    });


    /* Return */


    return (<></>);
};

export default forwardRef(ProductCreationControllerWidget);
/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import './ProductFeedWidget.css';
import { generateIdFunc } from '../../Tools/methodForest';
import { language } from '../../Tools/language';
import { refIdType } from '../../Tools/type';
import { _defaultLanguage_ } from '../../Tools/constants';
import edit_2_icon from '../../Assets/png/edit_2.png';
import trash_1_icon from '../../Assets/png/trash_1.png';

/* Widget */
type propsType = {
    $data: {
        refId: refIdType,
        controllerRef: refIdType,
        rootControllers: any,
        feed: any,
    }
};
const ProductFeedWidget = (props: propsType, ref: any) => {
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

    const wid = useRef(generateIdFunc()).current;

    const refId = data.refId;

    const controllerRef = data.controllerRef;

    const rootControllers = data.rootControllers;

    const feed = useRef(data.feed);

    /* Root controllers */

    const mainControllerRef: refIdType = rootControllers.mainControllerRef;

    const requestControllerRef: refIdType = rootControllers.requestControllerRef;

    const dataStoreControllerRef: refIdType = rootControllers.dataStoreControllerRef;

    /* - */

    const prfew_scaffold_id = useRef(generateIdFunc()).current;

    const prfew_name_id = useRef(generateIdFunc()).current;

    const isSelected = useRef(false);

    const accountType = dataStoreControllerRef.current.currentUserData.current.type;


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

    /* OnSelect */
    const onClickFunc = () => { controllerRef.current.selectProductFunc({ wid: wid, targetRef: refId }) };

    /* Select */
    const selectFunc = (x: { select: boolean }) => {
        isSelected.current = x.select;

        const $target = $(`#${prfew_scaffold_id}`);
        $target.css({ backgroundColor: x.select ? 'rgba(149, 167, 189, 0.12)' : 'transparent' });
        !x.select && $target.removeAttr('style');

        if (isSelected.current) {
            const html = feed.current.html_description;
            $('#prodmw_feed_preview_wrapper').show();
            $('#prodmw_feed_preview_wrapper').empty();
            $('#prodmw_feed_preview_wrapper').append(html);
            $('#prodmw_feed_preview').scrollTop(0);
        }
    };


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        isSelected: isSelected,
        refreshFunc() { refreshFunc() },
        setLanguageFunc(x: any) { setLanguageFunc(x) },
        selectFunc(x: any) { selectFunc(x) }
    }), [refresh]);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            // (controllerRef.current !== undefined) && controllerRef.current.addWidgetRefFunc({ wid: wid, refId: refId });

            /* Highlight */
            const searchString: string = controllerRef.current.productSearchText.current;
            if (searchString.length > 0) {
                const reg = new RegExp(`(${searchString})`, 'gi'); /* Use a regular expression to find the search term */
                const highlightedText = (feed.current.name).replace(reg, '<strong style="color: #007aff" >$1</strong>'); /* Replace the search term with bold HTML tags */
                $(`#${prfew_name_id}`).html(highlightedText); /* Update */
            }
        }
    }, []);

    /* On window size change */
    // useEffect(() => {
    //     window.addEventListener('resize', onWindowSizeChangeFunc);
    //     return () => window.removeEventListener('resize', onWindowSizeChangeFunc);
    // }, []);


    /* Return */


    const component = <>
        <div id={prfew_scaffold_id} className='prfew_scaffold'>
            <div className='prfew_container btn_opacity' onClick={onClickFunc}>
                <div className='prfew_img_container'>
                    {/* <img className='prfew_img' src='logo192.png' /> */}
                </div>

                <div style={{ flex: 1, marginLeft: 6 }}>
                    <div id={prfew_name_id} className='prfew_name ellipsis_line_2'>{feed.current.name}</div>
                    <div className='prfew_bottom_line' />
                </div>
            </div>

            {accountType === 'customer_admin' && <>
                <div className='prfew_btn_container' style={{ right: 40 }}>
                    <img width={16} height={16} src={edit_2_icon} />
                </div>

                <div className='prfew_btn_container' style={{ right: 5 }}>
                    <img width={16} height={16} src={trash_1_icon} />
                </div>
            </>}
        </div>

    </>;
    return (render.current ? component : <></>);
};

export default forwardRef(ProductFeedWidget);
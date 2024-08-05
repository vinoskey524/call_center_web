/* Standard packages */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import $ from 'jquery';

/* Custom packages */
import './ComplaintFeedPreviewWidget.css';
import { generateIdFunc } from '../../Tools/methodForest';
import { language } from '../../Tools/language';
import { refIdType } from '../../Tools/type';
import { _defaultLanguage_ } from '../../Tools/constants';

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
const ComplaintFeedPreviewWidget = (props: propsType, ref: any) => {
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

    const controllerRef = data.controllerRef; /* complaintDashboardControllerRef */

    const rootControllers = data.rootControllers;

    /* Root controllers */

    const mainControllerRef: refIdType = rootControllers.mainControllerRef;

    const requestControllerRef: refIdType = rootControllers.requestControllerRef;

    const dataStoreControllerRef: refIdType = rootControllers.dataStoreControllerRef;

    /* - */

    const emptyRef = useRef(undefined);

    const enableEdition = useRef(false);

    const dataFeed = {
        identifiant: {
            id: 'PL-17072024-000001'
        },
        clientInfo: {
            name: 'Hamet Kevin',
            phone: '+229 96 98 61 23',
            location: 'Cotonou, Benin'
        },
        advancedInfo: {
            object: 'Object of complaint',
            product: 'Name of the product',
            agency: 'Agence de Cotonou',
            // description: 'Configuration de l’interface de commutateur virtuelle',
            description: 'Configuration de l’interface de commutateur virtuelle : Permet d’accéder au commutateur à distance en configurant une adresse Ip et un masque sous-réseau sur l’interface SVIConfiguration de l’interface de commutateur virtuelle : Permet d’accéder au commutateur à distance en configurant une adresse Ip et un masque sous-réseau sur l’interface SVIConfiguration de l’interface de commutateur virtuelle : Permet d’accéder au commutateur à distance en configurant une adresse Ip et un masque sous-réseau sur l’interface SVIConfiguration de l’interface de commutateur virtuelle : Permet d’accéder au commutateur à distance en configurant une adresse Ip et un masque sous-réseau sur l’interface SVI',
            fichiers: [],
        },
        otherInfo: {
            creator: 'Hamet Kevin',
            creationDate: '18/07/2024 à 10:55',
            lastModificator: 'Luis Godjo',
            lastModificationDate: '18/07/2024 à 10:55',
            status: 'Locked',
        }
    };


    /* ------------------------------------ Methods ------------------------------------- */

    /* Refresh component */
    const refreshFunc = () => {
        refresher.current = !refresher.current;
        setRefresh(refresher.current);
    };

    /* Render */
    const renderFunc = (x: { render: boolean }) => {
        render.current = x.render;
        refreshFunc();
    };

    /* Set language */
    const setLanguageFunc = (x: { lang: 'en' | 'fr' }) => {
        lang.current = x.lang;
        refreshFunc();
    };

    /* On window size change */
    const onWindowSizeChangeFunc = () => {
        windowWidth.current = window.innerWidth;
        windowHeight.current = window.innerHeight;
    };

    /* Enable edition */
    const enableEditionFunc = (x: { enable: boolean }) => {
        $('.cfeprw_blurable').css({ 'filter': 'blur(10px)' });
        setTimeout(() => {
            enableEdition.current = x.enable;
            refreshFunc();
            setTimeout(() => { $('.cfeprw_blurable').css({ 'filter': 'blur(0px)' }) }, 100);
        }, 140);
    };

    /* On done */
    const onDoneFunc = () => { };

    /* On cancel */
    const onCancelFunc = () => { controllerRef.current.enableEditionFunc({ enable: false }) };


    /* ------------------------------------ jQuery ------------------------------------- */


    /* ------------------------------------ Hooks ------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        refreshFunc() { refreshFunc() },
        renderFunc(x: any) { renderFunc(x) },
        setLanguageFunc(x: any) { setLanguageFunc(x) },
        enableEditionFunc(x: any) { enableEditionFunc(x) }
    }), []);

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
        <div className='cfeprw_scaffold'>
            <div className='cfeprw_spacer' />

            <table className='cfeprw_data_table'>
                <tbody /* Id */ style={{}}>
                    <tr>
                        <th></th>
                        <td style={{ color: '#9e9e9e', fontSize: 12, paddingBottom: 2 }}>Identifiant</td>
                    </tr>
                    <tr>
                        <th className=''>Id :</th>
                        <td className='cfeprw_blurable enable_select' style={{ color: '#FFD802' }}>{dataFeed.identifiant.id}</td>
                    </tr>
                </tbody>

                <tbody /* Client */ style={{}}>
                    <tr>
                        <th></th>
                        <td style={{ color: '#9e9e9e', fontSize: 12, paddingTop: 12, paddingBottom: 2 }}>Informations client</td>
                    </tr>
                    <tr>
                        <th className=''>Name :</th>
                        <td className='cfeprw_blurable enable_select'>
                            {enableEdition.current ? <input className='cfeprw_data_input' type='text' value={dataFeed.clientInfo.name} /> : <>{dataFeed.clientInfo.name}</>}
                        </td>
                    </tr>
                    <tr>
                        <th className=''>Phone :</th>
                        <td className='cfeprw_blurable enable_select'>
                            {enableEdition.current ? <input className='cfeprw_data_input' type='text' value={dataFeed.clientInfo.phone} /> : <>{dataFeed.clientInfo.phone}</>}
                        </td>
                    </tr>
                    <tr>
                        <th className=''>Location :</th>
                        <td className='cfeprw_blurable enable_select'>
                            {enableEdition.current ? <input className='cfeprw_data_input' type='text' value={dataFeed.clientInfo.location} /> : <>{dataFeed.clientInfo.location}</>}
                        </td>
                    </tr>
                </tbody>

                <tbody /* Advanced */ style={{}}>
                    <tr>
                        <th></th>
                        <td style={{ color: '#9e9e9e', fontSize: 12, paddingTop: 12, paddingBottom: 2 }}>Informations avancees</td>
                    </tr>
                    <tr>
                        <th className=''>Object :</th>
                        <td className='cfeprw_blurable enable_select'>
                            {enableEdition.current ? <input className='cfeprw_data_input' type='text' value={dataFeed.advancedInfo.object} /> : <>{dataFeed.advancedInfo.object}</>}
                        </td>
                    </tr>
                    <tr>
                        <th className=''>Product :</th>
                        <td className='cfeprw_blurable enable_select'>
                            {enableEdition.current ? <input className='cfeprw_data_input' type='text' value={dataFeed.advancedInfo.product} /> : <>{dataFeed.advancedInfo.product}</>}
                        </td>
                    </tr>
                    <tr>
                        <th className=''>Agence :</th>
                        <td className='cfeprw_blurable enable_select'>
                            {enableEdition.current ? <input className='cfeprw_data_input' type='text' value={dataFeed.advancedInfo.agency} /> : <>{dataFeed.advancedInfo.agency}</>}
                        </td>
                    </tr>
                    <tr>
                        <th className=''>Description :</th>
                        <td className='cfeprw_blurable enable_select'>
                            {enableEdition.current ? <textarea className='cfeprw_data_textarea' value={dataFeed.advancedInfo.description} /> : <>{dataFeed.advancedInfo.description}</>}
                        </td>
                    </tr>
                    <tr>
                        <th className=''>Fichiers :</th>
                        <td className='cfeprw_blurable enable_select'></td>
                    </tr>
                </tbody>

                {!enableEdition.current &&
                    <tbody /* Autres informations */ style={{}}>
                        <tr>
                            <th></th>
                            <td style={{ color: '#9e9e9e', fontSize: 12, paddingTop: 12, paddingBottom: 2 }}>Autres informations</td>
                        </tr>
                        <tr>
                            <th className=''>Créateur :</th>
                            <td className='cfeprw_blurable enable_select'>{dataFeed.otherInfo.creator}</td>
                        </tr>
                        <tr>
                            <th className=''>Date de création :</th>
                            <td className='cfeprw_blurable enable_select'>{dataFeed.otherInfo.creationDate}</td>
                        </tr>
                        <tr>
                            <th className=''>Dernière modification :</th>
                            <td className='cfeprw_blurable enable_select'>18/07/2024 à 10:55 par Luis Godjo</td>
                        </tr>
                        <tr>
                            <th className=''>Status :</th>
                            <td className='cfeprw_blurable enable_select'>{dataFeed.otherInfo.status}</td>
                        </tr>
                    </tbody>
                }

                {enableEdition.current &&
                    <tbody /* Action */ style={{}}>
                        <tr>
                            <th className=''></th>
                            <td className=''>
                                <div className='cfeprw_data_action_btn'>
                                    <div className='cfeprw_data_done_btn btn_opacity' onClick={onDoneFunc}>Done</div>
                                    <div className='cfeprw_data_cancel_btn btn_opacity' onClick={onCancelFunc}>Cancel</div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                }
            </table>
        </div>
    </>;
    return (render.current ? component : <></>);
};

export default forwardRef(ComplaintFeedPreviewWidget);
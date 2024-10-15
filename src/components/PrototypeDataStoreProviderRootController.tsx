/** 
 * This controller is a Provider
 * It contains and manage all app data
*/

/* Standard packages */
import React, { createContext, useState, useRef, forwardRef, useImperativeHandle, useContext, useCallback } from 'react';
import { EventEmitter } from 'events';

/* Custom packages */
import { language } from './Tools/language';
import { refIdType } from './Tools/type';

/* Create an instance of EventEmitter */
export const appEmitter = new EventEmitter();

/* create context */
const DataStoreContext = createContext<any>({});

/* create data store provider */
export const DataStoreProviderRootController = forwardRef((props: any, ref: any) => {
    /* ----------------------------------------------------------- constants ----------------------------------------------------------- */
    const children = props.children;
    const refId: refIdType = props.$data.refId;

    const refresher = useRef(false);
    const [refresh, setRefresh] = useState(refresher.current);

    /* App settings */

    const appLanguage = useRef<string>('fr');
    const traduction = language[appLanguage.current];

    /* - */

    const refIdObj = useRef<any>({});


    /* ----------------------------------------------------------- Methods ----------------------------------------------------------- */

    /* Refresh component */
    const refreshFunc = useCallback(() => {
        refresher.current = !refresher.current;
        setRefresh(refresher.current);
    }, []);

    /* Add refId */
    const addRefIdFunc = (x: { wid: string, refId: any }) => {
        const wid = x.wid, obj = JSON.parse(`{"${wid}": ""}`);
        obj[wid] = x.refId;
        Object.assign(refIdObj.current, obj);
    };

    /* Delete refId */
    const deleteRefIdFunc = (x: { wid: string | string[] }) => {
        const wid = (typeof x.wid === 'string') ? [x.wid] : x.wid;
        for (let i = 0; i < wid.length; i++) { delete refIdObj.current[wid[i]] }
    };

    /* Set app language */
    const setAppLanguageFunc = (x: { lang: 'fr' | 'en' }) => {
        appLanguage.current = x.lang;
        refId.current.refreshFunc();
    };

    /* Set/Update data */
    const setDataFunc = useCallback((x: { type: string, data: any[], update?: boolean }) => {
        const type = x.type, data: any[] = x.data, update = x.update;
        switch (type) {
            case '': { } break;
            default: { console.error(`DataStoreControllerWidget => Data of type "${type}" doesn't exists !`) };
        };
    }, []);

    /* remove data */
    const removeDataFunc = useCallback((x: { type: string, data: any[] }) => {
        const type = x.type, data: any[] = x.data;
        switch (type) {
            case '': { } break;
            default: { console.error(`DataStoreControllerWidget => Data of type "${type}" doesn't exists !`) };
        };
    }, []);


    /* ----------------------------------------------------------- Methods ----------------------------------------------------------- */

    /* Imperative handler */
    useImperativeHandle(ref, () => ({
        refreshFunc() { refreshFunc() },

        addRefIdFunc(x: any) { addRefIdFunc(x) },
        deleteRefIdFunc(x: any) { deleteRefIdFunc(x) },

        setAppLanguageFunc(x: any) { setAppLanguageFunc(x) },
        setDataFunc(x: any) { setDataFunc(x) },
        removeDataFunc(x: any) { removeDataFunc(x) }
    }), []);


    /* return */

    const value = {
        /* data store ref */
        dataStoreRef: refId,

        /* ref Id */
        refIdObj: refIdObj,

        /* App settings */
        appLanguage: appLanguage,
        traduction: traduction,
    };
    const component = <DataStoreContext.Provider value={value}>{children}</DataStoreContext.Provider>;
    return (component);
});

/* create "getDataStore" hook */
// export const useDataStore = () => useContext(DataStoreContext);
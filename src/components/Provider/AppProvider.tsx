/* Std packeges */
import React, { createContext, useContext, useState, useRef } from 'react';

/* Custom packages */
import { _defaultLanguage_ } from '../Tools/constants';

/* Create context & context'provider */
const appContext = createContext({});
export const AppProvider = (props: any) => {
    const refresher = useRef(false);
    const [refresh, setRefresh] = useState(refresher.current);
    const data = useRef<any>({});

    /* Refresh component */
    const refreshFunc = () => { refresher.current = !refresher.current; setRefresh(refresher.current) };

    /* Notify on change */
    const notifyOnChangeFunc = (x: { type: string[], data: any }) => { data.current = x; refreshFunc() };

    /* - */
    const component = <appContext.Provider value={{ data: data.current, notifyOnChangeFunc: notifyOnChangeFunc }}>{props.children}</appContext.Provider>;
    return (component);
};

/* Export context */
export const useAppContext = () => useContext(appContext);
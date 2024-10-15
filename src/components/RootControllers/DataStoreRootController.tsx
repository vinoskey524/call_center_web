/* Standard packages */
import React, { memo, useState, useCallback, useRef, forwardRef, useImperativeHandle, useMemo, useEffect } from 'react';

/* custom packages */
import { sortStringFunc } from '../Tools/methodForest';
import { language } from '../Tools/language';
import { _defaultLanguage_ } from '../Tools/constants';
import { refIdType } from '../Tools/type';

/* create data store provider */
export const DataStoreRootController = forwardRef((props: any, ref: any) => {
    /* ----------------------------------------------------------- constants ----------------------------------------------------------- */

    const refId: refIdType = ref;

    const refresher = useRef(false);
    const [refresh, setRefresh] = useState(refresher.current);

    const isMounted = useRef(false);
    const render = useRef(false);

    /* App settings */
    const appLanguage = useRef<string>('fr');
    const traduction = useRef(language[appLanguage.current]);

    /* - */
    const currentUserData = useRef<any | undefined>(undefined);
    const currentCustomerData = useRef<any | undefined>(undefined);

    /* admin account */
    const mainAdminAccountData = useRef<any[]>([]);
    const mainAdminAccountIdTab = useRef<string[]>([]);
    const mainAdminAccountNewerTimestamp_ms = useRef(0);
    const mainAdminAccountOlderTimestamp_ms = useRef(0);

    /* call center account */
    const callCenterAccountIdTab = useRef<string[]>([]);
    const callCenterAccountData = useRef<any[]>([]);
    const callCenterAccountNewerTimestamp_ms = useRef(0);
    const callCenterAccountOlderTimestamp_ms = useRef(0);

    /* customer account */
    const customerAccountData = useRef<any[]>([]);
    const customerAccountIdTab = useRef<string[]>([]);
    const customerAccountNewerTimestamp_ms = useRef(0);
    const customerAccountOlderTimestamp_ms = useRef(0);

    /* product */
    const customerProductData = useRef<any[]>([]);
    const customerProductIdTab = useRef<string[]>([]);
    const customerProductNameTab = useRef<string[]>([]);
    const customerProductNewerTimestamp_ms = useRef(0);
    const customerProductOlderTimestamp_ms = useRef(0);

    /* complaint */
    const customerComplaintData = useRef<any[]>([]);
    const customerComplaintIdTab = useRef<string[]>([]);
    const customerComplaintNewerTimestamp_ms = useRef(0);
    const customerComplaintOlderTimestamp_ms = useRef(0);

    /* complaint object */
    const customerComplaintObjectData = useRef<any[]>([]);
    const customerComplaintObjectIdTab = useRef<string[]>([]);
    const customerComplaintObjectNameTab = useRef<string[]>([]);
    const customerComplaintObjectNewerTimestamp_ms = useRef(0);
    const customerComplaintObjectOlderTimestamp_ms = useRef(0);

    /* agency */
    const customerAgencyData = useRef<any[]>([]);
    const customerAgencyIdTab = useRef<string[]>([]);
    const customerAgencyNameTab = useRef<string[]>([]);
    const customerAgencyNewerTimestamp_ms = useRef(0);
    const customerAgencyOlderTimestamp_ms = useRef(0);

    /* - */
    const val = {
        /* data store ref */
        dataStoreRef: refId,

        /* App settings */
        appLanguage: appLanguage,
        traduction: traduction,

        /* - */
        currentUserData: currentUserData,
        currentCustomerData: currentCustomerData,

        /* admin account */
        mainAdminAccountData: mainAdminAccountData,
        mainAdminAccountIdTab: mainAdminAccountIdTab,
        mainAdminAccountNewerTimestamp_ms: mainAdminAccountNewerTimestamp_ms,
        mainAdminAccountOlderTimestamp_ms: mainAdminAccountOlderTimestamp_ms,

        /* call center account */
        callCenterAccountIdTab: callCenterAccountIdTab,
        callCenterAccountData: callCenterAccountData,
        callCenterAccountNewerTimestamp_ms: callCenterAccountNewerTimestamp_ms,
        callCenterAccountOlderTimestamp_ms: callCenterAccountOlderTimestamp_ms,

        /* customer account */
        customerAccountData: customerAccountData,
        customerAccountIdTab: customerAccountIdTab,
        customerAccountNewerTimestamp_ms: customerAccountNewerTimestamp_ms,
        customerAccountOlderTimestamp_ms: customerAccountOlderTimestamp_ms,

        /* product */
        customerProductData: customerProductData,
        customerProductIdTab: customerProductIdTab,
        customerProductNameTab: customerProductNameTab,
        customerProductNewerTimestamp_ms: customerProductNewerTimestamp_ms,
        customerProductOlderTimestamp_ms: customerProductOlderTimestamp_ms,

        /* complaint */
        customerComplaintData: customerComplaintData,
        customerComplaintIdTab: customerComplaintIdTab,
        customerComplaintNewerTimestamp_ms: customerComplaintNewerTimestamp_ms,
        customerComplaintOlderTimestamp_ms: customerComplaintOlderTimestamp_ms,

        /* complaint object */
        customerComplaintObjectData: customerComplaintObjectData,
        customerComplaintObjectIdTab: customerComplaintObjectIdTab,
        customerComplaintObjectNameTab: customerComplaintObjectNameTab,
        customerComplaintObjectNewerTimestamp_ms: customerComplaintObjectNewerTimestamp_ms,
        customerComplaintObjectOlderTimestamp_ms: customerComplaintObjectOlderTimestamp_ms,

        /* agency */
        customerAgencyData: customerAgencyData,
        customerAgencyIdTab: customerAgencyIdTab,
        customerAgencyNameTab: customerAgencyNameTab,
        customerAgencyNewerTimestamp_ms: customerAgencyNewerTimestamp_ms,
        customerAgencyOlderTimestamp_ms: customerAgencyOlderTimestamp_ms
    };


    /* ----------------------------------------------------------- Methods ----------------------------------------------------------- */

    /* Refresh component */
    const refreshFunc = useCallback(() => {
        refresher.current = !refresher.current;
        setRefresh(refresher.current);
    }, []);

    /* change language */
    const changeLanguageFunc = (x: { lang: 'en' | 'fr' }) => {
        appLanguage.current = x.lang;
        traduction.current = language[x.lang];
    };

    /* Set current user data */
    const setDataFunc = useCallback((x: { type: string, data: any[], update?: boolean }) => {
        const type = x.type, data: any[] = x.data, update = x.update;
        switch (type) {
            case 'currentUserData': { currentUserData.current = data } break;

            case 'currentCustomerData': { currentCustomerData.current = data } break;

            case 'mainAdminAccount': {
                const len = mainAdminAccountData.current.length;
                const tab = [];

                /* Ensure there's no duplicated data */
                if (len > 0) {
                    for (let i = 0; i < data.length; i++) {
                        const id = data[i].id;
                        if (mainAdminAccountIdTab.current.indexOf(id) === -1) {
                            tab.push(data[i])
                            mainAdminAccountIdTab.current.push(id);
                        }
                    }
                } else {
                    for (let i = 0; i < data.length; i++) { mainAdminAccountIdTab.current.push(data[i].id) }
                    tab.push(...data);
                }

                /* - */
                if (tab.length > 0) {
                    const sortedData = [...mainAdminAccountData.current, ...tab].sort((a: any, b: any) => b.timestamp_ms - a.timestamp_ms);
                    mainAdminAccountData.current = sortedData;

                    /* Update timestamp_ms */
                    mainAdminAccountNewerTimestamp_ms.current = mainAdminAccountData.current[0].timestamp_ms;
                    mainAdminAccountOlderTimestamp_ms.current = (mainAdminAccountData.current.slice(-1))[0].timestamp_ms;

                    /* Store data into local storage */

                    // console.log(mainAdminAccountData.current, mainAdminAccountNewerTimestamp_ms, mainAdminAccountOlderTimestamp_ms);
                }
            } break;

            case 'callCenterAccount': {
                const len = callCenterAccountData.current.length;
                const tab = [];

                /* Ensure there's no duplicated data */
                if (len > 0) {
                    for (let i = 0; i < data.length; i++) {
                        const id = data[i].id;
                        if (callCenterAccountIdTab.current.indexOf(id) === -1) {
                            tab.push(data[i])
                            callCenterAccountIdTab.current.push(id);
                        }
                    }
                } else {
                    for (let i = 0; i < data.length; i++) { callCenterAccountIdTab.current.push(data[i].id) }
                    tab.push(...data);
                }

                /* - */
                if (tab.length > 0) {
                    const sortedData = [...callCenterAccountData.current, ...tab].sort((a: any, b: any) => b.timestamp_ms - a.timestamp_ms);
                    callCenterAccountData.current = sortedData;

                    /* Update timestamp_ms */
                    callCenterAccountNewerTimestamp_ms.current = callCenterAccountData.current[0].timestamp_ms;
                    callCenterAccountOlderTimestamp_ms.current = (callCenterAccountData.current.slice(-1))[0].timestamp_ms;

                    /* Store data into local storage */

                    // console.log(callCenterAccountData.current, mainAdminAccountNewerTimestamp_ms, mainAdminAccountOlderTimestamp_ms);
                }
            } break;

            case 'customerAccount': {
                /* add account */
                if (update !== true) {
                    const len = customerAccountData.current.length;
                    const tab = [];

                    /* Ensure there's no duplicated data */
                    if (len > 0) {
                        for (let i = 0; i < data.length; i++) {
                            const id = data[i].id;
                            if (customerAccountIdTab.current.indexOf(id) === -1) {
                                tab.push(data[i])
                                customerAccountIdTab.current.push(id);
                            }
                        }
                    } else {
                        for (let i = 0; i < data.length; i++) { customerAccountIdTab.current.push(data[i].id) }
                        tab.push(...data);
                    }

                    /* - */
                    if (tab.length > 0) {
                        const sortedData = [...customerAccountData.current, ...tab].sort((a: any, b: any) => b.timestamp_ms - a.timestamp_ms);
                        customerAccountData.current = sortedData;

                        /* Update timestamp_ms */
                        customerAccountNewerTimestamp_ms.current = customerAccountData.current[0].timestamp_ms;
                        customerAccountOlderTimestamp_ms.current = (customerAccountData.current.slice(-1))[0].timestamp_ms;

                        /* Store data into local storage */
                    }
                }

                /* update account */
                else {
                    for (let i = 0; i < data.length; i++) {
                        const dt = data[i];
                        const index = customerAccountData.current.findIndex((e: any) => e.id === dt.id);
                        if (index !== -1) customerAccountData.current[index] = dt;
                    }
                }
            } break;

            case 'customerProduct': {
                /* Add product */
                if (!update) {
                    const len = customerProductData.current.length;
                    const tab = [];

                    /* Ensure there's no duplicated data */
                    if (len > 0) {
                        for (let i = 0; i < data.length; i++) {
                            const id = data[i].id;
                            const name = data[i].name;
                            if (customerProductIdTab.current.indexOf(id) === -1) {
                                tab.push(data[i])
                                customerProductIdTab.current.push(id);
                                customerProductNameTab.current.push(name);
                            }
                        }
                    } else {
                        for (let i = 0; i < data.length; i++) {
                            customerProductIdTab.current.push(data[i].id);
                            customerProductNameTab.current.push(data[i].name);
                        }
                        tab.push(...data);
                    }

                    /* - */
                    if (tab.length > 0) {
                        const sortedData = [...customerProductData.current, ...tab].sort((a: any, b: any) => b.timestamp_ms - a.timestamp_ms);
                        customerProductData.current = sortedData;

                        /* Update timestamp_ms */
                        customerProductNewerTimestamp_ms.current = customerProductData.current[0].timestamp_ms;
                        customerProductOlderTimestamp_ms.current = (customerProductData.current.slice(-1))[0].timestamp_ms;

                        /* Store data into local storage */

                        // console.log(customerProductData.current, mainAdminProductNewerTimestamp_ms, mainAdminProductOlderTimestamp_ms);
                    }
                }

                /* update product */
                else { }
            } break;

            case 'customerComplaint': {
                /* add complaint */
                if (!update) {
                    const len = customerComplaintData.current.length;
                    const tab = [];

                    /* Ensure there's no duplicated data */
                    if (len > 0) {
                        for (let i = 0; i < data.length; i++) {
                            const id = data[i].id;
                            if (customerComplaintIdTab.current.indexOf(id) === -1) {
                                tab.push(data[i])
                                customerComplaintIdTab.current.push(id);
                            }
                        }
                    } else {
                        for (let i = 0; i < data.length; i++) { customerComplaintIdTab.current.push(data[i].id) }
                        tab.push(...data);
                    }

                    /* - */
                    if (tab.length > 0) {
                        const sortedData = [...customerComplaintData.current, ...tab].sort((a: any, b: any) => b.timestamp_ms - a.timestamp_ms);
                        customerComplaintData.current = sortedData;

                        /* Update timestamp_ms */
                        customerComplaintNewerTimestamp_ms.current = customerComplaintData.current[0].timestamp_ms;
                        customerComplaintOlderTimestamp_ms.current = (customerComplaintData.current.slice(-1))[0].timestamp_ms;

                        /* Store data into local storage */

                        // console.log(customerComplaintData.current, mainAdminComplaintNewerTimestamp_ms, mainAdminComplaintOlderTimestamp_ms);
                    }
                }

                /* update complaint */
                else { }
            } break;

            case 'customerComplaintObject': {
                /* add complaint object */
                if (!update) {
                    const len = customerComplaintObjectData.current.length;
                    const tab = [];

                    /* Ensure there's no duplicated data */
                    if (len > 0) {
                        for (let i = 0; i < data.length; i++) {
                            const id = data[i].id;
                            const name = data[i].name;
                            if (customerComplaintObjectIdTab.current.indexOf(id) === -1) {
                                tab.push(data[i]);
                                customerComplaintObjectIdTab.current.push(id);
                                customerComplaintObjectNameTab.current.push(name);
                            }
                        }

                    } else { /* For first data insertion */
                        for (let i = 0; i < data.length; i++) {
                            customerComplaintObjectIdTab.current.push(data[i].id);
                            customerComplaintObjectNameTab.current.push(data[i].name);
                        }
                        tab.push(...data);
                    }

                    /* - */
                    if (tab.length > 0) {
                        /* Sort data */
                        const sortedData = [...customerComplaintObjectData.current, ...tab].sort((a: any, b: any) => b.timestamp_ms - a.timestamp_ms);
                        customerComplaintObjectData.current = sortedData;

                        /* sort name */
                        customerComplaintObjectNameTab.current.sort((a: string, b: string) => sortStringFunc({ a: a, b: b }));

                        /* Update timestamp_ms */
                        customerComplaintObjectNewerTimestamp_ms.current = customerComplaintObjectData.current[0].timestamp_ms;
                        customerComplaintObjectOlderTimestamp_ms.current = (customerComplaintObjectData.current.slice(-1))[0].timestamp_ms;

                        /* Store data into local storage */

                        // console.log(customerComplaintObjectData.current, mainAdminComplaintObjectNewerTimestamp_ms, mainAdminComplaintObjectOlderTimestamp_ms);
                    }
                }

                /* Update complaint object */
                else {
                    for (let i = 0; i < data.length; i++) {
                        const dt = data[i];
                        const index = customerComplaintObjectData.current.findIndex((e: any) => e.id === dt.id);
                        if (index !== -1) {
                            /* update name tab */
                            const name = dt.name;
                            const find = customerComplaintObjectNameTab.current.findIndex((e: string) => e === name);
                            customerComplaintObjectNameTab.current[find] = name;

                            /* update data */
                            customerComplaintObjectData.current[index] = dt;
                        }
                    }
                }
            } break;

            case 'customerAgency': {
                /* add agency */
                if (!update) {
                    const len = customerAgencyData.current.length;
                    const tab = [];

                    /* Ensure there's no duplicated data */
                    if (len > 0) {
                        for (let i = 0; i < data.length; i++) {
                            const id = data[i].id;
                            const name = data[i].name;
                            if (customerAgencyIdTab.current.indexOf(id) === -1) {
                                tab.push(data[i])
                                customerAgencyIdTab.current.push(id);
                                customerAgencyNameTab.current.push(name);
                            }
                        }

                    } else { /* For first insertion */
                        for (let i = 0; i < data.length; i++) {
                            customerAgencyIdTab.current.push(data[i].id);
                            customerAgencyNameTab.current.push(data[i].name);
                        }
                        tab.push(...data);
                    }

                    /* - */
                    if (tab.length > 0) {
                        /* sort data */
                        const sortedData = [...customerAgencyData.current, ...tab].sort((a: any, b: any) => b.timestamp_ms - a.timestamp_ms);
                        customerAgencyData.current = sortedData;

                        /* sort name */
                        customerAgencyNameTab.current.sort((a: string, b: string) => sortStringFunc({ a: a, b: b }));

                        /* Update timestamp_ms */
                        customerAgencyNewerTimestamp_ms.current = customerAgencyData.current[0].timestamp_ms;
                        customerAgencyOlderTimestamp_ms.current = (customerAgencyData.current.slice(-1))[0].timestamp_ms;

                        /* Store data into local storage */

                        // console.log(customerAgencyData.current, mainAdminAgencyNewerTimestamp_ms, mainAdminAgencyOlderTimestamp_ms);
                    }
                }

                /* update agency */
                else {
                    for (let i = 0; i < data.length; i++) {
                        const dt = data[i];
                        const index = customerAgencyData.current.findIndex((e: any) => e.id === dt.id);
                        if (index !== -1) {
                            /* update name tab */
                            const name = dt.name;
                            const find = customerAgencyNameTab.current.findIndex((e: string) => e === name);
                            customerAgencyNameTab.current[find] = name;

                            /* update data */
                            customerAgencyData.current[index] = dt;
                        }
                    }
                }
            } break;

            default: { console.error(`DataStoreControllerWidget => Data of type "${type}" doesn't exists !`) };
        };
    }, []);

    /* Remove data */
    const removeDataFunc = useCallback((x: { type: string, data: any[] }) => {
        const type = x.type, data = x.data;
        switch (type) {
            case 'customerAccount': {
                for (let i = 0; i < data.length; i++) {
                    const target = data[i];

                    /* remove data */
                    const index = customerAccountData.current.findIndex((e: any) => e.id === target.id);
                    if (index !== -1) customerAccountData.current.splice(index, 1);

                    /* remove id */
                    const idIndex = customerAccountIdTab.current.findIndex((e: string) => e === target.id);
                    if (idIndex !== -1) customerAccountIdTab.current.splice(idIndex, 1);
                }
            } break;

            case 'customerComplaintObject': {
                for (let i = 0; i < data.length; i++) {
                    const target = data[i];

                    /* remove data */
                    const index = customerComplaintObjectData.current.findIndex((e: any) => e.id === target.id);
                    if (index !== -1) customerComplaintObjectData.current.splice(index, 1);

                    /* remove id */
                    const idIndex = customerComplaintObjectIdTab.current.findIndex((e: string) => e === target.id);
                    if (idIndex !== -1) customerComplaintObjectIdTab.current.splice(idIndex, 1);

                    /* remove name */
                    const nameIndex = customerComplaintObjectNameTab.current.findIndex((e: string) => e === target.name);
                    if (nameIndex !== -1) customerComplaintObjectNameTab.current.splice(nameIndex, 1);
                }
            } break;

            case 'customerAgency': {
                for (let i = 0; i < data.length; i++) {
                    const target = data[i];

                    /* remove data */
                    const index = customerAgencyData.current.findIndex((e: any) => e.id === target.id);
                    if (index !== -1) customerAgencyData.current.splice(index, 1);

                    /* remove id */
                    const idIndex = customerAgencyIdTab.current.findIndex((e: string) => e === target.id);
                    if (idIndex !== -1) customerAgencyIdTab.current.splice(idIndex, 1);

                    /* remove name */
                    const nameIndex = customerAgencyNameTab.current.findIndex((e: string) => e === target.name);
                    if (nameIndex !== -1) customerAgencyNameTab.current.splice(nameIndex, 1);

                    console.log(index, idIndex, nameIndex, target, customerAgencyNameTab);
                }
            } break;

            default: { console.error(`DataStoreControllerWidget => Data of type "${type}" doesn't exists !`) } break;
        };
    }, []);


    /* ----------------------------------------------------------- Methods ----------------------------------------------------------- */

    /* Make methods inside, callable directly from parent component via ref */
    useImperativeHandle(ref, () => ({
        ...val,

        refreshFunc() { refreshFunc() },
        changeLanguageFunc(x: any) { changeLanguageFunc(x) },
        setDataFunc(x: any) { setDataFunc(x) },
        removeDataFunc(x: any) { removeDataFunc(x) },
    }), []);

    /* On mount */
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
        }
    }, []);


    /* - */
    return (<></>);

}); export default memo(DataStoreRootController);
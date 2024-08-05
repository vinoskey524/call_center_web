import React from 'react'

/** RefId type */
export type refIdType = React.MutableRefObject<any>;

/** Page data type */
export type pageDataType = { title: string, routeName: string, refId: refIdType, isDefault: boolean };

/** pg main function type */
export type postgresMainFuncType = 'loginFunc';
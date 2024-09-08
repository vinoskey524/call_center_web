import { _success_, _error_, _requestFailed_ } from '../../Tools/constants';
import { pg } from './init';
import { postgresMainFuncType } from '../../Tools/type';
import { decipherFunc } from '../../Tools/methodForest';

/** Pg main func */
export const pg_mainFunc = async (x: { func: postgresMainFuncType, data?: any }): Promise<{ status: string, data: any }> => {
    try {
        return await pg.post('/zebra', { func: x.func, data: x.data || '' })
            .then((res: any) => { return res.data })
            .catch((e: any) => { return { status: _error_, data: e.message } });
    } catch (e: any) { return { status: _requestFailed_, data: e.message } };
};
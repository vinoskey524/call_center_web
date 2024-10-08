import { _success_, _error_, _requestFailed_ } from '../../Tools/constants';
import { pg } from './init';
import { postgresMainFuncType } from '../../Tools/type';

/** Pg main func */
export const pg_mainFunc = async (x: { func: postgresMainFuncType, data?: any, timeout?: number }): Promise<{ status: string, data: any }> => {
    try {
        return await pg.post('/zebra', { func: x.func, data: x.data || '' }, x.timeout ? { timeout: x.timeout } : {})
            .then((res: any) => { return res.data })
            .catch((e: any) => { return { status: _error_, data: e.message } });
    } catch (e: any) { return { status: _requestFailed_, data: e.message } };
};
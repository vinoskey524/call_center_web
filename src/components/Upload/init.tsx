import axios from 'axios';
import { _databaseAddress_, _requestFailed_ } from '../Tools/constants';
import { catchErrorFunc } from '../Tools/methodForest';

/* 30s timout */
const tmout = 30000;

/** Create upload API */
export const upload = axios.create({ baseURL: _databaseAddress_, timeout: tmout, headers: { 'Content-Type': 'multipart/form-data' } });

/** Upload file */
type uploadType = 'createProductFunc' | 'createComplaintFunc';
export const uploadFileFunc = async (x: { formData: any, timeout?: number }): Promise<{ status: string, data: any }> => {
    try {
        // return await upload.post('/butterfly', { func: x.func, data: x.data }, { timeout: x.timeout || tmout })
        return await upload.post('/butterfly', x.formData, { timeout: x.timeout || tmout })
            .then((res: any) => { return res.data })
            .catch((e: any) => { throw new Error(JSON.stringify({ status: _requestFailed_, data: e })) })

    } catch (e: any) { return catchErrorFunc({ err: e }) }
};

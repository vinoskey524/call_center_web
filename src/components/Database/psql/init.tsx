import axios from 'axios';
import { _databaseAddress_ } from '../../Tools/constants';

/** Create psql API */
export const pg = axios.create({ baseURL: _databaseAddress_, timeout: 2000, headers: {} });
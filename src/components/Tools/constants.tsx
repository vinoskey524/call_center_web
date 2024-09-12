/** Standard packages */
import { BrowserView, MobileView, browserName, isBrowser, isMobile } from 'react-device-detect';

/** Custom packages */
import word_icon from '../Assets/png/word.png';
import html_icon from '../Assets/png/html.png';

/** Device type */
export const _deviceType_: 'browser' | 'mobile' = isBrowser ? 'browser' : 'mobile';
export const _browserName_ = browserName;

/* mode */
export const _dev_ = (process.env.NODE_ENV === 'development') ? true : false;
export const _prod_ = (process.env.NODE_ENV === 'production') ? true : false;
export const _test_ = (process.env.NODE_ENV === 'test') ? true : false;

/** Callback execution final state */
export const _success_ = 'success';
export const _error_ = 'error';
export const _requestFailed_ = 'requestFailed';

export const _pgReqFailed_ = 'pgReqFailed';
export const _cipherFailed_ = 'cipherFailed';
export const _decipherFailed_ = 'decipherFailed';
export const _incompleteForm_ = 'incompleteForm';

export const _domainExists_ = 'domainExists';
export const _companyNameExists_ = 'companyNameExists';
export const _emailExists_ = 'emailExists';
export const _phoneExists_ = 'phoneExists';
export const _fullnameExists_ = 'fullnameExists';
export const _usernameExists_ = 'usernameExists';

/**  */
export const _noUserFound_ = 'no user found';
export const _incorrectCredentials_ = 'incorrect credentials';

/** Server address */
export const _serverAddress_ = 'localhost';
// export const _serverAddress_ = '192.168.100.9';

/** psql db url */
export const _databasePort_ = 8811;
export const _databaseAddress_ = `http://${_serverAddress_}:${_databasePort_}`;

/** ws url */
export const _wsPort_ = 8812;
export const _wsAddress_ = `ws://${_serverAddress_}:${_wsPort_}`;

/** Default language */
export const _defaultLanguage_ = 'fr';

/** File icons  */
export const _fileIcon_ = {
    word: word_icon,
    html: html_icon,
}

/** Months */
export const months = [
    { name: 'january', days: 31 },
    { name: 'february', days: 28 },
    { name: 'march', days: 31 },
    { name: 'april', days: 30 },
    { name: 'may', days: 31 },
    { name: 'june', days: 30 },
    { name: 'july', days: 31 },
    { name: 'august', days: 31 },
    { name: 'september', days: 30 },
    { name: 'october', days: 31 },
    { name: 'november', days: 30 },
    { name: 'december', days: 31 }
];

/** Color palette  */
export const _colorPalette_ = [
    '#FF5733', '#33FF57', '#3357FF', '#FF33A6', '#A633FF', '#FF8C33', '#FF33F1', '#33FFF3', '#FFD133', '#B6FF33',
    '#33FFA6', '#F033FF', '#FF3368', '#33D1FF', '#A6FF33', '#57FF33', '#FF3380', '#F1FF33', '#33FF88', '#8C33FF',
    '#33FF57', '#33FFF0', '#B633FF', '#FF5733', '#33FF8C', '#FF3357', '#5733FF', '#FF33D1', '#8CFF33', '#33FF57',
    '#F033FF', '#FFD133', '#33FFA6', '#FF33A6', '#A6FF33', '#57FF33', '#FF3380', '#F1FF33', '#33FF88', '#8C33FF',
    '#33FFF0', '#B633FF', '#FF5733', '#33FF8C', '#FF3357', '#5733FF', '#FF33D1', '#8CFF33', '#33FF57', '#F033FF',
    '#FFD133', '#33FFA6', '#FF33A6', '#A6FF33', '#57FF33', '#FF3380', '#F1FF33', '#33FF88', '#8C33FF', '#33FFF0',
    '#B633FF', '#FF5733', '#33FF8C', '#FF3357', '#5733FF', '#FF33D1', '#8CFF33', '#33FF57', '#F033FF', '#FFD133',
    '#33FFA6', '#FF33A6', '#A6FF33', '#57FF33', '#FF3380', '#F1FF33', '#33FF88', '#8C33FF', '#33FFF0', '#B633FF',
    '#FF5733', '#33FF8C', '#FF3357', '#5733FF', '#FF33D1', '#8CFF33', '#33FF57', '#F033FF', '#FFD133', '#33FFA6',
    '#FF33A6', '#A6FF33', '#57FF33', '#FF3380', '#F1FF33', '#33FF88', '#8C33FF', '#33FFF0', '#B633FF', '#FF5733',
    '#33FF8C', '#FF3357', '#5733FF', '#FF33D1', '#8CFF33', '#33FF57', '#F033FF', '#FFD133', '#33FFA6', '#FF33A6',
    '#A6FF33', '#57FF33', '#FF3380', '#F1FF33', '#33FF88', '#8C33FF', '#33FFF0', '#B633FF', '#FF5733', '#33FF8C',
    '#FF3357', '#5733FF', '#FF33D1', '#8CFF33', '#33FF57', '#F033FF', '#FFD133', '#33FFA6', '#FF33A6', '#A6FF33',
    '#57FF33', '#FF3380', '#F1FF33', '#33FF88', '#8C33FF', '#33FFF0', '#B633FF', '#FF5733', '#33FF8C', '#FF3357',
    '#5733FF', '#FF33D1', '#8CFF33', '#33FF57', '#F033FF', '#FFD133', '#33FFA6', '#FF33A6', '#A6FF33', '#57FF33',
    '#FF3380', '#F1FF33', '#33FF88', '#8C33FF', '#33FFF0', '#B633FF', '#FF5733', '#33FF8C', '#FF3357', '#5733FF',
    '#FF33D1', '#8CFF33', '#33FF57', '#F033FF', '#FFD133', '#33FFA6', '#FF33A6', '#A6FF33', '#57FF33', '#FF3380',
    '#F1FF33', '#33FF88', '#8C33FF', '#33FFF0', '#B633FF', '#FF5733', '#33FF8C', '#FF3357', '#5733FF', '#FF33D1',
    '#8CFF33', '#33FF57', '#F033FF', '#FFD133', '#33FFA6', '#FF33A6', '#A6FF33', '#57FF33', '#FF3380', '#F1FF33',
    '#33FF88', '#8C33FF', '#33FFF0', '#B633FF'
];

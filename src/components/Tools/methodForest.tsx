import $ from 'jquery';
import { _error_ } from './constants';

/** Id generator */
export const generateIdFunc = (x?: { length: number }) => {
    const val = '0aW9zXe8CrVt1By5NuA46iZ3oEpRmTlYkUjIhOgPfMdQsSqDwFxGcHvJbKnL';
    const length = (x?.length !== undefined) ? x.length : val.length;
    let id = '';
    for (var i = 0; i < length; i++) id += val.charAt(Math.floor(Math.random() * 36));
    return id;
};

/** Animate modal */
export const animateModalFunc = (x: { scaffold: string, container: string, show: boolean }) => {
    const scaffold = x.scaffold;
    const container = x.container;
    const show = x.show;
    if (show) {
        const d = 100;
        $(`${scaffold}`).animate({ 'opacity': 1 }, d);
        $(`${container}`).animate({}, d);
        $(`${container}`).animate({ 'scale': 1 }, d);
        $(`${scaffold}`).css({ 'top': 0 });
    } else {
        const d = 90;
        $(`${container}`).css({ 'scale': 1.00001 });
        $(`${container}`).animate({}, d);
        $(`${container}`).animate({ 'scale': 0.85 }, d);
        $(`${scaffold}`).animate({}, d);
        $(`${scaffold}`).animate({ 'opacity': 0 }, d, () => {
            $(`${scaffold}`).css({ 'top': '100vh' });
            $(`${container}`).css({ 'scale': 1.3 });
        });
    }
};

/** Split string into chunks  */
export const stringToChunksFunc = (x: { data: string, length: number }) => { return (x.data).match(new RegExp(`.{1,${x.length}}`, 'g')) };





/* ------------------------------------------------------ Cipher using AES-256-GCM algo ------------------------------------------------------ */

/** - */
const bufferToHexFunc = (x: { data: any }) => {
    const byteArray = new Uint8Array(x.data);
    let hexString = '';
    for (let i = 0; i < byteArray.length; i++) { const hex = byteArray[i].toString(16).padStart(2, '0'); hexString += hex }
    return hexString;
    // return Array.from(new Uint8Array(x.buffer)).map((b) => b.toString(16).padStart(2, '0')).join('')
};
const hexToBufferFunc = (x: { data: any }) => {
    const hex = x.data, len = hex.length, buffer = new Uint8Array(len / 2);
    for (let i = 0; i < len; i += 2) { buffer[i / 2] = parseInt(hex.substr(i, 2), 16) }
    return buffer;
};
const generateKeyFunc = async () => {
    const tagLength = 128;
    return await crypto.subtle.generateKey({ name: 'AES-GCM', length: tagLength }, true, ['encrypt', 'decrypt']);
};
const cipherStringToChunksFunc = (x: { data: string }) => {
    const data = x.data;
    const dataLength = data.length;
    let len = 0;

    const dv = Math.ceil(dataLength / 9);
    len = (dv < 5) ? 5 : dv;

    let tab: any[] = [];
    for (let i = 0; i < dataLength; i += len) { tab.push(data.slice(i, (i + len))) }

    const res = String(tab.length) + String((tab.length > 1) ? tab.join('-') : tab[0]);
    return res;
};
const cipherMixerFunc = async (x: { data: string, key: string, iv: string, authTag: string }) => {
    const data = x.data, key = x.key, iv = x.iv, authTag = x.authTag;
    const fk = bufferToHexFunc({ data: crypto.getRandomValues(new Uint8Array(20)) });

    /* Mix "data" */
    const inversed0 = data.split('').reverse().join('');
    const dataChunks = cipherStringToChunksFunc({ data: inversed0 });

    /* Mix "key" */
    const inversed1 = key.split('').reverse().join('');
    const keyChunks = cipherStringToChunksFunc({ data: inversed1 });

    /* Mix "iv" */
    const inversed2 = iv.split('').reverse().join('');
    const ivChunks = cipherStringToChunksFunc({ data: inversed2 });

    /* Mix "authTag" */
    const inversed3 = authTag.split('').reverse().join('');
    const authTagChunks = cipherStringToChunksFunc({ data: inversed3 });

    /* Mix "fk" */
    const inversed4 = fk.split('').reverse().join('');
    const fkChunks = cipherStringToChunksFunc({ data: inversed4 });

    /* - */
    const res = [fkChunks, ivChunks, authTagChunks, dataChunks, keyChunks].join('-');
    return res;
};
const cipherDemixerFunc = (x: { data: string }) => {
    let data = x.data;
    let tab = data.split('-');

    /* Extract "fk" */
    const n0 = parseInt(data[0]);
    const d0 = (tab.splice(0, n0)).join('');
    const fk = d0.slice(1).split('').reverse().join('');
    data = tab.join('-'); tab = data.split('-');

    /* Extract "iv" */
    const n1 = parseInt(data[0]);
    const d1 = tab.splice(0, n1).join('');
    const iv = d1.slice(1).split('').reverse().join('');
    data = tab.join('-'); tab = data.split('-');

    /* Extract "authTag" */
    const n2 = parseInt(data[0]);
    const d2 = tab.splice(0, n2).join('');
    const authTag = d2.slice(1).split('').reverse().join('');
    data = tab.join('-'); tab = data.split('-');

    /* Extract "data" */
    const n3 = parseInt(data[0]);
    const d3 = tab.splice(0, n3).join('');
    const data1 = d3.slice(1).split('').reverse().join('');
    data = tab.join('-'); tab = data.split('-');

    /* Extract "key" */
    const n4 = parseInt(data[0]);
    const d4 = tab.splice(0, n4).join('');
    const key = d4.slice(1).split('').reverse().join('');

    return { data: data1, key: key, iv: iv, authTag: authTag };
};

/** Cipher */
export const cipherFunc = async (x: { data: string }) => {
    try {
        const data = x.data;
        const key = await generateKeyFunc();
        const iv = crypto.getRandomValues(new Uint8Array(12)); /* 96-bit nonce */
        const tagLength = 128;

        /* Encrypt */
        const text = new TextEncoder().encode(data);
        const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv, tagLength: tagLength }, key, text);

        /* Get authTag */
        const authTagLength = 16; /* The authTag is the last 16 bytes of the ciphertext (for a 128-bit tag) */
        const ciphertextArray = new Uint8Array(ciphertext); /* Convert ciphertext to a Uint8Array */
        const authTag = ciphertextArray.slice(ciphertextArray.length - authTagLength);

        /* Export key */
        const keyExported = await crypto.subtle.exportKey('raw', key);

        /* - */
        const res = bufferToHexFunc({ data: ciphertext });
        const fkey = bufferToHexFunc({ data: keyExported });
        const fiv = bufferToHexFunc({ data: iv });
        const fauthTag = bufferToHexFunc({ data: authTag });

        /* - */
        const mix = await cipherMixerFunc({ data: res, key: fkey, iv: fiv, authTag: fauthTag });
        return mix;

    } catch (e: any) { return { status: _error_, data: e.message } }
};

/** Decipher */
export const decipherFunc = async (x: { data: string }) => {
    try {
        const demixed = cipherDemixerFunc({ data: x.data });
        const data = demixed.data, key = demixed.key, iv = demixed.iv, authTag = demixed.authTag;

        /* Get buffer */
        const bdata = hexToBufferFunc({ data: data });
        const bkey = hexToBufferFunc({ data: key });
        const biv = hexToBufferFunc({ data: iv });

        /* Import key */
        const dkey = await crypto.subtle.importKey('raw', bkey, 'AES-GCM', true, ['decrypt']);

        /* Decrypt */
        const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: biv, tagLength: 128 }, dkey, bdata);
        const decipherText = new TextDecoder().decode(decrypted);

        return { data: decipherText };

    } catch (e: any) { return { status: _error_, data: e } }
};
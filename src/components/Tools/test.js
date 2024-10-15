// const wid = 'diddy';
// const ref = { current: '10 12 14 Bureau !' };

// const ob = JSON.parse(`{"${wid}": ""}`);
// ob[wid] = ref;
// const d = Object.assign({ id: 'u' }, ob);

// console.log(d);


let refIdStore = {};

const wid = 'kevin', obj = JSON.parse(`{"${wid}": ""}`);
obj[wid] = { current: 'a' };
refIdStore = Object.assign(refIdStore, obj);

console.log('ref 0 ::', refIdStore);


const wid1 = 'hamet', obj1 = JSON.parse(`{"${wid1}": ""}`);
obj1[wid1] = { current: 'b' };
refIdStore = Object.assign(refIdStore, obj1);

console.log('ref 1 ::', refIdStore);
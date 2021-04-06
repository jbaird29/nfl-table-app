const { v5: uuidv5 } = require('uuid');

// module.exports.createSID = (saveDataJSON) => {
//     const unique = '51d37bbb-b62c-4f24-a1e6-d0778d7d7deb';
//     const hexID = uuid.v5(saveDataJSON, unique).replaceAll('-', '')
//     const base64 = btoa(hexID.slice(0,30).match(/\w{2}/g).map(a => String.fromCharCode(parseInt(a, 16))).join(""))
//     const urlEncode = base64.replaceAll('+', '-').replaceAll('/', '~')
//     return urlEncode
// }


// https://www.npmjs.com/package/btoa
const btoa = (str) => {
    var buffer;
    if (str instanceof Buffer) {
        buffer = str;
    } else {
        buffer = Buffer.from(str.toString(), 'binary');
    }
    return buffer.toString('base64');
}


module.exports = function createSID(saveDataJSON) {
    const unique = '51d37bbb-b62c-4f24-a1e6-d0778d7d7deb';
    const hex = uuidv5(saveDataJSON, unique).replace(/-/g, '').slice(0,30)  // need to shorten to 30 digits to encode in base64
    const base64 = btoa(hex.match(/\w{2}/g).map(a => String.fromCharCode(parseInt(a, 16))).join(""))
    const urlEncode = base64.replace(/\+/g, '-').replace(/\//g, '~')
    return urlEncode
}

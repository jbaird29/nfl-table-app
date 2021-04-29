const base32 = require("base32");

module.exports = function createSID(saveDataJSON) {
    return base32.sha1(saveDataJSON).slice(0, 20);
};

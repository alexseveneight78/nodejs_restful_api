/*
helpers for various tasks
*/
// dependencies 
const crypto = require('crypto');
const config = require('../config');

// container for all the helpers 
const helpers = {};

// create a SHA256 hash 
helpers.hash = (str) => {
    if(typeof(str) == 'string' && str.length > 0) {
        let hash = crypto.createHmac('sha256',config.hashingSecret).update(str).digest('hex');
        return hash;
    } else {
        return false;
    }
};

// parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = (str) => {
    try{
        let obj = JSON.parse(str);
        return obj;
    } catch(e) {
        return {};
    }
};

module.exports = helpers;
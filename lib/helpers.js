/*
helpers for various tasks
*/
// dependencies 
const crypto = require('crypto');
const { createBrotliCompress } = require('zlib');
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

// create string of random alphanumeric characters of a given length
helpers.createRandomString = (strLength) => {
    strLength = typeof(strLength == 'number' && strLength > 0 ? strLength : false);
    if(strLength){
        // define al lthe possible characters  that could go into a string 
        let possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

        // start the final string
        let str = '';
        for(i=1; i <= strLength; i++){
            // get a random character from the possible characters string 
            let randomCharacter = 

            // append this character to the final string 
            str += randomCharacter;possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length))
        }
        // return the final string 
        return str;
    } else {
        return false;
    }
};

module.exports = helpers;
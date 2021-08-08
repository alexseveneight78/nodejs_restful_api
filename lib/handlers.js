/*
Request handlers
*/

// dependencies 
const _data = require('./data')
const helpers = require('./helpers');

let handlers = {};

// users 

handlers.users = (data, cb) => {
    let acceptableMethods = ['post','get','put','delete'];
    if(acceptableMethods.indexOf(data.method) > -1){ // if one of methods from a variable acceptableMethods exists
        handlers._users[data.method](data,cb);
    } else {
        cb(405);
    }
};
// container for the users submethods 
handlers._users = {};

// users - post 
// required data: firstName, lastName, phone, password, tosAgreement
// optional data: none
handlers._users.post = (data,cb) => {
    // check that all required fields are filled out 
    let firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    let lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    let phone = typeof(data.payload.phone) == 'string' /*&& data.payload.phone.trim().length == 10*/ ? data.payload.phone.trim() : false;
    let password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    let tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;

    console.log(firstName, lastName,phone,password,tosAgreement);
    console.log(firstName && lastName && phone && password && tosAgreement)

    if(firstName && lastName && phone && password && tosAgreement) {
        // make sure that the user doesn`t already exist 
        _data.read('users',phone,(err,data) => {
            if(err){
                // hash the password 
                let hashedPassword = helpers.hash(password);

                // create the user object
                if(hashedPassword) {
                    let userObject = {
                        'firstName' : firstName,
                        'lastName' : lastName,
                        'phone' : phone,
                        'hashedPassword' : hashedPassword,
                        'tosAgreement' : true
                    };
    
                    // store the user 
                    _data.create('users',phone,userObject,(err) => {
                        if(!err){
                            cb(200);
                        } else {
                            cb(500,{ 'Error' : 'Could not create a new user' })
                        }
                    });               
                } else {
                    cb(500, { 'Error' : 'Couldn`t hash the users` password' })
                }
            } else {
                // user already exists 
                cb(400,{'Error': 'A user with that phone number already exists'});
            };
        });
    } else {
        cb(400, {'Error' : 'Missing required fields'});
    };
};

// users - get
// required data: phone
// optional data: none
// @TODO Onlye let an authenticated user access their object. Don`t let them access anyone else's 
handlers._users.get = (data,cb) => {
    //console.log(data.queryStringObject.get('phone')) - https://nodejs.org/api/url.html#url_new_url_input_base
    // check taht the phone number is valid 
    let phone = typeof(data.queryStringObject.get('phone')) == 'string' ? data.queryStringObject.get('phone').trim() : false; /*&& data.queryStringObject.phone.trim().length == 10;*/
    
    if(phone) {
        // lookup the user
        _data.read('users', phone, (err,data) => {
            if(!err && data){
                // remove the hashed password from the user object before returning it to the requester 
                delete data.hashedPassword;
                cb(200, data);
            } else {
                cb(404)
            }
        })
    } else {
        cb(400,{'Error':'Missing required field'})
    }
};
// users - put
// required data: phone 
// optional data: firstName, lastName,password (at least 1 must be specified)
// TODO: Only let an authenticated user update their own objec. Don`t let them update anyone else`s
handlers._users.put = (data,cb) => {
    // Check for the required field
    let phone = typeof(data.payload.phone) == 'string' ? data.payload.phone.trim() : false; /*&& data.queryStringObject.phone.trim().length == 10;*/

    // check for the optional fields 
    let firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    let lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    let password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    // error if the phone is invalid 
    if(phone) {
        // error if nothing sent to update
        if(firstName || lastName || password) {
            // lookup the user 
            _data.read('users',phone,(err,userData) => {
                if(!err && data) {
                    // updtae the fields necessary
                    if(firstName) {
                        userData.firstName = firstName;
                    }
                    if(lastName) {
                        userData.lastName = lastName;
                    }
                    if(password){
                        userData.hashedPassword = helpers.hash(password);
                    }
                    // store the new updates 
                    _data.update('users',phone,userData,(err) => {
                        if(!err){
                            cb(200);
                        } else {
                            cb(500, {'Error': 'Couldn`t update the user'});
                        }
                    })
                } else {
                    cb(400,{'Error': 'The specified user doesn`t exist'})
                }
            })
        } else {
            cb(400,{'Error': 'Missing fields to update'})
        }
    } else {
        cb(400, {'Error': 'Missing required field'})
    }
};
// users - delete
// required fields: phone
// TODO: Only let an authenticated user delete their objects . Don`t let them delete anyone else`s.
// TODO: Cleanup (delete) any other data files associated with this user
handlers._users.delete = (data,cb) => {
    // check that the phone number is valid
    let phone = typeof(data.queryStringObject.get('phone')) == 'string' ? data.queryStringObject.get('phone').trim() : false; /*&& data.queryStringObject.phone.trim().length == 10;*/
    
    if(phone) {
        // lookup the user
        _data.read('users', phone, (err,data) => {
            if(!err && data){
                _data.delete('users', phone, (err) => {
                    if(!err){
                        cb(200);
                    } else {
                        cb(500, {'Error': 'Couldn`t delete the specified user'})
                    }
                })
            } else {
                cb(400, {'Error': 'Cpuldn`t find the specified user'})
            }
        })
    } else {
        cb(400,{'Error':'Missing required field'})
    }
};

// ping handler 
handlers.ping = (data, cb) => {
    cb(200);
};

// not found handler 

handlers.notFound = (data, callback) => {
    callback(404);
};

module.exports = handlers;
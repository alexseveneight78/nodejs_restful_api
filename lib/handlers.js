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
handlers._users.get = (data,cb) => {
    
};
// users - put
handlers._users.put = (data,cb) => {
    
};
// users - delete
handlers._users.delete = (data,cb) => {
    
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
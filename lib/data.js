/* 
Library to store and editing data
*/

// dependencies 
const fs = require('fs');
const { parse } = require('path');
const path = require('path');
const helpers = require('./helpers');

// container for the module

let lib = {};

// base directory of the data folder 
lib.baseDir = path.join(__dirname,'../.data/'); // ??? 

// write data to a file 
lib.create = (dir,file,data,cb) => {
    // open the file for writing 
    fs.open(lib.baseDir + dir + '/' + file + '.json', 'wx', (err, fileDescriptor) => {
        if(!err && fileDescriptor) {
            // convert data to string 
            let stringData = JSON.stringify(data);

            // write to file and close it
            fs.writeFile(fileDescriptor, stringData, (err) => {
                if(!err){
                    fs.close(fileDescriptor, (err) => {
                        if(!err){
                            cb(false);
                        } else {
                            cb('Error closing new file')
                        }
                    })
                } else {
                    cb('Error writing to new file')
                }
            })
        } else {
            cb('Could not create new file, it may already exist')
        }
    });
    //
};

// read data from file 
lib.read = (dir,file,cb) => {
    fs.readFile(lib.baseDir + dir + '/' + file + '.json', 'utf-8', (err,data) => {
        if(!err && data) {
            let parsedData = helpers.parseJsonToObject(data);
            cb(false, parsedData);
        } else {
            cb(err,data);
        }
    });
};

// updating an existing file 
lib.update = (dir,file,data,cb) => {
    // open the file for writing 
    fs.open(lib.baseDir + dir + '/' + file + '.json', 'r+', (err, fileDescriptor) => {
        if(!err && fileDescriptor){
            let stringData = JSON.stringify(data);

            // truncate the file
            fs.ftruncate(fileDescriptor, (err) => {
                if(!err) {
                    // write ti the file and close it
                    fs.writeFile(fileDescriptor, stringData, (err) => {
                        if(!err){
                            fs.close(fileDescriptor, (err) => {
                                if(!err){
                                    cb(false);
                                } else {
                                    cb('Error closing file')
                                }
                            })
                        } else {
                            cb('Error writing to existing file')
                        }
                    })
                } else {    
                    cb('Error truncating file')
                }
            });
        } else {
            cb('Could not open the file for updating, it may not exist yet.')
        }
    });
};

// delete a file 
lib.delete = (dir, file, cb) => {
    // unlink the file 
    fs.unlink(lib.baseDir + dir + '/' + file + '.json',(err) => {
        if(!err){
            cb(false);
        } else {
            cb('Error while unlinking');
        }
    });
};

// export the module 
module.exports = lib;
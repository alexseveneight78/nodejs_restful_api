/*
create and export configuration variables
*/

// container for all the einvironments 
const environments = {};

// staging (default) environment 
environments.staging = {
    'port' : 3000,
    'envName' : 'staging'
};

// production environment
environments.production = {
    'port' : 5000,
    'envName' : 'production'
};

// determine which environment was passed as a command-line argument
let currentEnv = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// check that the current environment is one of the environments above . if not, default to staging 
let environmentToExport = typeof(environments[currentEnv]) == 'object' ? environments[currentEnv] : environments.staging;

// export the module 
module.exports = environmentToExport;
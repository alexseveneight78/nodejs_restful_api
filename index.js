// Dependencies 
const http = require('http');
const https = require('https');
const querystring = require('querystring');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const fs = require('fs');

const config = require('./config');

// Instantiate the HTTP server
let httpServer = http.createServer(function(req,res) {
    unifiedServer(req,res)
});

// Start the HTTP server and have it listen to port 3000 
httpServer.listen(config.httpPort, () => {
    console.log(`The server is listening on port ${config.httpPort}`)
}); // SET NODE_ENV=production

// Instantiate the HTTPS server 
let httpsServerOptions = {
    'key': fs.readFileSync('./https/-key.pem'),
    'cert': fs.readFileSync('./https/cert.pem')
};
let httpsServer = https.createServer(httpsServerOptions,function(req,res) {
    unifiedServer(req,res)
});

// Start the HTTPS server 
httpsServer.listen(config.httpsPort, () => {
    console.log(`The server is listening on port ${config.httpsPort}`)
}); 

// all the server logic for http and https servers
let unifiedServer = (req,res) => {
    // get tje url and parse it
    let parsedUrl = new URL(req.url, "http://localhost:3000/foo?fizz=buzz")

    // get the path 
    let path = parsedUrl.pathname;
    let trimmedPath = path.replace(/^\/+|\/+$/g, "");

    // get the query string as an object 
    let queryStringObject = parsedUrl.searchParams;

    // get the HTTP method 
    let method = req.method;

    // get the payload if any 
    let decoder = new StringDecoder('utf-8');
    let buffer = '';

    req.on('data', (data) => {
        buffer += decoder.write(data);
    });

    req.on('end', () => {
        buffer += decoder.end();

        // choose the handler this request should go to. If one is not found, use the notFound handler
        let chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // construct the data object to send to the handler 
        let data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject': queryStringObject,
            'method' : method,
            //'headers' : headers,
            'payload' : buffer
        };

        // route the request to the handler specified in the router
        chosenHandler(data, (statusCode, payload) => {
            // use the status code called back by the handler or default to 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
            // use the payload called back by the handler or default to an empty object
            payload = typeof(payload) == 'object' ? payload : {};
            // convert the payload to a string 
            let payloadString = JSON.stringify(payload);
            // return the response 
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            // send the response 
            res.end(payloadString); 
        });
    })
};

// define the handlers 

let handlers = {};

// sample handler 

handlers.sample = (data, callback) => {
    // callback a http status code and a payload object
    callback(406, {'name': 'sample handler'});
};

// not found handler 

handlers.notFound = (data, callback) => {
    callback(404);
};

// define a request router 
let router = {
    'sample': handlers.sample
};

/*
set OpenSSL environment for current session only: 

set OPENSSL_CONF=C:\OpenSSL-Win64\bin\openssl.cfg
set Path=%Path%;C:\OpenSSL-Win64\bin

command for SSL cert creation: openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout -key.pem -out cert.pem
*/
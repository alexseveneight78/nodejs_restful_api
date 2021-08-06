// Dependencies 
const http = require('http');
const querystring = require('querystring');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

const config = require('./config');

// The server should respond to all requests with a string 
let server = http.createServer(function(req,res) {
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
    

    // logthe request path
    // console.log('path', path);
    // console.log('trimmed path', trimmedPath);
    // console.log(queryStringObject);
    // console.log(req.headers)

});

// Start the server and have it listen to port 3000 
server.listen(config.port, () => {
    console.log(`The server is listening on port ${config.port} in ${config.envName} mode`)
}); // SET NODE_ENV=production

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
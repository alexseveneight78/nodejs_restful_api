// Dependencies 
let http = require('http');
let url = require('url');


// The server should respond to all requests with a string 
let server = http.createServer(function(req,res) {
    // get tje url and parse it
    let parsedUrl = new URL(req.url, "http://localhost:3000/")

    // get the path 
    let path = parsedUrl.pathname;
    let trimmedPath = path.replace(/^\/+|\/+$/g, "")

    // get the HTTP method 
    let method = req.method;

    // send the response 
    res.end('Hello World!\n')

    // logthe request path
    console.log('Request recreived on trimmed path: ' + trimmedPath + ' with the method ' + method);
    console.log('Request recreived on path: ' + path);
    console.log('Request recreived with url: ' + parsedUrl);

});

// Start the server and have it listen to port 3000 
server.listen(3000, () => {
    console.log('The server os listening on port 3000 now')
})
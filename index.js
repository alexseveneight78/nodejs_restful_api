// Dependencies 
let http = require('http');

// The server should respond to all requests with a string 
let server = http.createServer(function(req,res) {
    res.end('Hello World!\n')
});

// Start the server and have it listen to port 3000 
server.listen(3000, () => {
    console.log('The server os listening on port 3000 now')
})
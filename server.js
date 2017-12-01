const http = require('http');
const router = require('./router');

http.createServer(router).listen(3005);
console.log('Server startet. Port: 3005'); 
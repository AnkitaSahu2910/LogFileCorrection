const hostname = '127.0.0.1';
const port = 8000;
const http = require('http');
const checkLogFile = require("./logFileService.js");
const server = http.createServer((req, res) => {
   checkLogFile.checkLogFile(req,res);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
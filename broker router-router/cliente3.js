const zmq = require('zermq');
let req = zmq.socket('req');
let url = " tcp://localhost:";

let args = process.argv.slice(2);
let port = url+args[0];
req.identity = args[1];
let peti = args[2];

req.connect(port);
req.on('message', (msg)=> {
  console.log('repsuesta: '+msg);
  process.exit(0);
})
req.send(peti);
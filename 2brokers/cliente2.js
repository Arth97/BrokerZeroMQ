const zmq = require('zeromq');
let req = zmq.socket('req');
req.identity = 'Cli2';

req.connect('tcp://localhost:8000');
req.on('error', (err)=> console.log("Prueba otra vez"));

req.on('message', (reply)=> {
  console.log(reply+"\n");
  process.exit(0);
});
req.send("Hola, soy Cli2");
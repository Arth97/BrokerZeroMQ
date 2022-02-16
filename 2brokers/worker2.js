const zmq = require('zeromq');
let req = zmq.socket('req');
req.identity = 'Work2';

req.connect('tcp://localhost:9000');
req.on('error', (err)=> console.log("Prueba otra vez crack\n"));

req.on('message', (c,sep,msg)=> {
  console.log(msg+" by: "+c+"\n");
  console.log("Log anterior deberia ser 'Hola, soy CliX'\n");
  let reply = "Work2: Respondo a "+c;
  req.send([c,'',reply]);
})
//Alta
req.send(['','','']);

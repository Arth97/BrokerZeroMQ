const zmq = require('zeromq');
let req = zmq.socket('req')

args = process.argv.slice(2);
let port = 'tcp://localhost:'+args[0];
req.identity = args[1];
let reply = args[2];

req.connect(port);
req.on('message', (c,sep,msg)=> {
  console.log("The msg is "+msg+" and the rply "+reply)
  setTimeout(()=> {
    req.send([c,'',reply])
  }, 1000)
})
req.send(['','',''])
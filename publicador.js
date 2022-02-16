const zmq = require('zeromq');
let pub = zmq.socket('pub');

if(process.argv.length < 4){
  console.log("Faltan argumentos");
  process.exit(0);
}
let args = process.argv.slice(2);

let port = args[0];
pub.bind('tcp://*:'+args[0]);

let nmsg = args[1];

args = args.slice(2)
let msg = [...args];

function emite() {
  let m = msg[0];
  console.log(m)
  pub.send(m);
  msg.shift(); msg.push(m);
}

for (i=0; i<=nmsg; i++) {
  setTimeout(emite, i*1000)
}
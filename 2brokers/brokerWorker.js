const { setInterval } = require('timers');
const zmq = require('zeromq');

let sb = zmq.socket('dealer');
let sw = zmq.socket('router');

let wrks = [];
let msgs = [];
let cli = [];

sb.connect('tcp://localhost:8080')
sw.bind('tcp://*:9000', (err) =>{
  console.log(err ? 'Failed bind sw 9000':'Connected to 9000')
})

sb.on('message', (c,sep,msg)=> {
  console.log(c+" "+msg);
  cli.push(c);
  msgs.push(msg);
});

sw.on('message', (w,sep,c,sep2,reply)=> {
  if(c=='') {
    wrks.push(w); 
    console.log(w+" se ha dado de alta");
    return;
  }
  sb.send([c,'',reply]);
  wrks.push(w);
});

setInterval(()=>  {
  if(wrks.length!=0 && cli.length!=0) {
    sw.send([
      wrks.shift()
      ,'',
      cli.shift()
      ,'',
      msgs.shift()
    ]);
  }
},2000);

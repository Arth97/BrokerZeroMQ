const zmq = require('zeromq');

let sc = zmq.socket('router');
let sb = zmq.socket('dealer');

let cli = [];

sc.bind('tcp://*:8000', (err) =>{
  console.log(err ? 'Failed bind sc 8000':'Connected to 8000')
})
sb.bind('tcp://*:8080', (err) => {
  console.log(err ? 'Failed bind sb 8080':'Connected to 8080')  
})

sc.on('message', (c,sep,msg)=> {
  cli.push(c);
  sb.send([c,'',msg]);
})

sb.on('message', (c,sep,reply)=> {
  if (cli.length>0 /*&& cli[0]==c */) {
    sc.send([c,'',reply]);
  }
})

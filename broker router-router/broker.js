const zmq = require('zmq');
let cli=[], req=[], workers=[];
let sc = zmq.socket('router');
let sw = zmq.socket('router');
let url = "tcp://localhost:";
let args = process.argv.slice(2);
let scPort = args[0];
let swPort = args[1];

sc.bind(url+scPort);
sw.bind(url+swPort);

sc.on('message', (c,sep,m)=> {
  if (workers.length==0)  {
    cli.push(c);
    req.push(m);
  } else  {
		sw.send([workers.shift(),'',c,'',m])
	}
})

sw.on('message',(w,sep,c,sep2,r)=> {
  if (c=='') {workers.push(w); return}
	if (cli.length>0) { 
		sw.send([w,'',cli.shift(),'',req.shift()])
	} else {
		workers.push(w)
	}
	sc.send([c,'',r])
})

const zmq = require('zeromq')
let sub = zmq.socket('sub')
sub.connect('tcp://127.0.0.1:8000')
sub.subscribe('dos')
sub.on('message', (m) => 
	{console.log('2',m+'')})

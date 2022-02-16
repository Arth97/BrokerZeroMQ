const zmq = require('zeromq')
let req = zmq.socket('req')

req.identity = 'Worker ' + process.pid

req.connect('tcp://localhost:49209')

req.on('error', (err) => {
    console.log('ERROR')
})

req.on('message', (...data)=>{
    let c = data[0], m = data[2]
    console.log('Message received: '+ m + ' from: ' + c)
    setTimeout(() => {
        req.send([c,'','answer'])
    }, 1000);
})
let msg = ['reg']
console.log('Register msg: '+ msg)
req.send(msg)
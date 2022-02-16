const zmq = require('zeromq')
let req = zmq.socket('req')

req.identity = 'Client ' + process.pid

req.connect('tcp://localhost:49208')

req.on('error', (err)=>{
    console.log('ERROR')
})

req.on('message', (data)=>{
    console.log('Answer: '+ data)
    process.exit(0)
})
req.send('Hola')
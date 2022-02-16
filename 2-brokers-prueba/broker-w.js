/* ESTE BROKER SE ENCARGA DE LOS WORKERS, AQUÍ LLEGAN LOS MENSAJES DE LOS CLIENTES VÍA EL BROKER-C
   Y SON REDIRIGIDOS A LOS WORKERS PARA QUE GESTIONEN LA PETICIÓN(ROUTER), LUEGO DEVUELVEN LA RESPUESTA
   Y EL BROKER-C SE ENCARGA DEL RESTO */
const zmq = require('zeromq')

let workers = []

let sr = zmq.socket('router')
let sd = zmq.socket('dealer')

/* BIND A PUERTOS CORRESPONDIENTES*/
sr.bind('tcp://*:49209', (err) =>{
    console.log(err?'Failed to bind sr at 49209':'Connection succesfull at 49209')
})
sd.connect('tcp://localhost:49210')

/* MENSAJES DE ERROR */
sr.on('error', (err) =>{
    if (err){
        console.log('Error en sr')
    }
})
sd.on('error', (err) =>{
    if(err){
        console.log('Error en sd')
    }
})

/* GESTIÓN DE MENSAJES */
sd.on('message', (...data)=>{
    let id = data[0], m = data[2], w = workers.shift()
    sr.send([w,'',id,'',m])
    console.log('Sending message to worker: "' + w + '"')
})

sr.on('message', (...data)=>{
    let idw = data[0], idc = data[2], m = data[4]
    if(idc == 'reg') { 
        console.log('New worker: ' + idw)
        workers.push(idw)
        sd.send(['Worker disponible'])
    } else { 
        console.log('Answer to ' + idc + ' from: ' + idw); 
        sd.send([idc,'',m]) 
        sd.send(['Worker disponible'])
        workers.push(idw) 
    } 
})

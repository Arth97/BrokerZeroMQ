/* ESTE BROKER SE RESPONSABILIZA DE LOS CLIENTES Y MANTIENE LA COLA DE PETICIONES PENDIENTES
   LOS CLIENTES ENVIAN LAS PETICIONES AQUÍ (ROUTER) Y EL LOS REDIRIGE AL BROKER-W (DEALER REDIRIGE) */

const zmq = require('zeromq')

let req = [], cli = []

let wdisp = 0

let sr = zmq.socket('router')
let sd = zmq.socket('dealer')

/* BIND A PUERTOS CORRESPONDIENTES*/
sr.bind('tcp://*:49208', (err) =>{
    console.log(err?'Failed to bind sc at 49208':'Connection succesfull at 49208')
})
sd.bind('tcp://*:49210', (err) => {
    console.log(err?'Failed to bind sw at 49210':'Connection succesfull at 49210')  
})

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
sr.on('message', (...data) =>{
    let id = data[0], m = data[2]
    console.log('Received: "' + m + '" from: "'+ id + '"')
    if(wdisp) { answer(id,m) }
    else { cli.push(id); req.push(m) }
})

sd.on('message', (...data)=>{
    let id = data[0], m = data[2]
    if(!m) { 
        wdisp++ 
        console.log('Workers availables') 
        if(cli.length > 0){
            id = cli.shift(), m = req.shift()
            answer(id,m)
        }
    } else {
        console.log('Sending answer to client: "' + id +'"')
        sr.send([id,'',m])
    }
})

/* FUNCIONES AUXILIARES */
function answer(id,m){
    console.log('Sending message: "' + m + '" from: "'+ id +'" to broker-w')
    sd.send([id,'',m]) 
    wdisp--
}
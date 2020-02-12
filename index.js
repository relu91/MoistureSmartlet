const Device = require("./app/device")
const mqtt = require("mqtt")
const deviceMap = {}

const client = mqtt.connect("mqtts://boswamp-1.arces.unibo.it",{
    port: 8883,
    rejectUnauthorized: false
})



client.on("connect",() => {
    let start;
    console.log("Connected to application")

    client.subscribe("application/10/device/+/rx",(error) =>{
        if(!error){
            console.log("Application started")
        }else{
            console.log("Error on subscribing",error)
        }
    } )

})

client.on('message', function (topic, message) {
    console.log(topic,message)
    if(!deviceMap[topic]){
        console.log("New candidate device found!")
        const regex = /application\/10\/device\/(?<id>([a-z]|[1-9])*)\/rx/gm;
        const m = regex.exec(topic)
        const id = m.groups.id
        
        const data = JSON.parse(message.toString())
        if (data.object && data.object.Dutycycle_min){
            console.log("New device found!")
            deviceMap[topic] = new Device(id, data.object.Dutycycle_min, client)
            console.log(deviceMap[topic])
        }   
      
    }

})

client.on("error",(err)=>{console.log("Error",err)})

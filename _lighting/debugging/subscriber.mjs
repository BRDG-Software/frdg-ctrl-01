/*
	run w/
		"node subscriber.js"
	use this to see if the messages are being received by the mqtt broker
*/

import fs from 'fs'
import mqtt from 'mqtt'

/*
const options = {
	protocol: 'mqtt',
	host: '172.168.1.141',
	port: '1883',
	client_id: 'uniquo-client-boyo-69',
}
*/

const options = {
	protocol: 'mqtt',
	host: 'broker.emqx.io',
	port: '1883',
	client_id: 'uniquo-client-boyo-69',
	username : 'emqx',
	password : 'public'
}

const client = mqtt.connect(options)
const topic = 'FRDG1/SHLV/leds'

//client.on('message', (topic, message) => {
//  console.log(`Received message on topic ${topic}: ${message}`);
//});

client.on('connect', () => {
  console.log('Connected')
  client.subscribe([topic], () => {
    console.log(`Subscribe to topic '${topic}'`)
  })
})


client.on('message', (topic, payload) => {
  console.log('Received Message:', topic, payload.toString())
})
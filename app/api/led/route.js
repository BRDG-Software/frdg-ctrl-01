/* if experiencing drop outs, try diff quality of services (qos)
https://assetwolf.com/learn/mqtt-qos-understanding-quality-of-service
more on nextjs mqtt:
https://stackoverflow.com/questions/77528026/nextjs-app-route-api-giving-initial-data-on-run-build-normally-in-run-dev
*/

import mqtt from 'mqtt'
export const dynamic = "force-dynamic";

const mqttBroker = process.env.MQTT_BROKER
const mqttPassword = process.env.MQTT_PASSWORD
if ((mqttBroker === undefined) || (mqttPassword === undefined)) {
	console.log("WARNING: mqtt undefined. shelf led will not work")
}

const client = mqtt.connect(mqttBroker, {
		username:'LedController',
		password:mqttPassword
	})


/*
	const client = mqtt.connect('mqtt://broker.emqx.io:1883', {
		username:'emqx',
		password:'public'
	})
*/

client.on('connect', () => {
   const topic = 'FRDG1/SHLV/leds'
   // subscrive
   client.subscribe(topic, err => {
      if (err) {
         console.log(err)
      } else {
         console.log(`Subscribed to topic: ${topic}`)
      }
   })
})


const mqttPublish = (context) => {
  if (client) {
    const { topic, qos, payload } = context;
    client.publish(topic, payload, { qos }, error => {
      if (error) {
        console.log('Publish error: ', error);
      }
    });
  }
};


export async function POST(request) {
	const data = await request.json()
	const ledmsg = data.ledmsg
	console.log(`received led change message: ${ledmsg}`)

	const outmessage = {
		topic: 'FRDG1/SHLV/leds',
		qos: 0,
		payload: ledmsg
	}

	mqttPublish(outmessage)
	//let respon = `{message: "${ledmsg}"}`
	//const respondo = js 
	//return new Response.json({ message: ${ledmsg}}, {status: 200})
	return new Response(`message received: ${ledmsg}`, {status: 200})
}
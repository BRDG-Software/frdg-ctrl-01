import fs from 'fs'
import mqtt from 'mqtt'

const options = {
  protocol: 'mqtt',
  host: '172.168.1.141',
  port: '1883',
  client_id: 'uniquo-client-boyo-420',
  username:'frig-test-publisho',
  password:'public'
}

/*
const options = {
	protocol: 'mqtt',
	host: 'broker.emqx.io',
	port: '1883',
	client_id: 'uniquo-client-boyo-23',
	username : 'emqx',
	password : 'public'
}
*/
const client = mqtt.connect(options)

//client.publish('cluster/messages/test430', 'sup hivemind');

/*
client.publish('cluster/messages/test420', 'squirrel', { retain: true }, (err) => {
  if (err) {
    console.error('Failed to publish message:', err);
  } else {
    console.log('Message published with retain flag set to true');
  }
});
*/
    //product light
//const msg = '001003T000255000000000W000000'
//const msg = '001003T000255000255000W000000'

    //pictolight
//const msg = '001003D000010000000255W000000'
const msg = '001003D000279000000000W000000'
//const msg = '001003D000279000255000W000000'
//const msg = '001003D100278255000000W000000'
//const msg = '001003D0100112250000W000000'

client.publish('FRDG1/SHLV/leds', msg, { retain: true }, (err) => {
  if (err) {
    console.error('Failed to publish message:', err);
  } else {
    console.log('Message published with retain flag set to true');
  }
});

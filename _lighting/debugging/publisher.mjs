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

const msg = '255255T000255255255255W000000'
//const msg = '001003T000255255255255W000000'
//const msg = '001003D000279255255255W000000'
//const msg = '001003D000279000000000W000000'

      //product light
  //all product lights on full white
//const msg = '255255T000255255255255W000000'

  //all product lights off
//const msg = '255255T000255000000000W000000'

  //set product light in case 3, shelf 4, to red
//const msg = '003004T000255255000000W000000'

      //pictolight
  //set pictolight pixels 1-10 in case 1, "shelf" 0, to blue 
//const msg = '001000D000010000000255W000000'

  //turn off all pictolight pixels 1-all in case 1, on every shelf
//const msg = '001255D000279000000000W000000'

  //set all pictolight pixels in case 1, shelf 1, to red
//const msg = '001001D000279255000000W000000'

  //set pictolight pixels 100-all in case 3, shelf 4, to white, with animation 2
//const msg = '003004D100279255255255W002000'

  //set pictolight pixel 10 in case 1, "shelf" 0, to red
//const msg = '001000D010011225000000W000000'

client.publish('FRDG1/SHLV/leds', msg, { retain: true }, (err) => {
  if (err) {
    console.error('Failed to publish message:', err);
  } else {
    console.log('Message published with retain flag set to true');
  }
});

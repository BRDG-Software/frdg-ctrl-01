/*
 * ~~~changelog~~~
 * v0.68
 * -if message case id is 255 and shelf is 255 do message
 * -if message case id is this case id and shelf id is 255 do message
 * -if message case id is 255 and shelf id is this shelf id do message 
 * 
 * v0.67
 * -add frdg case prefix
 * 
 * v0.6
 *    - added an additional byte to the api, such that you turn
 *      off/on a specific region of leds
 *    - add temp controls to tuneable leds
 *    - added 2 additional bytes of modifiers at end of message
 * ~~~~~~~~~~~~~~~
 * 
 * shelve lighting controller
 * subscribes to the FRDG MQTT broker
 * listens for a message, then changes lights
 * msg format:
 * [ 001        | 032     | A/T | 000      | 190       | 000 000 000 | W |                 000 000 ] 
 *   case id      shelf id         begin led  end led     color led    warmth / modifiers   cool-warm / modifiers
 * A/T = Addressable Lights or Tuneable Lights
 * [ 003 T 000 255 255 255 255 W 000 000 ]
 * will set shelf 3's  tuneable leds all to maximum bright white
 * 
 * [ 003 A 010 100 255 255 255 ]
 * will set shelf 3's addressable leds from led 10-100 to
 * bright white
 * 
 * 215 LEDS are apprx. 4 feet
*/
#include <FastLED.h>
#include "EspMQTTClient.h"
#include "utils.h"
#define NUM_LEDS 255
#define DATA_PIN D10
CRGB leds[NUM_LEDS];

bool debugPrint = true;

EspMQTTClient client(
  "FRDG-TEST-07",
  "Kevlar2424",
  "broker.emqx.io",  // MQTT Broker server ip
  "emqx",            // username
  "public",   // mqtt password
  "case01led03"      // Client name that uniquely identify your device
);
int caseID  = 1;
int shelfID = 3;
int LEDcurrent = 0;
int caseID_in = 0;
int shelfID_in = 0;
char ledTYPE_in = 'n';
char modTYPE_in ='n';
int ledID_in = 0;
int ledID_begin = 0;
int ledID_end   = 0;
int brightness = 255; //remaps the addressable light brightness
int rgb_in[] = {0,0,0};
int mod_in[] = {0,0};
int rgbOUT[] = {0,0,0};
String inMSG = "001003D255000000200";

void setup() {
  Serial.begin(9600);
  FastLED.addLeds<NEOPIXEL, DATA_PIN>(leds, 300);
  process_Message();
}

void do_addressable() {
  print_it("changing the addressable lights");
  respond();
  for (int i = ledID_begin; i < ledID_end; i++) {
    leds[i].setRGB(rgb_in[1], rgb_in[0], rgb_in[2]);
  }
  Serial.print("ledID_begin: ");
  Serial.println(ledID_begin);
  Serial.print("ledID_end: ");
  Serial.println(ledID_end);
  Serial.print("rgb1 ");
  Serial.println(rgb_in[0]);
  Serial.print("rgb2 ");
  Serial.println(rgb_in[1]);
  Serial.print("rgb3 ");
  Serial.println(rgb_in[2]); 
  /*
  if (ledID_in == 255) {
    print_it("changing all leds");
  
    for (int i = 0; i < NUM_LEDS; i++) {
      leds[i].setRGB(rgb_in[0], rgb_in[1], rgb_in[2]);
    }
   
   
  }
  else {
    print_it("changing single led"); 
    Serial.println(ledID_in);
    leds[ledID_in].setRGB(rgb_in[0], rgb_in[1], rgb_in[2]);
  }
  */
}
void do_tuneable() {
  print_it("changing the tuneable lights");
  respond();
  analogWrite(A0, rgb_in[0]); // r
  analogWrite(A1, rgb_in[1]); // g
  analogWrite(A2, rgb_in[2]); // b
  analogWrite(D3, mod_in[0]); // cool
  analogWrite(D4, mod_in[1]); // warm
  Serial.print("rgb1 ");
  Serial.println(rgb_in[0]);
  Serial.print("rgb2 ");
  Serial.println(rgb_in[1]);
  Serial.print("rgb3 ");
  Serial.println(rgb_in[2]);  
  Serial.println("mod_in 0");
  Serial.println(mod_in[0]);
  Serial.println("mod_in 1");
  Serial.println(mod_in[1]);
}
void process_Message() {
  char incoming[29];
  inMSG.toCharArray(incoming, 29);
  caseID_in  = process_subMSG(incoming, 0);
  shelfID_in = process_subMSG(incoming, 3);
  ledTYPE_in = incoming[6];
  ledID_begin = process_subMSG(incoming, 7);
  ledID_end   = process_subMSG(incoming,10);
  rgb_in[0]   = process_subMSG(incoming,13);
  rgb_in[1]   = process_subMSG(incoming,16);
  rgb_in[2]   = process_subMSG(incoming,19);
  modTYPE_in  = incoming[19];
  mod_in[0]   = process_subMSG(incoming, 23);
  mod_in[1]   = process_subMSG(incoming, 26);
  
  //print_message_parsed();
  if ((caseID_in == caseID)  || (caseID_in == 255)){    
    if ((shelfID_in == shelfID) || (shelfID_in == 255)) {
      if (ledTYPE_in == 'D') {
        do_addressable();
      }
      else if (ledTYPE_in == 'T') {
        do_tuneable();
      }
    }
  }
}

void onConnectionEstablished() {
  client.subscribe("FRDG1/SHLV/leds", [] (const String &payload)  {
    Serial.println(payload);
    inMSG = payload;
    process_Message();
  });
}

void respond() {
   client.publish("FRDG1/SHLV/leds", "shelf 3 did a thing");
}

void loop() {
  client.loop();
  FastLED.show();
}

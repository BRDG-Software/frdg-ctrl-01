/*
 * ~~~changelog~~~
 * v0.73
 * - included pictolight animations
 * - control animations by sending a value in the first mod byte
 * - 0 = no animation, just turn on section 
 * - 1 = sweepy
 * - 2 = grow
 * - 3 = blink
 * - 4 = pulse
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
 * [ 001        | 032     | D/T | 000      | 190       | 000 000 000 | W |                 000 000 ] 
 *   case id      shelf id         begin led  end led     color led    warmth / modifiers   cool-warm / modifiers
 * A/T = Addressable Lights or Tuneable Lights
 * [ 001 003 T 000 255 255 255 255 W 000 000 ]
 * will set case 1 shelf 3's  tuneable leds all to maximum bright white
 * 
 * [ 001 003 D 010 100 255 255 255 ]
 * will set case 1 shelf 3's addressable leds from led 10-100 to
 * bright white
 * 
 * 215 LEDS are apprx. 4 feet
*/
/* ANIMATIONS VARIABLES */
  // Specific to animSweepySweep
uint16_t animationSteps = 50;                 // More steps = smoother animation
float stepDelay = 300.0 / animationSteps;     // Sets the amount of time that the animation takes
  // Specific to animBlinkyblink
uint8_t numBlinks = 5;                        // Sets the number of times the section blinks
uint16_t blinkDelay = 100;                    // Sets the delay between blinks
  // Specific to animPulse
uint8_t numPulses = 7;                        // Sets the number of times the section pulses
uint16_t pulseSpeed = 1;                      // Sets the speed of pulses
uint8_t pulseBrightness = 255;                // Sets the max brightness of a pulse.

#include <FastLED.h>
#include "EspMQTTClient.h"
#include "utils.h"
#define NUM_LEDS 280
#define DATA_PIN D10
CRGB leds[NUM_LEDS];

bool debugPrint = true;
/*
  "mqtt://172.168.1.141",  // MQTT Broker server ip
"172.168.1.141:1883",  // MQTT Broker server ip
  
*/
EspMQTTClient client(
  "FRDG-TEST-07",
  "Kevlar2424",
  "172.168.1.141",  // MQTT Broker server ip
  "case01led03",            // username
  "public",   // mqtt password
  "case01led03"      // Client name that uniquely identify your device
);
/*
EspMQTTClient client(
  "FRDG-TEST-07",
  "Kevlar2424",
  "broker.emqx.io",  // MQTT Broker server ip
  "emqx",            // username
  "public",   // mqtt password
  "case01led03"      // Client name that uniquely identify your device
);
*/
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

bool doing_led = false;

void setup() {
  client.setKeepAlive(60);
  Serial.begin(9600);
  FastLED.addLeds<NEOPIXEL, DATA_PIN>(leds, 300);
  process_Message();
}
void ledOff() {
  FastLED.clear(); FastLED.show();
  rgb_in[0] = 0; rgb_in[1] = 0; rgb_in[2] = 0;
}
void animOff() {
  FastLED.clear(); FastLED.show();
}
void animOn(int begin, int end, int color[]) {
    //These 4 lines are just input validation. Put it somewhere else that could be more useful if you want. Or don't. See if I care.
  begin = constrain(begin, 0, NUM_LEDS - 1);
  end = constrain(end, 0, NUM_LEDS - 1);
  if (begin > end) {
      //GTFO of function if first LED is after last
    return;
  }
  for (int i = begin; i <= end; i++) {
    leds[i] = CRGB(color[1], color[0], color[2]);
  }
  FastLED.show();
}
void animSweepy(int begin, int end, int color[]) {
    // Input validation again. It should go somewhere better
  begin = constrain(begin, 0, NUM_LEDS - 1);
  end = constrain(end, 0, NUM_LEDS - 1);
  if (begin > end) {
      //GTFO of function if first LED is after last
    return;
  }
  int sectionLength = end - begin + 1;
    // Sweeps in with easing
  for (int step = 0; step <= animationSteps; step++) {
    float progress = (float)step / animationSteps;
      // Starts slow, speeds up in the middle, and ends slow.
      // I totally stole the easing formula. Not 100% on how it works.
    float easedProgress = (1.0f - cos(progress * PI)) / 2.0f;
      // animates over the full length of strip
    float currentStartPos = easedProgress * begin;
      // Clears the whole strip between frames of the animation
    FastLED.clear();
      // Draw the section at its current position.
    for (int i = 0; i < sectionLength; i++) {
      int ledIndex = round(currentStartPos) + i;
      if (ledIndex < NUM_LEDS) {
        leds[ledIndex] = CRGB(color[1], color[0], color[2]);
      }
    } 
    FastLED.show();
    delay(stepDelay);
  }
    //Keeps the section illuminated. Should be paired with animOff at some time after. Would be nice as a setting we could send from the pi
  animOn(begin, end, color);
}
void animGrow(int begin, int end, int color[]) {
  // Input validation again. It should go somewhere better
  begin = constrain(begin, 0, NUM_LEDS - 1);
  end = constrain(end, 0, NUM_LEDS - 1);
  if (begin > end) {
      //GTFO of function if first LED is after last
    return;
  }
  int sectionLength = end; //- begin + 1;
    // Sweeps in with easing
  for (int step = 0; step <= animationSteps; step++) {
      // 'progress' goes linearly from 0.0 to 1.0.
    float progress = (float)step / animationSteps;
      // Starts slow, speeds up in the middle, and ends slow.
      // I totally stole the easing formula. Not 100% on how it works.
    float easedProgress = (1.0f - cos(progress * PI)) / 2.0f;
   
    int ledsToLight = easedProgress * sectionLength;
      // Constrains the animation to the length of the section 
    for (int i = 0; i < sectionLength; i++) {
                  // ORIG: beginLED + 1
                  // using ledID_in leads to middle blank error
      int currentLed = 1 + i;
      if (i < ledsToLight) {
        leds[currentLed] = CRGB(color[1], color[0], color[2]);
      } else {
        leds[currentLed] = CRGB::Black;
      }
    }
    FastLED.show();
    delay(stepDelay);
  }
  //Keeps the section illuminated. Should be paired with animOff at some time after. Would be nice as a setting we could send from the pi
  animOn(begin, end, color);
}
void animBlink(int begin, int end, int color[]) {
  int offColor[] = { 0, 0, 0 };
  // Loop 3 times for the blinky blink
  for (int i = 0; i < numBlinks; i++) {
    animOn(begin, end, color);
    delay(blinkDelay);  // Keep it on for 150 milliseconds.

    // Set section to black. Could probably be replaced with animOff or FastLED.clear().
    animOn(begin, end, offColor);
    delay(blinkDelay);
  }
}
void animPulse(int begin, int end, int color[]) {
  for (int z = 0; z < numPulses; z++) {
    for (int b = 0; b <= pulseBrightness; b += 8) {
      for (int i = begin; i <= end; i++) {
        leds[i] = CRGB(color[1], color[0], color[2]);  // Set the base color
        leds[i].nscale8(b);                            // Scale the brightness of the color
      }
      FastLED.show();
      delay(pulseSpeed);  // A small delay to control the speed of the fade
    }

    // Fades it
    for (int b = pulseBrightness; b >= 0; b -= 8) {
      for (int i = begin; i <= end; i++) {
        leds[i] = CRGB(color[1], color[0], color[2]);
        leds[i].nscale8(b);
      }
      FastLED.show();
      delay(pulseSpeed);
    }
    animOff();
    //FastLED.clear(); FastLED.show();
  }
}

void doing_addressable() {
  Serial.println("doing addressable. please  W A I T");
  if (mod_in[0] == 4) {
  animPulse(ledID_begin, ledID_end, rgb_in);
  }
  else if (mod_in[0] == 3) {
    animBlink(ledID_begin, ledID_end, rgb_in);
  }
  else if (mod_in[0] == 2) {
    animGrow(ledID_begin, ledID_end, rgb_in);
  }
  else if (mod_in[0] == 1) {
    animSweepy(ledID_begin, ledID_end, rgb_in);
  }
  delay(1000);
  Serial.println("done doing addressable");
  respond();
  doing_led = false;
  ledOff();
}

void do_addressable() {
  print_it("changing the addressable lights");
  if (mod_in[0] > 0) {
    doing_led = true;
    doing_addressable();
  }
  //respond();
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
  Serial.print("mod in 1: ");
  Serial.println(mod_in[0]);
  Serial.print("mod in 2: ");
  Serial.println(mod_in[1]);
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
    if (doing_led == false) {
      process_Message();
    }
  });
}

void respond() {
   client.publish("FRDG1/SHLV/leds", "shelf 3 did a thing");
}

void loop() {
  client.loop();
  FastLED.show();
}

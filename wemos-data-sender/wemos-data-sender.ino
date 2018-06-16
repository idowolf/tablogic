
/* RestClient simple GET request
 *
 * by Fabiano França (fabianofranca)
 */

#include <RestClient.h>
#include <ArduinoJson.h>
#include <CD74HC4067.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>

#define DHTTYPE           DHT22     // DHT 22 (AM2302)
#define MIC_MUX 2
#define PROXIMITY_MUX 15
#define TEMP_PIN D5
#define SLIDER_MUX 12
#define ANALOG_PIN A0

const int sampleWindow = 50; // Sample window width in mS (50 mS = 20Hz)
unsigned int sample;

RestClient client = RestClient("SERVER_URL");
StaticJsonBuffer<200> jsonBuffer;
JsonObject& data = jsonBuffer.createObject();
JsonObject& miniData = jsonBuffer.createObject();
CD74HC4067 my_mux(D1, D2, D3, D4);  // create a new CD74HC4067 object with its four control pins
DHT_Unified dht(TEMP_PIN, DHTTYPE);

String response;
String jsonString;
char json[200];
char* prefix = "payload=";
char payload[208];

//Setup
void setup() {
  Serial.begin(115200);
  Serial.println("connect to WiFi network");
  client.begin("SSID", "PASSWORD");
  Serial.println("Setup!");

  // Temp. sensor
  dht.begin();

}

void loop(){
  response = "";
  int micRead = getMicValueDb();
  Serial.print(micRead);
  Serial.print("\t");
  data["mic"] = micRead;
  int proxRead = getProxValue();
  Serial.print(proxRead);
  Serial.print("\t");
  data["prox"] = proxRead;
  float tempRead = getTemp();
  Serial.print(tempRead);
  Serial.print("\t");
  data["temp"] = tempRead;
  float humRead = getHum();
  Serial.print(humRead);
  Serial.print("\t");
  data["hum"] = humRead;
  int sliderRead = getSlider();
  Serial.println(sliderRead);
  data["slider"] = sliderRead;
  data["deviceId"] = "1";
  data.printTo(json);
//  Serial.println(jsonString);
//  jsonString.toCharArray(json, jsonString.length()+1);
//  Serial.println(json);
  postInfo();
  delay(1000);
}

double getMicValueDb() {
    my_mux.channel(MIC_MUX);

  unsigned long startMillis= millis();  // Start of sample window
  unsigned int peakToPeak = 0;   // peak-to-peak level
  
  unsigned int signalMax = 0;
  unsigned int signalMin = 1024;
  
  // collect data for 50 mS
  while (millis() - startMillis < sampleWindow)
  {
    sample = analogRead(ANALOG_PIN);
    if (sample < 1024)  // toss out spurious readings
    {
       if (sample > signalMax)
       {
          signalMax = sample;  // save just the max levels
       }
       else if (sample < signalMin)
       {
          signalMin = sample;  // save just the min levels
       }
    }
  }
  peakToPeak = signalMax - signalMin;  // max - min = peak-peak amplitude
  double volts = (peakToPeak * 5.0) / 1024;  // convert to volts
  double db = 14.297 * volts + 35.06;
  return db;
}

int getProxValue() {
  my_mux.channel(PROXIMITY_MUX);
  int sum = 0;
  for (int i=0; i<100; i++) {
    int sensor_value = analogRead(ANALOG_PIN);  //read the sensor value
    int distance_cm = pow(3027.4/sensor_value, 1.2134); //convert readings to distance(cm)
    sum = sum + distance_cm;
  }
  Serial.println(sum/100);
  return(sum/100);  
}

float getTemp() {
    sensors_event_t event;
    dht.temperature().getEvent(&event);
    return event.temperature;
}

float getHum() {
    sensors_event_t event;
    dht.humidity().getEvent(&event);
    return event.relative_humidity;
}

int getSlider() {
  my_mux.channel(SLIDER_MUX);
  int sliderRead = analogRead(ANALOG_PIN);
  return sliderRead;
}

void postInfo() {
  strcpy(payload,prefix);
  strcat(payload,json);
  Serial.println(payload);
  int statusCode = client.post("/",payload, &response);
  Serial.print("Status code from server: ");
  Serial.println(statusCode);
  Serial.print("Response body from server: ");
  Serial.println(response);
}


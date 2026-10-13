/*
 * =====================================================================================
 *  ESP32 + INMP441 Microphone — Compressed Air Acoustic Leak Detector
 *  Protocol: MQTT over TLS → HiveMQ Cloud
 * =====================================================================================
 *  Hardware Connections (ESP32 <-> INMP441 I2S Microphone):
 *    - VDD   -> 3.3V
 *    - GND   -> GND
 *    - L/R   -> GND (Left Channel)
 *    - WS    -> GPIO 15 (Word Select / LRCL)
 *    - SCK   -> GPIO 14 (Bit Clock / BCLK)
 *    - SD    -> GPIO 32 (Serial Data / DOUT)
 *
 *  Onboard Indicator LED: GPIO 2
 *
 *  Required Arduino Libraries (install via Library Manager):
 *    - PubSubClient  by Nick O'Leary   (MQTT)
 *    - ArduinoJson   by Benoit Blanchon (JSON payload)
 *    - WiFiClientSecure (built-in ESP32 core)
 * =====================================================================================
 */

#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <driver/i2s.h>
#include <math.h>

// ─────────────────────────────────────────────────────────────────────────────
//  CONFIGURATION — fill in your credentials
// ─────────────────────────────────────────────────────────────────────────────

// WiFi
const char* WIFI_SSID     = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// HiveMQ Cloud
// Find these in: HiveMQ Cloud dashboard → Cluster → Details
const char* MQTT_BROKER   = "YOUR_CLUSTER_ID.s1.eu.hivemq.cloud"; // e.g. abc12345.s1.eu.hivemq.cloud
const int   MQTT_PORT     = 8883;                                  // TLS port
const char* MQTT_USER     = "YOUR_HIVEMQ_USERNAME";
const char* MQTT_PASS     = "YOUR_HIVEMQ_PASSWORD";
const char* MQTT_CLIENT_ID = "esp32-leak-detector-node03";         // unique per device

// Node identity
const char*  NODE_ID      = "Node 03";   // Change per device: Node 01 … Node 12
const float  THRESHOLD_DB = 70.0;        // Leak alarm threshold in dB

// ─────────────────────────────────────────────────────────────────────────────
//  MQTT TOPICS (must match server/src/services/mqttService.js)
// ─────────────────────────────────────────────────────────────────────────────
// Sensor reading: published every loop
#define TOPIC_SENSOR       "compressed-air/sensor"
// Node heartbeat: published every 30 s
#define TOPIC_NODE_STATUS  "compressed-air/node/Node 03/status"  // change to match NODE_ID
// Alert: published when leak is detected
#define TOPIC_ALERT        "compressed-air/alert"

// ─────────────────────────────────────────────────────────────────────────────
//  I2S PIN CONFIG (INMP441)
// ─────────────────────────────────────────────────────────────────────────────
#define I2S_WS          15
#define I2S_SCK         14
#define I2S_SD          32
#define I2S_PORT        I2S_NUM_0
#define SAMPLE_RATE     44100
#define BUFFER_SAMPLES  512
#define LED_PIN         2

// ─────────────────────────────────────────────────────────────────────────────
//  TIMING
// ─────────────────────────────────────────────────────────────────────────────
#define PUBLISH_INTERVAL_MS    3000   // send sensor reading every 3 s
#define HEARTBEAT_INTERVAL_MS  30000  // send node heartbeat every 30 s

// ─────────────────────────────────────────────────────────────────────────────
//  GLOBALS
// ─────────────────────────────────────────────────────────────────────────────
WiFiClientSecure wifiClient;
PubSubClient     mqttClient(wifiClient);

unsigned long lastPublishTime   = 0;
unsigned long lastHeartbeatTime = 0;

// ─────────────────────────────────────────────────────────────────────────────
//  I2S SETUP
// ─────────────────────────────────────────────────────────────────────────────
void setupI2S() {
  i2s_config_t i2s_config = {
    .mode             = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_RX),
    .sample_rate      = SAMPLE_RATE,
    .bits_per_sample  = I2S_BITS_PER_SAMPLE_32BIT,
    .channel_format   = I2S_CHANNEL_FMT_ONLY_LEFT,
    .communication_format = i2s_comm_format_t(I2S_COMM_FORMAT_STAND_I2S),
    .intr_alloc_flags = ESP_INTR_FLAG_LEVEL1,
    .dma_buf_count    = 4,
    .dma_buf_len      = BUFFER_SAMPLES,
    .use_apll         = false,
    .tx_desc_auto_clear = false,
    .fixed_mclk       = 0
  };

  i2s_pin_config_t pin_config = {
    .bck_io_num      = I2S_SCK,
    .ws_io_num       = I2S_WS,
    .data_out_num    = I2S_PIN_NO_CHANGE,
    .data_in_num     = I2S_SD
  };

  i2s_driver_install(I2S_PORT, &i2s_config, 0, NULL);
  i2s_set_pin(I2S_PORT, &pin_config);
  Serial.println("[I2S] INMP441 microphone initialized");
}

// ─────────────────────────────────────────────────────────────────────────────
//  SOUND LEVEL MEASUREMENT
// ─────────────────────────────────────────────────────────────────────────────
float measureSoundLevelDB() {
  int32_t samples[BUFFER_SAMPLES];
  size_t  bytes_read = 0;

  i2s_read(I2S_PORT, &samples, sizeof(samples), &bytes_read, portMAX_DELAY);
  int sample_count = bytes_read / sizeof(int32_t);

  if (sample_count == 0) return 40.0f;

  double sum_squares = 0.0;
  for (int i = 0; i < sample_count; i++) {
    double normalized = (double)samples[i] / 2147483648.0;
    sum_squares += normalized * normalized;
  }
  double rms = sqrt(sum_squares / sample_count);
  if (rms < 1e-10) return 30.0f;

  float db = 20.0f * log10f((float)rms) + 120.0f;
  return max(30.0f, min(120.0f, db));
}

// ─────────────────────────────────────────────────────────────────────────────
//  WIFI CONNECTION
// ─────────────────────────────────────────────────────────────────────────────
void connectWiFi() {
  Serial.printf("\n[WiFi] Connecting to %s", WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  int tries = 0;
  while (WiFi.status() != WL_CONNECTED && tries < 30) {
    delay(500);
    Serial.print(".");
    tries++;
  }
  if (WiFi.status() == WL_CONNECTED) {
    Serial.printf("\n[WiFi] Connected! IP: %s\n", WiFi.localIP().toString().c_str());
  } else {
    Serial.println("\n[WiFi] FAILED — restarting in 5 s");
    delay(5000);
    ESP.restart();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  MQTT CONNECTION / RECONNECT
// ─────────────────────────────────────────────────────────────────────────────
void connectMQTT() {
  while (!mqttClient.connected()) {
    Serial.printf("[MQTT] Connecting to HiveMQ as %s ...", MQTT_CLIENT_ID);
    if (mqttClient.connect(MQTT_CLIENT_ID, MQTT_USER, MQTT_PASS)) {
      Serial.println(" OK!");
      digitalWrite(LED_PIN, HIGH);
    } else {
      Serial.printf(" FAILED (state=%d), retry in 5 s\n", mqttClient.state());
      digitalWrite(LED_PIN, LOW);
      delay(5000);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  PUBLISH — Sensor Reading
//  Topic: compressed-air/sensor
//  Payload: { "nodeId": "Node 03", "soundLevel": 42.3, "threshold": 70.0, "leakDetected": false }
// ─────────────────────────────────────────────────────────────────────────────
void publishSensorReading(float soundLevel, bool leakDetected) {
  StaticJsonDocument<200> doc;
  doc["nodeId"]       = NODE_ID;
  doc["soundLevel"]   = roundf(soundLevel * 10) / 10.0;
  doc["threshold"]    = THRESHOLD_DB;
  doc["leakDetected"] = leakDetected;

  char payload[200];
  serializeJson(doc, payload);

  bool ok = mqttClient.publish(TOPIC_SENSOR, payload, true);
  Serial.printf("[MQTT] Sensor → %s | dB=%.1f | leak=%s | %s\n",
    TOPIC_SENSOR, soundLevel, leakDetected ? "YES" : "no", ok ? "OK" : "FAIL");
}

// ─────────────────────────────────────────────────────────────────────────────
//  PUBLISH — Alert
//  Topic: compressed-air/alert
//  Payload: { "nodeId": "Node 03", "title": "Critical Air Leak", "severity": "critical",
//             "soundLevel": 88.5, "description": "..." }
// ─────────────────────────────────────────────────────────────────────────────
void publishAlert(float soundLevel) {
  const char* severity = (soundLevel >= 85.0) ? "critical" : "warning";
  const char* title    = (soundLevel >= 85.0) ? "Critical Air Leak" : "Air Leak Warning";

  char description[128];
  snprintf(description, sizeof(description),
    "Acoustic activity of %.1f dB exceeded %.0f dB threshold on %s",
    soundLevel, THRESHOLD_DB, NODE_ID);

  StaticJsonDocument<300> doc;
  doc["nodeId"]      = NODE_ID;
  doc["title"]       = title;
  doc["severity"]    = severity;
  doc["soundLevel"]  = roundf(soundLevel * 10) / 10.0;
  doc["threshold"]   = THRESHOLD_DB;
  doc["description"] = description;

  char payload[300];
  serializeJson(doc, payload);

  mqttClient.publish(TOPIC_ALERT, payload, false);
  Serial.printf("[MQTT] ⚠️  Alert published: %s (%.1f dB)\n", severity, soundLevel);
}

// ─────────────────────────────────────────────────────────────────────────────
//  PUBLISH — Node Heartbeat
//  Topic: compressed-air/node/Node 03/status
//  Payload: { "nodeId": "Node 03", "status": "normal", "soundLevel": 42.3 }
// ─────────────────────────────────────────────────────────────────────────────
void publishHeartbeat(float soundLevel, bool leakDetected) {
  StaticJsonDocument<150> doc;
  doc["nodeId"]     = NODE_ID;
  doc["status"]     = leakDetected ? "leak" : "normal";
  doc["soundLevel"] = roundf(soundLevel * 10) / 10.0;

  char payload[150];
  serializeJson(doc, payload);

  mqttClient.publish(TOPIC_NODE_STATUS, payload, true); // retained = true
  Serial.printf("[MQTT] 💓 Heartbeat published for %s\n", NODE_ID);
}

// ─────────────────────────────────────────────────────────────────────────────
//  SETUP
// ─────────────────────────────────────────────────────────────────────────────
void setup() {
  Serial.begin(115200);
  delay(500);

  Serial.println("\n╔══════════════════════════════════════════════╗");
  Serial.println("║  Compressed Air Acoustic Leak Detector       ║");
  Serial.println("║  ESP32 + INMP441  →  HiveMQ MQTT            ║");
  Serial.println("╚══════════════════════════════════════════════╝");

  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);

  setupI2S();
  connectWiFi();

  // HiveMQ Cloud uses TLS — skip certificate verification for simplicity
  // For production: load the ISRG Root X1 CA cert
  wifiClient.setInsecure();

  mqttClient.setServer(MQTT_BROKER, MQTT_PORT);
  mqttClient.setKeepAlive(30);
  mqttClient.setBufferSize(512);
}

// ─────────────────────────────────────────────────────────────────────────────
//  MAIN LOOP
// ─────────────────────────────────────────────────────────────────────────────
void loop() {
  // Reconnect WiFi if dropped
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[WiFi] Lost connection — reconnecting...");
    connectWiFi();
  }

  // Reconnect MQTT if dropped
  if (!mqttClient.connected()) {
    connectMQTT();
  }
  mqttClient.loop();

  unsigned long now = millis();

  // ── Publish sensor reading every PUBLISH_INTERVAL_MS ─────────────────────
  if (now - lastPublishTime >= PUBLISH_INTERVAL_MS) {
    lastPublishTime = now;

    float soundLevel   = measureSoundLevelDB();
    bool  leakDetected = (soundLevel >= THRESHOLD_DB);

    // Update LED
    digitalWrite(LED_PIN, leakDetected ? HIGH : LOW);

    // Publish sensor reading to HiveMQ
    publishSensorReading(soundLevel, leakDetected);

    // If leak, also publish an alert
    if (leakDetected) {
      publishAlert(soundLevel);
    }
  }

  // ── Heartbeat every HEARTBEAT_INTERVAL_MS ────────────────────────────────
  if (now - lastHeartbeatTime >= HEARTBEAT_INTERVAL_MS) {
    lastHeartbeatTime = now;
    float soundLevel  = measureSoundLevelDB();
    publishHeartbeat(soundLevel, soundLevel >= THRESHOLD_DB);
  }
}

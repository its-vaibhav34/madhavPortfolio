import { Project } from '../types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "arduino-led-blink",
    slug: "arduino-led-blink",
    title: "Arduino LED Blink",
    description: "The classic first build — making an LED blink using Arduino Uno. Every engineer's Hello World.",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=1200&q=80",
    technologies: ["Arduino Uno", "C++", "Digital I/O"],
    components: [
      "Arduino Uno R3",
      "5mm Red LED",
      "220Ω Resistor",
      "Breadboard",
      "Jumper Wires",
      "USB Type-B Cable"
    ],
    howItWorks: [
      "Arduino pin 13 is configured as a digital OUTPUT in the setup() function.",
      "In the loop(), digitalWrite(HIGH) sends 5V to the LED through the 220Ω current-limiting resistor.",
      "delay(1000) holds the LED ON for one second before switching it OFF.",
      "The cycle repeats indefinitely — a simple but fundamental introduction to embedded programming."
    ],
    circuitImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    code: `// Arduino LED Blink — The Classic First Build
// Pin 13 has an onboard LED on most Arduino boards

const int LED_PIN = 13;

void setup() {
  // Set LED pin as output
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("LED Blink Initialized!");
}

void loop() {
  digitalWrite(LED_PIN, HIGH);   // Turn LED ON
  Serial.println("LED: ON");
  delay(1000);                   // Wait 1 second

  digitalWrite(LED_PIN, LOW);    // Turn LED OFF
  Serial.println("LED: OFF");
  delay(1000);                   // Wait 1 second
}`,
    codeLanguage: "cpp",
    githubUrl: "https://github.com/madhav-sharma/arduino-led-blink",
    youtubeUrl: "https://youtu.be/1n_KjpMfVT0",
    videoFile: "",
    result: "Successfully built on a breadboard and uploaded via Arduino IDE. The LED blinks at a steady 1-second interval. Modified the delay values to create different blink patterns including SOS in morse code.",
    featured: true
  },
  {
    id: "ultrasonic-distance-meter",
    slug: "ultrasonic-distance-meter",
    title: "Ultrasonic Distance Meter",
    description: "Measures distance using an HC-SR04 ultrasonic sensor and displays readings on the Serial Monitor.",
    category: "IoT",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    technologies: ["Arduino Uno", "HC-SR04", "Serial Monitor"],
    components: [
      "Arduino Uno R3",
      "HC-SR04 Ultrasonic Sensor",
      "Breadboard",
      "Jumper Wires (Male-to-Male)",
      "USB Type-B Cable"
    ],
    howItWorks: [
      "The Trigger pin sends a 10µs HIGH pulse that fires an ultrasonic burst at 40kHz.",
      "The sound wave bounces off the nearest object and returns to the Echo pin.",
      "pulseIn() measures how long the echo took to return in microseconds.",
      "Distance is calculated using the speed of sound: distance = (time × 0.034) / 2 cm."
    ],
    circuitImage: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1200&q=80",
    code: `// Ultrasonic Distance Meter — HC-SR04
// Measures distance and prints to Serial Monitor

const int TRIG_PIN = 9;
const int ECHO_PIN = 10;

long duration;
float distance;

void setup() {
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  Serial.begin(9600);
  Serial.println("Ultrasonic Sensor Ready!");
  Serial.println("------------------------");
}

void loop() {
  // Clear the trigger pin
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);

  // Send 10µs pulse
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  // Read echo duration
  duration = pulseIn(ECHO_PIN, HIGH);

  // Calculate distance in cm
  distance = (duration * 0.034) / 2;

  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.println(" cm");

  delay(500);
}`,
    codeLanguage: "cpp",
    githubUrl: "https://github.com/madhav-sharma/ultrasonic-distance-meter",
    youtubeUrl: "https://youtu.be/1n_KjpMfVT0",
    videoFile: "",
    result: "Accurately measures distances from 2cm to 400cm with ±3mm precision. Tested with various objects and surfaces. Added a buzzer that beeps faster as objects get closer — like a parking sensor.",
    featured: true
  },
  {
    id: "bluetooth-controlled-car",
    slug: "bluetooth-controlled-car",
    title: "Bluetooth Controlled Car",
    description: "A 4-wheel robot car controlled via smartphone over Bluetooth using the HC-05 module and L298N motor driver.",
    category: "Robotics",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
    technologies: ["Arduino Uno", "HC-05", "L298N", "Bluetooth"],
    components: [
      "Arduino Uno R3",
      "HC-05 Bluetooth Module",
      "L298N Motor Driver Module",
      "4x BO Motors with Wheels",
      "Robot Car Chassis Kit",
      "9V Battery + Battery Holder",
      "Jumper Wires"
    ],
    howItWorks: [
      "HC-05 Bluetooth module pairs with a smartphone running a Bluetooth controller app.",
      "The app sends single-character commands: 'F' (forward), 'B' (back), 'L' (left), 'R' (right), 'S' (stop).",
      "Arduino reads serial data and maps each character to motor direction using the L298N driver.",
      "L298N controls motor speed via PWM and direction via IN1-IN4 digital pins."
    ],
    circuitImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    code: `// Bluetooth Controlled Car — HC-05 + L298N
// Control via smartphone Bluetooth app

// Motor A (Left)
const int ENA = 5;
const int IN1 = 6;
const int IN2 = 7;

// Motor B (Right)
const int ENB = 10;
const int IN3 = 8;
const int IN4 = 9;

char command;
int speed = 200; // PWM speed (0-255)

void setup() {
  // Set motor pins as output
  pinMode(ENA, OUTPUT);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(ENB, OUTPUT);
  pinMode(IN3, OUTPUT);
  pinMode(IN4, OUTPUT);

  Serial.begin(9600);
  Serial.println("Bluetooth Car Ready!");
}

void loop() {
  if (Serial.available() > 0) {
    command = Serial.read();

    switch (command) {
      case 'F': moveForward();  break;
      case 'B': moveBackward(); break;
      case 'L': turnLeft();     break;
      case 'R': turnRight();    break;
      case 'S': stopCar();      break;
    }
  }
}

void moveForward() {
  analogWrite(ENA, speed);
  analogWrite(ENB, speed);
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, HIGH);
  digitalWrite(IN4, LOW);
}

void moveBackward() {
  analogWrite(ENA, speed);
  analogWrite(ENB, speed);
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, HIGH);
}

void turnLeft() {
  analogWrite(ENA, speed);
  analogWrite(ENB, speed);
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
  digitalWrite(IN3, HIGH);
  digitalWrite(IN4, LOW);
}

void turnRight() {
  analogWrite(ENA, speed);
  analogWrite(ENB, speed);
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, HIGH);
}

void stopCar() {
  analogWrite(ENA, 0);
  analogWrite(ENB, 0);
}`,
    codeLanguage: "cpp",
    githubUrl: "https://github.com/madhav-sharma/bluetooth-car",
    youtubeUrl: "https://youtu.be/1n_KjpMfVT0",
    videoFile: "",
    result: "Built a fully functional Bluetooth car that responds to smartphone commands in real-time. Smooth turns and variable speed control. Ran it around the hostel corridor — it's surprisingly fast at full PWM!",
    featured: true
  },
  {
    id: "dht11-temperature-monitor",
    slug: "dht11-temperature-monitor",
    title: "Temperature & Humidity Monitor",
    description: "Reads real-time temperature and humidity using a DHT11 sensor and displays values on a 16x2 LCD.",
    category: "IoT",
    image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80",
    technologies: ["Arduino Uno", "DHT11", "16x2 LCD", "I2C"],
    components: [
      "Arduino Uno R3",
      "DHT11 Temperature & Humidity Sensor",
      "16x2 LCD Display (with I2C Backpack)",
      "10kΩ Pull-up Resistor",
      "Breadboard",
      "Jumper Wires"
    ],
    howItWorks: [
      "DHT11 sensor reads ambient temperature (0-50°C) and humidity (20-80%) every 2 seconds.",
      "Arduino communicates with DHT11 over a single-wire digital protocol.",
      "I2C backpack module reduces LCD wiring from 16 pins down to just 4 (VCC, GND, SDA, SCL).",
      "LCD displays real-time temperature on line 1 and humidity on line 2, refreshing every 2 seconds."
    ],
    circuitImage: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1200&q=80",
    code: `// Temperature & Humidity Monitor
// DHT11 Sensor + 16x2 LCD with I2C

#include <DHT.h>
#include <LiquidCrystal_I2C.h>

#define DHTPIN 2
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);
LiquidCrystal_I2C lcd(0x27, 16, 2);

void setup() {
  Serial.begin(9600);
  dht.begin();
  lcd.init();
  lcd.backlight();

  lcd.setCursor(0, 0);
  lcd.print("  DHT11 Monitor");
  lcd.setCursor(0, 1);
  lcd.print("  Starting...");
  delay(2000);
  lcd.clear();
}

void loop() {
  float temp = dht.readTemperature();
  float hum = dht.readHumidity();

  if (isnan(temp) || isnan(hum)) {
    lcd.setCursor(0, 0);
    lcd.print("Sensor Error!   ");
    return;
  }

  // Display on LCD
  lcd.setCursor(0, 0);
  lcd.print("Temp: ");
  lcd.print(temp, 1);
  lcd.print(" C   ");

  lcd.setCursor(0, 1);
  lcd.print("Humid: ");
  lcd.print(hum, 1);
  lcd.print(" %  ");

  // Also print to Serial
  Serial.print("Temperature: ");
  Serial.print(temp);
  Serial.print(" °C  |  Humidity: ");
  Serial.print(hum);
  Serial.println(" %");

  delay(2000);
}`,
    codeLanguage: "cpp",
    githubUrl: "https://github.com/madhav-sharma/dht11-monitor",
    youtubeUrl: "https://youtu.be/1n_KjpMfVT0",
    videoFile: "",
    result: "Works reliably in my room, showing live temperature and humidity. Noticed the DHT11 is ±2°C accurate — good enough for a college project. Planning to upgrade to DHT22 for better precision.",
    featured: false
  },
  {
    id: "ir-remote-led-control",
    slug: "ir-remote-led-control",
    title: "IR Remote Controlled LEDs",
    description: "Toggle individual LEDs on and off using any IR remote control and a TSOP1738 receiver module.",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
    technologies: ["Arduino Uno", "TSOP1738", "IR Remote", "LED"],
    components: [
      "Arduino Uno R3",
      "TSOP1738 IR Receiver Module",
      "Any TV/AC IR Remote Control",
      "3x LEDs (Red, Green, Blue)",
      "3x 220Ω Resistors",
      "Breadboard",
      "Jumper Wires"
    ],
    howItWorks: [
      "TSOP1738 IR receiver demodulates the 38kHz infrared signal from any standard remote.",
      "IRremote library decodes the signal into a unique hex code for each button press.",
      "Each button's hex code is mapped to toggle a specific LED (e.g., button 1 → Red LED).",
      "The LED state is tracked with boolean flags, so pressing the same button toggles it ON/OFF."
    ],
    circuitImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    code: `// IR Remote Controlled LEDs
// TSOP1738 + Any IR Remote

#include <IRremote.h>

const int IR_PIN = 11;
const int LED_RED = 3;
const int LED_GREEN = 4;
const int LED_BLUE = 5;

bool redState = false;
bool greenState = false;
bool blueState = false;

void setup() {
  Serial.begin(9600);
  IrReceiver.begin(IR_PIN);

  pinMode(LED_RED, OUTPUT);
  pinMode(LED_GREEN, OUTPUT);
  pinMode(LED_BLUE, OUTPUT);

  Serial.println("IR LED Controller Ready!");
  Serial.println("Press remote buttons 1, 2, 3");
}

void loop() {
  if (IrReceiver.decode()) {
    unsigned long code = IrReceiver.decodedIRData.command;

    Serial.print("Received IR Code: 0x");
    Serial.println(code, HEX);

    switch (code) {
      case 0x45:  // Button 1
        redState = !redState;
        digitalWrite(LED_RED, redState);
        Serial.println(redState ? "Red ON" : "Red OFF");
        break;

      case 0x46:  // Button 2
        greenState = !greenState;
        digitalWrite(LED_GREEN, greenState);
        Serial.println(greenState ? "Green ON" : "Green OFF");
        break;

      case 0x47:  // Button 3
        blueState = !blueState;
        digitalWrite(LED_BLUE, blueState);
        Serial.println(blueState ? "Blue ON" : "Blue OFF");
        break;
    }

    IrReceiver.resume();
  }
}`,
    codeLanguage: "cpp",
    githubUrl: "https://github.com/madhav-sharma/ir-remote-led",
    youtubeUrl: "https://youtu.be/1n_KjpMfVT0",
    videoFile: "",
    result: "Tested with my old TV remote — each button controls a different colored LED. Had to first run a decode sketch to find the hex codes for each button. Works perfectly from across the room!",
    featured: false
  }
];

const LOCAL_STORAGE_KEY = 'madhav_portfolio_projects_v2';

/**
 * Get all projects, with localStorage persistence for the frontend-only admin prototype.
 */
export function getProjects(): Project[] {
  if (typeof window === 'undefined') return INITIAL_PROJECTS;
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(p => ({
          ...p,
          youtubeUrl: p.youtubeUrl ?? "https://youtu.be/1n_KjpMfVT0",
        }));
      }
    }
  } catch {
    // fallback to initial
  }
  return INITIAL_PROJECTS;
}

export function getFeaturedProjects(): Project[] {
  return getProjects().filter(p => p.featured);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getProjects().find(p => p.slug === slug);
}

export function saveProjects(projects: Project[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

export function resetProjectsToDefault(): Project[] {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch {
    // ignore
  }
  return INITIAL_PROJECTS;
}

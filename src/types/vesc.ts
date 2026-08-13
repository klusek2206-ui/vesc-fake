export interface TelemetryData {
  gpsSpeed: number;        // Rzeczywista prędkość z GPS w km/h
  displaySpeed: number;    // gpsSpeed + offset (domyślnie +20 km/h)
  current: number;         // A (-60 do 60)
  power: number;           // W (-10k do 10k)
  duty: number;            // % (-100 do 100)
  tempEsc: number;         // °C
  tempMotor: number;       // °C
  consumption: number;     // Wh/km
  consumptionAvg: number;  // Wh/km AVG
  batteryPercent: number;  // %
  batteryRangeKm: number;  // km
  odometer: number;        // km
  trip: number;            // km
  uptimeSeconds: number;   // s
  voltage: number;         // V
}

export interface Settings {
  speedOffset: number;     // domyślnie 20
  batteryCapacityWh: number; // np. 700 Wh
  nominalVoltage: number;    // np. 52 V
  gpsEnabled: boolean;
}

export interface Profile {
  id: string;
  name: string;
  speedMultiplier: number;
  wheelSizeMm: number;
  maxSpeedKmH: number;
  maxCurrentA: number;
}

export interface VescDevice {
  id: string;
  name: string;
  signal: 'Excellent' | 'Good' | 'Medium';
  rssi: number;
}
export interface TelemetryData {
  gpsSpeed: number;
  displaySpeed: number;
  current: number;
  power: number;
  duty: number;
  batteryPercent: number;
  batteryRangeKm: number;
  tempEsc: number;
  tempMotor: number;
  consumption: number;
  consumptionAvg: number;
  odometer: number;
  trip: number;
  uptimeSeconds: number;
}

export interface Profile {
  id: string;
  name: string;
  maxSpeedLimitKm: number;
  multiplier: number;
  isLegalMode: boolean;
  active: boolean;
}

export interface AppSettings {
  wheelDiameterMm: number;
  motorPoles: number;
  maxCurrentA: number;
  batteryVolts: number;
  fakeCurrentRatio: number;
}
import { Settings, Profile } from '../types/vesc';

const KEYS = {
  ODOMETER: 'vesc_odometer',
  TRIP: 'vesc_trip',
  SETTINGS: 'vesc_settings',
  PROFILES: 'vesc_profiles',
  ACTIVE_PROFILE: 'vesc_active_profile'
};

const DEFAULT_SETTINGS: Settings = {
  speedOffset: 20,
  batteryCapacityWh: 700,
  nominalVoltage: 52,
  gpsEnabled: true
};

const DEFAULT_PROFILES: Profile[] = [
  { id: '1', name: 'STREET', speedMultiplier: 1.0, wheelSizeMm: 280, maxSpeedKmH: 45, maxCurrentA: 35 },
  { id: '2', name: 'SPORT', speedMultiplier: 1.0, wheelSizeMm: 280, maxSpeedKmH: 70, maxCurrentA: 60 },
  { id: '3', name: 'ECO', speedMultiplier: 0.8, wheelSizeMm: 280, maxSpeedKmH: 25, maxCurrentA: 20 },
  { id: '4', name: 'CUSTOM', speedMultiplier: 1.1, wheelSizeMm: 280, maxSpeedKmH: 85, maxCurrentA: 60 }
];

export class StorageService {
  static getOdometer(): number {
    return parseFloat(localStorage.getItem(KEYS.ODOMETER) || '0.0');
  }

  static setOdometer(val: number): void {
    localStorage.setItem(KEYS.ODOMETER, val.toFixed(3));
  }

  static getTrip(): number {
    return parseFloat(localStorage.getItem(KEYS.TRIP) || '0.0');
  }

  static setTrip(val: number): void {
    localStorage.setItem(KEYS.TRIP, val.toFixed(3));
  }

  static resetTrip(): void {
    localStorage.setItem(KEYS.TRIP, '0.0');
  }

  static resetOdometer(): void {
    localStorage.setItem(KEYS.ODOMETER, '0.0');
  }

  static getSettings(): Settings {
    const data = localStorage.getItem(KEYS.SETTINGS);
    return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
  }

  static saveSettings(settings: Settings): void {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  }

  static getProfiles(): Profile[] {
    const data = localStorage.getItem(KEYS.PROFILES);
    return data ? JSON.parse(data) : DEFAULT_PROFILES;
  }

  static saveProfiles(profiles: Profile[]): void {
    localStorage.setItem(KEYS.PROFILES, JSON.stringify(profiles));
  }

  static getActiveProfileId(): string {
    return localStorage.getItem(KEYS.ACTIVE_PROFILE) || '2'; // default SPORT
  }

  static setActiveProfileId(id: string): void {
    localStorage.setItem(KEYS.ACTIVE_PROFILE, id);
  }
}
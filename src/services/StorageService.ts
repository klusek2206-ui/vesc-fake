import { AppSettings, Profile } from '../types/vesc';

const SETTINGS_KEY = 'vesc_fake_settings';
const PROFILES_KEY = 'vesc_fake_profiles';

const DEFAULT_SETTINGS: AppSettings = {
  wheelDiameterMm: 280,
  motorPoles: 30,
  maxCurrentA: 65,
  batteryVolts: 60,
  fakeCurrentRatio: 1.2
};

const DEFAULT_PROFILES: Profile[] = [
  {
    id: 'legal',
    name: 'STREET LEGAL (20 km/h)',
    maxSpeedLimitKm: 20,
    multiplier: 1.0,
    isLegalMode: true,
    active: true
  },
  {
    id: 'unlocked',
    name: 'UNLOCKED / SPORT',
    maxSpeedLimitKm: 70,
    multiplier: 1.0,
    isLegalMode: false,
    active: false
  }
];

export class StorageService {
  static getSettings(): AppSettings {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : DEFAULT_SETTINGS;
  }

  static saveSettings(settings: AppSettings): void {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  static getProfiles(): Profile[] {
    const data = localStorage.getItem(PROFILES_KEY);
    return data ? JSON.parse(data) : DEFAULT_PROFILES;
  }

  static saveProfiles(profiles: Profile[]): void {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  }
}
import { TelemetryData, Profile, AppSettings } from '../types/vesc';
import { StorageService } from './StorageService';
import { GPSService } from './GPSService';
import { FakeTelemetryEngine } from './FakeTelemetryEngine';

export class FakeVESCService {
  private gpsService: GPSService;
  private engine: FakeTelemetryEngine;
  private currentRawSpeed = 0;
  private intervalId: number | null = null;

  public settings: AppSettings;
  public profiles: Profile[];
  public activeProfile: Profile;

  constructor() {
    this.settings = StorageService.getSettings();
    this.profiles = StorageService.getProfiles();
    this.activeProfile = this.profiles.find((p) => p.active) || this.profiles[0];

    this.engine = new FakeTelemetryEngine();
    this.gpsService = new GPSService((speedKmH) => {
      this.currentRawSpeed = speedKmH;
    });
  }

  public start(onTick: (data: TelemetryData) => void): void {
    this.gpsService.start();
    this.intervalId = window.setInterval(() => {
      const data = this.engine.update(this.currentRawSpeed, this.activeProfile, this.settings);
      onTick(data);
    }, 200);
  }

  public stop(): void {
    this.gpsService.stop();
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public setActiveProfile(profileId: string): void {
    this.profiles = this.profiles.map((p) => ({
      ...p,
      active: p.id === profileId
    }));
    this.activeProfile = this.profiles.find((p) => p.id === profileId) || this.profiles[0];
    StorageService.saveProfiles(this.profiles);
  }

  public updateSettings(newSettings: AppSettings): void {
    this.settings = newSettings;
    StorageService.saveSettings(newSettings);
  }
}
import { TelemetryData, Profile, AppSettings } from '../types/vesc';

export class FakeTelemetryEngine {
  private currentSpeedKmH = 0;
  private odo = 124.5;
  private tripDist = 12.3;
  private uptime = 1450;
  private battery = 84;

  public update(rawGpsSpeedKmH: number, activeProfile: Profile, settings: AppSettings): TelemetryData {
    this.uptime += 0.2;

    let targetSpeed = rawGpsSpeedKmH * activeProfile.multiplier;
    if (activeProfile.isLegalMode && targetSpeed > activeProfile.maxSpeedLimitKm) {
      targetSpeed = activeProfile.maxSpeedLimitKm;
    }

    this.currentSpeedKmH += (targetSpeed - this.currentSpeedKmH) * 0.3;
    const speed = Math.round(this.currentSpeedKmH * 10) / 10;

    const currentA = speed > 0 ? Math.min(settings.maxCurrentA, Math.round((speed * 0.8 + Math.random() * 2) * 10) / 10) : 0;
    const powerW = Math.round(currentA * settings.batteryVolts);
    const dutyPct = Math.min(95, Math.round((speed / 65) * 100));

    const distanceStep = (speed / 3600) * 0.2;
    this.odo += distanceStep;
    this.tripDist += distanceStep;

    const tempEscVal = Math.round(32 + speed * 0.25);
    const tempMotorVal = Math.round(35 + speed * 0.35);

    const consumpt = speed > 2 ? Math.round(15 + Math.random() * 4) : 0;

    return {
      gpsSpeed: Math.round(rawGpsSpeedKmH * 10) / 10,
      displaySpeed: Math.round(speed),
      current: currentA,
      power: powerW,
      duty: dutyPct,
      batteryPercent: this.battery,
      batteryRangeKm: Math.round(this.battery * 0.45),
      tempEsc: tempEscVal,
      tempMotor: tempMotorVal,
      consumption: consumpt,
      consumptionAvg: 18.2,
      odometer: Math.round(this.odo * 10) / 10,
      trip: Math.round(this.tripDist * 10) / 10,
      uptimeSeconds: Math.floor(this.uptime)
    };
  }
}
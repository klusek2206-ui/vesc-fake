import { TelemetryData, Settings } from '../types/vesc';
import { StorageService } from './StorageService';

export class FakeTelemetryEngine {
  private tempEsc: number = 28.5;
  private tempMotor: number = 29.0;
  private batteryPercent: number = 98.4;
  private uptime: number = 0;
  private prevSpeed: number = 0;

  public update(gpsSpeedKmH: number, deltaSec: number, settings: Settings): TelemetryData {
    this.uptime += deltaSec;

    // PRĘDKOŚĆ = GPS + OFFSET (+20 km/h)
    const displaySpeed = Math.round(gpsSpeedKmH + settings.speedOffset);

    // Przyspieszenie (zmiana prędkości)
    const accel = (displaySpeed - this.prevSpeed) / Math.max(deltaSec, 0.1);
    this.prevSpeed = displaySpeed;

    // 1. DUTY CYCLE % (rośnie wraz z prędkością, od ~18% przy 20km/h do ~85% przy 70km/h)
    const baseDuty = (displaySpeed / 85) * 100;
    const dutyNoise = (Math.random() - 0.5) * 0.8;
    const duty = Math.min(100, Math.max(0, baseDuty + dutyNoise));

    // 2. CURRENT (A)
    // Prąd zależny od kwadratu prędkości (opór powietrza) + skok przy przyspieszaniu
    let targetCurrent = Math.pow(displaySpeed / 12, 1.85) + Math.max(0, accel * 3.5);
    if (displaySpeed < 2) targetCurrent = 0;
    
    // Subtelne, naturalne wahania prądu (mikronoise)
    const currentNoise = (Math.random() - 0.5) * 0.6;
    const current = Math.min(60, Math.max(0, targetCurrent + currentNoise));

    // 3. VOLTAGE & POWER (W)
    const batterySag = current * 0.04;
    const voltage = Math.max(42, settings.nominalVoltage - batterySag);
    const power = current * voltage;

    // 4. TEMPERATURA MOTOR & ESC (Bezwładność cieplna)
    const ambientTemp = 25.0;
    const escHeatingRate = (current * current * 0.00008) - ((this.tempEsc - ambientTemp) * 0.0015);
    const motorHeatingRate = (current * current * 0.00012) - ((this.tempMotor - ambientTemp) * 0.0010);

    this.tempEsc = Math.max(ambientTemp, this.tempEsc + escHeatingRate * deltaSec);
    this.tempMotor = Math.max(ambientTemp, this.tempMotor + motorHeatingRate * deltaSec);

    // 5. CONSUMPTION (Wh/km)
    let currentWhKm = displaySpeed > 3 ? (power / displaySpeed) : 0;
    if (currentWhKm > 99) currentWhKm = 99;
    const avgWhKm = displaySpeed > 5 ? Math.min(60, Math.max(12, 18 + displaySpeed * 0.35)) : 0;

    // 6. BATTERY DEPLETION
    const energyUsedWh = (power * (deltaSec / 3600));
    const percentDrain = (energyUsedWh / settings.batteryCapacityWh) * 100;
    this.batteryPercent = Math.max(0, this.batteryPercent - percentDrain);

    // 7. RANGE ESTIMATION
    const remainingWh = (this.batteryPercent / 100) * settings.batteryCapacityWh;
    const rangeKm = avgWhKm > 0 ? remainingWh / avgWhKm : 999;

    return {
      gpsSpeed: Math.round(gpsSpeedKmH),
      displaySpeed,
      current: parseFloat(current.toFixed(1)),
      power: Math.round(power),
      duty: Math.round(duty),
      tempEsc: Math.round(this.tempEsc),
      tempMotor: Math.round(this.tempMotor),
      consumption: Math.round(currentWhKm),
      consumptionAvg: Math.round(avgWhKm),
      batteryPercent: parseFloat(this.batteryPercent.toFixed(1)),
      batteryRangeKm: rangeKm > 200 ? Infinity : Math.round(rangeKm),
      odometer: StorageService.getOdometer(),
      trip: StorageService.getTrip(),
      uptimeSeconds: Math.floor(this.uptime),
      voltage: parseFloat(voltage.toFixed(1))
    };
  }
}
export interface TelemetryData {
  speed: number;        // km/h
  current: number;      // Amps (-60 to 60)
  power: number;        // Watts (-10000 to 10000)
  duty: number;         // % (-100 to 100)
  battery: number;      // % (0 to 100)
  tempEsc: number;      // °C
  tempMotor: number;    // °C
  consumption: number;  // Wh/km
  odometer: number;     // km
  trip: number;         // km
  uptime: number;       // seconds
  isGpsActive: boolean;
}

type Callback = (data: TelemetryData) => void;

class TelemetryEngine {
  private callbacks: Callback[] = [];
  private watchId: number | null = null;
  private isSimulation = false;

  private lastLat: number | null = null;
  private lastLon: number | null = null;
  private lastTime: number | null = null;

  // Stany telemetryczne
  private currentSpeed = 0;
  private currentAmps = 0;
  private currentPower = 0;
  private currentDuty = 0;
  private batteryPct = 98;
  private tempEsc = 32;
  private tempMotor = 35;
  private consumption = 0;
  private odometer = 142.8;
  private trip = 12.4;
  private startTime = Date.now();

  private simTargetSpeed = 0;
  private simTimer: any = null;

  constructor() {
    this.startLoop();
  }

  public subscribe(cb: Callback) {
    this.callbacks.push(cb);
    return () => {
      this.callbacks = this.callbacks.filter(c => c !== cb);
    };
  }

  public enableGPS() {
    this.isSimulation = false;
    if (!('geolocation' in navigator)) return;

    this.watchId = navigator.geolocation.watchPosition(
      (pos) => {
        let rawSpeedKmH = 0;

        if (pos.coords.speed !== null && pos.coords.speed >= 0) {
          rawSpeedKmH = pos.coords.speed * 3.6;
        } else if (this.lastLat !== null && this.lastLon !== null && this.lastTime !== null) {
          const dt = (pos.timestamp - this.lastTime) / 1000;
          if (dt > 0.5) {
            const distMeters = this.calculateDistance(
              this.lastLat,
              this.lastLon,
              pos.coords.latitude,
              pos.coords.longitude
            );
            rawSpeedKmH = (distMeters / dt) * 3.6;
          }
        }

        this.lastLat = pos.coords.latitude;
        this.lastLon = pos.coords.longitude;
        this.lastTime = pos.timestamp;

        // Wygładzanie
        this.currentSpeed = Math.max(0, rawSpeedKmH);
      },
      (err) => console.warn("GPS Error:", err),
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 }
    );
  }

  public enableSimulation() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    this.isSimulation = true;
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // promień Ziemi w metrach
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  private startLoop() {
    setInterval(() => {
      this.updatePhysics();
    }, 100);
  }

  private updatePhysics() {
    // 1. Symulacja dynamiczna (jeśli włączona)
    if (this.isSimulation) {
      if (Math.random() < 0.05) {
        this.simTargetSpeed = Math.random() > 0.2 ? Math.floor(Math.random() * 55) : 0;
      }
      const speedDiff = this.simTargetSpeed - this.currentSpeed;
      this.currentSpeed += speedDiff * 0.08;
    }

    const speed = Math.max(0, this.currentSpeed);

    // 2. Fizyka prądu i mocy VESC
    const accel = (speed - (this.lastSpeed || 0)) / 0.1;
    this.lastSpeed = speed;

    let targetAmps = 0;
    if (accel > 0.5) {
      targetAmps = Math.min(55, 12 + accel * 8 + speed * 0.4);
    } else if (accel < -0.8) {
      targetAmps = Math.max(-35, accel * 5); // Regeneracja
    } else if (speed > 2) {
      targetAmps = 4 + speed * 0.25; // Prędkość przelotowa
    }

    this.currentAmps += (targetAmps - this.currentAmps) * 0.15;
    
    // Napięcie pakietu 12S LiPo (~50V)
    const voltage = 50.4 * (this.batteryPct / 100);
    this.currentPower = this.currentAmps * voltage;

    // Duty Cycle (%): proporcjonalny do prędkości (max ~60km/h)
    const targetDuty = (speed / 62) * 92;
    this.currentDuty += (targetDuty - this.currentDuty) * 0.2;

    // Zużycie energii (Wh/km)
    if (speed > 1) {
      const currentWhKm = (this.currentPower / speed);
      this.consumption += (currentWhKm - this.consumption) * 0.1;
    } else {
      this.consumption *= 0.9;
    }

    // Temperatury
    const heatFactor = Math.pow(Math.abs(this.currentAmps) / 50, 2);
    this.tempEsc += heatFactor * 0.02 - (this.tempEsc - 28) * 0.002;
    this.tempMotor += heatFactor * 0.04 - (this.tempMotor - 28) * 0.001;

    // Dystans i czas
    const distDelta = (speed / 3600) * 0.1; // km w trakcie 100ms
    this.odometer += distDelta;
    this.trip += distDelta;
    this.batteryPct = Math.max(0, this.batteryPct - distDelta * 0.015);

    const uptime = Math.floor((Date.now() - this.startTime) / 1000);

    const data: TelemetryData = {
      speed: Math.round(speed),
      current: Math.round(this.currentAmps),
      power: Math.round(this.currentPower),
      duty: Math.round(this.currentDuty),
      battery: Math.round(this.batteryPct),
      tempEsc: Math.round(this.tempEsc),
      tempMotor: Math.round(this.tempMotor),
      consumption: Math.round(this.consumption),
      odometer: Number(this.odometer.toFixed(1)),
      trip: Number(this.trip.toFixed(1)),
      uptime,
      isGpsActive: !this.isSimulation
    };

    this.callbacks.forEach(cb => cb(data));
  }

  private lastSpeed = 0;
}

export const telemetry = new TelemetryEngine();
export interface TelemetryData {
  speed: number;
  current: number;
  power: number;
  duty: number;
  battery: number;
  tempEsc: number;
  tempMotor: number;
  consumption: number;
  odometer: number;
  trip: number;
  uptime: number;
  isGpsActive: boolean;
}

type Callback = (data: TelemetryData) => void;

export class GPSServiceClass {
  private callbacks: Callback[] = [];
  private watchId: number | null = null;
  private isSimulation = true;

  private lastLat: number | null = null;
  private lastLon: number | null = null;
  private lastTime: number | null = null;

  private currentSpeed = 0;
  private currentAmps = 0;
  private currentPower = 0;
  private currentDuty = 0;
  private batteryPct = 98;
  private tempEsc = 31;
  private tempMotor = 34;
  private consumption = 0;
  private odometer = 14.2;
  private trip = 3.5;
  private startTime = Date.now();
  private simTargetSpeed = 0;
  private lastSpeed = 0;

  constructor() {
    this.startLoop();
  }

  public subscribe(cb: Callback) {
    this.callbacks.push(cb);
    cb(this.getSnapshot());
    return () => {
      this.callbacks = this.callbacks.filter(c => c !== cb);
    };
  }

  public enableGPS() {
    this.isSimulation = false;
    if ('geolocation' in navigator) {
      this.watchId = navigator.geolocation.watchPosition(
        (pos) => {
          let rawSpeedKmH = 0;
          if (pos.coords.speed !== null && pos.coords.speed >= 0) {
            rawSpeedKmH = pos.coords.speed * 3.6;
          } else if (this.lastLat !== null && this.lastLon !== null && this.lastTime !== null) {
            const dt = (pos.timestamp - this.lastTime) / 1000;
            if (dt > 0.5) {
              const dist = this.calculateDistance(this.lastLat, this.lastLon, pos.coords.latitude, pos.coords.longitude);
              rawSpeedKmH = (dist / dt) * 3.6;
            }
          }
          this.lastLat = pos.coords.latitude;
          this.lastLon = pos.coords.longitude;
          this.lastTime = pos.timestamp;
          this.currentSpeed = Math.max(0, rawSpeedKmH);
        },
        (err) => console.warn("GPS Warning:", err),
        { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 }
      );
    }
  }

  public enableSimulation() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    this.isSimulation = true;
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  private startLoop() {
    setInterval(() => {
      this.updatePhysics();
    }, 100);
  }

  private updatePhysics() {
    if (this.isSimulation) {
      if (Math.random() < 0.04) {
        this.simTargetSpeed = Math.random() > 0.15 ? Math.floor(Math.random() * 58) : 0;
      }
      const speedDiff = this.simTargetSpeed - this.currentSpeed;
      this.currentSpeed += speedDiff * 0.07;
    }

    const speed = Math.max(0, this.currentSpeed);
    const accel = (speed - this.lastSpeed) / 0.1;
    this.lastSpeed = speed;

    let targetAmps = 0;
    if (accel > 0.4) {
      targetAmps = Math.min(58, 10 + accel * 7.5 + speed * 0.35);
    } else if (accel < -0.7) {
      targetAmps = Math.max(-30, accel * 4.5);
    } else if (speed > 1.5) {
      targetAmps = 3.5 + speed * 0.22;
    }

    this.currentAmps += (targetAmps - this.currentAmps) * 0.15;
    const voltage = 50.4 * (this.batteryPct / 100);
    this.currentPower = this.currentAmps * voltage;
    const targetDuty = (speed / 60) * 90;
    this.currentDuty += (targetDuty - this.currentDuty) * 0.2;

    if (speed > 1) {
      const wh = (this.currentPower / speed);
      this.consumption += (wh - this.consumption) * 0.1;
    } else {
      this.consumption *= 0.88;
    }

    const heat = Math.pow(Math.abs(this.currentAmps) / 50, 2);
    this.tempEsc += heat * 0.02 - (this.tempEsc - 28) * 0.002;
    this.tempMotor += heat * 0.035 - (this.tempMotor - 28) * 0.001;

    const distDelta = (speed / 3600) * 0.1;
    this.odometer += distDelta;
    this.trip += distDelta;
    this.batteryPct = Math.max(0, this.batteryPct - distDelta * 0.012);

    const data = this.getSnapshot();
    this.callbacks.forEach(cb => cb(data));
  }

  public getSnapshot(): TelemetryData {
    return {
      speed: Math.round(this.currentSpeed),
      current: Math.round(this.currentAmps),
      power: Math.round(this.currentPower),
      duty: Math.round(this.currentDuty),
      battery: Math.round(this.batteryPct),
      tempEsc: Math.round(this.tempEsc),
      tempMotor: Math.round(this.tempMotor),
      consumption: Math.round(this.consumption),
      odometer: Number(this.odometer.toFixed(1)),
      trip: Number(this.trip.toFixed(1)),
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
      isGpsActive: !this.isSimulation
    };
  }
}

// Eksportujemy zarówno nazwę GPSService, jak i domyślny eksport, zapobiegając błędom importu w innych plikach
export const GPSService = new GPSServiceClass();
export const telemetry = GPSService;
export default GPSService;
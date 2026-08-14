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
  private isSimulation = false; // Domyślnie tryb rzeczywisty / 0 gdy stoi

  private lastLat: number | null = null;
  private lastLon: number | null = null;
  private lastTime: number | null = null;

  // Wartości fizyczne
  private speed = 0;
  private current = 0;
  private power = 0;
  private duty = 0;
  private battery = 0;
  private tempEsc = 0;
  private tempMotor = 0;
  private consumption = 0;
  private odometer = 0.0;
  private trip = 0.0;
  private startTime = Date.now();

  constructor() {
    this.startLoop();
    this.enableGPS();
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
            if (dt > 0.4) {
              const dist = this.calculateDistance(this.lastLat, this.lastLon, pos.coords.latitude, pos.coords.longitude);
              rawSpeedKmH = (dist / dt) * 3.6;
            }
          }

          this.lastLat = pos.coords.latitude;
          this.lastLon = pos.coords.longitude;
          this.lastTime = pos.timestamp;

          // FILTR MARTWEJ STREFY (Eliminuje skakanie gdy telefon leży w miejscu)
          if (rawSpeedKmH < 2.5) {
            rawSpeedKmH = 0;
          }

          // Płynne filtrowanie wartości (EMA)
          this.speed += (rawSpeedKmH - this.speed) * 0.3;
          if (this.speed < 0.4) this.speed = 0;
        },
        (err) => console.warn("GPS Warning:", err),
        { enableHighAccuracy: true, maximumAge: 500, timeout: 3000 }
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
      if (Math.random() < 0.03) {
        const target = Math.random() > 0.2 ? Math.floor(Math.random() * 45) : 0;
        this.speed += (target - this.speed) * 0.1;
      }
    }

    // Gdy urządzenie stoi w miejscu, wyzeruj wartości wyliczane
    if (this.speed === 0) {
      this.current += (0 - this.current) * 0.2;
      this.power += (0 - this.power) * 0.2;
      this.duty += (0 - this.duty) * 0.2;
      this.consumption += (0 - this.consumption) * 0.2;
    } else {
      const targetAmps = Math.min(60, this.speed * 0.8 + Math.random() * 2);
      this.current += (targetAmps - this.current) * 0.2;
      this.power = this.current * 48;
      this.duty = Math.min(100, (this.speed / 60) * 100);
      this.consumption = 15 + Math.random() * 3;

      const distDelta = (this.speed / 3600) * 0.1;
      this.odometer += distDelta;
      this.trip += distDelta;
    }

    const data = this.getSnapshot();
    this.callbacks.forEach(cb => cb(data));
  }

  public getSnapshot(): TelemetryData {
    return {
      speed: Math.round(this.speed),
      current: Math.round(this.current),
      power: Math.round(this.power),
      duty: Math.round(this.duty),
      battery: Math.round(this.battery),
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

export const GPSService = new GPSServiceClass();
export const telemetry = GPSService;
export default GPSService;
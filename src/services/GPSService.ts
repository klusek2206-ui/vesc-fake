export class GPSService {
  private watchId: number | null = null;
  private currentRawSpeed: number = 0; // m/s
  private smoothedSpeedKmH: number = 0;
  private lastLat: number | null = null;
  private lastLon: number | null = null;
  private onDistanceDelta?: (deltaKm: number) => void;
  public hasPermission: boolean = false;
  public gpsAccuracy: number = 0;

  constructor(onDistanceDelta?: (deltaKm: number) => void) {
    this.onDistanceDelta = onDistanceDelta;
  }

  public start(): void {
    if (!('geolocation' in navigator)) return;

    this.watchId = navigator.geolocation.watchPosition(
      (pos) => {
        this.hasPermission = true;
        this.gpsAccuracy = pos.coords.accuracy;

        // Pobieranie prędkości GPS (m/s -> km/h)
        if (pos.coords.speed !== null && pos.coords.speed >= 0) {
          this.currentRawSpeed = pos.coords.speed * 3.6;
        } else {
          this.currentRawSpeed = 0;
        }

        // Dystans oparty na czystym GPS Haversine
        if (pos.coords.accuracy < 35 && this.lastLat !== null && this.lastLon !== null) {
          const distKm = this.haversineDistance(
            this.lastLat,
            this.lastLon,
            pos.coords.latitude,
            pos.coords.longitude
          );
          if (distKm > 0.001 && distKm < 0.2) { // Odrzucamy skoki GPS
            if (this.onDistanceDelta) this.onDistanceDelta(distKm);
          }
        }

        this.lastLat = pos.coords.latitude;
        this.lastLon = pos.coords.longitude;
      },
      (err) => {
        console.warn('GPS Error/Denied:', err.message);
        this.hasPermission = false;
        this.currentRawSpeed = 0;
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 5000
      }
    );
  }

  public stop(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  // Wygładzanie danych wejściowych prędkości
  public getSmoothedSpeed(): number {
    const alpha = 0.2; // Filtr dolnoprzepustowy
    this.smoothedSpeedKmH += (this.currentRawSpeed - this.smoothedSpeedKmH) * alpha;
    return Math.max(0, this.smoothedSpeedKmH);
  }

  private haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Promień Ziemi w km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}
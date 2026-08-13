export class GPSService {
  private watchId: number | null = null;
  private onSpeedUpdate: (speedKmH: number) => void;

  constructor(onSpeedUpdate: (speedKmH: number) => void) {
    this.onSpeedUpdate = onSpeedUpdate;
  }

  public start(): void {
    if (!navigator.geolocation) return;

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const speedMps = position.coords.speed || 0;
        const speedKmH = Math.max(0, speedMps * 3.6);
        this.onSpeedUpdate(speedKmH);
      },
      (error) => console.warn('GPS Error:', error),
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 2000
      }
    );
  }

  public stop(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }
}
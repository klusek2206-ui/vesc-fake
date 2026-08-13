import { VescDevice } from '../types/vesc';

export class FakeVESCService {
  public static async scanForDevices(): Promise<VescDevice[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: '1', name: 'VESC Scooter', signal: 'Excellent', rssi: -52 },
          { id: '2', name: 'VESC Controller', signal: 'Good', rssi: -68 },
          { id: '3', name: 'Electric Scooter', signal: 'Good', rssi: -72 },
          { id: '4', name: 'VESC GT', signal: 'Medium', rssi: -84 }
        ]);
      }, 1800);
    });
  }

  public static async connectDevice(_id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1500);
    });
  }
}
// src/app/services/tracking.service.ts
import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class TrackingService {
  private positions: any[] = [];

  constructor(private storage: Storage) {
    this.initStorage();
  }

  async initStorage() {
    await this.storage.create();
  }

  async startTracking() {
    const watchId = await Geolocation.watchPosition({}, (position, err) => {
      if (position) {
        const { latitude, longitude } = position.coords;
        this.positions.push({ latitude, longitude, timestamp: Date.now() });
        console.log("Positions: "+JSON.stringify(this.positions))
        
      }
    });
    return watchId;
  }

  async stopTracking(watchId: string) {
    Geolocation.clearWatch({ id: watchId });
    await this.storage.set('offline-positions', this.positions);
  }

  async syncDataToCloud() {
    const offlinePositions = await this.storage.get('offline-positions');
    if (offlinePositions) {
      // Envie os dados para a nuvem (API)
      console.log('Sincronizando:', offlinePositions);
      // Após sucesso:
      await this.storage.remove('offline-positions');
    }
  }

  async getData()
  {
    return this.positions;
  }
}

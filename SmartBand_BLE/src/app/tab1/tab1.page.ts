// src/app/tab1/tab1.page.ts
import { Component, OnInit, OnDestroy, ChangeDetectorRef} from '@angular/core';
import { TrackingService } from '../services/tracking.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit, OnDestroy {
  isTracking = false;
  watchId: string = '';
  dataService : any[] = [];
  dataInterval: any;

  constructor(private trackingService: TrackingService) {
    let data = JSON.stringify(this.trackingService.getData());
    this.dataService.push(data);
  }

  ngOnInit() {
    // Inicia a captura de dados a cada 3 segundos
    this.startDataCapture();
  }

  ngOnDestroy() {
    // Limpa o intervalo quando o componente for destruído
    if (this.dataInterval) {
      clearInterval(this.dataInterval);
    }
  }

  startDataCapture() {
    this.dataInterval = setInterval(async () => {
      const data = JSON.stringify(await this.trackingService.getData());
      this.dataService.push(data);
      console.log('Data pushed to service:', data);
      this.startWalk()
      this.startWalk()

    }, 3000); // 3000ms = 3 segundos
  }

  async startWalk() {
    this.isTracking = true;
    this.watchId = await this.trackingService.startTracking();
  }

  async stopWalk() {
    this.isTracking = false;
    await this.trackingService.stopTracking(this.watchId);
  }

  async syncToCloud() {
    await this.trackingService.syncDataToCloud();
    alert('Dados sincronizados!');
  }
}

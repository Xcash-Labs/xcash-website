import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadconfigService {
  private appConfig: any;

  constructor(private http: HttpClient) { }

  async loadAppConfig() {
    try {
      const dataObservable = this.http.get('/assets/config/webconfig.json');
      this.appConfig = await lastValueFrom(dataObservable);
    } catch (error) {
      console.error("Error loading app config:", error);
    }
  }

  getConfig() {
    return this.appConfig;
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  useLocal: boolean = true
  constructor(private http: HttpClient) { }

  getForecast(lat: number, lon: number) {
    if (this.useLocal)
      return this.http.get('assets/jsons/forecast.json')
    return this.http.get(`https://api.weatherbit.io/v2.0/forecast/daily?key=108d074d95644752b19ef310d1048157&lat=${lat}&lon=${lon}`)
  }

  getUserLocation(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            reject(error);
          }
        );
      }
    });
  }

  private readonly activePage = signal<'about' | 'home'>('home')

  getActivePage() {
    return this.activePage.asReadonly()
  }

  setActivePage(page: 'about' | 'home') {
    this.activePage.set(page)
  }

  getCities() {
      return this.http.get('assets/jsons/cities.json')
  }

}
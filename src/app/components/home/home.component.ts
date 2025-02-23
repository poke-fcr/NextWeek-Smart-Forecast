import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  constructor(private dataSvc: DataService) { }
  weatherData: any[] = []
  refinedWeatherData: any[] = []
  location: string = "NA"
  cities: any[] = []
  showDetails: boolean = true
  ngOnInit(): void {
    this.fetchCities()
    this.fetchGeoLocation()
  }

  fetchCities() {
    this.dataSvc.getCities().subscribe((data: any) => this.cities = data)
  }

  fetchGeoLocation() {
    this.dataSvc.getUserLocation().then((v: any) => this.getForeCast(v.latitude, v.longitude, true))
  }

  manualCity(event: any) {
    if (event && event.target && event.target.value) {
      let obj = this.cities.find(v => v.city == event.target.value)
      debugger;
      console.log(obj)
      this.getForeCast(obj.latitude, obj.longitude)
    }
  }

  getForeCast(latitude: number, longitude: number, isGPS?: boolean) {
    console.log(latitude, longitude)
    this.dataSvc.getForecast(latitude, longitude).subscribe((resp: any) => {
      if(isGPS){
      this.location = resp.city_name
      } else {
        this.location = 'NA'
      }
      this.weatherData = resp.data.splice(0, 7)
      this.refinedWeatherData = this.rankWeatherDays(this.weatherData)
    })
  }



  rankWeatherDays(weatherData: any) {
    // Assign scores
    weatherData.forEach((day: any) => {
      day.score = this.calculateScore(day);
    });

    // Sort days by score (descending order)
    weatherData.sort((a: { score: number; }, b: { score: number; }) => b.score - a.score);

    // Assign ranks (1 = best day, 7 = worst)
    weatherData.forEach((day: any, index: number) => {
      day.rank = index + 1;
    });

    return weatherData;
  }

  calculateScore(day: any): number {
    let score = 100;
  
    // 🌡️ Temperature (22°C is ideal)
    let tempDiff = Math.abs(day.temp - 22);
    let tempScore = 100 - tempDiff * 3;
  
    // 💧 Humidity (45% is ideal)
    let humidityDiff = Math.abs(day.rh - 45);
    let humidityScore = 100 - humidityDiff * 2;
  
    // ☁️ Cloud Cover (Fewer clouds preferred)
    let cloudScore = 100 - day.clouds;
  
    // 🌧️ Precipitation (0 mm is best)
    let precipScore = day.precip === 0 ? 100 : 100 - day.precip * 8;
  
    // ☔ Probability of Precipitation (POP) - A high chance of rain lowers the score
    let popScore = 100 - day.pop; // 100% chance of rain = 0 score
  
    // 💨 Wind Speed (Lower is better)
    let windScore = 100 - day.wind_spd * 8;
  
    // 📈 Pressure (1015 mb is ideal)
    let pressureDiff = Math.abs(day.pres - 1015);
    let pressureScore = 100 - pressureDiff * 0.2;
  
    // ☀️ UV Index (Lower is better)
    let uvPenalty = 0;
    if (day.uv > 15) uvPenalty = 40;  // Extreme
    else if (day.uv > 10) uvPenalty = 30;  // Very High
    else if (day.uv > 7) uvPenalty = 20;  // High
    else if (day.uv > 5) uvPenalty = 10;  // Moderate
  
    // 👀 Visibility (Higher is better)
    let visibilityScore = day.vis >= 10 ? 100 : day.vis * 10; // Max visibility is best
  
    // 🔥 Final weighted score
    score = (tempScore + humidityScore + cloudScore + precipScore + popScore + windScore + pressureScore + visibilityScore) / 8;
    score -= uvPenalty; // Deduct UV penalty
  
    return Math.max(0, Math.min(100, score)); // Keep within 0-100 range
  }
  

}

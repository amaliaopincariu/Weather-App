import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from "rxjs/operators";
import { __values } from "tslib";


@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private http: HttpClient) { }


  getCurrentForecastForCity(city:String)  {
    return this.http.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=ed6e9dd171cc32e3aa664de4d0ce3cc1&units=metric`)
  }
  getCurrentWeather()  {
    return new Observable((observer)=> {
      navigator.geolocation.getCurrentPosition(
        (position)=>{
          observer.next(position)
        },
        (error)=>{
          observer.next(error)
        }
      )
    }).pipe(
      map((value:any)=>{
        return new HttpParams()
          .set('lon', value.coords.longitude)
          .set('lat', value.coords.latitude)
          .set("units", "metric")
      }),
      switchMap((values)=>{
        return this.http.get(`https://api.openweathermap.org/data/2.5/weather?lat=${values.get('lat')}&lon=${values.get('lon')}&appid=ed6e9dd171cc32e3aa664de4d0ce3cc1&units=${values.get('units')}`)
      })
    )    
  }
}

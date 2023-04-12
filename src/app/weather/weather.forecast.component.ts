import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-weather-forecast',
  templateUrl: './weather.forecast.component.html',
  styleUrls: ['./weather.forecast.component.css']
})
export class WeatherForecastComponent implements OnInit {

  

  constructor(private weatherService: WeatherService) { }

  ngOnInit() {
    
  


}
}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { WeatherForecastComponent } from './weather/weather.forecast.component';
import { FormsModule } from '@angular/forms';
import { SearchlWeatherForecastComponent } from './search-weather-forecast/search-weather-forecast.component';
import { weatherRouting  } from './weather.routing';
import { AppRoutingModule } from './app-routing.module';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WeatherForecastComponent,
    SearchlWeatherForecastComponent,
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    weatherRouting,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { ModuleWithProviders } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { SearchlWeatherForecastComponent } from "./search-weather-forecast/search-weather-forecast.component";

const WEATHER_ROUTER:Routes =[
    {path: "", component:HomeComponent },
    {path: "search", component:SearchlWeatherForecastComponent }
]

export const weatherRouting:ModuleWithProviders<RouterModule>= RouterModule.forRoot(WEATHER_ROUTER)
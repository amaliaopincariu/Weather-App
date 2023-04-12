import { Component, OnInit, HostListener } from '@angular/core';
import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-search-weather-forecast',
  templateUrl: './search-weather-forecast.component.html',
  styleUrls: ['./search-weather-forecast.component.css']
})
export class SearchlWeatherForecastComponent implements OnInit {

  currentWeather: any = null
  location: string = ''
  propretyTemp = [];
  hoursTemp = [];
  agregateTemps = new Map<string, any>();
  tempMaps = new Map<string, any>();
  weatherNow: any;
  currentTime = new Date();
  time: [0];
  timeline: any = [];
  forecast: any;
  temp = [];
  list = [0];
  cityHistory = [];
  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
  }



  getTodayForecast(today: any) {
    const todayWeather = {
      mainDescription: today.weather[0].main,
      icon: today.weather[0].icon,
      min: today.main.temp_min,
      max: today.main.temp_max,
      temp: today.main.temp,
      name: today.name
    }

    this.currentWeather = todayWeather
    this.location = this.currentWeather.name
    this.getWeather()
  }

  mapTodayForecast(weatherList: any) {
    this.agregateTemps.clear();
    console.log(this.agregateTemps)
    for (let i = 0; i < weatherList['list'].length; i++) {
      let currentItem = weatherList['list'][i]
      const date = new Date(currentItem['dt_txt']);
      var currentKey = date.getDay().toString()
      let savedItem = this.agregateTemps.has(currentKey);
      if (savedItem == false) {
        this.agregateTemps.set(currentKey, [currentItem])
      } else {
        var currentValue = this.agregateTemps.get(currentKey);
        currentValue.push(currentItem);
        this.agregateTemps.set(currentKey, currentValue);
      }
    }
  }

  calculateAvergages() {
    let keys = Object.keys(this.agregateTemps);
    for (let key in keys) {
      let allValues = this.agregateTemps.get(key) as Array<any>;
      let tempSum: number = 0;
      let feelsSum: number = 0;
      let humiditySum: number = 0;
       allValues.forEach(element => {
        tempSum = tempSum + Number(element['main']['temp'])
        feelsSum = tempSum + Number(element['main']['feels_like'])
        humiditySum = tempSum + Number(element['main']['humidity'])
      });
    }
  }

  testMethod(data: any) {
    console.log(data)
    // Filter the data to get only the information you need for the next 5 days

    let city = data["city"]["name"];
    let country = data["city"]["country"];
    const filteredData = data.list.filter((item: any) => {
      const date = new Date(item.dt_txt);
      const today = new Date();
      const next7Days = new Date(today.setDate(today.getDate() + 7));
      return date <= next7Days;
    });

    // Group the filtered data by date
    const groupedData = filteredData.reduce((acc: any, curr: any) => {
      const date = curr.dt_txt.substr(0, 10);
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(curr);
      return acc;
    }, {});

    // Calculate the average temperature and other statistics for each day's arrforEachay
    const dailyData = Object.values(groupedData).map((item: any[]) => {
      const temps = item.map(x => x.main.temp);
      return {
        date: item[0].dt_txt.substr(0, 10),
        temp: temps.reduce((sum, x) => sum + x) / temps.length,
        min: Math.min(...temps),
        max: Math.max(...temps),
        description: item[0].weather[0].description,
        icon: item[0].weather[0].icon,
        name: city,
        country: country,
      }
    });

    // Save the daily weather data to the component's property
    this.propretyTemp = dailyData;
  }


  getWeather() {
    if (this.location == '') {
      this.weatherService.getCurrentWeather().subscribe(data => {
        this.getTodayForecast(data);
      });
    } else {
      if (this.cityHistory.indexOf(this.location.toLowerCase()) == -1) {
        this.cityHistory.push(this.location.toLowerCase());
      }

      this.weatherService.getCurrentForecastForCity(this.location).subscribe(today => {
        const todayWeather = {
          mainDescription: today["list"][0].weather[0].description,
          icon: today['list'][0].weather[0].icon,
          min: today['list'][0].main['temp_min'],
          max: today['list'][0].main['temp_max'],
          temp: today['list'][0].main['temp'],
          name: today["city"].name,
          country: today["city"].country,
        }
        this.currentWeather = todayWeather;
        this.testMethod(today);

        this.hoursTemp = []
        for (let i = 0; i < 7; i++) {
          let dateX = new Date(today['list'][i]['dt_txt']);
          const currentDayData = {
            name: today['city']['name'],
            country: today['city']['country'],
            date: today['list'][i]['dt_txt'],
            temp: today['list'][i]['main']['temp'],
            feels_like: today['list'][i]['main']['feels_like'],
            main: today['list'][i]['weather'][0]['main'],
            description: today['list'][i]['weather'][0]['description'],
            icon: today['list'][i]['weather'][0]['icon'],
            humidity: today['list'][i]['main']['humidity'],
            hours: dateX.getHours().toString() + ":00",
          };
          this.hoursTemp.push(currentDayData)
        }
      });
    }
  }
}

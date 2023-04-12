import { Component, OnInit, HostListener } from '@angular/core';
import { WeatherService } from '../weather.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  showSeachBar = false;
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
  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.weatherService.getCurrentWeather().subscribe(data => {
      this.getTodayForecast(data);
    });
  }
  //calculates the range in hours data range
  dateRange() {
    const start = new Date();
    start.setHours(start.getHours() + (start.getTimezoneOffset() / 60));
    const to = new Date(start);
    to.setHours(to.getHours() + 2, to.getMinutes() + 59, to.getSeconds() + 59);
    return { start, to }
  }
  // the function that fetches the data from the API
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
  //a list mapping data from API
  mapTodayForecast(weatherList: any) {
    this.agregateTemps.clear();
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
      this.weatherService.getCurrentForecastForCity(this.location).subscribe(today => {
        const todayWeather = {
          mainDescription: today['weather'][0]['main'],
          icon: today['weather'][0]['icon'],
          min: today['main']['temp_min'],
          max: today['main']['temp_max'],
          temp: today['main']['temp'],
          name: today['name']
        }

        this.currentWeather = todayWeather
      })

      this.weatherService.getCurrentForecastForCity(this.location).subscribe(data => {

        this.propretyTemp = [];
        this.testMethod(data);

        this.hoursTemp = []
        for (let i = 0; i < 7; i++) {
          let dateX = new Date(data['list'][i]['dt_txt']);
          const currentDayData = {
            name: data['city']['name'],
            country: data['city']['country'],
            date: data['list'][i]['dt_txt'],
            temp: data['list'][i]['main']['temp'],
            feels_like: data['list'][i]['main']['feels_like'],
            main: data['list'][i]['weather'][0]['main'],
            description: data['list'][i]['weather'][0]['description'],
            icon: data['list'][i]['weather'][0]['icon'],
            humidity: data['list'][i]['main']['humidity'],
            hours: dateX.getHours().toString() + ":00",
          };

          this.hoursTemp.push(currentDayData)
        }
      });
    }
  }
}

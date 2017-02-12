import { Component } from '@angular/core';
import { ApiService } from './shared';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import '../style/app.scss';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent {
  forecast = {};
  forecasts = {};
  schedule = {};
  public forecast_saved: string;
  frequency: number = 5;
  interval: number = 10; // in minutes
  rainCount: number = 0;
  waterCount: number = 0;
  needWater: boolean = false; 
  n: number = 0;

  constructor(private apiService: ApiService) {
  		this.runApp();
  		// interval observable - every 10 minutes, fire runApp()
  	    IntervalObservable.create(this.interval * 60000).subscribe(n => this.runApp());
  }

  runApp() {
  	// clear counts
  	this.rainCount = 0;
  	this.waterCount = 0;
  	this.getForecast();
  }

  getForecast() {
  	this.apiService.getCurrentForecast()
  	.subscribe(
  		data => this.forecast = data,
  		err => console.log(err),
  		() => this.saveForecast(this.forecast.Message)
  	);

  }

  saveForecast(result) {
	  this.apiService.saveCurrentForecast(result)
	  	.subscribe(
	  		data => this.forecast_saved = data,
	  		err => console.log(err),
	  		() => this.getExistingForecast(this.frequency)
	  	);
  }

  // check last 5 days forecast

  getExistingForecast(frequency) {
  	this.apiService.getExistingForecast(frequency)
	  	.subscribe(
	  		data => this.forecasts = data.Message,
	  		err => console.log(err),
	  		() => this.checkRain()
	  	);
  }

  // check if i've watered

  checkRain() {
  	for (let forecast of this.forecasts) {
  		if (forecast[0].toLowerCase().indexOf('rain') >= 0) {
  			this.rainCount++;
  		}
  	}

  	this.checkWatered();
  }

  checkWatered() {
  	this.apiService.getSchedule(this.frequency)
	  	.subscribe(
	  		data => this.schedule = data.Message,
	  		err => console.log(err),
	  		() => this.updateStatus()
	  	);
  }

  // if rain count == 0 and water count == 0, display red else display green

  updateStatus() {
	for (let watered of this.schedule) {
		if (watered[0]) {
			this.waterCount++;
		}
	}

  	if (this.rainCount == 0 && this.waterCount == 0) {
  		this.needWater = true;
  	} else {
  		this.needWater = false;
  	}
  }

  // on click alert, store watering date and change to green

  waterPlants() {
  	this.apiService.createSchedule()
	  	.subscribe(
	  		data => this.checkWatered(),
	  		err => console.log(err)
	  		);
  }


}





import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions} from "@angular/http";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()	
export class ApiService {
	title = 'Angular 2';
	forecast = {};
	startDate = new Date();
	endDate = new Date();

	constructor(private http:Http) {}

	getCurrentForecast() {
		return this.http.get('http://10.0.1.99:5000/getCurrentForecast')
	      .map((res:Response) => res.json());

	}

	saveCurrentForecast(result) {
		let headers = new Headers({ 'Content-Type': 'application/json' });
	    let options = new RequestOptions({ headers: headers });
		let body = JSON.stringify( {date : this.endDate.toISOString().substring(0, 10), forecast : result });

		return this.http.post('http://10.0.1.99:5000/createForecast', body, options)
	      .map((res:Response) => res.json());

	}

	getExistingForecast(frequency:number) {
		this.startDate.setDate(this.endDate.getDate() - frequency);

		return this.http.get('http://10.0.1.99:5000/getExistingForecast?start_date=' + this.startDate.toISOString().substring(0, 10) + '&end_date=' + this.endDate.toISOString().substring(0, 10))
	      .map((res:Response) => res.json());

	}

	getSchedule(frequency:number) {
		this.startDate.setDate(this.endDate.getDate() - frequency);

		return this.http.get('http://10.0.1.99:5000/getSchedule?start_date=' + this.startDate.toISOString().substring(0, 10) + '&end_date=' + this.endDate.toISOString().substring(0, 10))
	      .map((res:Response) => res.json());

	}

	createSchedule() {
		let headers = new Headers({ 'Content-Type': 'application/json' });
	    let options = new RequestOptions({ headers: headers });
		let body = JSON.stringify( { date : this.endDate.toISOString().substring(0, 10) });

		return this.http.post('http://10.0.1.99:5000/createSchedule', body, options)
	      .map((res:Response) => res.json());

	}
}

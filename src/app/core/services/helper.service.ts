import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class HelperService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getCountries() {
        return this.http.get(`${this.apiUrl}/api/helper/countries`);
    }

    getLocals() {
        return this.http.get(`${this.apiUrl}/api/helper/locals`);
    }

    getLanguages() {
        return this.http.get(`${this.apiUrl}/api/helper/languages`);
    }

    getCurrencies() {
        return this.http.get(`${this.apiUrl}/api/helper/currencies`);
    }

    getTimezones() {
        return this.http.get(`${this.apiUrl}/api/helper/timezone`);
    }

    getDays() {
        return this.http.get(`${this.apiUrl}/api/helper/days`);
    }

    getFormTables() {
        return this.http.get(`${this.apiUrl}/api/helper/formtables`);
    }

    // executeCronJob() {
    // 	return this.http.get(`${this.apiUrl}/api/cronjob`);
    // }

}

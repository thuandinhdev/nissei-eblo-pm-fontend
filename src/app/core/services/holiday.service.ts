import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Holiday} from '../../shared/models/holiday.model';

import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class HolidayService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getAll(year) {
        return this.http.get<Holiday[]>(`${this.apiUrl}/api/holidays?year=${year}`);
    }

    getById(id: number) {
        return this.http.get(`${this.apiUrl}/api/holidays/${id}`);
    }

    create(holiday: Holiday) {
        return this.http.post(`${this.apiUrl}/api/holidays`, holiday);
    }

    update(holiday: Holiday) {
        return this.http.put(`${this.apiUrl}/api/holidays/${holiday.id}`, holiday);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/api/holidays/${id}`);
    }

    yearAllHolidays(year: number) {
        return this.http.post(`${this.apiUrl}/api/all-year-holidays`, {year: year});
    }

}

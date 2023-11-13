import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class DashboardService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getDashboardCounts(length: number) {
        return this.http.post(`${this.apiUrl}/api/helper/dashboard`, {length: length});
    }

    getDashboardLists(length: number) {
        return this.http.post(`${this.apiUrl}/api/helper/pm/dashboard`, {length: length});
    }

    getTodayActivities(length: number) {
        return this.http.post(`${this.apiUrl}/api/get-today-activity`, {length: length});
    }
}


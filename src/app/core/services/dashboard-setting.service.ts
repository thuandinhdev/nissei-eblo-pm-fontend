import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class DashboardSettingService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getAll() {
        return this.http.get(`${this.apiUrl}/api/dashboard-settings`);
    }

    create(settings) {
        return this.http.post(`${this.apiUrl}/api/dashboard-settings`, settings);
    }
}

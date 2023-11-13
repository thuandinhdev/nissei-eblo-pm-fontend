import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class EstimateSettingService {

    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getAll() {
        return this.http.get(`${this.apiUrl}/api/estimate-setting`);
    }

    create(params) {
        return this.http.post(`${this.apiUrl}/api/estimate-setting`, params);
    }
}

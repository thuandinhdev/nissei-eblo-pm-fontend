import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class InvoiceSettingService {

    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getAll() {
        return this.http.get(`${this.apiUrl}/api/invoice-setting`);
    }

    create(params) {
        return this.http.post(`${this.apiUrl}/api/invoice-setting`, params);
    }
}

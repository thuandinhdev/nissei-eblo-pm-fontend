import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Setting} from '../../shared/models/setting.model';

import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class SettingService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getAll() {
        return this.http.get<Setting[]>(`${this.apiUrl}/api/settings`);
    }

    getSettings() {
        return this.http.get<Setting[]>(`${this.apiUrl}/api/settings/get-settings`);
    }

    getById(id: number) {
        return this.http.get(`${this.apiUrl}/api/settings/${id}`);
    }

    create(setting: Setting) {
        return this.http.post(`${this.apiUrl}/api/settings`, setting);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/api/settings/${id}`);
    }

    saveWorkingDays(data) {
        return this.http.post(`${this.apiUrl}/api/working-days`, data);
    }

    sendTestEmail() {
        return this.http.get(`${this.apiUrl}/api/settings/sent-test-email`);
    }

    getWorkingDays() {
        return this.http.get(`${this.apiUrl}/api/working-days`);
    }

    getPaymentGatewaySettings() {
        return this.http.get(`${this.apiUrl}/api/payment-gateway-setting`);
    }

    createPaymentGatewaySettings(setting) {
        return this.http.post(`${this.apiUrl}/api/payment-gateway-setting`, setting);
    }

    getSlackSettings() {
        return this.http.get(`${this.apiUrl}/api/slack-setting`);
    }

    createSlackSettings(setting) {
        return this.http.post(`${this.apiUrl}/api/slack-setting`, setting);
    }

}

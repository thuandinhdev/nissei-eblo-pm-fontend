import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class AppointmentsService {

    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getAll(status, date) {
        return this.http.get(`${this.apiUrl}/api/appointments?status=${status}&date=${date}`);
    }

    getById(id: number) {
        return this.http.get(`${this.apiUrl}/api/appointments/${id}`);
    }

    create(appointments) {
        return this.http.post(`${this.apiUrl}/api/appointments`, appointments);
    }

    update(appointments) {
        return this.http.put(`${this.apiUrl}/api/appointments/${appointments.id}`, appointments);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/api/appointments/${id}`);
    }

    changeStatus(appointments: any) {
        return this.http.post(`${this.apiUrl}/api/appointments/${appointments.id}/change-status`, {status: appointments.status});
    }

    getAppointmentAvailabilities(appointments) {
        return this.http.get(`${this.apiUrl}/api/appointments/availabilities/${appointments.provider_id}/${appointments.start_date_time}`);
    }
}

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Leave} from '../../shared/models/leave.model';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class LeaveService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getAll() {
        return this.http.get<Leave[]>(`${this.apiUrl}/api/leaves`);
    }

    getById(id: number) {
        return this.http.get(`${this.apiUrl}/api/leaves/${id}`);
    }

    create(leave: Leave) {
        return this.http.post(`${this.apiUrl}/api/leaves`, leave);
    }

    update(leave: Leave) {
        return this.http.put(`${this.apiUrl}/api/leaves/${leave.id}`, leave);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/api/leaves/${id}`);
    }

    getCalendarLeaves() {
        return this.http.get(`${this.apiUrl}/api/leaves/calendar`);
    }

    getPendingLeaves() {
        return this.http.get(`${this.apiUrl}/api/leaves/pending`);
    }

    changeStatus(leave: any) {
        return this.http.post(`${this.apiUrl}/api/leaves/change-status/${leave.id}`, {'status': leave.status});
    }

    changeRejectLeaveStatus(leave: any) {
        return this.http.post(`${this.apiUrl}/api/leaves/change-status/${leave.id}`, leave);
    }

    getLeaveReportDetails(leave: any) {
        return this.http.post(`${this.apiUrl}/api/leaves/report-details`, leave);
    }
}

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Timesheet} from '../../shared/models/timesheet.model';

import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class TimesheetService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getTimesheetsByModule(params: any) {
        return this.http.post(`${this.apiUrl}/api/get-timesheets`, params);
    }

    create(params: any) {
        return this.http.post(`${this.apiUrl}/api/timesheets`, params);
    }

    update(timesheet: Timesheet) {
        return this.http.put(`${this.apiUrl}/api/timesheets/${timesheet.id}`, timesheet);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/api/timesheets/${id}`);
    }
}

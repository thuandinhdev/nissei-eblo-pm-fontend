import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Meeting} from '../../shared/models/meeting.model';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class MeetingService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getAll() {
        return this.http.get<Meeting[]>(`${this.apiUrl}/api/meetings`);
    }

    getById(id: number) {
        return this.http.get(`${this.apiUrl}/api/meetings/${id}`);
    }

    create(meeting) {
        return this.http.post(`${this.apiUrl}/api/meetings`, meeting);
    }

    update(meeting: Meeting) {
        return this.http.put(`${this.apiUrl}/api/meetings/${meeting.id}`, meeting);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/api/meetings/${id}`);
    }

    changeStatus(params: any) {
        return this.http.post(`${this.apiUrl}/api/meetings/${params.ids}/change-status`, {'status': params.status});
    }

    getCalendarMeetings() {
        return this.http.get(`${this.apiUrl}/api/meetings/calendar`);
    }
}

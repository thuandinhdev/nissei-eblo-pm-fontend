import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Announcement} from '../../shared/models/announcement.model';

import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class AnnouncementService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getAll() {
        return this.http.get<Announcement[]>(`${this.apiUrl}/api/announcements`);
    }

    getById(id: number) {
        return this.http.get(`${this.apiUrl}/api/announcements/${id}`);
    }

    create(announcement: Announcement) {
        return this.http.post(`${this.apiUrl}/api/announcements`, announcement);
    }

    update(announcement: Announcement) {
        return this.http.put(`${this.apiUrl}/api/announcements/${announcement.id}`, announcement);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/api/announcements/${id}`);
    }
}

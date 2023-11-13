import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Leavetype} from '../../shared/models/leavetype.model';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class LeavetypeService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getAll() {
        return this.http.get<Leavetype[]>(`${this.apiUrl}/api/leave-type`);
    }

    getById(id: number) {
        return this.http.get(`${this.apiUrl}/api/leave-type/${id}`);
    }

    create(leavetype: Leavetype) {
        return this.http.post(`${this.apiUrl}/api/leave-type`, leavetype);
    }

    update(leavetype: Leavetype) {
        return this.http.put(`${this.apiUrl}/api/leave-type/${leavetype.id}`, leavetype);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/api/leave-type/${id}`);
    }
}

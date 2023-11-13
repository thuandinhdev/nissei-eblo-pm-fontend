import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Role} from '../../shared/models/role.model';

import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class RoleService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getAll() {
        return this.http.get<Role[]>(`${this.apiUrl}/api/roles`);
    }

    getById(id: number) {
        return this.http.get(`${this.apiUrl}/api/roles/${id}`);
    }

    create(role: Role) {
        return this.http.post(`${this.apiUrl}/api/roles`, role);
    }

    update(role: Role) {
        return this.http.put(`${this.apiUrl}/api/roles/${role.id}`, role);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/api/roles/${id}`);
    }
}

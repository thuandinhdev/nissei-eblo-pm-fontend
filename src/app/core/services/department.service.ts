import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class DepartmentService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getAll() {
        return this.http.get(`${this.apiUrl}/api/departments`);
    }

    getById(id: number) {
        return this.http.get(`${this.apiUrl}/api/departments/${id}`);
    }

    create(department) {
        return this.http.post(`${this.apiUrl}/api/departments`, department);
    }

    update(department) {
        return this.http.put(`${this.apiUrl}/api/departments/${department.id}`, department);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/api/departments/${id}`);
    }

    deleteDepartmentRole(id: number, roleId: number) {
        return this.http.delete(`${this.apiUrl}/api/departments/${id}/${roleId}`);
    }

    getDepartmentDetail(id: number, roleId: number) {
        return this.http.get(`${this.apiUrl}/api/departments/${id}/${roleId}`);
    }

    updateDepartmentDetail(id: number, roleId: number, menu: {}) {
        return this.http.put(`${this.apiUrl}/api/departments/${id}/${roleId}`, menu);
    }

    getDepartmentsClientsRoles() {
        return this.http.get(`${this.apiUrl}/api/departments/clients-roles`);
    }
}

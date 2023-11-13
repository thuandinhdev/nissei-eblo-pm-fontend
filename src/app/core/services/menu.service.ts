import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class MenuService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getAll() {
        return this.http.get(`${this.apiUrl}/api/menu`);
    }

    getById(id: number) {
        return this.http.get(`${this.apiUrl}/api/menu/${id}`);
    }

    create(menu) {
        return this.http.post(`${this.apiUrl}/api/menu`, menu);
    }

    update(menu) {
        return this.http.put(`${this.apiUrl}/api/menu/${menu.id}`, menu);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/api/menu/${id}`);
    }

    getSidebarMenu() {
        return this.http.get(`${this.apiUrl}/api/sidebar-menu`);
    }
}

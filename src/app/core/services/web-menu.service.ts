import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class WebMenuService {

    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    create(menu: any) {
        return this.http.post(`${this.apiUrl}/api/web-menu`, menu);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/api/web-menu/${id}`);
    }

    update(menu: any) {
        return this.http.put(`${this.apiUrl}/api/web-menu/${menu.id}`, menu);
    }

    getDataSubMenu() {
        return this.http.get(`${this.apiUrl}/api/get-data-sub-menu`);
    }

    createSubMenu(menu: any) {
        return this.http.post(`${this.apiUrl}/api/add-web-sub-menu`, menu);
    }

    deleteSubMenu(id: number) {
        return this.http.delete(`${this.apiUrl}/api/web-sub-menu/${id}`);
    }

    updateSubMenu(menu: any) {
        return this.http.put(`${this.apiUrl}/api/web-sub-menu/${menu.id}`, menu);
    }

}



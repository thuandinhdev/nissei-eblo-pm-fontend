import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Themes} from '../../shared/models/themes.model';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ThemesService {

    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getAll() {
        return this.http.get<Themes[]>(`${this.apiUrl}/api/themes`);
    }

    getById(id: number) {
        return this.http.get(`${this.apiUrl}/api/themes/${id}`);
    }

    create(themes: Themes) {
        return this.http.post(`${this.apiUrl}/api/themes`, themes);
    }

    createImport(themes: Themes) {
        return this.http.post(`${this.apiUrl}/api/themes-import`, themes);
    }

    update(themes: Themes) {
        return this.http.put(`${this.apiUrl}/api/themes/${themes.id}`, themes);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/api/themes/${id}`);
    }

    changeStatus(data: any) {
        return this.http.post(`${this.apiUrl}/api/themes/${data.id}/change-status`, {status: data.status});
    }
}



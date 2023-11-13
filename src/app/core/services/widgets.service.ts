import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Widgets} from '../../shared/models/widgets.model';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class WidgetsService {

    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getAll() {
        return this.http.get<Widgets[]>(`${this.apiUrl}/api/widgets`);
    }

    getById(id: number) {
        return this.http.get(`${this.apiUrl}/api/widgets/${id}`);
    }

    create(widgets: Widgets) {
        return this.http.post(`${this.apiUrl}/api/widgets`, widgets);
    }

    update(widgets: Widgets) {
        return this.http.put(`${this.apiUrl}/api/widgets/${widgets.id}`, widgets);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/api/widgets/${id}`);
    }
    getUseData() {
        return this.http.get(`${this.apiUrl}/api/widgets/getusedata`);
    }
    
}



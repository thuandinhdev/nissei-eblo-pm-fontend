import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {WidgetsTypes} from '../../shared/models/widgets-types.model';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class WidgetsTypesService {

    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getAll() {
        return this.http.get<WidgetsTypes[]>(`${this.apiUrl}/api/widget-types`);
    }

    getById(id: number) {
        return this.http.get(`${this.apiUrl}/api/widget-types/${id}`);
    }

    create(widgets_type: WidgetsTypes) {
        return this.http.post(`${this.apiUrl}/api/widget-types`, widgets_type);
    }

    update(widgets_type: WidgetsTypes) {
        return this.http.put(`${this.apiUrl}/api/widget-types/${widgets_type.id}`, widgets_type);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/api/widget-types/${id}`);
    }

    getFieldById(id: number) {
        return this.http.get(`${this.apiUrl}/api/widget-types-field/${id}`);
    }

    addFeildInWidget(managerWidgets) {
        return this.http.post(`${this.apiUrl}/api/widget-types/add-field-in-widget`, managerWidgets);
    }

    updateFeildInWidget(managerWidgets) {
        return this.http.put(`${this.apiUrl}/api/widget-types-field/${managerWidgets.id}`, managerWidgets);
    }

    deleteManagerWidgetsTypes(id: number) {
        return this.http.delete(`${this.apiUrl}/api/widget-types-field/${id}`);
    }

    getFieldAll() {
        return this.http.get(`${this.apiUrl}/api/all-fields`);
    }
}



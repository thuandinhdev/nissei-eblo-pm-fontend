import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Pages} from '../../shared/models/pages.model';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PagesService {

    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getAll() {
        return this.http.get<Pages[]>(`${this.apiUrl}/api/pages`);
    }

    getById(id: number) {
        return this.http.get(`${this.apiUrl}/api/pages/${id}`);
    }

    create(pages: Pages) {
        return this.http.post(`${this.apiUrl}/api/pages`, pages);
    }

    update(pages: Pages) {
        return this.http.put(`${this.apiUrl}/api/pages/${pages.id}`, pages);
    }

    clonePage(id: number) {
        return this.http.get(`${this.apiUrl}/api/clonePage/${id}`);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/api/pages/${id}`);
    }

    getWidgetById(id: number) {
        return this.http.get(`${this.apiUrl}/api/pages-widget/${id}`);
    }

    managerWidgets(managerWidgets) {
        return this.http.post(`${this.apiUrl}/api/pages/manager-widgets`, managerWidgets);
    }

    updateManagerWidget(managerWidgets) {
        return this.http.put(`${this.apiUrl}/api/manager-widgets/${managerWidgets.id}`, managerWidgets);
    }

    deleteManagerWidget(id: number) {
        return this.http.delete(`${this.apiUrl}/api/manager-widget/${id}`);
    }

    changeStatus(data: any) {
        return this.http.post(`${this.apiUrl}/api/manager-widget-change-status/${data.id}`, {status: data.status});
    }
}



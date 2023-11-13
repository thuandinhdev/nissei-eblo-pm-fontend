import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Templates} from '../../shared/models/templates.model';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TemplatesService {

    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getAll() {
        return this.http.get<Templates[]>(`${this.apiUrl}/api/templates`);
    }

    getById(id: number) {
        return this.http.get(`${this.apiUrl}/api/templates/${id}`);
    }

    getRegionById(id: number) {
        return this.http.get(`${this.apiUrl}/api/templates-region/${id}`);
    }

    create(templates: Templates) {
        return this.http.post(`${this.apiUrl}/api/templates`, templates);
    }

    managerRegions(managerRegions) {
        return this.http.post(`${this.apiUrl}/api/templates/manager-regions`, managerRegions);
    }

    update(templates: Templates) {
        return this.http.put(`${this.apiUrl}/api/templates/${templates.id}`, templates);
    }

    updateManagerRegion(managerRegions) {
        return this.http.put(`${this.apiUrl}/api/manager-regions/${managerRegions.id}`, managerRegions);
    }


    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/api/templates/${id}`);
    }

    deleteManagerRegion(id: number) {
        return this.http.delete(`${this.apiUrl}/api/manager-region/${id}`);
    }

    changeStatus(data: any) {
        return this.http.post(`${this.apiUrl}/api/manager-regions-change-status/${data.id}`, {status: data.status});
    }
}



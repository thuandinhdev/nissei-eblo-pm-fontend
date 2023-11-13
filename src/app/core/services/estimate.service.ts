import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Estimate} from '../../shared/models/estimate.model';

import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class EstimateService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getAll(year) {
        return this.http.get<Estimate[]>(`${this.apiUrl}/api/estimates`);
    }

    getById(id: number) {
        return this.http.get(`${this.apiUrl}/api/estimates/${id}`);
    }

    create(estimate) {
        return this.http.post(`${this.apiUrl}/api/estimates`, estimate);
    }

    update(estimate) {
        return this.http.put(`${this.apiUrl}/api/estimates/${estimate.id}`, estimate);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/api/estimates/${id}`);
    }

    changeStatus(estimate: any) {
        return this.http.post(`${this.apiUrl}/api/estimates/change-status/${estimate.id}`, {'status': estimate.status});
    }

    download(id) {
        return this.http.get(`${this.apiUrl}/api/estimates/download/${id}`);
    }
}

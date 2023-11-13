import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Tax} from '../../shared/models/tax.model';

import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class TaxService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getAll() {
        return this.http.get<Tax[]>(`${this.apiUrl}/api/taxes`);
    }

    getById(id: number) {
        return this.http.get(`${this.apiUrl}/api/taxes/${id}`);
    }

    create(tax: Tax) {
        return this.http.post(`${this.apiUrl}/api/taxes`, tax);
    }

    update(tax: Tax) {
        return this.http.put(`${this.apiUrl}/api/taxes/${tax.id}`, tax);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/api/taxes/${id}`);
    }
}

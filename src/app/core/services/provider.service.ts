import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Provider} from '../../shared/models/provider.model';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class ProviderService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getAll() {
        return this.http.get<Provider[]>(`${this.apiUrl}/api/providers`);
    }

    getById(id: number) {
        return this.http.get(`${this.apiUrl}/api/providers/${id}`);
    }

    create(providers: Provider) {
        return this.http.post(`${this.apiUrl}/api/providers`, providers);
    }

    update(providers: Provider) {
        return this.http.put(`${this.apiUrl}/api/providers/${providers.id}`, providers);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/api/providers/${id}`);
    }
}

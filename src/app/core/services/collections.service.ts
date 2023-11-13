import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Collections} from '../../shared/models/collections.model';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CollectionsService {

    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getAll() {
        return this.http.get<Collections[]>(`${this.apiUrl}/api/collections`);
    }

    getTemplate() {
        return this.http.get(`${this.apiUrl}/api/collections/get-template`);
    }

    getById(id: number) {
        return this.http.get(`${this.apiUrl}/api/collections/get-by-id/${id}`);
    }

    create(collections: Collections) {
        return this.http.post(`${this.apiUrl}/api/collections`, collections);
    }

    update(collections: Collections) {
        return this.http.put(`${this.apiUrl}/api/collections/${collections.id}`, collections);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/api/collections/destroy/${id}`);
    }
}



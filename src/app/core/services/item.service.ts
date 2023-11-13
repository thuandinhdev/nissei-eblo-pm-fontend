import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Item} from '../../shared/models/item.model';

import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class ItemService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getAll() {
        return this.http.get<Item[]>(`${this.apiUrl}/api/items`);
    }

    getById(id: number) {
        return this.http.get(`${this.apiUrl}/api/items/${id}`);
    }

    create(item: Item) {
        return this.http.post(`${this.apiUrl}/api/items`, item);
    }

    update(item: Item) {
        return this.http.put(`${this.apiUrl}/api/items/${item.id}`, item);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/api/items/${id}`);
    }
}

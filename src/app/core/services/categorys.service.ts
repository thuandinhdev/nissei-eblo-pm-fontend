import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Categorys} from '../../shared/models/categorys.model';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CategorysService {

    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getAll() {
        return this.http.get<Categorys[]>(`${this.apiUrl}/api/categorys`);
    }

    getTemplate() {
        return this.http.get(`${this.apiUrl}/api/categorys/get-template`);
    }

    getById(id: number) {
        return this.http.get(`${this.apiUrl}/api/categorys/get-by-id/${id}`);
    }

    create(categorys: Categorys) {
        return this.http.post(`${this.apiUrl}/api/categorys`, categorys);
    }

    update(categorys: Categorys) {
        return this.http.put(`${this.apiUrl}/api/categorys/${categorys.id}`, categorys);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/api/categorys/destroy/${id}`);
    }
}



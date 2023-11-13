import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Regions} from '../../shared/models/regions.model';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class RegionsService {

    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getAll() {
        return this.http.get<Regions[]>(`${this.apiUrl}/api/regions`);
    }

    getById(id: number) {
        return this.http.get(`${this.apiUrl}/api/regions/${id}`);
    }

    create(regions: Regions) {
        return this.http.post(`${this.apiUrl}/api/regions`, regions);
    }

    update(regions: Regions) {
        return this.http.put(`${this.apiUrl}/api/regions/${regions.id}`, regions);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/api/regions/${id}`);
    }
}



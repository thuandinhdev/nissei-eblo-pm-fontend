import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Translation} from '../../shared/models/translation.model';

import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class TranslationService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getAll() {
        return this.http.get<Translation[]>(`${this.apiUrl}/api/translations`);
    }

    getById(id: number) {
        return this.http.get(`${this.apiUrl}/api/translations/${id}`);
    }

    create(translation: Translation) {
        return this.http.post(`${this.apiUrl}/api/translations`, translation);
    }

    update(translation: Translation) {
        return this.http.put(`${this.apiUrl}/api/translations/${translation.id}`, translation);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/api/translations/${id}`);
    }

    getAllActiveTranslations() {
        return this.http.get<Translation[]>(`${this.apiUrl}/api/translations/active`);
    }
}


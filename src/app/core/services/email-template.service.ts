import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class EmailTemplateService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getAll() {
        return this.http.get(`${this.apiUrl}/api/email-templates`);
    }

    getById(id: number) {
        return this.http.get(`${this.apiUrl}/api/email-templates/${id}`);
    }

    create(emailTemplate) {
        return this.http.post(`${this.apiUrl}/api/email-templates`, emailTemplate);
    }

    update(emailTemplate) {
        return this.http.put(`${this.apiUrl}/api/email-templates/${emailTemplate.id}`, emailTemplate);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/api/email-templates/${id}`);
    }

}

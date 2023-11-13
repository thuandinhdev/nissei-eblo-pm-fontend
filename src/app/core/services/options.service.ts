import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Options} from '../../shared/models/options.model';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class OptionsService {

    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getAll(typeOption) {
        return this.http.post(`${this.apiUrl}/api/options/getAll`, {typeOption: typeOption});
    }

    getById(id: number) {
        return this.http.get(`${this.apiUrl}/api/options/get-by-id/${id}`);
    }

    create(customField: Options) {
        return this.http.post(`${this.apiUrl}/api/options`, customField);
    }

    update(customField: Options) {
        return this.http.put(`${this.apiUrl}/api/options/${customField.id}`, customField);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/api/options/${id}`);
    }

    changeStatus(customField: any) {
        return this.http.post(`${this.apiUrl}/api/options/${customField.id}/change-status`, {status: customField.status});
    }

    getFormTables() {
        return this.http.get(`${this.apiUrl}/api/options/form`);
    }

    public getOptionsByForm(formId: number): any {
        return this.http.get(`${this.apiUrl}/api/options/form/${formId}`);
    }

    public getOptionsDetailByForm(formId: number, isView: number): any {
        return this.http.get(`${this.apiUrl}/api/options/form/${formId}/1`);
    }
}



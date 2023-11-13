import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CustomField} from '../../shared/models/custom-field.model';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CustomFieldsService {

    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getAll() {
        return this.http.get<CustomField[]>(`${this.apiUrl}/api/customfields`);
    }

    getById(id: number) {
        return this.http.get(`${this.apiUrl}/api/customfields/${id}`);
    }

    create(customField: CustomField) {
        return this.http.post(`${this.apiUrl}/api/customfields`, customField);
    }

    update(customField: CustomField) {
        return this.http.put(`${this.apiUrl}/api/customfields/${customField.id}`, customField);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/api/customfields/${id}`);
    }

    changeStatus(customField: any) {
        return this.http.post(`${this.apiUrl}/api/customfields/${customField.id}/change-status`, {status: customField.status});
    }

    getFormTables() {
        return this.http.get(`${this.apiUrl}/api/customfields/form`);
    }

    public getCustomFieldByForm(formId: number): any {
        return this.http.get(`${this.apiUrl}/api/customfields/form/${formId}`);
    }

    public getCustomFieldDetailByForm(formId: number, isView: number): any {
        return this.http.get(`${this.apiUrl}/api/customfields/form/${formId}/1`);
    }
}



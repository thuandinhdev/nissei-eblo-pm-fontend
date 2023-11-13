import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class InvoiceService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getById(id: number) {
        return this.http.get(`${this.apiUrl}/api/invoices/${id}`);
    }

    create(invoice) {
        return this.http.post(`${this.apiUrl}/api/invoices`, invoice);
    }

    update(invoice) {
        return this.http.put(`${this.apiUrl}/api/invoices/${invoice.id}`, invoice);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/api/invoices/${id}`);
    }

    changeStatus(invoice: any) {
        return this.http.post(`${this.apiUrl}/api/invoices/change-status/${invoice.id}`, {'status': invoice.status});
    }
}

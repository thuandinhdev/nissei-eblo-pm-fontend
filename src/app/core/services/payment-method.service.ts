import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PaymentMethodService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getAll() {
        return this.http.get(`${this.apiUrl}/api/payment-methods`);
    }

    getById(id: number) {
        return this.http.get(`${this.apiUrl}/api/payment-methods/${id}`);
    }

    create(payment) {
        return this.http.post(`${this.apiUrl}/api/payment-methods`, payment);
    }

    update(payment) {
        return this.http.put(`${this.apiUrl}/api/payment-methods/${payment.id}`, payment);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/api/payment-methods/${id}`);
    }

    setActiveInactiveMethod(method) {
        return this.http.put(`${this.apiUrl}/api/payment-methods/${method.id}`, method);
    }
}

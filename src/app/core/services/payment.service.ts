import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Payment} from '../../shared/models/payment.model';

import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getById(id: number) {
        return this.http.get(`${this.apiUrl}/api/payments/${id}`);
    }

    create(payment) {
        return this.http.post(`${this.apiUrl}/api/payments`, payment);
    }

    update(payment: Payment) {
        return this.http.put(`${this.apiUrl}/api/payments/${payment.id}`, payment);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/api/payments/${id}`);
    }

    stripePaymentCharge(payment) {
        return this.http.post(`${this.apiUrl}/api/payments/stripe/charges`, payment);
    }
}

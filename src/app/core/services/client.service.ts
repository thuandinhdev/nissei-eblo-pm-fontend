import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Client} from '../../shared/models/client.model';

import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class ClientService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getAll() {
        return this.http.get<Client[]>(`${this.apiUrl}/api/clients`);
    }

    getClientsWithTrashed() {
        return this.http.get<Client[]>(`${this.apiUrl}/api/clients/withtrashed`);
    }

    getById(id: number) {
        return this.http.get(`${this.apiUrl}/api/clients/${id}`);
    }

    create(client: Client) {
        return this.http.post(`${this.apiUrl}/api/clients`, client);
    }

    update(client: Client) {
        return this.http.put(`${this.apiUrl}/api/clients/${client.id}`, client);
    }

    delete(id: number, params: any) {
        return this.http.post(`${this.apiUrl}/api/clients/delete/${id}`, params);
    }

    setActiveDeactiveUser(client: Client) {
        return this.http.put(`${this.apiUrl}/api/clients/status-change/${client.id}`, client);
    }

    sendInviteUserMail(id) {
        return this.http.get(`${this.apiUrl}/api/users/invite/${id}`);
    }
}

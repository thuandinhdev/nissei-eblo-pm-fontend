import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {User} from '../../shared/models/user.model';

import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class UserService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getAll() {
        return this.http.get<User[]>(`${this.apiUrl}/api/users`);
    }

    getUserIdName() {
        return this.http.get<User[]>(`${this.apiUrl}/api/get-users`);
    }

    getUserkeyBy() {
        return this.http.get<User[]>(`${this.apiUrl}/api/get-users-keyby`);
    }

    getMailUsers() {
        return this.http.get<User[]>(`${this.apiUrl}/api/mail-users`);
    }

    getById(id: number) {
        return this.http.get(`${this.apiUrl}/api/users/${id}`);
    }

    create(user: User) {
        return this.http.post(`${this.apiUrl}/api/users`, user);
    }

    update(user: User) {
        return this.http.put(`${this.apiUrl}/api/users/${user.id}`, user);
    }

    delete(id: number, params: any) {
        return this.http.post(`${this.apiUrl}/api/users/delete/${id}`, params);
    }

    getUserPermissions() {
        return this.http.get(`${this.apiUrl}/api/users/permissions`);
    }

    setActiveDeactiveUser(user: User) {
        return this.http.put(`${this.apiUrl}/api/users/status-change/${user.id}`, user);
    }

    getUserGeneratedId() {
        return this.http.get(`${this.apiUrl}/api/users/get-generated-id`);
    }

    changePassword(user) {
        return this.http.post(`${this.apiUrl}/api/users/change-password/${user.id}`, user);
    }

    changeEmail(user) {
        return this.http.post(`${this.apiUrl}/api/users/change-email/${user.id}`, user);
    }

    sendInviteUserMail(id) {
        return this.http.get(`${this.apiUrl}/api/users/invite/${id}`);
    }

    import(importUsers) {
        return this.http.post(`${this.apiUrl}/api/users/import`, importUsers);
    }

    changeLocale(locale: string) {
        return this.http.get(`${this.apiUrl}/api/user/change-locale/${locale}`);
    }
}

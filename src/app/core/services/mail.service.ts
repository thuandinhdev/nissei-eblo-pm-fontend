import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class MailService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    create(emailCompose: any) {
        return this.http.post(`${this.apiUrl}/api/mailbox`, emailCompose);
    }

    getAll(reqObj: any) {
        return this.http.post(`${this.apiUrl}/api/all-mailbox`, reqObj);
    }

    findById(id: number) {
        return this.http.get(`${this.apiUrl}/api/mailbox/${id}`);
    }

    destroy(id: number) {
        return this.http.delete(`${this.apiUrl}/api/mailbox/${id}`);
    }

    markAsRead(mailObj: any) {
        return this.http.post(`${this.apiUrl}/api/mailbox/reads`, mailObj);
    }

    markAsFavourite(mailObj: any) {
        return this.http.post(`${this.apiUrl}/api/mailbox/favourite`, mailObj);
    }

    removeMarkMails(mailObj: any) {
        return this.http.post(`${this.apiUrl}/api/mailbox/remove`, mailObj);
    }

    removeAttachments(dataObj: any) {
        return this.http.post(`${this.apiUrl}/api/mailbox/attachment/remove`, dataObj);
    }

    setUnFavouriteMail(dataObj: any) {
        return this.http.post(`${this.apiUrl}/api/mailbox/unfavourite`, dataObj);
    }

    getUnReadMails(length: number) {
        return this.http.post(`${this.apiUrl}/api/mailbox/unread-emails`, {length: length});
    }
}

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {TaskComments} from '../../shared/models/task-comments.model';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class TaskCommentsService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    create(taskComment: TaskComments) {
        return this.http.post(`${this.apiUrl}/api/task-comment`, taskComment);
    }

    update(taskComment: any) {
        return this.http.put(`${this.apiUrl}/api/task-comment/${taskComment.id}`, taskComment);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/api/task-comment/${id}`);
    }
}

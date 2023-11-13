import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {TaskAttachment} from '../../shared/models/task-attachment.model';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class TaskAttachmentService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getAllAttachmentById(taskId: number) {
        return this.http.get<TaskAttachment[]>(`${this.apiUrl}/api/task-attachment/${taskId}`);
    }

    create(taskAttachment: TaskAttachment) {
        return this.http.post(`${this.apiUrl}/api/task-attachment`, taskAttachment);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/api/task-attachment/${id}`);
    }
}

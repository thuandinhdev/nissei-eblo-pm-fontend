import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {ProjectComments} from '../../shared/models/project-comments.model';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class ProjectCommentsService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    create(projectComment: ProjectComments) {
        return this.http.post(`${this.apiUrl}/api/project-comment`, projectComment);
    }

    update(projectComment: any) {
        return this.http.put(`${this.apiUrl}/api/project-comment/${projectComment.id}`, projectComment);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/api/project-comment/${id}`);
    }
}

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Posts} from '../../shared/models/posts.model';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PostsService {

    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getAll() {
        return this.http.get<Posts[]>(`${this.apiUrl}/api/posts`);
    }

    getTemplate() {
        return this.http.get(`${this.apiUrl}/api/posts/get-template`);
    }

    getById(id: number) {
        return this.http.get(`${this.apiUrl}/api/posts/get-by-id/${id}`);
    }

    create(posts: Posts) {
        return this.http.post(`${this.apiUrl}/api/posts`, posts);
    }

    update(posts: Posts) {
        return this.http.put(`${this.apiUrl}/api/posts/${posts.id}`, posts);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/api/posts/destroy/${id}`);
    }
}



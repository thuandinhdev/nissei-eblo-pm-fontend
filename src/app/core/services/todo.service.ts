import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Todo} from '../../shared/models/todo.model';

import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class TodoService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getAllTodos(params) {
        return this.http.post(`${this.apiUrl}/api/todos/list`, params);
    }

    changeTodosStatus(todos) {
        return this.http.post(`${this.apiUrl}/api/todos/update-list`, todos);
    }

    getAll() {
        return this.http.get<Todo[]>(`${this.apiUrl}/api/todos`);
    }

    getById(id: number) {
        return this.http.get(`${this.apiUrl}/api/todos/${id}`);
    }

    create(todo: Todo) {
        return this.http.post(`${this.apiUrl}/api/todos`, todo);
    }

    update(todo: Todo) {
        return this.http.put(`${this.apiUrl}/api/todos/${todo.id}`, todo);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/api/todos/${id}`);
    }
}

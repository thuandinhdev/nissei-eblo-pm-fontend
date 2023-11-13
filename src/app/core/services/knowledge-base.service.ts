import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {environment} from '../../../environments/environment';
import {KnowledgeBase} from '../../shared/models/knowledge-base.model';

@Injectable({
    providedIn: 'root'
})

export class KnowledgeBaseService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    create(knowledgeBase: KnowledgeBase) {
        return this.http.post(`${this.apiUrl}/api/knowledgebase-category`, knowledgeBase);
    }

    getAllCategory() {
        return this.http.get<KnowledgeBase[]>(`${this.apiUrl}/api/knowledgebase-category`);
    }

    getCategoryById(id: number) {
        return this.http.get(`${this.apiUrl}/api/knowledgebase-category/${id}`);
    }

    getArticalByCategoryId(categoryId: number) {
        return this.http.get(`${this.apiUrl}/api/knowledgebase-category/${categoryId}`);
    }

    updateCategory(knowledgeBase: KnowledgeBase) {
        return this.http.put(`${this.apiUrl}/api/knowledgebase-category/${knowledgeBase.id}`, knowledgeBase);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/api/knowledgebase-category/${id}`);
    }

    search(search: Text) {
        return this.http.get(`${this.apiUrl}/api/knowledgebase-category/search?search=` + search);
    }

    createArtical(articles: KnowledgeBase) {
        return this.http.post(`${this.apiUrl}/api/knowledgebase-article`, articles);
    }

    getArticleById(id: number) {
        return this.http.get(`${this.apiUrl}/api/knowledgebase-article/${id}`);
    }

    updateArticle(articles: KnowledgeBase) {
        return this.http.put(`${this.apiUrl}/api/knowledgebase-article/${articles.id}`, articles);
    }

    deleteArticle(id: number) {
        return this.http.delete(`${this.apiUrl}/api/knowledgebase-article/${id}`);
    }
}

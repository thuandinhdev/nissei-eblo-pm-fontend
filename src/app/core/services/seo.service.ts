import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Seo } from 'src/app/shared/models/seo.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {

  }
 getAll() {
      return this.http.get(`${this.apiUrl}/api/seo`);
  }

  getAllMeta() {
      return this.http.get(`${this.apiUrl}/api/get-all-seo`);
  }

  getAllKeyword() {
      return this.http.get(`${this.apiUrl}/api/get-all-keyword`);
  }

  getById(id: number) {
      return this.http.get(`${this.apiUrl}/api/seo/${id}`);
  }

  create(seo: any) {
      return this.http.post(`${this.apiUrl}/api/seo`, seo);
  }

  update(seo: any) {
      return this.http.put(`${this.apiUrl}/api/seo/${seo.id}`, seo);
  }

  delete(id: number) {
      return this.http.delete(`${this.apiUrl}/api/seo/${id}`);
  }
}

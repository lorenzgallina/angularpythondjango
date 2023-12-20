import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export class BaseService<T> {
  protected API_URL = environment.apiUrl;
  protected endpoint: string;

  constructor(protected http: HttpClient, endpoint: string) {
    this.endpoint = endpoint;
  }

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(`${this.API_URL}/${this.endpoint}/`);
  }

  add(item: T): Observable<T> {
    return this.http.post<T>(`${this.API_URL}/${this.endpoint}/`, item);
  }

  update(item: T, id: number): Observable<T> {
    return this.http.put<T>(`${this.API_URL}/${this.endpoint}/${id}/`, item);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${this.endpoint}/${id}/`);
  }
}

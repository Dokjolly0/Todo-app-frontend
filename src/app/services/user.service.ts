import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private url: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUserList(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.url}/users/users`, { headers }); // Usa l'URL definito
  }

  getUserById(token: string, id: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.url}/users/${id}`, { headers }); // Usa l'URL definito
  }

  requestResetPasswordWithEmail(email: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.url}/request-password-reset`, { username: email }, { headers });
  }

  changePasswordWithEmail(userId: string, token: string, newPassword: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    // Creare i parametri della query
    const params = new HttpParams().set('userId', userId).set('token', token);
    // Costruire il corpo della richiesta
    const body = { newPassword: newPassword };
    return this.http.post(`${this.url}/reset-password-with-email`, body, { headers, params });
  }

  private getUser() {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }
}

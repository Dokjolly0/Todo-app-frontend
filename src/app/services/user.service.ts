import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private url: string = 'http://159.223.142.172:3000/api'; // URL del server

  constructor(private http: HttpClient) {}

  getUserList(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.url}/users/users`, { headers }); // Usa l'URL definito
  }

  getUserById(token: string, id: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.url}/users/${id}`, { headers }); // Usa l'URL definito
  }

  private getUser() {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RegisterData } from '../entity/register.entity';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string | null = null;
  private user: any | null = null;
  url: string = 'http://159.223.142.172:3000/api'; // URL del server

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.url}/login`, { username, password }).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.token = response.token;
        this.user = response.user;
      })
    );
  }

  // 5 Proprieta separate
  register(firstName: string, lastName: string, picture: string, username: string, password: string): Observable<any>;
  // 1 oggetto singolo
  register(data: RegisterData): Observable<any>;
  // Implement
  register(
    firstNameOrObj: string | RegisterData,
    lastName?: string,
    picture?: string,
    username?: string,
    password?: string
  ): Observable<any> {
    if (typeof firstNameOrObj === 'string') {
      return this.http.post<any>(`${this.url}/register`, {
        firstName: firstNameOrObj,
        lastName,
        picture,
        username,
        password,
      });
    }
    return this.http.post<any>(`${this.url}/register`, firstNameOrObj);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUser(): any | null {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.token = null;
    this.user = null;
  }
}

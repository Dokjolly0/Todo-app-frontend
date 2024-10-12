import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  constructor() {}

  setToken(token: string) {
    localStorage.setItem('authToken', token);
  }

  getToken() {
    return localStorage.getItem('authToken');
  }

  hasToken() {
    return !!this.getToken();
  }

  removeToken() {
    localStorage.removeItem('authToken');
  }

  isTokenExpired(token: string): boolean {
    if (!token) return true;
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    const isExpired = payload.exp ? payload.exp < currentTime : true;
    return isExpired;
  }
}

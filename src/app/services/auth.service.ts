import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { RegisterData } from '../entity/register.entity';
import { environment } from '../../environments/environment';
import { JwtService } from './jwt.service';
import { User } from '../entity/user.entity';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private jwtService: JwtService, private router: Router) {
    if (this.isLoggedIn()) this.fetchUser();
  }
  private _currentUser$ = new BehaviorSubject<User | null>(null);
  url: string = environment.apiUrl;
  currentUser$ = this._currentUser$.asObservable();

  login(username: string, password: string, rememberMe: boolean = false): Observable<any> {
    return this.http.post<any>(`${this.url}/login`, { username, password }).pipe(
      tap((res) => this.jwtService.setToken(res.token, rememberMe)), // Passiamo "rememberMe" al JwtService
      tap((res) => this._currentUser$.next(res.user)),
      map((res) => res.user)
    );
  }

  register(data: RegisterData): Observable<any> {
    return this.http.post<any>(`${this.url}/register`, data);
  }

  isLoggedIn(): boolean {
    return this.jwtService.hasToken();
  }

  fetchUser() {
    this.http.get<User>(`${this.url}/users/me`).subscribe((user) => this._currentUser$.next(user));
  }

  logout() {
    this.jwtService.removeToken();
    this._currentUser$.next(null);
    this.router.navigate(['/signin']);
  }
}

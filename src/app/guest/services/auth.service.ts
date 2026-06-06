import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private api: ApiService) {}

  // Register new user
  register(data: { name: string; email: string; password: string; role?: string }): Observable<any> {
    return this.api.post('/auth/register', data).pipe(
      tap((res: any) => {
        if (res.token) localStorage.setItem('hiredesk_token', res.token);
      })
    );
  }

  // Login existing user
  login(data: { email: string; password: string }): Observable<any> {
    return this.api.post('/auth/login', data).pipe(
      tap((res: any) => {
        if (res.token) localStorage.setItem('hiredesk_token', res.token);
      })
    );
  }

  // Logout — remove token
  logout(): void {
    localStorage.removeItem('hiredesk_token');
  }

  // Check if logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('hiredesk_token');
  }

  // Get current user profile
  getProfile(): Observable<any> {
    return this.api.get('/auth/me');
  }
}

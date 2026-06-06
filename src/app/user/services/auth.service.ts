// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private api: ApiService) {}

  // ── LOGIN ─────────────────────────────────────────────────────
  login(email: string, password: string): Observable<any> {
    return this.api.login(email, password).pipe(
      tap((res: any) => {
        if (res && res.token) {
          localStorage.setItem('hd_token', res.token);
          localStorage.setItem('hd_user', JSON.stringify(res.user));
        }
      })
    );
  }

  // ── REGISTER ──────────────────────────────────────────────────
  register(data: any): Observable<any> {
    return this.api.register(data);
  }

  // ── LOGOUT ────────────────────────────────────────────────────
  logout(): void {
    localStorage.removeItem('hd_token');
    localStorage.removeItem('hd_user');
    // Navigate handled by layout component
    window.location.href = '/login';
  }

  // ── CHECK LOGIN ───────────────────────────────────────────────
  isLoggedIn(): boolean {
    return !!localStorage.getItem('hd_token');
  }

  // ── GET CURRENT USER ──────────────────────────────────────────
  getCurrentUser(): any {
    const u = localStorage.getItem('hd_user');
    return u ? JSON.parse(u) : null;
  }

  // ── GET TOKEN ─────────────────────────────────────────────────
  getToken(): string | null {
    return localStorage.getItem('hd_token');
  }

  // ── FRIENDLY ERRORS ───────────────────────────────────────────
  getFriendlyError(message: string): string {
    if (message?.includes('email already exists')) return 'An account with this email already exists.';
    if (message?.includes('Incorrect email'))      return 'Incorrect email or password.';
    if (message?.includes('deactivated'))          return 'Your account has been deactivated.';
    return message || 'Something went wrong. Please try again.';
  }
}
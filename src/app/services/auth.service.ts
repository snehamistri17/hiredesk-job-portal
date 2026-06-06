import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private router: Router) { }

  saveUser(token: string, user: any) {
    localStorage.setItem('hd_token', token);
    localStorage.setItem('hd_user', JSON.stringify(user));
  }

  saveCompany(token: string, company: any) {
    localStorage.setItem('hd_token', token);
    localStorage.setItem('hd_company', JSON.stringify(company));
    localStorage.setItem('hd_role', 'company');
  }

  isLoggedIn() { return !!localStorage.getItem('hd_token'); }
  getToken() { return localStorage.getItem('hd_token'); }
  getRole() { const u = this.getUser(); return u?.role || localStorage.getItem('hd_role') || ''; }
  getUser() { const u = localStorage.getItem('hd_user'); return u ? JSON.parse(u) : null; }
  getCompany() { const c = localStorage.getItem('hd_company'); return c ? JSON.parse(c) : null; }

  logout() {
    localStorage.removeItem('hd_token');
    localStorage.removeItem('hd_user');
    localStorage.removeItem('hd_company');
    localStorage.removeItem('hd_role');
    this.router.navigate(['/login']);
  }
}

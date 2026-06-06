// src/app/user/login/login.component.ts
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HeaderComponent } from '../../guest/header/header.component';
import { FooterComponent } from '../../guest/footer/footer.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink,HeaderComponent,FooterComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  role: 'user' | 'company' = 'user';
  email    = '';
  password = '';
  showPass = false;
  loading  = false;
  error    = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.error = '';

    if (!this.email || !this.password) {
      this.error = 'Please fill in all fields.';
      return;
    }

    this.loading = true;

    if (this.role === 'user') {
      this.loginUser();
    } else {
      this.loginCompany();
    }
  }

  // ── Student / Admin login ────────────────────────────────────
  private loginUser() {
    this.http.post('http://localhost:3000/api/auth/login', {
      email:    this.email.trim().toLowerCase(),
      password: this.password
    }).subscribe({
      next: (res: any) => {
        this.loading = false;
        localStorage.setItem('hd_token', res.token);
        localStorage.setItem('hd_user', JSON.stringify(res.user));

        const role = res.user?.role;
        if (role === 'admin')        this.router.navigate(['/admin-dashboard']);
        else if (role === 'user')    this.router.navigate(['/student/dashboard']);
        else                         this.error = 'Unknown user role.';
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 0) {
          this.error = 'Cannot connect to server. Make sure backend is running on port 3000.';
        } else {
          this.error = err.error?.message || 'Login failed. Please try again.';
        }
      }
    });
  }

  // ── Company login ────────────────────────────────────────────
  private loginCompany() {
    this.http.post('http://localhost:3000/api/auth/company-login', {
      email:    this.email.trim().toLowerCase(),
      password: this.password
    }).subscribe({
      next: (res: any) => {
        this.loading = false;
        localStorage.setItem('hd_token', res.token);
        localStorage.setItem('hd_company', JSON.stringify(res.company));

        this.router.navigate(['/company/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 0) {
          this.error = 'Cannot connect to server. Make sure backend is running on port 3000.';
        } else {
          this.error = err.error?.message || 'Login failed. Please try again.';
        }
      }
    });
  }
}
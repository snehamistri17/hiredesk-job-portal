// src/app/user/registration/registration.component.ts
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HeaderComponent } from '../../guest/header/header.component';
import { FooterComponent } from '../../guest/footer/footer.component';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink,HeaderComponent,FooterComponent],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {

  // ── Role ────────────────────────────────────────────────────
  role: 'user' | 'company' = 'user';   // default to student

  // ── Common fields ────────────────────────────────────────────
  email           = '';
  phone           = '';
  password        = '';
  confirmPassword = '';
  showPass        = false;
  showConfirm     = false;
  loading         = false;
  error           = '';
  successMsg      = '';

  // ── User (student) fields ────────────────────────────────────
  name       = '';
  rollNo     = '';
  branch     = '';
  department = '';

  // ── Company fields ───────────────────────────────────────────
  companyName = '';
  industry    = '';
  website     = '';

  // ── Dropdown options ─────────────────────────────────────────
  branches = ['B.Tech', 'M.Tech', 'BCA', 'MCA', 'B.Sc', 'M.Sc', 'MBA', 'B.Com', 'Other'];

  departments = [
    'Computer Science & Engineering',
    'Information Technology',
    'Electronics & Communication',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Chemical Engineering',
    'Business Administration',
    'Other'
  ];

  industries = [
    'Information Technology',
    'Software / SaaS',
    'Banking & Finance',
    'Healthcare',
    'Manufacturing',
    'E-Commerce',
    'Consulting',
    'Education',
    'Automobile',
    'Retail',
    'Other'
  ];

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    this.error      = '';
    this.successMsg = '';

    if (this.role === 'user') {
      this.registerUser();
    } else {
      this.registerCompany();
    }
  }

  // ── Student registration ─────────────────────────────────────
  private registerUser() {
    if (!this.name.trim())                      { this.error = 'Please enter your full name.'; return; }
    if (!this.email.trim())                     { this.error = 'Please enter your email.'; return; }
    if (!this.phone.trim())                     { this.error = 'Please enter your phone number.'; return; }
    if (!this.rollNo.trim())                    { this.error = 'Please enter your roll number.'; return; }
    if (!this.branch)                           { this.error = 'Please select your degree.'; return; }
    if (!this.department)                       { this.error = 'Please select your department.'; return; }
    if (!this.password)                         { this.error = 'Please enter a password.'; return; }
    if (this.password.length < 8)               { this.error = 'Password must be at least 8 characters.'; return; }
    if (this.password !== this.confirmPassword) { this.error = 'Passwords do not match.'; return; }

    this.loading = true;

    const body = {
      name:       this.name.trim(),
      email:      this.email.trim().toLowerCase(),
      phone:      this.phone.trim(),
      rollNo:     this.rollNo.trim(),
      branch:     this.branch,
      department: this.department,
      password:   this.password,
      role:       'user'
    };

    this.http.post('http://localhost:3000/api/auth/register', body).subscribe({
      next: () => {
        this.loading    = false;
        this.successMsg = 'Account created successfully! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 0) {
          this.error = 'Cannot connect to server. Make sure backend is running on port 3000.';
        } else {
          this.error = err.error?.message || 'Registration failed. Please try again.';
        }
      }
    });
  }

  // ── Company registration ─────────────────────────────────────
  private registerCompany() {
    if (!this.companyName.trim())               { this.error = 'Please enter your company name.'; return; }
    if (!this.email.trim())                     { this.error = 'Please enter the official email.'; return; }
    if (!this.phone.trim())                     { this.error = 'Please enter a contact number.'; return; }
    if (!this.industry)                         { this.error = 'Please select your industry.'; return; }
    if (!this.password)                         { this.error = 'Please enter a password.'; return; }
    if (this.password.length < 8)               { this.error = 'Password must be at least 8 characters.'; return; }
    if (this.password !== this.confirmPassword) { this.error = 'Passwords do not match.'; return; }

    this.loading = true;

    const body = {
      name:     this.companyName.trim(),
      email:    this.email.trim().toLowerCase(),
      phone:    this.phone.trim(),
      industry: this.industry,
      website:  this.website.trim(),
      password: this.password
    };

    // ✅ Uses existing POST /api/company/register in company.routes.mjs
    this.http.post('http://localhost:3000/api/company/register', body).subscribe({
      next: () => {
        this.loading    = false;
        this.successMsg = 'Company registered! Please wait for admin approval before logging in.';
        setTimeout(() => this.router.navigate(['/login']), 2500);
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 0) {
          this.error = 'Cannot connect to server. Make sure backend is running on port 3000.';
        } else {
          this.error = err.error?.message || 'Registration failed. Please try again.';
        }
      }
    });
  }
}
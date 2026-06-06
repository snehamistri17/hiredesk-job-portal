import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const pw  = group.get('newPassword')?.value;
  const cpw = group.get('confirmPassword')?.value;
  return pw && cpw && pw !== cpw ? { mismatch: true } : null;
}

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePassworddComponent implements OnInit {

  currentStep = 1;
  steps = [
    { title: 'Verify Email',     sub: 'Confirm your identity' },
    { title: 'Current Password', sub: 'Enter your current password' },
    { title: 'New Password',     sub: 'Set your new password' }
  ];

  // Step 1
  emailForm!: FormGroup;
  emailChecking = false;
  emailError    = '';

  // Step 2
  currentPassForm!: FormGroup;
  currentPassError = '';
  verifyingCurrent = false;
  showCurrentPass  = false;

  // Step 3
  passwordForm!: FormGroup;
  showNew          = false;
  showConfirm      = false;
  changingPassword = false;

  private BASE = 'http://localhost:3000/api';

  constructor(
    private fb:     FormBuilder,
    private auth:   AuthService,
    private http:   HttpClient,
    private router: Router
  ) {}

  private headers() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.auth.getToken()
    });
  }

  ngOnInit(): void {
    const company = this.auth.getCompany();

    this.emailForm = this.fb.group({
      email: [company?.email || '', [Validators.required, Validators.email]]
    });

    this.currentPassForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.passwordForm = this.fb.group({
      newPassword:     ['', [Validators.required, Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  isEmailInvalid(field: string): boolean {
    const ctrl = this.emailForm.get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  verifyEmail(): void {
    if (this.emailForm.invalid) { this.emailForm.markAllAsTouched(); return; }
    this.emailChecking = true;
    this.emailError    = '';
    const company = this.auth.getCompany();
    setTimeout(() => {
      this.emailChecking = false;
      if (this.emailForm.value.email === company?.email) {
        this.currentStep = 2;
      } else {
        this.emailError = 'Email does not match your account.';
      }
    }, 800);
  }

  isCurrentPassInvalid(field: string): boolean {
    const ctrl = this.currentPassForm.get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  verifyCurrentPassword(): void {
    if (this.currentPassForm.invalid) { this.currentPassForm.markAllAsTouched(); return; }
    this.verifyingCurrent = true;
    this.currentPassError = '';
    const company = this.auth.getCompany();
    this.http.post(this.BASE + '/auth/company-login', {
      email:    company?.email,
      password: this.currentPassForm.value.currentPassword
    }).subscribe({
      next: () => { this.verifyingCurrent = false; this.currentStep = 3; },
      error: () => { this.verifyingCurrent = false; this.currentPassError = 'Current password is incorrect.'; }
    });
  }

  isPasswordInvalid(field: string): boolean {
    const ctrl = this.passwordForm.get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  get passwordValue(): string { return this.passwordForm.get('newPassword')?.value || ''; }
  get hasMinLength(): boolean { return this.passwordValue.length >= 8; }
  get hasUppercase(): boolean { return /[A-Z]/.test(this.passwordValue); }
  get hasNumber():    boolean { return /\d/.test(this.passwordValue); }
  get hasSpecial():   boolean { return /[\W_]/.test(this.passwordValue); }

  get passwordStrength(): { class: string; width: string; label: string } {
    const score = [this.hasMinLength, this.hasUppercase, this.hasNumber, this.hasSpecial].filter(Boolean).length;
    if (score <= 1) return { class: 'weak',   width: '25%',  label: 'Weak'   };
    if (score === 2) return { class: 'fair',   width: '50%',  label: 'Fair'   };
    if (score === 3) return { class: 'good',   width: '75%',  label: 'Good'   };
    return              { class: 'strong', width: '100%', label: 'Strong' };
  }

  changePassword(): void {
    if (this.passwordForm.invalid) { this.passwordForm.markAllAsTouched(); return; }
    this.changingPassword = true;
    this.http.post(
      this.BASE + '/auth/company-change-password',
      { currentPassword: this.currentPassForm.value.currentPassword, newPassword: this.passwordForm.value.newPassword },
      { headers: this.headers() }
    ).subscribe({
      next: () => { this.changingPassword = false; this.currentStep = 4; },
      error: (err) => { this.changingPassword = false; alert(err.error?.message || 'Error changing password.'); }
    });
  }

  goToLogin(): void { this.auth.logout(); }

  resetAll(): void {
    const company = this.auth.getCompany();
    this.emailForm.reset({ email: company?.email || '' });
    this.currentPassForm.reset();
    this.passwordForm.reset();
    this.emailError = '';
    this.currentPassError = '';
    this.currentStep = 1;
  }
}

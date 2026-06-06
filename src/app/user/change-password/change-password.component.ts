import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  step    = 1;
  current = '';
  newPass = '';
  confirm = '';

  showCurrent = false;
  showNew     = false;
  showConfirm = false;

  focusCurrent = false;
  focusNew     = false;
  focusConfirm = false;

  success = false;
  error   = '';
  loading = false;

  tips = [
    'Use at least 8 characters',
    'Include uppercase and lowercase letters',
    'Add numbers and special characters (!@#$%)',
    "Don't reuse passwords from other sites",
    'Never share your password with anyone',
    'Change password every 3–6 months'
  ];

  constructor(private api: ApiService) {}

  get strength(): number {
    if (!this.newPass) return 0;
    let s = 0;
    if (this.newPass.length >= 8)            s++;
    if (/[A-Z]/.test(this.newPass))          s++;
    if (/[0-9]/.test(this.newPass))          s++;
    if (/[^A-Za-z0-9]/.test(this.newPass))  s++;
    return s;
  }
  get hasUpper():   boolean { return /[A-Z]/.test(this.newPass); }
  get hasNum():     boolean { return /[0-9]/.test(this.newPass); }
  get hasSpecial(): boolean { return /[^A-Za-z0-9]/.test(this.newPass); }

  get strengthLabel(): string {
    return ['', 'Weak', 'Fair', 'Good', 'Strong'][this.strength] || '';
  }
  get strengthColor(): string {
    return ['', '#ff4d6d', '#ffc542', '#00c6a7', '#22c55e'][this.strength] || '';
  }

  goStep2() {
    this.error = '';
    if (!this.current) { this.error = 'Please enter your current password.'; return; }
    this.step = 2;
  }

  goStep3() {
    this.error = '';
    if (!this.newPass || this.newPass.length < 8) { this.error = 'Password must be at least 8 characters.'; return; }
    this.step = 3;
  }

  submit() {
    this.error = '';
    if (this.newPass !== this.confirm) { this.error = 'Passwords do not match.'; return; }
    this.loading = true;
    this.api.changePassword(this.current, this.newPass).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
        this.current = this.newPass = this.confirm = '';
        this.step    = 1;
      },
      error: (err) => {
        this.loading = false;
        this.error   = err.error?.message || 'Failed to change password.';
        this.step    = 1;
      }
    });
  }
}

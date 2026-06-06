import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-profile.component.html',
  styleUrl: './admin-profile.component.css'
})
export class AdminProfileComponent implements OnInit {
  form!: FormGroup;
  profileImageUrl: string | null = null;
  avatarColor: string = 'linear-gradient(135deg, #f59e0b, #ef4444)';
  saving = false;
  successMsg = '';
  errorMsg = '';
  loading = true;

  private BASE = 'http://localhost:3000/api';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private http: HttpClient
  ) {}

  private headers() {
    const token = localStorage.getItem('hd_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      name:       ['', [Validators.required, Validators.minLength(2)]],
      email:      ['', [Validators.required, Validators.email]],
      phone:      ['', [Validators.pattern(/^\+?[\d\s\-(). ]{7,15}$/)]],
      branch:     [''],
      currentSem: [''],
    });

    this.http.get(`${this.BASE}/user/profile`, { headers: this.headers() }).subscribe({
      next: (data: any) => {
        this.form.patchValue({
          name:       data.name       || '',
          email:      data.email      || '',
          phone:      data.phone      || '',
          branch:     data.branch     || '',
          currentSem: data.currentSem || '',
        });
        this.loading = false;
      },
      error: () => {
        const user = this.auth.getUser();
        this.form.patchValue({
          name:  user?.name  || '',
          email: user?.email || '',
          phone: user?.phone || '',
        });
        this.loading = false;
      }
    });
  }

  getInitials(): string {
    const name = this.form?.value?.name || 'AD';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  }

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  onImageChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) { alert('Please select a valid image file.'); return; }
      const reader = new FileReader();
      reader.onload = (e) => { this.profileImageUrl = e.target?.result as string; };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    this.successMsg = '';
    this.errorMsg = '';

    const payload: any = {
      name:  this.form.value.name.trim(),
      email: this.form.value.email.trim().toLowerCase(),
    };
    if (this.form.value.phone)      payload.phone      = this.form.value.phone.trim();
    if (this.form.value.branch)     payload.branch     = this.form.value.branch;
    if (this.form.value.currentSem) payload.currentSem = this.form.value.currentSem;

    this.http.put(`${this.BASE}/user/profile`, payload, { headers: this.headers() }).subscribe({
      next: (res: any) => {
        this.saving = false;
        this.successMsg = 'Profile updated successfully!';
        const user = this.auth.getUser();
        const updated = { ...user, name: payload.name, email: payload.email };
        localStorage.setItem('hd_user', JSON.stringify(updated));
        setTimeout(() => this.successMsg = '', 4000);
      },
      error: (err) => {
        this.saving = false;
        this.errorMsg = err.error?.message || 'Error updating profile. Try again.';
      }
    });
  }

  onCancel(): void { this.ngOnInit(); }
}
// src/app/profile/profile.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  editing = false;
  saved   = false;
  loading = true;
  error   = '';

  profile: any = {
    name: '', email: '', phone: '', dob: '', gender: '',
    address: '', city: '', state: '', pincode: '',
    linkedin: '', github: '', portfolio: '', bio: '',
    college: '', branch: '', department: '',
    admissionYear: '', passoutYear: '',
    cgpa: '', placementStatus: 'Eligible',
    profileCompletion: 0
  };

  constructor(private http: HttpClient) {}

  private get headers() {
    return new HttpHeaders({ Authorization: `Bearer ${localStorage.getItem('hd_token')}` });
  }

  get initials(): string {
    return (this.profile.name || 'U')
      .split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);
  }

  ngOnInit() {
    this.http.get<any>('http://localhost:3000/api/user/profile', { headers: this.headers })
      .subscribe({
        next: (data) => {
          // Merge all fields
          Object.keys(this.profile).forEach(k => {
            if (data[k] !== undefined && data[k] !== null && data[k] !== '') {
              this.profile[k] = data[k];
            }
          });
          this.loading = false;
        },
        error: () => { this.loading = false; }
      });
  }

  save() {
    this.error = '';
    this.http.put<any>('http://localhost:3000/api/user/profile', this.profile, { headers: this.headers })
      .subscribe({
        next: (res) => {
          this.editing = false;
          this.saved   = true;
          if (res.user) {
            Object.keys(this.profile).forEach(k => {
              if (res.user[k] !== undefined) this.profile[k] = res.user[k];
            });
            // Update localStorage with new name
            const saved = JSON.parse(localStorage.getItem('hd_user') || '{}');
            saved.name = this.profile.name;
            localStorage.setItem('hd_user', JSON.stringify(saved));
          }
          setTimeout(() => this.saved = false, 3000);
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to save. Try again.';
        }
      });
  }
}
// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {

  private BASE = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // ── TOKEN HEADER ───────────────────────────────────────────
  private headers(): HttpHeaders {
    const token = localStorage.getItem('hd_token');
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  // ── AUTH ───────────────────────────────────────────────────
  register(data: any): Observable<any> {
    return this.http.post(`${this.BASE}/auth/register`, data);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.BASE}/auth/login`, { email, password });
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.post(
      `${this.BASE}/auth/change-password`,
      { currentPassword, newPassword },
      { headers: this.headers() }
    );
  }

  // ── PROFILE ───────────────────────────────────────────────
  getProfile(): Observable<any> {
    return this.http.get(`${this.BASE}/user/profile`, { headers: this.headers() });
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put(`${this.BASE}/user/profile`, data, { headers: this.headers() });
  }

  // ── ACADEMIC ──────────────────────────────────────────────
  getAcademic(): Observable<any> {
    return this.http.get(`${this.BASE}/user/academic`, { headers: this.headers() });
  }

  saveAcademic(data: any): Observable<any> {
    return this.http.put(`${this.BASE}/user/academic`, data, { headers: this.headers() });
  }

  // ── SKILLS ────────────────────────────────────────────────
  getSkills(): Observable<any> {
    return this.http.get(`${this.BASE}/user/skills`, { headers: this.headers() });
  }

  saveSkills(data: any): Observable<any> {
    return this.http.put(`${this.BASE}/user/skills`, data, { headers: this.headers() });
  }

  // ── RESUME ────────────────────────────────────────────────
  uploadResume(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('resume', file);
    return this.http.post(`${this.BASE}/user/resume`, formData, { headers: this.headers() });
  }

  deleteResume(): Observable<any> {
    return this.http.delete(`${this.BASE}/user/resume`, { headers: this.headers() });
  }

  trackResumeView(userId: string): Observable<any> {
    return this.http.get(`${this.BASE}/user/resume/view/${userId}`, { headers: this.headers() });
  }

  // ── DASHBOARD ─────────────────────────────────────────────
  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.BASE}/user/dashboard-stats`, { headers: this.headers() });
  }

  // ── JOBS ──────────────────────────────────────────────────
  getJobs(search: string = '', type: string = ''): Observable<any> {
    return this.http.get(
      `${this.BASE}/jobs?search=${search}&type=${type}`,
      { headers: this.headers() }
    );
  }

  // ── APPLICATIONS ──────────────────────────────────────────
  getApplications(): Observable<any> {
    return this.http.get(`${this.BASE}/applications`, { headers: this.headers() });
  }

  applyJob(jobId: string): Observable<any> {
    return this.http.post(
      `${this.BASE}/applications`,
      { jobId },
      { headers: this.headers() }
    );
  }

  getApplicationStats(): Observable<any> {
    return this.http.get(`${this.BASE}/applications/stats`, { headers: this.headers() });
  }

  // ── NOTIFICATIONS ─────────────────────────────────────────
  getNotifications(): Observable<any> {
    return this.http.get(`${this.BASE}/notifications`, { headers: this.headers() });
  }

  markAllRead(): Observable<any> {
    return this.http.put(
      `${this.BASE}/notifications/mark-all-read`,
      {},
      { headers: this.headers() }
    );
  }

  markRead(id: string): Observable<any> {
    return this.http.put(
      `${this.BASE}/notifications/${id}/read`,
      {},
      { headers: this.headers() }
    );
  }
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private BASE = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  private headers() {
    const token = localStorage.getItem('hd_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // ── AUTH ──────────────────────────────────
  registerUser(data: any) { return this.http.post(`${this.BASE}/auth/register`, data); }
  loginUser(data: any) { return this.http.post(`${this.BASE}/auth/login`, data); }
  loginCompany(data: any) { return this.http.post(`${this.BASE}/auth/company-login`, data); }

  // ── ADMIN STATS ───────────────────────────
  getAdminStats() { return this.http.get(`${this.BASE}/admin/stats`, { headers: this.headers() }); }

  // FIX: endpoint is /admin/students (not /admin/students/:id/status)
  getStudents() { return this.http.get(`${this.BASE}/admin/students`, { headers: this.headers() }); }

  // FIX: correct update endpoint — PUT /admin/students/:id
  updateStudentStatus(id: string, data: any) {
    return this.http.put(`${this.BASE}/admin/students/${id}`, data, { headers: this.headers() });
  }

  // ── COMPANIES ─────────────────────────────
  registerCompany(data: any) { return this.http.post(`${this.BASE}/company/register`, data); }
  getAllCompanies() { return this.http.get(`${this.BASE}/company/all`, { headers: this.headers() }); }
  getPendingCompanies() { return this.http.get(`${this.BASE}/company/pending`, { headers: this.headers() }); }
  approveCompany(id: string) { return this.http.put(`${this.BASE}/company/${id}/approve`, {}, { headers: this.headers() }); }
  rejectCompany(id: string) { return this.http.put(`${this.BASE}/company/${id}/reject`, {}, { headers: this.headers() }); }
  deleteCompany(id: string) { return this.http.delete(`${this.BASE}/company/${id}`, { headers: this.headers() }); }
  getMyCompanyProfile() { return this.http.get(`${this.BASE}/company/profile`, { headers: this.headers() }); }
  updateMyCompanyProfile(data: any) {
    return this.http.put(`${this.BASE}/company/profile`, data, { headers: this.headers() });
  }

  // ── JOBS ──────────────────────────────────
  getAllJobs() { return this.http.get(`${this.BASE}/jobs`); }
  getMyJobs() { return this.http.get(`${this.BASE}/jobs/all`, { headers: this.headers() }); }
  getJobById(id: string) { return this.http.get(`${this.BASE}/jobs/${id}`); }
  postJob(data: any) { return this.http.post(`${this.BASE}/jobs`, data, { headers: this.headers() }); }
  updateJob(id: string, data: any) {
    return this.http.put(`${this.BASE}/jobs/${id}`, data, { headers: this.headers() });
  }
  deleteJob(id: string) { return this.http.delete(`${this.BASE}/jobs/${id}`, { headers: this.headers() }); }

  // ── APPLICATIONS ──────────────────────────
  submitApplication(data: any) { return this.http.post(`${this.BASE}/applications`, data, { headers: this.headers() }); }
  getCompanyApplications() { return this.http.get(`${this.BASE}/applications/company`, { headers: this.headers() }); }
  getAllApplications() { return this.http.get(`${this.BASE}/applications/all`, { headers: this.headers() }); }
  getJobApplications(jobId: string) {
    return this.http.get(`${this.BASE}/applications/job/${jobId}`, { headers: this.headers() });
  }
  updateApplicationStatus(id: string, data: any) {
    return this.http.put(`${this.BASE}/applications/${id}/status`, data, { headers: this.headers() });
  }

  // ── RESULTS ───────────────────────────────
  getResults() { return this.http.get(`${this.BASE}/results`, { headers: this.headers() }); }
  publishResult(id: string) { return this.http.put(`${this.BASE}/results/${id}/publish`, {}, { headers: this.headers() }); }
  publishAllResults() { return this.http.put(`${this.BASE}/results/publish-all/go`, {}, { headers: this.headers() }); }
}
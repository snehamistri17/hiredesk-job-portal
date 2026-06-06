import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';

@Injectable({ providedIn: 'root' })
export class AdminDataService {
  stats: any = {};
  students: any[] = [];
  companies: any[] = [];
  applications: any[] = [];
  results: any[] = [];
  loading = false;

  constructor(private api: ApiService) {}

  loadStats() {
    this.api.getAdminStats().subscribe({
      next: (data: any) => { this.stats = data; },
      error: () => {}
    });
  }

  loadStudents() {
    this.api.getStudents().subscribe({
      next: (data: any) => { this.students = data; },
      error: () => {}
    });
  }

  loadCompanies() {
    this.api.getAllCompanies().subscribe({
      next: (data: any) => { this.companies = data; },
      error: () => {}
    });
  }

  loadApplications() {
    this.api.getAllApplications().subscribe({
      next: (data: any) => { this.applications = data; },
      error: () => {}
    });
  }

  loadResults() {
    this.api.getResults().subscribe({
      next: (data: any) => { this.results = data; },
      error: () => {}
    });
  }

  approveCompany(id: string) {
    return this.api.approveCompany(id);
  }

  rejectCompany(id: string) {
    return this.api.rejectCompany(id);
  }

  deleteCompany(id: string) {
    return this.api.deleteCompany(id);
  }
}

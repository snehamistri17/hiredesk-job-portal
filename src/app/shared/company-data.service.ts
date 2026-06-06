import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ApiService } from '../services/api.service';

export interface Job {
  id?: any; _id?: string; title: string; department: string; location: string;
  type: 'Full-Time' | 'Part-Time' | 'Internship' | 'Contract';
  salary: string; positions: number; deadline: string;
  status: 'Active' | 'Closed' | 'Draft';
  applicants: number; postedDate: string;
  description: string; requirements: string[]; skills: string[];
}

export interface Candidate {
  id?: any; _id?: string; name: string; email: string; phone: string;
  college: string; degree: string; cgpa: number;
  jobId?: any; jobTitle: string; appliedDate: string;
  status: 'Applied' | 'Shortlisted' | 'Interview Scheduled' | 'Selected' | 'Rejected';
  interviewDate?: string; interviewTime?: string;
  interviewMode?: 'Online' | 'In-Person';
  skills: string[]; avatar: string; resume: string; experience: string;
}

export interface CompanyProfile {
  name: string; email: string; phone: string; website: string;
  industry: string; size: string; founded: string; headquarters: string;
  description: string; logo: string; linkedin: string; twitter: string;
  status: 'Approved' | 'Pending' | 'Rejected';
}

@Injectable({ providedIn: 'root' })
export class CompanyDataService {

  // Local state — loaded from API
  jobs: Job[] = [];
  candidates: Candidate[] = [];
  hiringHistory: any[] = [];
  notifications: any[] = [];
  companyProfile: CompanyProfile = {
    name: '', email: '', phone: '', website: '', industry: '', size: '',
    founded: '', headquarters: '', description: '', logo: '',
    linkedin: '', twitter: '', status: 'Pending'
  };
  loading = false;

  constructor(private api: ApiService) {
    this.loadJobs();
    this.loadCandidates();
    this.loadProfile();
  }

  // ── Load jobs from MongoDB ──
  loadJobs() {
    this.loading = true;
    this.api.getMyJobs().subscribe({
      next: (jobs: any) => { this.jobs = jobs; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  // ── Load applications (candidates) ──
  loadCandidates() {
    this.api.getCompanyApplications().subscribe({
      next: (apps: any) => {
        this.candidates = apps;
        // Build hiringHistory from Selected candidates
        // Application schema fields: studentName, jobTitle, branch, pkg, appliedDate, interviewDate
        this.hiringHistory = apps
          .filter((a: any) => a.status === 'Selected')
          .map((a: any) => ({
            _id:        a._id || a.id,
            name:       a.studentName || a.name || 'Unknown',
            jobTitle:   a.jobTitle || 'N/A',
            department: a.branch || a.department || 'General',
            hiredDate:  a.interviewDate || a.appliedDate,
            salary:     a.pkg || a.salary || 'N/A',
            status:     'Active'
          }));
      },
      error: () => { }
    });
  }

  // ── Load company profile ──
  loadProfile() {
    this.api.getMyCompanyProfile().subscribe({
      next: (profile: any) => { Object.assign(this.companyProfile, profile); },
      error: () => { }
    });
  }

  // ── Post a new job ──
  addJob(job: any): Observable<any> {
    const payload = {
      jobtitle: job.title,
      department: job.department,
      company: this.companyProfile.name,
      location: job.location,
      type: job.type,
      salary: job.salary,
      positions: job.positions,
      deadline: job.deadline,
      description: job.description,
      requirements: job.requirements,
      skills: job.skills,
      status: job.status
    };
    return this.api.postJob(payload).pipe(
      tap((res: any) => {
        this.loadJobs(); // Refresh list
      })
    );
  }

  // ── Update candidate status ──
  updateCandidateStatus(id: any, status: Candidate['status'], extra?: any): Observable<any> {
    return this.api.updateApplicationStatus(id, { status, ...extra }).pipe(
      tap(() => {
        this.loadCandidates(); // This also rebuilds hiringHistory
      })
    );
  }

  // ── Update company profile ──
  saveProfile(): Observable<any> {
    return this.api.updateMyCompanyProfile(this.companyProfile).pipe(
      tap(() => this.loadProfile())
    );
  }

  // ── Delete a job ──
  removeJob(id: any): Observable<any> {
    return this.api.deleteJob(id).pipe(
      tap(() => this.loadJobs())
    );
  }

  // ── Helpers ──
  getJobById(id: any) { return this.jobs.find(j => j._id === id || j.id === id); }
  getCandidateById(id: any) { return this.candidates.find(c => c._id === id || c.id === id); }
  getCandidatesByJob(jobId: any) { return this.candidates.filter(c => c.jobId === jobId); }

  getDashboardStats() {
    return {
      totalJobs: this.jobs.filter(j => j.status === 'Active').length,
      totalApplications: this.candidates.length,
      shortlisted: this.candidates.filter(c => c.status === 'Shortlisted' || c.status === 'Interview Scheduled').length,
      hired: this.candidates.filter(c => c.status === 'Selected').length,
      pendingReview: this.candidates.filter(c => c.status === 'Applied').length,
      interviewsToday: this.candidates.filter(c => c.status === 'Interview Scheduled').length,
    };
  }
}


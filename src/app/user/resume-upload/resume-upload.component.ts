import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { ApiService } from '../services/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-resume-upload',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './resume-upload.component.html',
  styleUrls: ['./resume-upload.component.css']
})
export class ResumeUploadComponent implements OnInit {
  // Applied jobs list
  appliedJobs: any[] = [];
  loading = true;
  uploading: { [jobId: string]: boolean } = {};
  removing:  { [jobId: string]: boolean } = {};
  successMsg: { [jobId: string]: string } = {};
  errorMsg:   { [jobId: string]: string } = {};
  isDragOver: { [jobId: string]: boolean } = {};

  // Selected job for upload modal
  activeJobId: string | null = null;

  resumeTips = [
    'PDF format only (max 5MB)',
    'Tailor resume to each jobs requirements',
    'Highlight relevant skills & projects',
    'Include CGPA and academic achievements',
    'Keep it to 1-2 pages maximum',
    'Professional email address required'
  ];

  private BASE = 'http://localhost:3000/api';

  constructor(private api: ApiService, private http: HttpClient) {}

  ngOnInit() {
    this.loadAppliedJobs();
  }

  private get authHeaders(): HttpHeaders {
    const token = localStorage.getItem('hd_token');
    return new HttpHeaders({ Authorization: token ? `Bearer ${token}` : '' });
  }

  loadAppliedJobs() {
    this.loading = true;
    this.api.getApplications().subscribe({
      next: (apps: any[]) => {
        this.appliedJobs = apps.map(a => ({
          ...a,
          jobId:    a.jobId?.toString() || a._id?.toString(),
          appId:    a._id?.toString(),
          jobTitle: a.jobTitle,
          company:  a.company,
          logo:     a.logo || '🏢',
          color:    a.color || '#e0f5ff',
          pkg:      a.pkg || '—',
          status:   a.status,
          // Per-job resume fields stored on application
          resumeName: a.resumeName || null,
          resumeUrl:  a.resume || null,
          resumeUploadDate: a.resumeUploadDate || null,
        }));
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  hasResume(job: any): boolean {
    return !!(job.resumeName || job.resumeUrl);
  }

  uploadDateDisplay(job: any): string {
    if (!job.resumeUploadDate) return '';
    const d = new Date(job.resumeUploadDate);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  onFileChange(event: Event, job: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.uploadFile(input.files[0], job);
      input.value = '';  // reset so same file can be re-selected
    }
  }

  onDrop(event: DragEvent, job: any) {
    event.preventDefault();
    this.isDragOver[job.appId] = false;
    const file = event.dataTransfer?.files[0];
    if (file) this.uploadFile(file, job);
  }

  uploadFile(file: File, job: any) {
    const appId = job.appId;

    if (file.type !== 'application/pdf') {
      this.errorMsg[appId] = 'Only PDF files are allowed.';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.errorMsg[appId] = 'File must be under 5MB.';
      return;
    }

    this.uploading[appId]  = true;
    this.errorMsg[appId]   = '';
    this.successMsg[appId] = '';

    const formData = new FormData();
    formData.append('resume', file);

    // Upload resume tied to this specific application
    this.http.post<any>(
      `${this.BASE}/applications/${appId}/resume`,
      formData,
      { headers: this.authHeaders }
    ).subscribe({
      next: (res: any) => {
        const idx = this.appliedJobs.findIndex(j => j.appId === appId);
        if (idx !== -1) {
          this.appliedJobs[idx] = {
            ...this.appliedJobs[idx],
            resumeName: res.resumeName || file.name,
            resumeUrl:  res.resumeUrl,
            resumeUploadDate: new Date().toISOString()
          };
        }
        this.uploading[appId]  = false;
        this.successMsg[appId] = '✅ Resume uploaded successfully for this job!';
        setTimeout(() => this.successMsg[appId] = '', 4000);
      },
      error: (err: any) => {
        this.uploading[appId] = false;
        this.errorMsg[appId]  = err.error?.message || 'Upload failed. Please try again.';
      }
    });
  }

  removeResume(job: any) {
    if (!confirm(`Remove resume for ${job.jobTitle} at ${job.company}?`)) return;
    const appId = job.appId;
    this.removing[appId] = true;

    this.http.delete<any>(
      `${this.BASE}/applications/${appId}/resume`,
      { headers: this.authHeaders }
    ).subscribe({
      next: () => {
        const idx = this.appliedJobs.findIndex(j => j.appId === appId);
        if (idx !== -1) {
          this.appliedJobs[idx] = {
            ...this.appliedJobs[idx],
            resumeName: null,
            resumeUrl:  null,
            resumeUploadDate: null
          };
        }
        this.removing[appId]   = false;
        this.successMsg[appId] = 'Resume removed.';
        setTimeout(() => this.successMsg[appId] = '', 3000);
      },
      error: () => {
        this.removing[appId] = false;
        this.errorMsg[appId] = 'Failed to remove resume.';
      }
    });
  }

  get uploadedCount(): number {
    return this.appliedJobs.filter(j => this.hasResume(j)).length;
  }

  get pendingCount(): number {
    return this.appliedJobs.filter(j => !this.hasResume(j)).length;
  }

  statusColor(status: string): string {
    if (status === 'Selected')             return '#dcfce7';
    if (status === 'Rejected')             return '#fee2e2';
    if (status === 'Interview Scheduled')  return '#dbeafe';
    if (status === 'Shortlisted')          return '#fef9c3';
    return '#f1f5f9';
  }

  statusTextColor(status: string): string {
    if (status === 'Selected')             return '#166534';
    if (status === 'Rejected')             return '#991b1b';
    if (status === 'Interview Scheduled')  return '#1e40af';
    if (status === 'Shortlisted')          return '#854d0e';
    return '#475569';
  }
}

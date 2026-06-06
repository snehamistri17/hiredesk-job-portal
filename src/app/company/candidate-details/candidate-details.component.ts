import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-candidate-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DatePipe],
  templateUrl: './candidate-details.component.html',
  styleUrls: ['./candidate-details.component.css']
})
export class CandidateDetailsComponent implements OnInit {
  candidate: any = null;
  loading = true;
  notes = '';
  showScheduleForm = false;
  interviewForm = { date: '', time: '', mode: 'Online' };
  saving = false;

  private BASE = 'http://localhost:3000/api';

  constructor(
    private route:  ActivatedRoute,
    private router: Router,
    private api:    ApiService,
    private http:   HttpClient
  ) {}

  private headers() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('hd_token')}`
    });
  }

  ngOnInit() {
    // FIX: get the _id from the route param and fetch directly from API
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.loading = false; return; }

    // Fetch the specific application by ID from company applications
    this.api.getCompanyApplications().subscribe({
      next: (apps: any) => {
        const found = apps.find((a: any) => a._id === id);
        if (found) {
          this.candidate = {
            ...found,
            id:     found._id,
            name:   found.studentName,
            email:  found.studentEmail || '—',
            phone:  found.phone        || '—',
            avatar: (found.studentName || 'A').charAt(0).toUpperCase(),
            degree: found.branch       || '—',
          };
        }
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  getStatusBadge(status: string) {
    const map: any = {
      'Applied': 'badge-applied', 'Shortlisted': 'badge-shortlisted',
      'Interview Scheduled': 'badge-interview', 'Selected': 'badge-selected',
      'Rejected': 'badge-rejected'
    };
    return map[status] || '';
  }

  updateStatus(status: string) {
    if (!this.candidate) return;
    this.saving = true;
    this.api.updateApplicationStatus(this.candidate._id, { status }).subscribe({
      next: () => {
        this.candidate = { ...this.candidate, status };
        this.saving = false;
      },
      error: () => { alert('Error updating status'); this.saving = false; }
    });
  }

  scheduleInterview() { this.showScheduleForm = !this.showScheduleForm; }

  confirmSchedule() {
    if (!this.candidate || !this.interviewForm.date) return;
    this.saving = true;
    const payload = {
      status:        'Interview Scheduled',
      interviewDate: this.interviewForm.date,
      interviewTime: this.interviewForm.time,
      interviewMode: this.interviewForm.mode,
    };
    this.api.updateApplicationStatus(this.candidate._id, payload).subscribe({
      next: () => {
        this.candidate = { ...this.candidate, ...payload };
        this.showScheduleForm = false;
        this.saving = false;
        alert('Interview scheduled successfully!');
      },
      error: () => { alert('Error scheduling interview'); this.saving = false; }
    });
  }

  downloadResume(): void {
  if (!this.candidate?.resume || !this.candidate?.userId) {
    alert('No resume uploaded by this candidate.');
    return;
  }
  // Track the view on student's profile, then open the file
  const token = localStorage.getItem('hd_token');
  this.http.get(
    `http://localhost:3000/api/user/resume/view/${this.candidate.userId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  ).subscribe({
    next: () => {
      const url = `http://localhost:3000/${this.candidate.resume}`;
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.download = this.candidate.resumeName || 'Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    error: () => {
      // Still open resume even if tracking fails
      const url = `http://localhost:3000/${this.candidate.resume}`;
      window.open(url, '_blank');
    }
  });
}
  goBack() { this.router.navigate(['/company/candidates']); }
}
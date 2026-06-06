import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-interview-status',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DatePipe],
  templateUrl: './interview-status.component.html',
  styleUrls: ['./interview-status.component.css']
})
export class InterviewStatusComponent implements OnInit {
  scheduled: any[] = [];
  loading = true;

  get onlineCount()   { return this.scheduled.filter(c => c.interviewMode === 'Online').length; }
  get inPersonCount() { return this.scheduled.filter(c => c.interviewMode === 'In-Person').length; }

  constructor(private api: ApiService, public router: Router) {}

  ngOnInit() {
    // FIX: load from API directly instead of CompanyDataService cache
    this.api.getCompanyApplications().subscribe({
      next: (apps: any) => {
        this.scheduled = apps
          .filter((a: any) => a.status === 'Interview Scheduled')
          .map((a: any) => ({
            ...a,
            name:   a.studentName,
            avatar: (a.studentName || 'A').charAt(0).toUpperCase(),
          }));
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  markSelected(c: any) {
    this.api.updateApplicationStatus(c._id, { status: 'Selected' }).subscribe({
      next: () => { c.status = 'Selected'; this.scheduled = this.scheduled.filter(s => s._id !== c._id); },
      error: () => alert('Error updating status')
    });
  }

  markRejected(c: any) {
    this.api.updateApplicationStatus(c._id, { status: 'Rejected' }).subscribe({
      next: () => { this.scheduled = this.scheduled.filter(s => s._id !== c._id); },
      error: () => alert('Error updating status')
    });
  }
}

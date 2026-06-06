import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-company-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './company-dashboard.component.html',
  styleUrls: ['./company-dashboard.component.css']
})
export class CompanyDashboardComponent implements OnInit {
  stats = {
    totalJobs: 0, totalApplications: 0, shortlisted: 0,
    hired: 0, pendingReview: 0, interviewsToday: 0
  };
  activeJobs:           any[] = [];
  recentCandidates:     any[] = [];
  scheduledInterviews:  any[] = [];
  loading = true;
  companyName = '';

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const co = this.auth.getCompany();
    this.companyName = co?.name || 'Company';
    this.load();
  }

  load() {
    this.loading = true;

    // FIX: Load jobs first, then applications — guarantees consistent render
    this.api.getMyJobs().subscribe({
      next: (jobs: any) => {
        const mapped = jobs.map((j: any) => ({ ...j, title: j.jobtitle }));
        this.activeJobs      = mapped.filter((j: any) => j.status === 'Active');
        this.stats = { ...this.stats, totalJobs: this.activeJobs.length };
        this.cdr.detectChanges();
      },
      error: () => {}
    });

    this.api.getCompanyApplications().subscribe({
      next: (apps: any) => {
        const mapped = apps.map((a: any) => ({
          ...a,
          id:     a._id,
          name:   a.studentName,
          avatar: (a.studentName || 'A').charAt(0).toUpperCase(),
        }));

        // FIX: reassign all array references so Angular detects changes on re-visit
        this.recentCandidates    = mapped.slice(0, 6);
        this.scheduledInterviews = mapped.filter((c: any) => c.status === 'Interview Scheduled');

        // FIX: reassign stats object reference
        this.stats = {
          totalJobs:         this.stats.totalJobs,
          totalApplications: apps.length,
          shortlisted:       apps.filter((c: any) => c.status === 'Shortlisted' || c.status === 'Interview Scheduled').length,
          hired:             apps.filter((c: any) => c.status === 'Selected').length,
          pendingReview:     apps.filter((c: any) => c.status === 'Applied').length,
          interviewsToday:   mapped.filter((c: any) => c.status === 'Interview Scheduled').length,
        };
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loading = false; this.cdr.detectChanges(); }
    });
  }

  viewCandidate(id: any) {
    this.router.navigate(['/company/candidate', id]);
  }

  getDeptIcon(dept: string): string {
    const icons: Record<string, string> = {
      'Engineering': 'code', 'Design': 'brush', 'Marketing': 'campaign',
      'Sales': 'trending_up', 'HR': 'people', 'Finance': 'attach_money',
      'Data Science': 'bar_chart', 'Product': 'inventory',
      'Operations': 'settings', 'Legal': 'gavel',
    };
    return icons[dept] ?? 'work';
  }

  getStatusBadge(s: string) {
    const m: any = {
      'Applied': 'badge-applied', 'Shortlisted': 'badge-shortlisted',
      'Interview Scheduled': 'badge-interview', 'Selected': 'badge-selected',
      'Rejected': 'badge-rejected',
    };
    return m[s] || 'badge-applied';
  }
}

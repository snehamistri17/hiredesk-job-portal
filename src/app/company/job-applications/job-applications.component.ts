import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-job-applications',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DatePipe],
  templateUrl: './job-applications.component.html',
  styleUrls: ['./job-applications.component.css']
})
export class JobApplicationsComponent implements OnInit, OnDestroy {
  all: any[] = [];
  filteredCandidates: any[] = [];
  searchQuery    = '';
  selectedJob    = '';
  selectedStatus = '';
  loading = true;
  private routerSub!: Subscription;

  companyService = { jobs: [] as any[] };

  get statusCounts() {
    const statuses = ['Applied', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'];
    const badges: any = {
      'Applied':             'badge-applied',
      'Shortlisted':         'badge-shortlisted',
      'Interview Scheduled': 'badge-interview',
      'Selected':            'badge-selected',
      'Rejected':            'badge-rejected',
    };
    return statuses.map(s => ({
      status:     s,
      count:      this.all.filter(c => c.status === s).length,
      badgeClass: badges[s]
    }));
  }

  constructor(
    private api:    ApiService,
    private router: Router,
    private route:  ActivatedRoute,
    private cdr:    ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Load the company's jobs for the filter dropdown
    this.api.getMyJobs().subscribe({
      next: (jobs: any) => {
        this.companyService.jobs = jobs.map((j: any) => ({
          ...j,
          id:    j._id,
          title: j.jobtitle
        }));
      },
      error: () => {}
    });

    // Respect ?job= query param
    this.route.queryParams.subscribe(p => {
      if (p['job']) this.selectedJob = p['job'];
      this.loadApplications();
    });

    // Reload data every time user navigates back to this page
    this.routerSub = this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadApplications();
    });
  }

  ngOnDestroy() {
    if (this.routerSub) this.routerSub.unsubscribe();
  }

  loadApplications() {
    this.loading = true;
    this.api.getCompanyApplications().subscribe({
      next: (data: any) => {
        // Normalize each application: map backend field names → template fields
        this.all = (data as any[]).map(app => this.normalize(app));
        this.filterCandidates();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Maps backend Application fields → template-friendly fields
  private normalize(app: any): any {
    const name  = app.studentName  || app.name  || '';
    const email = app.studentEmail || app.email || '';
    return {
      ...app,
      name,
      email,
      // Generate 2-letter initials from name
      avatar: this.getInitials(name),
      // 'branch' stored in schema, shown as 'degree' in table
      degree:   app.degree   || app.branch   || '',
      college:  app.college  || '',
      skills:   Array.isArray(app.skills) ? app.skills : [],
      cgpa:     app.cgpa     ?? '',
      jobTitle: app.jobTitle || '',
      status:   app.status   || 'Applied',
    };
  }

  private getInitials(name: string): string {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  filterCandidates() {
    const q = this.searchQuery.toLowerCase();
    this.filteredCandidates = this.all.filter((c: any) =>
      (!q ||
        c.name?.toLowerCase().includes(q) ||
        c.college?.toLowerCase().includes(q) ||
        c.skills?.some((s: string) => s.toLowerCase().includes(q))
      ) &&
      (!this.selectedJob    || c.jobId?.toString() === this.selectedJob) &&
      (!this.selectedStatus || c.status === this.selectedStatus)
    );
  }

  filterByStatus(s: string) {
    this.selectedStatus = this.selectedStatus === s ? '' : s;
    this.filterCandidates();
  }

  updateStatus(app: any, status: string) {
    this.api.updateApplicationStatus(app._id, { status }).subscribe({
      next: () => {
        const idx = this.all.findIndex(a => a._id === app._id);
        if (idx !== -1) {
          this.all = [
            ...this.all.slice(0, idx),
            { ...this.all[idx], status },
            ...this.all.slice(idx + 1)
          ];
          this.filterCandidates();
          this.cdr.detectChanges();
        }
      },
      error: () => alert('Error updating status')
    });
  }

  viewCandidate(id: any) {
    this.router.navigate(['/company/candidate', id]);
  }

  exportCSV() {
    const header = 'Name,Job Title,Company,Status,CGPA,Applied Date';
    const rows   = this.filteredCandidates.map(c =>
      [c.name, c.jobTitle, c.company, c.status, c.cgpa, c.appliedDate].join(',')
    );
    const csv  = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'applications.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  getStatusBadge(s: string) {
    const m: any = {
      'Applied':             'badge-applied',
      'Shortlisted':         'badge-shortlisted',
      'Interview Scheduled': 'badge-interview',
      'Selected':            'badge-selected',
      'Rejected':            'badge-rejected',
    };
    return m[s] || '';
  }

  cgpaClass(c: number) {
    return c >= 9 ? 'cgpa-high' : c >= 7.5 ? 'cgpa-mid' : 'cgpa-low';
  }
}
// src/app/eligible-jobs/eligible-jobs.component.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-eligible-jobs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './eligible-jobs.component.html',
  styleUrls: ['./eligible-jobs.component.css']
})
export class EligibleJobsComponent implements OnInit {
  search     = '';
  filterType = 'All';
  loading    = true;
  error      = '';

  // FIX: Use a plain object instead of Set — Angular change detection
  // tracks object reference changes, not internal Set mutations.
  appliedIds: { [jobId: string]: boolean } = {};
  applyingId: string | null = null;
  successMsg = '';

  jobTypes = ['All', 'Full-Time', 'Internship', 'Contract'];

  allJobs: any[] = [];

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  private get headers() {
    return new HttpHeaders({ Authorization: `Bearer ${localStorage.getItem('hd_token')}` });
  }

  ngOnInit() {
    // FIX: Load applied IDs first, then load jobs — so isApplied() is
    // already populated when jobs render. Previously both ran in parallel
    // and jobs often rendered before appliedIds was populated.
    this.loadApplied(() => this.loadJobs());
  }

  loadJobs() {
    this.loading = true;
    this.http.get<any[]>('http://localhost:3000/api/jobs', { headers: this.headers })
      .subscribe({
        next: (data) => {
          this.allJobs = data;
          this.loading = false;
          this.cdr.detectChanges(); // FIX: force re-render after both loads complete
        },
        error: () => {
          this.error   = 'Failed to load jobs. Please try again.';
          this.loading = false;
        }
      });
  }

  // FIX: Accept optional callback so loadJobs runs only after appliedIds is ready
  loadApplied(callback?: () => void) {
    this.http.get<any[]>('http://localhost:3000/api/applications', { headers: this.headers })
      .subscribe({
        next: (apps) => {
          // FIX: Replace entire object (new reference) so change detection fires
          const ids: { [jobId: string]: boolean } = {};
          apps.forEach(a => {
            if (a.jobId) ids[a.jobId.toString()] = true;
          });
          this.appliedIds = ids;
          if (callback) callback();
        },
        error: () => {
          // Even on error, proceed to load jobs
          if (callback) callback();
        }
      });
  }

  get filteredJobs(): any[] {
    return this.allJobs.filter(j => {
      const matchType   = this.filterType === 'All' || j.type === this.filterType;
      const q           = this.search.toLowerCase();
      const matchSearch = !q ||
        j.jobtitle?.toLowerCase().includes(q) ||
        j.company?.toLowerCase().includes(q);
      return matchType && matchSearch;
    });
  }

  isApplied(id: string): boolean {
    // FIX: Plain object property lookup — always triggers change detection
    return !!this.appliedIds[id?.toString()];
  }

  applyJob(job: any) {
    const id = job._id?.toString();
    if (!id || this.isApplied(id)) return;

    this.applyingId = id;
    this.http.post<any>('http://localhost:3000/api/applications', { jobId: id }, { headers: this.headers })
      .subscribe({
        next: () => {
          // FIX: Create new object reference so Angular detects the change
          this.appliedIds = { ...this.appliedIds, [id]: true };
          this.applyingId = null;
          this.successMsg = `✅ Applied to ${job.company} successfully!`;
          setTimeout(() => this.successMsg = '', 3000);
        },
        error: (err) => {
          this.applyingId = null;
          alert(err.error?.message || 'Failed to apply. Try again.');
        }
      });
  }
}
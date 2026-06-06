// src/app/applied-jobs/applied-jobs.component.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-applied-jobs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './applied-jobs.component.html',
  styleUrls: ['./applied-jobs.component.css']
})
export class AppliedJobsComponent implements OnInit {
  applications: any[] = [];
  loading = true;
  error   = '';

  stats = [
    { label: 'Total Applied',  value: 0, icon: '📨', cls: 'ic-blue'   },
    { label: 'Under Review',   value: 0, icon: '🔍', cls: 'ic-orange'  },
    { label: 'Shortlisted',    value: 0, icon: '⭐', cls: 'ic-teal'    },
    { label: 'Selected',       value: 0, icon: '🏆', cls: 'ic-green'   },
  ];

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.error   = '';
    this.api.getApplications().subscribe({
      next: (data: any[]) => {
        this.applications = data.map(a => ({
          ...a,
          appliedDate: new Date(a.appliedDate).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }),
          statusCls:   this.getStatusClass(a.status),
          stage:       a.stage || 'Application Submitted'
        }));

        // FIX: reassign array reference so Angular detects change
        this.stats = [
          { label: 'Total Applied',  value: data.length,                                                                   icon: '📨', cls: 'ic-blue'   },
          { label: 'Under Review',   value: data.filter(a => a.status === 'Applied').length,                               icon: '🔍', cls: 'ic-orange'  },
          { label: 'Shortlisted',    value: data.filter(a => ['Shortlisted','Interview Scheduled'].includes(a.status)).length, icon: '⭐', cls: 'ic-teal' },
          { label: 'Selected',       value: data.filter(a => a.status === 'Selected').length,                              icon: '🏆', cls: 'ic-green'   },
        ];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error   = 'Failed to load applications.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getStatusClass(status: string): string {
    const map: any = {
      'Applied':              'badge-warning',
      'Shortlisted':          'badge-primary',
      'Interview Scheduled':  'badge-accent',
      'Selected':             'badge-success',
      'Rejected':             'badge-danger',
      'Hired':                'badge-success',
    };
    return map[status] || 'badge-warning';
  }
}

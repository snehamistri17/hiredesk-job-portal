import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-placement-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './placement-result.component.html',
  styleUrls: ['./placement-result.component.css']
})
export class PlacementResultComponent implements OnInit {
  placementResult: any = { isPlaced: false };
  history: any[] = [];
  loading = true;

  stats = { total: 0, interviews: 0, rejected: 0 };

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.api.getApplications().subscribe({
      next: (apps: any[]) => {
        this.history = apps.map(a => ({
          logo:        a.logo || '🏢',
          role:        a.jobTitle,
          company:     a.company,
          pkg:         a.pkg || '—',
          date:        new Date(a.appliedDate).toLocaleDateString('en-IN', {
                         day: 'numeric', month: 'short', year: 'numeric'
                       }),
          status:      a.status,
          resultClass: a.status === 'Selected'
                         ? 'placed'
                         : a.status === 'Rejected'
                           ? 'rejected'
                           : a.status === 'Interview Scheduled'
                             ? 'interview'
                             : 'pending',
        }));

        this.stats = {
          total:      apps.length,
          interviews: apps.filter(a =>
            ['Interview Scheduled', 'Shortlisted', 'Selected'].includes(a.status)
          ).length,
          rejected:   apps.filter(a => a.status === 'Rejected').length,
        };

        const placed = apps.find(a => a.status === 'Selected');
        this.placementResult = placed
          ? {
              isPlaced:    true,
              logo:        placed.logo || '🏢',
              color:       placed.color || '#e0f5ff',
              company:     placed.company,
              role:        placed.jobTitle,
              package:     placed.pkg || '—',
              joiningDate: placed.joiningDate || '01 July 2025',
            }
          : { isPlaced: false };

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loading = false; this.cdr.detectChanges(); }
    });
  }

  get successRate(): number {
    if (!this.stats.total) return 0;
    const placed = this.history.filter(h => h.status === 'Selected').length;
    return Math.round((placed / this.stats.total) * 100);
  }

  statusLabel(s: string): string {
    const map: any = {
      'Applied':             'Applied',
      'Shortlisted':         'Shortlisted',
      'Interview Scheduled': 'Interview',
      'Selected':            'Placed ✅',
      'Rejected':            'Not Selected',
    };
    return map[s] || s;
  }
}

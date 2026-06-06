import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-candidate-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.css']
})
export class CandidateListComponent implements OnInit, OnDestroy {
  all: any[] = [];
  filtered: any[] = [];
  q = ''; statusF = '';
  loading = true;
  private routerSub!: Subscription;

  constructor(
    private api: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.load();

    // Reload data every time user navigates back to this page
    this.routerSub = this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => {
      this.load();
    });
  }

  ngOnDestroy() {
    if (this.routerSub) this.routerSub.unsubscribe();
  }

  load() {
    this.loading = true;
    this.api.getCompanyApplications().subscribe({
      next: (data: any) => {
        // Normalize each application: map backend field names to what the template expects
        this.all = (data as any[]).map(app => this.normalize(app));
        this.filter();
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
      // 'branch' is stored in schema, alias as 'degree' for display
      degree: app.degree || app.branch || '',
      college: app.college || '',
      skills: Array.isArray(app.skills) ? app.skills : [],
      cgpa: app.cgpa ?? '',
      jobTitle: app.jobTitle || '',
      status: app.status || 'Applied',
    };
  }

  private getInitials(name: string): string {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  filter() {
    this.filtered = this.all.filter((c: any) => {
      const mq = !this.q ||
        c.name?.toLowerCase().includes(this.q.toLowerCase()) ||
        c.college?.toLowerCase().includes(this.q.toLowerCase());
      const ms = !this.statusF || c.status === this.statusF;
      return mq && ms;
    });
  }

  getBadge(s: string) {
    const m: any = {
      'Applied':            'badge-applied',
      'Shortlisted':        'badge-shortlisted',
      'Interview Scheduled':'badge-interview',
      'Selected':           'badge-selected',
      'Rejected':           'badge-rejected'
    };
    return m[s] || '';
  }

  cgpaC(n: number) {
    return n >= 9 ? 'cgpa-high' : n >= 7.5 ? 'cgpa-mid' : 'cgpa-low';
  }

  viewCandidate(id: any) {
    this.router.navigate(['/company/candidate', id]);
  }
}
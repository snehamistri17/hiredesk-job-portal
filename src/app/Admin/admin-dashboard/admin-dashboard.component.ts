import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AdminDataService } from '../../shared/admin-data.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  stats: any = {
    totalStudents: 0, totalCompanies: 0, totalJobs: 0,
    totalApplications: 0, placedStudents: 0, pendingApprovals: 0, placementRate: 0
  };
  statCards:      any[] = [];
  pending:        any[] = [];
  recentStudents: any[] = [];
  loading = true;

  monthly:        { month: string; placed: number }[] = [];
  branchWise:     { branch: string; pct: number }[]   = [];
  upcomingDrives: any[] = [];

  get maxVal(): number {
    return Math.max(...this.monthly.map(m => m.placed), 1);
  }

  chartsReady = false;

  constructor(private api: ApiService, private adminData: AdminDataService) {}

  ngOnInit() {

    // 1. Stats card
    (this.api.getAdminStats() as any).subscribe({
      next: (data: any) => {
        this.stats = data;
        this.statCards = [
          { icon: '🎓', val: data.totalStudents,     label: 'Total Students', color: '#6366f1', bg: '#ede9fe', trend: '' },
          { icon: '🏢', val: data.totalCompanies,    label: 'Companies',      color: '#0ea5e9', bg: '#e0f2fe', trend: data.pendingApprovals + ' pending' },
          { icon: '💼', val: data.totalJobs,         label: 'Active Jobs',    color: '#f59e0b', bg: '#fef3c7', trend: '' },
          { icon: '📋', val: data.totalApplications, label: 'Applications',   color: '#10b981', bg: '#d1fae5', trend: '' },
          { icon: '🏆', val: data.placedStudents,    label: 'Placed',         color: '#22c55e', bg: '#dcfce7', trend: data.placementRate + '% rate' },
        ];
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });

    // 2. Pending company approvals
    (this.api.getPendingCompanies() as any).subscribe({
      next: (data: any) => { this.pending = data; },
      error: () => {}
    });

    // 3. Recent students + Monthly chart + Branch-wise
    (this.api.getStudents() as any).subscribe({
      next: (data: any) => {

        // FIX 3: use s.name (correct DB field) — not s.displayName / s.userName
        this.recentStudents = data.slice(0, 6).map((s: any) => ({
          ...s,
          avatar: (s.name || 'S').charAt(0).toUpperCase(),
          cgpa:   s.cgpa != null ? s.cgpa : '—',
        }));

        // FIX 1: use s.placementStatus (correct DB field) — not s.status
        this.monthly = this._buildMonthly(data);

        // FIX 2 & 4: use s.placementStatus + dynamic branches from actual data
        this.branchWise = this._buildBranchWise(data);

        this.chartsReady = true;
      },
      error: () => { this.chartsReady = true; }
    });

    // 4. Upcoming placement drives
    (this.api.getAllJobs() as any).subscribe({
      next: (data: any) => {
        this.upcomingDrives = data
          .filter((j: any) => j.status === 'Active')
          .sort((a: any, b: any) =>
            new Date(a.deadline || 0).getTime() - new Date(b.deadline || 0).getTime()
          )
          .slice(0, 5)
          .map((j: any) => ({
            company:    j.company    || '—',
            type:       j.type       || 'Full-Time',
            title:      j.jobtitle   || j.title || '—',
            date:       j.deadline   || '—',
            location:   j.location   || '—',
            registered: j.applicants || 0,
            package:    j.salary     || '—',
          }));
      },
      error: () => {}
    });
  }

  // FIX 1: was checking s.status — must use s.placementStatus
  private _buildMonthly(students: any[]): { month: string; placed: number }[] {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const counts = new Array(12).fill(0);
    students
      .filter((s: any) => s.placementStatus === 'Placed' && s.createdAt)  // ✅ FIXED
      .forEach((s: any) => {
        const m = new Date(s.createdAt).getMonth();
        counts[m]++;
      });
    return months.map((month, i) => ({ month, placed: counts[i] }));
  }

  // FIX 2 & 4: was checking s.status and hardcoded branch names
  // Now uses s.placementStatus and builds branches dynamically from actual data
  private _buildBranchWise(students: any[]): { branch: string; pct: number; total: number; placed: number }[] {
    // Build branch list dynamically from real data — not a hardcoded list
    const branchMap = new Map<string, { total: number; placed: number }>();

    students.forEach((s: any) => {
      const branch = s.branch || 'Unknown';
      if (!branchMap.has(branch)) branchMap.set(branch, { total: 0, placed: 0 });
      const entry = branchMap.get(branch)!;
      entry.total++;
      if (s.placementStatus === 'Placed') entry.placed++;  // ✅ FIXED
    });

    return Array.from(branchMap.entries())
      .map(([branch, { total, placed }]) => ({
        branch,
        total,
        placed,
        pct: total > 0 ? Math.round((placed / total) * 100) : 0,
      }))
      .filter(b => b.total > 0)
      .sort((a, b) => b.pct - a.pct);
  }

  stClass(status: string): string {
    const map: any = {
      'Placed':      'sbadge-placed',
      'Eligible':    'sbadge-eligible',
      'Applied':     'sbadge-applied',
      'Not Eligible':'sbadge-ineligible',
    };
    return map[status] ?? 'sbadge-eligible';
  }

  approve(company: any) {
    (this.api.approveCompany(company._id) as any).subscribe({
      next: () => { this.pending = this.pending.filter(p => p._id !== company._id); },
      error: () => alert('Error approving company')
    });
  }

  reject(company: any) {
    (this.api.rejectCompany(company._id) as any).subscribe({
      next: () => { this.pending = this.pending.filter(p => p._id !== company._id); },
      error: () => alert('Error rejecting company')
    });
  }

  get noMonthlyData(): boolean {
    return this.chartsReady && this.monthly.every(m => m.placed === 0);
  }

  get hasMonthlyData(): boolean {
    return !this.chartsReady || this.monthly.some(m => m.placed > 0);
  }
}
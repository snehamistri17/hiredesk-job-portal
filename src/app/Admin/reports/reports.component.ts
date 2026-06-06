import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit {

  monthly: any[]      = [];
  branchWise: any[]   = []
  topCompanies: any[] = [];
  maxMonthly = 0;
  loading = true;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    (this.api.getStudents() as any).subscribe({
      next: (students: any) => {
        this.computeBranchWise(students);
        this.computeMonthly(students);
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });

    (this.api.getAllCompanies() as any).subscribe({
      next: (companies: any) => {
        this.computeTopCompanies(companies);
      },
      error: () => {}
    });
  }

  private computeBranchWise(students: any[]) {
    // Use actual branches found in DB, not a hardcoded list
    const branchMap: Record<string, { total: number; placed: number }> = {};
    students.forEach((s: any) => {
      const b = s.branch || s.department || 'Other';
      if (!branchMap[b]) branchMap[b] = { total: 0, placed: 0 };
      branchMap[b].total++;
      if (s.status === 'Placed') branchMap[b].placed++;
    });

    this.branchWise = Object.entries(branchMap)
      .map(([branch, v]) => ({
        branch,
        students: v.total,
        placed:   v.placed,
        pct:      v.total > 0 ? Math.round((v.placed / v.total) * 100) : 0,
      }))
      .sort((a, b) => b.students - a.students);
  }

  private computeMonthly(students: any[]) {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const counts = new Array(12).fill(0);

    // Count ALL students registered per month (not just Placed)
    // so the chart always shows data even before placements
    students.forEach((s: any) => {
      if (s.createdAt) {
        const m = new Date(s.createdAt).getMonth();
        counts[m]++;
      }
    });

    // Also add placed students as a separate dataset if any
    const placedCounts = new Array(12).fill(0);
    students.filter((s: any) => s.status === 'Placed' && s.createdAt)
      .forEach((s: any) => {
        const m = new Date(s.createdAt).getMonth();
        placedCounts[m]++;
      });

    this.monthly = months.map((month, i) => ({
      month,
      total:  counts[i],
      placed: placedCounts[i],
    }));

    // ✅ Fix: use total students for maxVal so chart always renders
    this.maxMonthly = Math.max(...counts, 1);
  }

  private computeTopCompanies(companies: any[]) {
    this.topCompanies = companies
      .filter((c: any) => c.status === 'Approved')
      .slice(0, 5)
      .map((c: any) => ({
        name:  c.name,
        avg:   c.package || c.salaryRange || '—',
        hired: 0,
      }));
  }

  pctClass(pct: number): string {
    if (pct >= 60) return 'high';
    if (pct >= 40) return 'mid';
    return 'low';
  }

  // Show chart if there's any monthly data at all
  get hasChartData(): boolean {
    return this.monthly.some(m => m.total > 0 || m.placed > 0);
  }

  get noChartData(): boolean {
    return !this.hasChartData;
  }
}
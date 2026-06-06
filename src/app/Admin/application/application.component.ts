import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-all-applications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css'],
})
export class ApplicationComponent implements OnInit {
  all: any[] = [];
  filtered: any[] = [];
  fStatus = ''; fCompany = ''; q = '';
  companies: string[] = [];
  loading = true;
  summary: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() { this.loadApplications(); }

  loadApplications() {
    this.api.getAllApplications().subscribe({
      next: (data: any) => {
        // ✅ Map API fields to template fields correctly
        this.all = data.map((a: any) => ({
          ...a,
          // student name from studentName field
          student: a.studentName || a.name || '—',
          // job title from jobTitle field
          job:     a.jobTitle || a.role || '—',
          // avatar initials
          avatar:  (a.studentName || a.name || 'S').charAt(0).toUpperCase(),
          // formatted date
          date:    a.appliedDate
                    ? new Date(a.appliedDate).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })
                    : '—',
          // ensure score is a number
          score:   a.score ?? 0,
          // keep status
          status:  a.status || 'Applied',
          // keep round
          round:   a.round || a.stage || '—',
          // keep company
          company: a.company || '—',
        }));

        // Unique companies for filter dropdown
        this.companies = [...new Set(data.map((a: any) => a.company))] as string[];
        this.updateSummary();
        this.filter();
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  updateSummary() {
    this.summary = [
      { icon: '📋', val: this.all.length,                                                          label: 'Total',       bg: '#ede9fe' },
      { icon: '🏆', val: this.all.filter((a: any) => a.status === 'Hired').length,                label: 'Hired',       bg: '#dcfce7' },
      { icon: '✅', val: this.all.filter((a: any) => a.status === 'Shortlisted').length,          label: 'Shortlisted', bg: '#dbeafe' },
      { icon: '📅', val: this.all.filter((a: any) => a.status === 'Interview Scheduled').length,  label: 'Interviews',  bg: '#fef9c3' },
      { icon: '❌', val: this.all.filter((a: any) => a.status === 'Rejected').length,             label: 'Rejected',    bg: '#fee2e2' },
    ];
  }

  filter() {
    this.filtered = this.all.filter((a: any) => {
      return (!this.fStatus  || a.status  === this.fStatus) &&
             (!this.fCompany || a.company === this.fCompany) &&
             (!this.q || a.student?.toLowerCase().includes(this.q.toLowerCase()) ||
                         a.job?.toLowerCase().includes(this.q.toLowerCase()));
    });
  }

  // ✅ Added Selected status class
  statusClass(s: string) {
    const m: any = {
      'Hired':                'hired',
      'Shortlisted':          'shortlisted',
      'Selected':             'shortlisted',
      'Interview Scheduled':  'interview',
      'Under Review':         'review',
      'Applied':              'review',
      'Rejected':             'rejected',
    };
    return m[s] ?? 'review';
  }

  scoreClass(n: number) {
    return n >= 85 ? 'sc-green' : n >= 65 ? 'sc-yellow' : 'sc-red';
  }
}
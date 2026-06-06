import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';

declare var emailjs: any;

@Component({
  selector: 'app-application-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './application-status.component.html',
  styleUrls: ['./application-status.component.css']
})
export class ApplicationStatusComponent implements OnInit {
  applications: any[] = [];
  selectedApp  = 0;
  loading      = true;
  error        = '';
  emailSentIds: Set<string> = new Set();

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading     = true;
    this.error       = '';
    this.selectedApp = 0;
    this.api.getApplications().subscribe({
      next: (data: any[]) => {
        this.applications = data.map(a => ({
          ...a,
          company:       a.company,
          logo:          a.logo  || '🏢',
          color:         a.color || '#e0f5ff',
          role:          a.jobTitle,
          pkg:           a.pkg   || '—',
          overallStatus: a.status,
          // Simplified timeline: only 3 stages for student project
          timeline: this.buildTimeline(a)
        }));
        this.loading = false;
        this.cdr.detectChanges();

        this.applications.forEach(app => {
          if (app.overallStatus === 'Selected' && !this.emailSentIds.has(app._id)) {
            this.sendCongratulationsEmail(app);
          }
        });
      },
      error: () => {
        this.error   = 'Failed to load applications.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Simplified 3-stage pipeline: Applied → Interview → Result
  buildTimeline(a: any): any[] {
    const status = a.status;

    const stages = [
      {
        stage: 'Application Submitted',
        icon:  '📨',
        date:  a.timeline?.[0]?.date || new Date(a.appliedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        desc:  'Your application was received successfully.',
        status: 'done'
      },
      {
        stage: 'Interview',
        icon:  '🎤',
        date:  a.interviewDate ? `${a.interviewDate}${a.interviewTime ? ' · ' + a.interviewTime : ''}` : '—',
        desc:  this.interviewDesc(a),
        mode:  a.interviewMode || null,
        status: this.interviewStageStatus(status)
      },
      {
        stage: 'Final Result',
        icon:  '🏆',
        date:  status === 'Selected' || status === 'Rejected' ? 'Announced' : '—',
        desc:  this.resultDesc(status),
        status: this.resultStageStatus(status)
      }
    ];

    return stages;
  }

  interviewStageStatus(status: string): 'done' | 'active' | 'pending' {
    if (status === 'Selected' || status === 'Rejected')    return 'done';
    if (status === 'Interview Scheduled' || status === 'Shortlisted') return 'active';
    return 'pending';
  }

  resultStageStatus(status: string): 'done' | 'active' | 'pending' {
    if (status === 'Selected' || status === 'Rejected') return 'done';
    return 'pending';
  }

  interviewDesc(a: any): string {
    if (a.status === 'Interview Scheduled') {
      let desc = 'Interview scheduled';
      if (a.interviewMode) desc += ` · ${a.interviewMode}`;
      if (a.interviewDate) desc += ` on ${a.interviewDate}`;
      return desc + '. Best of luck! 🤞';
    }
    if (a.status === 'Shortlisted') return 'You\'ve been shortlisted! Interview details coming soon.';
    if (a.status === 'Selected' || a.status === 'Rejected') return 'Interview completed.';
    return 'Interview details will be shared once shortlisted.';
  }

  resultDesc(status: string): string {
    if (status === 'Selected') return 'Congratulations! You have been selected. 🎉';
    if (status === 'Rejected') return 'Unfortunately not selected this time. Keep applying!';
    return 'Result will be announced after the interview.';
  }

  get selected(): any {
    return this.applications[this.selectedApp];
  }

  get isSelected(): boolean {
    return this.selected?.overallStatus === 'Selected';
  }

  get isRejected(): boolean {
    return this.selected?.overallStatus === 'Rejected';
  }

  get isInterviewScheduled(): boolean {
    return this.selected?.overallStatus === 'Interview Scheduled';
  }

  get progressPercent(): number {
    const s = this.selected?.overallStatus;
    if (!s || s === 'Applied')                        return 15;
    if (s === 'Shortlisted')                          return 40;
    if (s === 'Interview Scheduled')                  return 65;
    if (s === 'Selected' || s === 'Rejected')         return 100;
    return 15;
  }

  sendCongratulationsEmail(app: any) {
    this.emailSentIds.add(app._id);
    const user    = JSON.parse(localStorage.getItem('hd_user') || '{}');
    const toEmail = user.email;
    const toName  = user.name;
    if (!toEmail) return;
    try {
      emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
        to_name: toName || 'Student', to_email: toEmail,
        company: app.company, role: app.role, package: app.pkg,
        year: new Date().getFullYear()
      }, 'YOUR_PUBLIC_KEY')
        .then(() => console.log('✅ Email sent'))
        .catch((err: any) => console.error('EmailJS:', err));
    } catch (e) { console.error('EmailJS not loaded:', e); }
  }

  statusLabel(s: string): string {
    const map: any = {
      'Applied':              'Applied',
      'Shortlisted':          'Shortlisted',
      'Interview Scheduled':  'Interview Scheduled',
      'Selected':             'Selected 🎉',
      'Rejected':             'Not Selected',
    };
    return map[s] || s;
  }
}

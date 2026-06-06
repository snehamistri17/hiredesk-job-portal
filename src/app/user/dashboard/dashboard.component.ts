// src/app/dashboard/dashboard.component.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  userName          = '';
  greeting          = '';
  profileCompletion = 0;
  loadingJobs       = true;
  loadingStats      = true;

  stats: { icon: string; label: string; value: any; change: string; cls: string; color: string }[] = [
    { icon: '💼', label: 'Eligible Jobs',    value: '—', change: 'Available now',    cls: 'ic-blue',   color: '#3b82f6' },
    { icon: '📨', label: 'My Applications',  value: '—', change: 'Total applied',    cls: 'ic-teal',   color: '#06b6d4' },
    { icon: '🏆', label: 'Profile Score',    value: '—', change: 'Complete profile', cls: 'ic-green',  color: '#10b981' },
  ];

  recentJobs:  any[] = [];
  skills:      any[] = [];
  activities:  any[] = [];

  todos = [
    { text: 'Upload latest resume',    done: false, icon: '📄', route: '/student/resume'   },
    { text: 'Add technical skills',    done: false, icon: '⚡', route: '/student/skills'   },
    { text: 'Fill academic details',   done: false, icon: '🎓', route: '/student/academic' },
    { text: 'Link GitHub profile',     done: false, icon: '🐙', route: '/student/profile'  },
    { text: 'Complete personal info',  done: false, icon: '👤', route: '/student/profile'  },
  ];

  quickActions = [
    { icon: '📄', label: 'Upload Resume',    route: '/student/resume'         },
    { icon: '💼', label: 'Browse Jobs',      route: '/student/eligible-jobs'  },
    { icon: '⚡', label: 'Add Skills',       route: '/student/skills'         },
    { icon: '🎓', label: 'Update Academics', route: '/student/academic'       },
  ];

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  private get headers() {
    return new HttpHeaders({ Authorization: `Bearer ${localStorage.getItem('hd_token')}` });
  }

  get doneTodos():    number { return this.todos.filter(t => t.done).length; }
  get todoProgress(): number { return Math.round((this.doneTodos / this.todos.length) * 100); }

  ngOnInit() {
    const h   = new Date().getHours();
    this.greeting = h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening';

    try {
      const u = JSON.parse(localStorage.getItem('hd_user') || '{}');
      this.userName = u.name?.split(' ')[0] || 'there';
    } catch {}

    // FIX: sequence the calls — profile first (has most info), then stats, then jobs/skills in parallel
    this.loadProfile();
  }

  loadProfile() {
    this.http.get<any>('http://localhost:3000/api/user/profile', { headers: this.headers })
      .subscribe({
        next: (u) => {
          this.userName          = u.name?.split(' ')[0] || 'there';
          this.profileCompletion = u.profileCompletion   || 0;

          // FIX: reassign todos array with new objects so Angular detects changes
          this.todos = [
            { text: 'Upload latest resume',   done: !!u.resumeUrl,                     icon: '📄', route: '/student/resume'   },
            { text: 'Add technical skills',   done: (u.technicalSkills?.length > 0),   icon: '⚡', route: '/student/skills'   },
            { text: 'Fill academic details',  done: !!(u.cgpa || u.college),           icon: '🎓', route: '/student/academic' },
            { text: 'Link GitHub profile',    done: !!u.github,                        icon: '🐙', route: '/student/profile'  },
            { text: 'Complete personal info', done: !!(u.dob && u.address && u.city),  icon: '👤', route: '/student/profile'  },
          ];

          // FIX: reassign stats array reference
          this.stats = [
            { ...this.stats[0] },
            { ...this.stats[1] },
            { icon: '🏆', label: 'Profile Score', value: (u.profileCompletion || 0) + '%', change: 'Profile completion', cls: 'ic-green', color: '#10b981' },
          ];

          this.buildActivity(u);
          this.cdr.detectChanges();

          // Now load the rest in parallel
          this.loadStats();
          this.loadJobs();
          this.loadSkills();
        },
        error: () => {
          this.loadStats();
          this.loadJobs();
          this.loadSkills();
        }
      });
  }

  loadStats() {
    this.http.get<any>('http://localhost:3000/api/applications/stats', { headers: this.headers })
      .subscribe({
        next: (s) => {
          // FIX: create new array reference
          this.stats = this.stats.map((st, i) => i === 1
            ? { ...st, value: s.total ?? 0, change: s.underReview > 0 ? `${s.underReview} under review` : 'No pending' }
            : st
          );
          this.loadingStats = false;
          this.cdr.detectChanges();
        },
        error: () => { this.loadingStats = false; }
      });
  }

  loadJobs() {
    this.http.get<any[]>('http://localhost:3000/api/jobs', { headers: this.headers })
      .subscribe({
        next: (jobs) => {
          // FIX: reassign array reference
          this.recentJobs = jobs.slice(0, 4).map(j => ({
            id:       j._id,
            company:  j.company,
            logo:     j.logo     || '🏢',
            role:     j.jobtitle,
            pkg:      j.salary,
            location: j.location || '—',
            deadline: j.deadline || '—',
            color:    j.color    || '#e0f5ff',
            type:     j.type     || 'Full-Time',
          }));
          this.stats = this.stats.map((st, i) => i === 0
            ? { ...st, value: jobs.length, change: `${jobs.length} jobs available` }
            : st
          );
          this.loadingJobs = false;
          this.cdr.detectChanges();
        },
        error: () => { this.loadingJobs = false; }
      });
  }

  loadSkills() {
    this.http.get<any>('http://localhost:3000/api/user/skills', { headers: this.headers })
      .subscribe({
        next: (data) => {
          const colors = ['#3b82f6','#06b6d4','#10b981','#f59e0b'];
          // FIX: reassign array reference
          this.skills = (data.technicalSkills || []).slice(0, 4).map((s: any, i: number) => ({
            name:  s.name,
            pct:   s.pct,
            color: colors[i % colors.length]
          }));
          if (this.skills.length > 0) {
            this.todos = this.todos.map((t, i) => i === 1 ? { ...t, done: true } : t);
          }
          this.cdr.detectChanges();
        },
        error: () => {}
      });
  }

  buildActivity(u: any) {
    const list = [];
    if (u.resumeUrl) list.push({ icon: '📄', text: 'Resume uploaded',           time: 'Recently',        bg: '#dcfce7' });
    if (u.github)    list.push({ icon: '🐙', text: 'GitHub linked',             time: 'Recently',        bg: '#f3e8ff' });
    if (u.cgpa)      list.push({ icon: '🎓', text: 'Academic details updated',  time: 'Recently',        bg: '#dbeafe' });
    list.push({ icon: '🎉', text: `Welcome to HireDesk, ${u.name?.split(' ')[0] || ''}!`, time: 'Account created', bg: '#fef9c3' });
    this.activities = list.slice(0, 4);
  }
}

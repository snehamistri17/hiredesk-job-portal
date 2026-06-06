// src/app/header/header.component.ts
import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Output() sidebarToggle = new EventEmitter<void>();

  showNotifDropdown  = false;
  showProfileDropdown = false;

  // User loaded from localStorage — real logged in user
  profile = {
    name:              'Student',
    email:             '',
    department:        '',
    college:           '',
    enrollmentNo:      '',
    cgpa:              '',
    batch:             '',
    profileCompletion: 0,
    readyScore:        0
  };

  notifications: any[] = [];

  navLinks = [
    { label: 'Dashboard',    icon: 'bi-speedometer2',          route: '/student/dashboard'          },
    { label: 'Jobs',         icon: 'bi-briefcase-fill',        route: '/student/eligible-jobs'      },
    { label: 'Applications', icon: 'bi-send-fill',             route: '/student/applied-jobs'       },
    { label: 'Status',       icon: 'bi-clipboard2-check-fill', route: '/student/application-status' },
    { label: 'Result',       icon: 'bi-trophy-fill',           route: '/student/placement-result'   }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadUserFromStorage();
  }

  // Read real user from localStorage
  loadUserFromStorage() {
    const saved = localStorage.getItem('hd_user');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        this.profile.name       = u.name       || 'Student';
        this.profile.email      = u.email      || '';
        this.profile.department = u.department || '';
        this.profile.enrollmentNo = u.rollNo   || '';
        this.profile.cgpa       = u.cgpa       || '';
        this.profile.profileCompletion = u.profileCompletion || 0;
      } catch {}
    }
  }

  get initials(): string {
    return (this.profile.name || 'ST')
      .split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);
  }

  get unread(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  toggleSidebar(): void { this.sidebarToggle.emit(); }

  toggleNotif(e: Event): void {
    e.stopPropagation();
    this.showNotifDropdown   = !this.showNotifDropdown;
    this.showProfileDropdown = false;
  }

  toggleProfile(e: Event): void {
    e.stopPropagation();
    this.showProfileDropdown = !this.showProfileDropdown;
    this.showNotifDropdown   = false;
  }

  markRead(id: number): void {
    const n = this.notifications.find(x => x.id === id);
    if (n) n.read = true;
  }

  markAllRead(): void { this.notifications.forEach(n => n.read = true); }

  navigate(route: string): void {
    this.showProfileDropdown = false;
    this.showNotifDropdown   = false;
    this.router.navigate([route]);
  }

  logout(): void {
    localStorage.removeItem('hd_token');
    localStorage.removeItem('hd_user');
    window.location.href = '/login';
  }

  notifIcon(type: string): string {
    const map: any = {
      job: 'bi-briefcase-fill', application: 'bi-file-check-fill',
      interview: 'bi-camera-video-fill', drive: 'bi-calendar-event-fill',
      reminder: 'bi-bell-fill', result: 'bi-trophy-fill'
    };
    return map[type] || 'bi-bell-fill';
  }

  notifColor(type: string): string {
    const map: any = {
      job: '#1e4278', application: '#10b981',
      interview: '#0891b2', drive: '#d97706',
      reminder: '#f97316', result: '#7c3aed'
    };
    return map[type] || '#1e4278';
  }

  @HostListener('document:click')
  closeAll(): void {
    this.showNotifDropdown   = false;
    this.showProfileDropdown = false;
  }
}
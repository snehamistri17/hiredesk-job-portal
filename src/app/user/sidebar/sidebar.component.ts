// src/app/sidebar/sidebar.component.ts
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Input()  isOpen  = false;
  @Output() closed  = new EventEmitter<void>();

  userName     = 'Student';
  userInitials = 'ST';
  userDept     = '';
  userCgpa     = '';
  userEnrollNo = '';

  profile = {
    name:              'Student',
    department:        '',
    college:           '',
    enrollmentNo:      '',
    cgpa:              '',
    batch:             '',
    profileCompletion: 0,
    readyScore:        0,
    placedAt:          ''
  };

  checklist = [
    { label: 'Upload Resume',    done: false },
    { label: 'Add Skills',       done: false },
    { label: 'Fill Academics',   done: false },
    { label: 'Link GitHub',      done: false },
  ];

  quickStats = [
    { icon: 'bi-send-fill',      label: 'Applied',     value: 0, color: '#2d4de0' },
    { icon: 'bi-star-fill',      label: 'Shortlisted', value: 0, color: '#ffc542' },
    { icon: 'bi-trophy-fill',    label: 'Selected',    value: 0, color: '#22c55e' },
  ];

  showLogoutConfirm = false;

  navSections = [
    {
      label: 'Main',
      items: [
        { label: 'Dashboard',          icon: 'bi-speedometer2',          route: '/student/dashboard'          },
        { label: 'My Profile',         icon: 'bi-person-fill',           route: '/student/profile'            },
        { label: 'Academic Details',   icon: 'bi-mortarboard-fill',      route: '/student/academic'           },
        { label: 'Skills',             icon: 'bi-stars',                 route: '/student/skills'             },
        { label: 'Resume Upload',      icon: 'bi-file-earmark-fill',     route: '/student/resume'             },
      ]
    },
    {
      label: 'Jobs',
      items: [
        { label: 'Eligible Jobs',      icon: 'bi-briefcase-fill',        route: '/student/eligible-jobs',      badge: null, badgeType: '' },
        { label: 'Applied Jobs',       icon: 'bi-send-fill',             route: '/student/applied-jobs',       badge: null, badgeType: '' },
        { label: 'Application Status', icon: 'bi-clipboard2-check-fill', route: '/student/application-status', badge: null, badgeType: '' },
        // { label: 'Placement Result',   icon: 'bi-trophy-fill',           route: '/student/placement-result',   badge: null, badgeType: '' },
      ]
    },
    {
      label: 'Account',
      items: [
        // { label: 'Notifications',  icon: 'bi-bell-fill',        route: '/student/notifications',   badge: null, badgeType: '' },
        { label: 'Change Password',icon: 'bi-shield-lock-fill', route: '/student/change-password', badge: null, badgeType: '' },
      ]
    }
  ];

  ngOnInit() {
    this.loadUserFromStorage();
  }

  loadUserFromStorage() {
    const saved = localStorage.getItem('hd_user');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        this.userName              = u.name       || 'Student';
        this.userDept              = u.department || '';
        this.userCgpa              = u.cgpa       || '';
        this.userEnrollNo          = u.rollNo     || '';
        this.profile.name          = u.name       || 'Student';
        this.profile.department    = u.department || '';
        this.profile.enrollmentNo  = u.rollNo     || '';
        this.profile.cgpa          = u.cgpa       || '';
        this.profile.profileCompletion = u.profileCompletion || 0;

        this.userInitials = (u.name || 'ST')
          .split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);
      } catch {}
    }
  }

  get initials(): string { return this.userInitials; }
  get doneCount(): number { return this.checklist.filter(c => c.done).length; }

  isActive(route: string): boolean {
    return window.location.pathname === route;
  }

  navigate(route: string) {
    this.closed.emit();
    window.location.href = route;
  }

  confirmLogout()  { this.showLogoutConfirm = true; }
  cancelLogout()   { this.showLogoutConfirm = false; }

  doLogout() {
    localStorage.removeItem('hd_token');
    localStorage.removeItem('hd_user');
    window.location.href = '/login';
  }
}
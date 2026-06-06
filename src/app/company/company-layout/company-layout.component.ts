import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CompanyDataService } from '../../shared/company-data.service';
import { filter } from 'rxjs/operators';

@Component({
   selector: 'app-company-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './company-layout.component.html',
  styleUrls: ['./company-layout.component.css']
})
export class CompanyLayoutComponent implements OnInit {
  sidebarCollapsed = false;
  showNotifications = false;
  currentPage = 'Dashboard';

  get activeJobsCount() {
    return this.companyService.jobs.filter(j => j.status === 'Active').length;
  }
  get newAppsCount() {
    return this.companyService.candidates.filter(c => c.status === 'Applied').length;
  }
  get unreadNotifs() {
    return this.companyService.notifications.filter(n => !n.read).length;
  }

  pageNames: { [key: string]: string } = {
    'dashboard': 'Dashboard',
    'profile': 'Company Profile',
    'post-job': 'Post a Job',
    'manage-jobs': 'Manage Jobs',
    'applications': 'Job Applications',
    'candidates': 'Candidate List',
    'interview-status': 'Interview Status',
    'hiring-history': 'Hiring History',
    'change--password': 'Change Password',
    'notifications' :'Notifications'
  };

  constructor(public companyService: CompanyDataService, private router: Router) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      const parts = e.urlAfterRedirects.split('/');
      const last = parts[parts.length - 1];
      this.currentPage = this.pageNames[last] || 'Dashboard';
    });
  }

  get companyInitial(): string {
    const name = this.companyService.companyProfile.name || '';
    return name.charAt(0).toUpperCase() || 'C';
  }

  toggleSidebar() { this.sidebarCollapsed = !this.sidebarCollapsed; }

  toggleNotifications() { this.showNotifications = !this.showNotifications; }

  getNotifIcon(type: string): string {
    const map: { [key: string]: string } = {
      'application': 'inbox',
      'interview': 'event',
      'system': 'check_circle'
    };
    return map[type] || 'notifications';
  }

  logout() {
    this.router.navigate(['/login']);
  }
}
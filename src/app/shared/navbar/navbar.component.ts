import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { notificationsList } from '../admin-data';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  pageTitle = 'Dashboard';

  quickNotifs = [...notificationsList];
  showNotif = false;
  unreadCount = 0;

  // Logged-in user info
  loggedInName = 'Admin';
  loggedInRole = 'Admin';
  loggedInInitials = 'AD';

  private routeTitles: Record<string, string> = {
    'admin-dashboard':   'Dashboard',
    'user-management':   'Manage Users',
    'company-mangement': 'Manage Companies',
    'jobs-mangement':    'Placement Drives',
    'application':       'All Applications',
    'publish-results':   'Publish Results',
    'reports':           'Reports & Analytics',
    'settings':          'System Settings',
    'notification':      'Notifications',
    'changepassword':    'Change Password',
    'editprofile':       'Edit Profile',
  };

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit(): void {
    this.unreadCount = this.quickNotifs.filter(n => !n.read).length;

    // ✅ Load logged-in user name from AuthService
    const user = this.auth.getUser();
    if (user) {
      this.loggedInName = user.displayName || user.userName || user.name || 'Admin';
      this.loggedInRole = user.role === 'admin' ? 'Admin' : (user.role || 'Admin');
      this.loggedInInitials = this.loggedInName
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'AD';
    }

    // Update title on every navigation
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const path = event.urlAfterRedirects.replace('/', '');
        this.pageTitle = this.routeTitles[path] || 'Dashboard';
      });

    // Set title on initial load
    const currentPath = this.router.url.replace('/', '');
    this.pageTitle = this.routeTitles[currentPath] || 'Dashboard';
  }

  toggleNotif(): void { this.showNotif = !this.showNotif; }
}
import { Component } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NgIf } from '@angular/common';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidebarComponent, NgIf, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  showHeaderFooter = true;
  isAdmin = false;

  constructor(private router: Router) {
    // Check immediately on load
    this.isAdmin = this.isAdminRoute();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isAdmin = this.isAdminRoute();
      });
  }

  isAdminRoute(): boolean {
    const adminRoutes = [
      '/admin-dashboard',
      '/user-management',
      '/jobs-mangement',
      '/company-mangement',
      '/application',
      '/publish-results',
      '/reports',
      '/settings',
      '/notification',
      '/changepassword',
      '/editprofile'
    ];
    return adminRoutes.some(route => this.router.url.startsWith(route));
  }
}
import { Component, OnInit, HostListener } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  sidebarOpen  = true;
  isMobile     = false;
  showUserMenu = false;
  currentTitle = 'Dashboard';
  userName     = 'Student';
  userInitials = 'ST';
  userEmail    = '';

  navItems = [
    { label: 'Dashboard',          icon: '🏠', route: '/student/dashboard'          },
    { label: 'My Profile',         icon: '👤', route: '/student/profile'            },
    { label: 'Academic Details',   icon: '🎓', route: '/student/academic'           },
    { label: 'Skills',             icon: '⚡', route: '/student/skills'             },
    { label: 'Resume Upload',      icon: '📄', route: '/student/resume'             },
    { label: 'Eligible Jobs',      icon: '💼', route: '/student/eligible-jobs'      },
    { label: 'Applied Jobs',       icon: '📨', route: '/student/applied-jobs'       },
    { label: 'Application Status', icon: '🔍', route: '/student/application-status' },
    // { label: 'Placement Result',   icon: '🏆', route: '/student/placement-result'   },
    // { label: 'Notifications',      icon: '🔔', route: '/student/notifications'      },
    { label: 'Change Password',    icon: '🔐', route: '/student/change-password'    },
  ];

  pageTitles: { [key: string]: string } = {
    '/student/dashboard':          'Dashboard',
    '/student/profile':            'My Profile',
    '/student/academic':           'Academic Details',
    '/student/skills':             'Skills Management',
    '/student/resume':             'Resume Upload',
    '/student/eligible-jobs':      'Eligible Jobs',
    '/student/applied-jobs':       'Applied Jobs',
    '/student/application-status': 'Application Status',
    '/student/placement-result':   'Placement Result',
    '/student/notifications':      'Notifications',
    '/student/change-password':    'Change Password',
  };

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkScreen();
    this.loadUser();
    this.currentTitle = this.pageTitles[this.router.url] || 'Dashboard';

    this.router.events.pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.currentTitle = this.pageTitles[e.urlAfterRedirects] || 'Dashboard';
        if (this.isMobile) this.sidebarOpen = false;
        this.showUserMenu = false;
      });
  }

  loadUser() {
    try {
      const u       = JSON.parse(localStorage.getItem('hd_user') || '{}');
      this.userName  = u.name  || 'Student';
      this.userEmail = u.email || '';
      this.userInitials = (u.name || 'ST')
        .split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);
    } catch {}
  }

  @HostListener('window:resize')
  checkScreen() {
    this.isMobile = window.innerWidth < 768;
    if (this.isMobile) this.sidebarOpen = false;
    else this.sidebarOpen = true;
  }

  @HostListener('document:click', ['$event'])
  onDocClick(e: Event) {
    if (!(e.target as HTMLElement).closest('.user-menu-wrap')) {
      this.showUserMenu = false;
    }
  }

  toggleSidebar()  { this.sidebarOpen = !this.sidebarOpen; }
  closeSidebar()   { if (this.isMobile) this.sidebarOpen = false; }
  toggleUserMenu() { this.showUserMenu = !this.showUserMenu; }

  goTo(route: string) {
    this.showUserMenu = false;
    this.router.navigate([route]);
    if (this.isMobile) this.sidebarOpen = false;
  }

  logout() {
    localStorage.removeItem('hd_token');
    localStorage.removeItem('hd_user');
    window.location.href = '/login';
  }
}
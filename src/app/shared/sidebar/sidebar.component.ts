import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  active = 'dashboard';
  collapsed = false;

  // ✅ Dynamic user info
  loggedInName = 'Admin';
  loggedInInitials = 'AD';

  navItems = [
    { id: 'admin-dashboard',   label: 'Dashboard',           icon: '⊞',  badge: null  },
    { id: 'user-management',   label: 'Manage Users',     icon: '🎓', badge: null  },
    { id: 'company-mangement', label: 'Manage Companies',    icon: '🏢', badge: null  },
    { id: 'jobs-mangement',    label: 'Placement Drives',    icon: '🚀', badge: null  },
    { id: 'application',       label: 'All Applications',    icon: '📋', badge: null  },
    { id: 'reports',           label: 'Reports & Analytics', icon: '📊', badge: null  },
    { id: 'changepassword',    label: 'Change Password',     icon: '🔒', badge: null  },
    { id: 'editprofile',       label: 'Edit Profile',        icon: '👤', badge: null  },
  ];

  constructor(private router: Router, private auth: AuthService) {
    // Set active from current URL on load/refresh
    const path = this.router.url.replace('/', '');
    if (path) this.active = path;
  }

  ngOnInit(): void {
    // ✅ Load logged-in user info
    const user = this.auth.getUser();
    if (user) {
      this.loggedInName = user.displayName || user.userName || user.name || 'Admin';
      this.loggedInInitials = this.loggedInName
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'AD';
    }
  }

  toggle(): void {
    this.collapsed = !this.collapsed;
  }

  go(id: string): void {
    this.active = id;
    this.router.navigate([`/${id}`]);
  }
}
// src/app/navbar/navbar.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  showNotifications = false;
  showProfile       = false;

  // Real user from localStorage
  userName     = 'Student';
  userEmail    = '';
  userInitials = 'ST';

  notifications: any[] = [];

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  ngOnInit() {
    this.loadUserFromStorage();
  }

  loadUserFromStorage() {
    const saved = localStorage.getItem('hd_user');
    if (saved) {
      try {
        const u          = JSON.parse(saved);
        this.userName     = u.name  || 'Student';
        this.userEmail    = u.email || '';
        this.userInitials = (u.name || 'ST')
          .split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);
      } catch {}
    }
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    this.showProfile       = false;
  }

  toggleProfile() {
    this.showProfile       = !this.showProfile;
    this.showNotifications = false;
  }

  markAllRead() { this.notifications.forEach(n => n.read = true); }

  closeAll() {
    this.showNotifications = false;
    this.showProfile       = false;
  }

  logout() {
    localStorage.removeItem('hd_token');
    localStorage.removeItem('hd_user');
    window.location.href = '/login';
  }
}
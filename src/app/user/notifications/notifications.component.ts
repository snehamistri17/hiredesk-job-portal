import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications: any[] = [];
  activeTab = 'all';
  loading   = true;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    this.loading = true;
    this.api.getNotifications().subscribe({
      next: (data: any[]) => {
        // Only show real application-related events — filter out system/admin broadcasts
        this.notifications = data
          .filter(n =>
            // Keep only user-specific notifications
            n.userId &&
            // Keep only meaningful types
            ['job', 'shortlist', 'interview', 'result'].includes(n.type)
          )
          .map(n => ({
            ...n,
            id:     n._id,
            time:   this.timeAgo(n.createdAt),
            unread: n.unread,
            // Ensure icon and bg have fallbacks
            icon:   n.icon || this.defaultIcon(n.type),
            bg:     n.bg   || this.defaultBg(n.type),
          }));
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  private defaultIcon(type: string): string {
    const icons: any = {
      job:       '📨',
      shortlist: '⭐',
      interview: '🎤',
      result:    '🏆',
    };
    return icons[type] || '🔔';
  }

  private defaultBg(type: string): string {
    const bgs: any = {
      job:       '#dcfce7',
      shortlist: '#fef9c3',
      interview: '#dbeafe',
      result:    '#f0fdf4',
    };
    return bgs[type] || '#eef2ff';
  }

  get filtered(): any[] {
    if (this.activeTab === 'unread') return this.notifications.filter(n => n.unread);
    if (this.activeTab === 'jobs')   return this.notifications.filter(n => n.type === 'job');
    if (this.activeTab === 'interview') return this.notifications.filter(n => n.type === 'interview' || n.type === 'shortlist');
    if (this.activeTab === 'result') return this.notifications.filter(n => n.type === 'result');
    return this.notifications;
  }

  get unreadCount(): number {
    return this.notifications.filter(n => n.unread).length;
  }

  markAllRead() {
    this.api.markAllRead().subscribe({
      next: () => this.notifications.forEach(n => n.unread = false),
      error: () => {}
    });
  }

  markRead(n: any) {
    if (!n.unread) return;
    this.api.markRead(n.id).subscribe({
      next: () => n.unread = false,
      error: () => {}
    });
  }

  // trackBy for performance — prevents ghost rows
  trackById(_: number, n: any): string {
    return n.id;
  }

  private timeAgo(dateStr: string): string {
    if (!dateStr) return 'Recently';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1)   return 'Just now';
    if (mins < 60)  return `${mins} min${mins > 1 ? 's' : ''} ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)   return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7)   return `${days} day${days > 1 ? 's' : ''} ago`;
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  }

  get tabCounts() {
    return {
      all:       this.notifications.length,
      unread:    this.notifications.filter(n => n.unread).length,
      jobs:      this.notifications.filter(n => n.type === 'job').length,
      interview: this.notifications.filter(n => n.type === 'interview' || n.type === 'shortlist').length,
      result:    this.notifications.filter(n => n.type === 'result').length,
    };
  }
}

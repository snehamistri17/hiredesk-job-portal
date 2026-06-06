import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  icon: string;
  type: 'job' | 'application' | 'interview' | 'system' | 'alert';
  tag: string;
  read: boolean;
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  activeTab = 'all';

  notifications: Notification[] = [
    { id: 1, title: 'New Application Received', message: 'Aarav Mehta applied for your Software Engineer position. CGPA: 9.2, Branch: CS.', time: '5 min ago', icon: '📋', type: 'application', tag: 'Application', read: false },
    { id: 2, title: 'Job Post Approved', message: 'Your job post "Senior Frontend Developer" has been approved and is now live.', time: '30 min ago', icon: '💼', type: 'job', tag: 'Job', read: false },
    { id: 3, title: 'Interview Scheduled', message: 'Interview with Priya Sharma scheduled for March 10 at 10:00 AM via video call.', time: '2 hrs ago', icon: '📅', type: 'interview', tag: 'Interview', read: false },
    { id: 4, title: 'Application Shortlisted', message: '12 candidates have been shortlisted for the CloudGen SDE Drive. Results published.', time: '4 hrs ago', icon: '⭐', type: 'application', tag: 'Application', read: true },
    { id: 5, title: 'Drive Registration Closed', message: 'Registration for DataBridge Analytics Hunt closed with 28 students registered.', time: 'Yesterday', icon: '🔒', type: 'job', tag: 'Job', read: true },
    { id: 6, title: 'System Maintenance', message: 'Scheduled maintenance on March 5 from 2 AM - 4 AM. Services may be unavailable.', time: 'Yesterday', icon: '⚙️', type: 'system', tag: 'System', read: true },
    { id: 7, title: 'Offer Letter Pending', message: 'You have 2 pending offer letters to send for CloudGen SDE Drive selections.', time: '2 days ago', icon: '⚠️', type: 'alert', tag: 'Alert', read: true },
  ];

  tabs = [
    { key: 'all', label: 'All', icon: '🔔', count: 0 },
    { key: 'job', label: 'Jobs', icon: '💼', count: 0 },
    { key: 'application', label: 'Applications', icon: '📋', count: 0 },
    { key: 'interview', label: 'Interviews', icon: '📅', count: 0 },
    { key: 'system', label: 'System', icon: '⚙️', count: 0 },
    { key: 'alert', label: 'Alerts', icon: '⚠️', count: 0 },
  ];

  ngOnInit(): void { this.updateTabCounts(); }

  get unreadCount(): number { return this.notifications.filter(n => !n.read).length; }

  get filteredNotifications(): Notification[] {
    if (this.activeTab === 'all') return this.notifications;
    return this.notifications.filter(n => n.type === this.activeTab);
  }

  setTab(key: string): void { this.activeTab = key; }

  markRead(notif: Notification): void { notif.read = true; this.updateTabCounts(); }

  markAllRead(): void { this.notifications.forEach(n => n.read = true); this.updateTabCounts(); }

  deleteNotif(event: Event, notif: Notification): void {
    event.stopPropagation();
    this.notifications = this.notifications.filter(n => n.id !== notif.id);
    this.updateTabCounts();
  }

  updateTabCounts(): void {
    this.tabs.forEach(tab => {
      tab.count = tab.key === 'all'
        ? this.notifications.filter(n => !n.read).length
        : this.notifications.filter(n => n.type === tab.key && !n.read).length;
    });
  }
}
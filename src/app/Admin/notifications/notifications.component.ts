import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  icon: string;
  type: 'company' | 'student' | 'application' | 'system' | 'alert';
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
  activeTab: string = 'all';

  notifications: Notification[] = [
    { id: 1, title: 'New Company Registration', message: 'MobileSoft has submitted a registration request and is pending approval.', time: '2 min ago', icon: '🏢', type: 'company', tag: 'Company', read: false },
    { id: 2, title: 'Student Placed Successfully', message: 'Aarav Mehta (CS, 9.2 CGPA) has been placed at CloudGen Systems with 1.2 LPA package.', time: '18 min ago', icon: '🎓', type: 'student', tag: 'Student', read: false },
    { id: 3, title: 'New Application Received', message: '48 new applications received today across 5 active placement drives.', time: '1 hr ago', icon: '📋', type: 'application', tag: 'Application', read: false },
    { id: 4, title: 'Placement Drive Scheduled', message: 'DataBridge Analytics Hunt is scheduled for March 22 — 28 students registered.', time: '3 hrs ago', icon: '🚀', type: 'company', tag: 'Company', read: true },
    { id: 5, title: 'System Update Completed', message: 'WorkHireDesk platform updated to v2.4.1. New features: bulk email, analytics export.', time: '5 hrs ago', icon: '⚙️', type: 'system', tag: 'System', read: true },
    { id: 6, title: 'Low CGPA Alert', message: '12 students are below 6.0 CGPA threshold and may miss upcoming placement drives.', time: 'Yesterday', icon: '⚠️', type: 'alert', tag: 'Alert', read: true },
    { id: 7, title: 'Results Published', message: 'DesignCo UI/UX Drive results published. 18 students selected out of 55 registered.', time: 'Yesterday', icon: '🏆', type: 'application', tag: 'Application', read: true },
  ];

  tabs = [
    { key: 'all', label: 'All', icon: '🔔', count: 0 },
    { key: 'company', label: 'Company', icon: '🏢', count: 0 },
    { key: 'student', label: 'Student', icon: '🎓', count: 0 },
    { key: 'application', label: 'Applications', icon: '📋', count: 0 },
    { key: 'system', label: 'System', icon: '⚙️', count: 0 },
    { key: 'alert', label: 'Alerts', icon: '⚠️', count: 0 },
  ];

  ngOnInit(): void {
    this.updateTabCounts();
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  get filteredNotifications(): Notification[] {
    if (this.activeTab === 'all') return this.notifications;
    return this.notifications.filter(n => n.type === this.activeTab);
  }

  setTab(key: string): void {
    this.activeTab = key;
  }

  markRead(notif: Notification): void {
    notif.read = true;
    this.updateTabCounts();
  }

  markAllRead(): void {
    this.notifications.forEach(n => n.read = true);
    this.updateTabCounts();
  }

  deleteNotif(event: Event, notif: Notification): void {
    event.stopPropagation();
    this.notifications = this.notifications.filter(n => n.id !== notif.id);
    this.updateTabCounts();
  }

  updateTabCounts(): void {
    this.tabs.forEach(tab => {
      if (tab.key === 'all') {
        tab.count = this.notifications.filter(n => !n.read).length;
      } else {
        tab.count = this.notifications.filter(n => n.type === tab.key && !n.read).length;
      }
    });
  }
}
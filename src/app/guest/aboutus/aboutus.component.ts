import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './aboutus.component.html',
  styleUrl: './aboutus.component.css'
})
export class AboutusComponent {
  stats = [
    { value: '1M+',  label: 'Active Job Seekers',  icon: '👥' },
    { value: '50K+', label: 'Companies Hiring',     icon: '🏢' },
    { value: '2M+',  label: 'Jobs Posted',          icon: '💼' },
    { value: '98%',  label: 'Satisfaction Rate',    icon: '⭐' },
  ];

  team = [
    { name: 'Sneha Mistri',      initials: 'SM', color: '#1d4ed8' },
    { name: 'Ayushi Patel',      initials: 'AP', color: '#06b6d4' },
    { name: 'Tisha Patel',         initials: 'TP', color: '#10b981' },
   
  ];

  values = [
    { icon: '🎯', title: 'Mission-Driven',   desc: 'We believe everyone deserves access to great career opportunities, regardless of their background.' },
    { icon: '🔒', title: 'Trust & Safety',   desc: 'We verify companies and protect candidate data with enterprise-grade security.' },
    { icon: '🚀', title: 'Innovation First', desc: 'We constantly push boundaries to make job searching faster, smarter, and more effective.' },
    { icon: '🤝', title: 'Human Connection', desc: 'Technology should bring people together, not replace the human element of hiring.' },
    { icon: '📊', title: 'Data Transparency', desc: 'We believe in transparent salary data and honest company reviews to empower decisions.' },
    { icon: '🌍', title: 'Inclusive Growth', desc: 'We champion diversity in hiring and build tools that reduce unconscious bias.' },
  ];
}

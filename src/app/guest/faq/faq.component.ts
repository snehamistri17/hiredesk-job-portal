import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FaqService } from '../services/faq.service';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

  constructor(
    private router: Router,
    private faqService: FaqService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  searchQuery = '';
  loading = true;

  quickQuestions: string[] = [];

  topics = [
    { title: 'Create Naukri Profile', icon: '👤' },
    { title: 'Search',                icon: '🔍' },
    { title: 'Apply',                 icon: '🖱️' },
    { title: 'Getting around Naukri', icon: '🔄' },
    { title: 'Settings',              icon: '⚙️' },
    { title: 'Security Advice',       icon: '🛡️' }
  ];

  blogs = [
    { title: 'Interview Advice',   desc: 'Prepare for your next interview with expert tips.',  img: 'https://via.placeholder.com/350x200' },
    { title: 'How To Use Naukri',  desc: 'Learn how to make your profile attractive.',         img: 'https://via.placeholder.com/350x200' },
    { title: 'Career Advice',      desc: 'Best career advice from industry experts.',          img: 'https://via.placeholder.com/350x200' }
  ];

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.faqService.getAllFaqs().subscribe({
        next: (res: any) => {
          this.quickQuestions = res.faqs
            .slice(0, 4)
            .map((f: any) => f.question);
          this.loading = false;
        },
        error: (err: any) => {
          console.error('Could not load FAQs:', err);
          this.quickQuestions = [
            'How can I deactivate my Naukri account?',
            'How can I update/edit my Profile?',
            'How can I block a recruiter?',
            'Do I need to pay to apply for a job?'
          ];
          this.loading = false;
        }
      });
    }
  }

  goToDetail(item: any): void {
    console.log('Clicked:', item);
  }
}
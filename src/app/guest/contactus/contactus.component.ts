import { Component, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule, HeaderComponent, FooterComponent],
  templateUrl: './contactus.component.html',
  styleUrl: './contactus.component.css'
})
export class ContactusComponent {
  private apiUrl = 'http://localhost:3000/api/contact';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient
  ) {}

  formData = { name: '', email: '', subject: '', message: '' };
  submitted  = false;
  submitting = false;
  errorMsg   = '';

  contactInfo = [
    { icon: '📞', label: 'Phone',     value: '+91 88 6026 9730',         sub: 'Mon–Fri, 9am–6pm IST'      },
    { icon: '✉️', label: 'Email',     value: 'support@hiredesk.com',     sub: 'We reply within 24 hours'   },
    { icon: '📍', label: 'Office',    value: 'Ahmedabad, Gujarat',        sub: 'SG Highway, 380054'         },
    { icon: '💬', label: 'Live Chat', value: 'Available on the platform', sub: 'Instant support for users'  },
  ];

  faqs = [
    { q: 'How do I create a free account?',        a: 'Click Register in the navigation bar...' },
    { q: 'How do companies post jobs?',             a: 'Companies register separately...'        },
    { q: 'Is HireDesk free for job seekers?',       a: 'Yes! Creating an account is free...'     },
    { q: 'How long does it take to get responses?', a: 'Most companies respond within 3–5 days.' },
  ];

  openFaq: number | null = null;

  toggleFaq(i: number): void {
    this.openFaq = this.openFaq === i ? null : i;
  }

  onSubmit(): void {
    this.errorMsg = '';
    if (!this.formData.name || !this.formData.email || !this.formData.message) {
      this.errorMsg = 'Please fill in all required fields.';
      return;
    }
    this.submitting = true;
    this.http.post<{ success: boolean; message: string }>(this.apiUrl, this.formData)
      .subscribe({
        next: (_res) => {
          this.submitting = false;
          this.submitted  = true;
          this.formData   = { name: '', email: '', subject: '', message: '' };
        },
        error: (err) => {
          this.submitting = false;
          this.errorMsg   = err?.error?.message || 'Something went wrong. Please try again.';
        }
      });
  }

  resetForm(): void {
    this.submitted = false;
    this.errorMsg  = '';
  }
}
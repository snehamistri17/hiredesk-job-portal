import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [NgFor],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
// footerContact: any;

footerContact = {
    phone: '1 (888) 602-9730',
    email: 'sales@hiredesk.com'
  };

  footerLinks = {
    solutions: [
      { name: 'Job Posting Platform', link: '/solutions/job-posting' },
      { name: 'Recruitment Software', link: '/solutions/recruitment' },
      { name: 'Applicant Tracking', link: '/solutions/ats' },

    ],
    company: [
      { name: 'About Us', link: '/about' },
      { name: 'Careers', link: '/careers' },
      { name: 'Contact', link: '/contact' },
    ],
    resources: [
      { name: 'Knowledge Base', link: '/knowledge-base' },
      { name: 'Customer Reviews', link: '/reviews' },
      { name: 'Affiliate Program', link: '/affiliate' },

    ]
  };

  socialMedia = [
    { name: 'Facebook', icon: 'fab fa-facebook-f', link: 'https://facebook.com' },
    { name: 'LinkedIn', icon: 'fab fa-linkedin-in', link: 'https://linkedin.com' },
    { name: 'Twitter', icon: 'fab fa-twitter', link: 'https://twitter.com' },
    { name: 'Instagram', icon: 'fab fa-instagram', link: 'https://instagram.com' },
    { name: 'YouTube', icon: 'fab fa-youtube', link: 'https://youtube.com' }
  ];

}

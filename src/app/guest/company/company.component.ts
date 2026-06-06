import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CompanyService } from '../services/company.service';
import { JobService } from '../services/job.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

export interface JobListing {
  _id: string;
  title: string;
  type: string;
  location: string;
  salary: string;
  isHot: boolean;
  postedAgo: string;
}

export interface RatingCategory {
  label: string;
  score: number;
  percent: number;
}

@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [CommonModule, RouterModule,HeaderComponent,FooterComponent],
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private companyService: CompanyService,
    private jobService: JobService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}


  company: any = {
    name: 'Loading...',
    initials: '...',
    tagline: '',
    verified: true,
    website: '',
    location: '',
    employees: '',
    industry: '',
    founded: '',
    openJobs: 0,
    rating: 0,
    recommendPercent: 0,
    funding: '',
    fundingStage: '',
    headquarters: '',
    type: '',
    about: '',
    techStack: []
  };

  jobs: JobListing[] = [];
  loading = true;

  ratingCategories: RatingCategory[] = [
    { label: 'Culture & Values',  score: 4.8, percent: 96 },
    { label: 'Work-Life Balance', score: 4.3, percent: 86 },
    { label: 'Career Growth',     score: 4.7, percent: 94 },
    { label: 'Compensation',      score: 4.5, percent: 90 },
    { label: 'Management',        score: 4.4, percent: 88 },
  ];

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {


      const name = this.route.snapshot.queryParamMap.get('name');

      if (name) {
        this.companyService.getAllCompanies().subscribe({
          next: (res: any) => {
            const found = res.companies.find((c: any) =>
              c.name.toLowerCase() === name.toLowerCase()
            );
            if (found) this.mapCompany(found);
            else this.loadDefaultCompany();
          },
          error: () => this.loadDefaultCompany()
        });
      } else {
        this.loadDefaultCompany();
      }

      this.loadJobs();
    }
  }

  loadDefaultCompany(): void {
    this.companyService.getAllCompanies().subscribe({
      next: (res: any) => {
        if (res.companies && res.companies.length > 0) {
          this.mapCompany(res.companies[0]);
        }
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  mapCompany(c: any): void {
    this.company = {
      name:             c.name            || 'Company',
      initials:         c.name ? c.name.substring(0, 2).toUpperCase() : 'CO',
      tagline:          c.tagline         || '',
      verified:         c.verified        || false,
      website:          c.website         || '',
      location:         c.location        || '',
      employees:        c.employees       || '',
      industry:         c.industry        || '',
      founded:          c.founded         || '',
      openJobs:         c.openJobs        || 0,
      rating:           c.rating          || 0,
      recommendPercent: c.recommendPercent|| 0,
      funding:          c.funding         || '',
      fundingStage:     c.fundingStage    || '',
      headquarters:     c.headquarters    || '',
      type:             c.type            || '',
      about:            c.about           || '',
      techStack:        c.techStack       || []
    };
    this.loading = false;
  }

  loadJobs(): void {
    this.jobService.getAllJobs().subscribe({
      next: (res: any) => {
        this.jobs = res.jobs.map((j: any) => ({
          _id:      j._id,
          title:    j.title,
          type:     j.type,
          location: j.location,
          salary:   j.salary,
          isHot:    j.isHot,
          postedAgo: this.getPostedAgo(j.createdAt)
        }));
      },
      error: () => {}
    });
  }

  getPostedAgo(dateStr: string): string {
    if (!dateStr) return 'Recently';
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  }

  goBack(): void { this.router.navigate(['/companies']); }
  goToJobs(): void { this.router.navigate(['/jobs']); }
  goToPlacementRules(): void { this.router.navigate(['/placement-rules']); }
}
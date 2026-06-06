import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Router, RouterModule, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobService } from '../services/job.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  experience: string;
  description: string;
  skills: string[];
  openings: number;
  isHot: boolean;
  createdAt: string;
}

const LOGO_MAP: Record<string, string> = {
  'wipro': 'https://logo.clearbit.com/wipro.com',
  'infosys': 'https://logo.clearbit.com/infosys.com',
  'tcs': 'https://logo.clearbit.com/tcs.com',
  'google': 'https://logo.clearbit.com/google.com',
  'amazon': 'https://logo.clearbit.com/amazon.com',
  'microsoft': 'https://logo.clearbit.com/microsoft.com',
  'flipkart': 'https://logo.clearbit.com/flipkart.com',
  'swiggy': 'https://logo.clearbit.com/swiggy.com',
  'zomato': 'https://logo.clearbit.com/zomato.com',
  'hdfc': 'https://logo.clearbit.com/hdfcbank.com',
  'icici': 'https://logo.clearbit.com/icicibank.com',
  'accenture': 'https://logo.clearbit.com/accenture.com',
  'deloitte': 'https://logo.clearbit.com/deloitte.com',
  'cognizant': 'https://logo.clearbit.com/cognizant.com',
  'hcl': 'https://logo.clearbit.com/hcltech.com',
  'tech mahindra': 'https://logo.clearbit.com/techmahindra.com',
};

@Component({
  selector: 'app-joblist',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HeaderComponent, FooterComponent,RouterLink],
  templateUrl: './joblist.component.html',
  styleUrl: './joblist.component.css'
})
export class JoblistComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private jobService: JobService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  jobs: Job[] = [];
  loading = true;
  error = '';
  searchQuery = '';
  searchLocation = '';
  failedLogos = new Set<number>();

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.route.queryParams.subscribe(params => {
        this.searchQuery = params['q'] || '';
        this.searchLocation = params['location'] || '';
        this.loadJobs();
      });
    }
  }

  loadJobs(): void {
    this.loading = true;
    this.error = '';
    this.jobService.getAllJobs({
      q: this.searchQuery || undefined,
      location: this.searchLocation || undefined,
    }).subscribe({
      next: (res: any) => {
        const rawJobs = Array.isArray(res) ? res : (res.jobs || []);
        this.jobs = rawJobs.map((j: any) => ({
          ...j,
          title: j.title || j.jobtitle || '',
          openings: j.openings || j.positions || 1,
        }));

        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load jobs. Is the backend running?';
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.router.navigate(['/jobs'], {
      queryParams: {
        q: this.searchQuery || null,
        location: this.searchLocation || null
      }
    });
  }

  viewJobDetails(jobId: string): void {
    this.router.navigate(['/job-details', jobId]);
  }

  getLogoUrl(company: string): string {
    if (!company) return '';
    const key = company.toLowerCase().trim();
    if (LOGO_MAP[key]) return LOGO_MAP[key];
    for (const k of Object.keys(LOGO_MAP)) {
      if (key.includes(k) || k.includes(key)) return LOGO_MAP[k];
    }
    return '';
  }

  onImgError(event: any, index: number): void {
    this.failedLogos.add(index);
    event.target.style.display = 'none';
  }

  getBadgeClass(type: string): string {
    const t = (type || '').toLowerCase().replace(/\s/g, '-');
    if (t.includes('full')) return 'badge-fulltime';
    if (t.includes('remote')) return 'badge-remote';
    if (t.includes('part')) return 'badge-part-time';
    if (t.includes('intern')) return 'badge-internship';
    return 'badge-fulltime';
  }

  getPostedAgo(dateStr: string): string {
    if (!dateStr) return 'Recently';
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  }
}
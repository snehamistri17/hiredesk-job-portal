import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { JobService } from '../services/job.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

export interface Job {
  _id?: string;
  title: string;
  company: string;
  type: string;
  location: string;
  positions: number;
  salary: string;
}

export interface Category {
  name: string;
  icon: string;
  jobs: string;
}

export interface Stat {
  value: string;
  label: string;
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  constructor(
    private router: Router,
    private jobService: JobService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  searchQuery: string = '';
  searchLocation: string = '';
  loading: boolean = true;
  error: string = '';

  trendingTags: string[] = ['UI Designer', 'React Dev', 'Data Analyst', 'Product Manager'];

  stats: Stat[] = [
    { value: '10k+', label: 'Jobs Posted'  },
    { value: '5k+',  label: 'Companies'    },
    { value: '1M+',  label: 'Job Seekers'  },
    { value: '50+',  label: 'Categories'   }
  ];

  categories: Category[] = [
    { name: 'IT & Software', icon: '💻', jobs: '120+' },
    { name: 'Marketing',     icon: '📢', jobs: '120+' },
    { name: 'Finance',       icon: '⚖️', jobs: '120+' },
    { name: 'Design',        icon: '🎨', jobs: '120+' },
    { name: 'Healthcare',    icon: '🏥', jobs: '85+'  },
    { name: 'Education',     icon: '📚', jobs: '60+'  },
    { name: 'Sales',         icon: '📈', jobs: '95+'  },
    { name: 'Engineering',   icon: '⚙️', jobs: '110+' }
  ];

  latestJobs: Job[] = [];

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loading = true;
      this.jobService.getAllJobs().subscribe({
        next: (res: any) => {
          this.latestJobs = res.jobs.slice(0, 3);
          this.loading = false;
        },
        error: (err: any) => {
          console.error('Failed to load jobs:', err);
          this.error = 'Could not load jobs.';
          this.loading = false;
          this.latestJobs = [
            { title: 'Frontend Developer', company: 'ABC Tech',      type: 'FULL-TIME', location: 'Mumbai, India',    positions: 3, salary: '8-12 LPA'  },
            { title: 'Digital Marketer',   company: 'XYZ Marketing', type: 'FULL-TIME', location: 'Delhi, India',     positions: 2, salary: '5-8 LPA'   },
            { title: 'Financial Analyst',  company: 'Finance Inc',   type: 'FULL-TIME', location: 'Bangalore, India', positions: 1, salary: '10-15 LPA' },
          ];
        }
      });
    }
  }

  onSearch(): void {
    this.router.navigate(['/jobs'], {
      queryParams: { q: this.searchQuery || null, loc: this.searchLocation || null }
    });
  }

  searchByTag(tag: string): void {
    this.router.navigate(['/jobs'], { queryParams: { q: tag } });
  }

  browseCategory(cat: Category): void {
    this.router.navigate(['/jobs'], { queryParams: { category: cat.name } });
  }

  applyJob(job: Job): void {
    if (job._id) {
      this.router.navigate(['/job-details', job._id]);
    } else {
      this.router.navigate(['/login']);
    }
  }

  postJob(): void   { this.router.navigate(['/login']); }
  getStarted(): void { this.router.navigate(['/registration']); }
}
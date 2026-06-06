import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { JobService } from '../services/job.service';

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.css']
})
export class JobDetailsComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  job: any = {
    title: '',
    company: '',
    rating: 0,
    reviews: 0,
    experience: '',
    salary: '',
    location: '',
    posted: '',
    openings: 0,
    applicants: 0
  };

  highlights: string[] = [];
  matchScore: string[]  = [];
  loading = true;
  error   = '';

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.jobService.getJobById(id).subscribe({
          next: (res: any) => {
            const j = res.job;

            this.job = {
              title:      j.title      || '',
              company:    j.company    || '',
              rating:     j.rating     || 0,
              reviews:    j.reviews    || 0,
              experience: j.experience || 'Not specified',
              salary:     j.salary     || 'Not disclosed',
              location:   j.location   || '',
              posted:     this.getPostedAgo(j.createdAt),
              openings:   j.openings   || 1,
              applicants: j.applicants || 0
            };

            this.highlights = j.skills && j.skills.length > 0
              ? j.skills
              : ['Strong communication skills', 'Team player', 'Problem solving'];

            this.matchScore = j.skills && j.skills.length > 0
              ? j.skills.slice(0, 5).map((s: string) => '✅ ' + s)
              : ['✅ Communication', '✅ Teamwork'];

            this.loading = false;
          },
          error: (err: any) => {
            console.error(err);
            this.error = 'Could not load job. Is backend running?';
            this.loading = false;
          }
        });
      }
    }
  }

  getPostedAgo(dateStr: string): string {
    if (!dateStr) return 'Recently';
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  }

  goToCompanyProfile(companyName: string): void {
    this.router.navigate(['/companies'], {
      queryParams: { name: companyName }
    });
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-publish-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './publish-results.component.html',
  styleUrls: ['./publish-results.component.css'],
})
export class PublishResultsComponent implements OnInit {
  published:   any[] = [];
  unpublished: any[] = [];
  loading = true;

  // ← FIXED: HTML uses {{ results.length }} – expose combined array as getter
  get results(): any[] {
    return [...this.published, ...this.unpublished];
  }

  constructor(private api: ApiService) {}

  ngOnInit() { this.loadResults(); }

  loadResults() {
    this.api.getResults().subscribe({
      next: (data: any) => {
        this.published   = data.filter((r: any) =>  r.published);
        this.unpublished = data.filter((r: any) => !r.published);
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  publish(r: any) {
    this.api.publishResult(r._id).subscribe({
      next: (res: any) => {
        r.published = true;
        r.offerDate = res.result?.offerDate || new Date().toISOString().split('T')[0];
        this.unpublished = this.unpublished.filter(x => x._id !== r._id);
        this.published   = [r, ...this.published];
      },
      error: () => alert('Error publishing result')
    });
  }

  publishAll() {
    this.api.publishAllResults().subscribe({
      next: () => { this.loadResults(); },
      error: () => alert('Error publishing all results')
    });
  }

  // ← FIXED: HTML calls formatPkg(r.package) – format a numeric/string package value
  formatPkg(val: string | number): string {
    if (!val) return '—';
    const num = parseFloat(val.toString().replace(/[^0-9.]/g, ''));
    if (isNaN(num)) return val.toString();
    if (num >= 100000) return (num / 100000).toFixed(1) + ' L';
    return num.toLocaleString('en-IN');
  }
}
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class JobService {
  constructor(private api: ApiService) {}

  getAllJobs(filters?: { q?: string; location?: string; type?: string }): Observable<any> {
    let query = "";
    if (filters) {
      const p = new URLSearchParams();
      if (filters.q)        p.set('q',        filters.q);
      if (filters.location) p.set('location', filters.location);
      if (filters.type)     p.set('type',     filters.type);
      if (p.toString()) query = `?${p.toString()}`;
    }
    return this.api.get(`/jobs${query}`);
  }

  getJobById(id: string): Observable<any> {
    return this.api.get(`/jobs/${id}`);
  }

  createJob(data: any): Observable<any> {
    return this.api.post('/jobs', data);
  }
}
import { Injectable, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Job } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private firestore = inject(AngularFirestore);

  // Get all jobs
  getAllJobs(): Observable<Job[]> {
    return this.firestore
      .collection<Job>('jobs', ref => ref.orderBy('postedDate', 'desc'))
      .valueChanges({ idField: 'id' });
  }

  // Get recommended jobs for user (top matches)
  getRecommendedJobs(userId: string, limit: number = 3): Observable<Job[]> {
    return this.firestore
      .collection<Job>('jobs', ref => 
        ref.orderBy('postedDate', 'desc').limit(limit)
      )
      .valueChanges({ idField: 'id' });
  }

  // Get job by ID
  getJob(jobId: string): Observable<Job | undefined> {
    return this.firestore.doc<Job>(`jobs/${jobId}`).valueChanges();
  }
}

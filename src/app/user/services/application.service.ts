import { Injectable, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Application, DashboardStats } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private firestore = inject(AngularFirestore);

  // Get all applications for a user
  getUserApplications(userId: string): Observable<Application[]> {
    return this.firestore
      .collection<Application>('applications', ref => 
        ref.where('userId', '==', userId).orderBy('appliedDate', 'desc')
      )
      .valueChanges({ idField: 'id' });
  }

  // Get latest applications (limited)
  getLatestApplications(userId: string, limit: number = 3): Observable<Application[]> {
    return this.firestore
      .collection<Application>('applications', ref => 
        ref.where('userId', '==', userId)
           .orderBy('appliedDate', 'desc')
           .limit(limit)
      )
      .valueChanges({ idField: 'id' });
  }

  // Create new application
  async createApplication(application: Application): Promise<void> {
    const id = this.firestore.createId();
    await this.firestore.doc(`applications/${id}`).set({
      ...application,
      id,
      appliedDate: new Date(),
      status: 'under-review'
    });
  }

  // Update application status
  async updateApplicationStatus(applicationId: string, status: Application['status']): Promise<void> {
    await this.firestore.doc(`applications/${applicationId}`).update({
      status,
      updatedDate: new Date()
    });
  }

  // Get dashboard statistics
  getDashboardStats(userId: string): Observable<DashboardStats> {
    return this.getUserApplications(userId).pipe(
      map(applications => {
        const stats: DashboardStats = {
          readyScore: 85, // Calculate based on profile
          profileCompletion: 0, // Will be set from user profile
          totalApplications: applications.length,
          shortlisted: applications.filter(app => app.status === 'shortlisted').length,
          underReview: applications.filter(app => app.status === 'under-review').length,
          rejected: applications.filter(app => app.status === 'rejected').length,
          interviewScheduled: applications.filter(app => app.status === 'interview-scheduled').length
        };
        return stats;
      })
    );
  }
}


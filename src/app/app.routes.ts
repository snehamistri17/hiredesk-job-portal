import { Routes } from '@angular/router';
import { RegistrationComponent } from './user/registration/registration.component';
import { HomePageComponent } from './guest/home-page/home-page.component';
import { LoginComponent } from './user/login/login.component';
import { AdminDashboardComponent } from './Admin/admin-dashboard/admin-dashboard.component';
import { UserManagementComponent } from './Admin/user-management/user-management.component';
import { JobsManagementComponent } from './Admin/jobs-management/jobs-management.component';
import { CompanyManagementComponent } from './Admin/company-management/company-management.component';
import { ApplicationComponent } from './Admin/application/application.component';
import { ReportsComponent } from './Admin/reports/reports.component';
import { CompanyLayoutComponent } from './company/company-layout/company-layout.component';
import { CompanyProfileComponent } from './company/company-profile/company-profile.component';
import { PostJobComponent } from './company/post-job/post-job.component';
import { CompanyDashboardComponent } from './company/company-dashboard/company-dashboard.component';
import { ManageJobsComponent } from './company/manage-jobs/manage-jobs.component';
import { JobApplicationsComponent } from './company/job-applications/job-applications.component';
import { CandidateListComponent } from './company/candidate-list/candidate-list.component';
import { CandidateDetailsComponent } from './company/candidate-details/candidate-details.component';
import { InterviewStatusComponent } from './company/interview-status/interview-status.component';
import { HiringHistoryComponent } from './company/hiring-history/hiring-history.component';
import { ChangePassworddComponent } from './Admin/change-password/change-password.component';
import { ChangePassworddComponent as CompanyChangePasswordComponent } from './company/change-password/change-password.component';
import { AdminProfileComponent } from './Admin/admin-profile/admin-profile.component';
import { JoblistComponent } from './guest/joblist/joblist.component';
import { JobDetailsComponent } from './guest/job-details/job-details.component';
import { PlacementRulesComponent } from './guest/placement-rules/placement-rules.component';

import { FaqComponent } from './guest/faq/faq.component';
import { studentGuard } from './user/guards/student.guard';
import { LayoutComponent } from './user/layout/layout.component';
import { DashboardComponent } from './user/dashboard/dashboard.component';
import { ProfileComponent } from './user/profile/profile.component';
import { AcademicComponent } from './user/academic-details/academic-details.component';
import { ApplicationStatusComponent } from './user/application-status/application-status.component';
import { AppliedJobsComponent } from './user/applied-jobs/applied-jobs.component';
import { EligibleJobsComponent } from './user/eligible-jobs/eligible-jobs.component';
import { PlacementResultComponent } from './user/placement-result/placement-result.component';
import { ResumeComponent } from './user/resume/resume.component';
import { SkillsComponent } from './user/skills/skills.component';
import { NotificationsComponent } from './user/notifications/notifications.component';

import { CompanyComponent } from './guest/company/company.component';
import { ChangePasswordComponent } from './user/change-password/change-password.component';
import { AboutusComponent } from './guest/aboutus/aboutus.component';
import { ContactusComponent } from './guest/contactus/contactus.component';
import { ResumeUploadComponent } from './user/resume-upload/resume-upload.component';



export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },

  // ── Admin ──────────────────────────────────────────
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'user-management', component: UserManagementComponent },
  { path: 'jobs-mangement', component: JobsManagementComponent },
  { path: 'company-mangement', component: CompanyManagementComponent },
  { path: 'application', component: ApplicationComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'changepassword', component: ChangePassworddComponent },
  { path: 'editprofile', component: AdminProfileComponent },

  // ── Guest ───────────────────────────────────────
  { path: 'jobs', component: JoblistComponent },
  { path: 'companies', component: CompanyComponent },
  { path: 'job-details/:id', component: JobDetailsComponent },
  { path: 'placement-rules', component: PlacementRulesComponent },
  { path: 'faq', component: FaqComponent },
  { path:'aboutus' ,component:AboutusComponent},
  { path:'contactus' ,component:ContactusComponent},

  // ── Company (nested inside layout) ────────────────
  {
    path: 'company',
    component: CompanyLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: CompanyDashboardComponent },
      { path: 'profile', component: CompanyProfileComponent },
      { path: 'post-job', component: PostJobComponent },
      { path: 'manage-jobs', component: ManageJobsComponent },
      { path: 'applications', component: JobApplicationsComponent },
      { path: 'candidates', component: CandidateListComponent },
      { path: 'candidate/:id', component: CandidateDetailsComponent },
      { path: 'interview-status', component: InterviewStatusComponent },
      { path: 'hiring-history', component: HiringHistoryComponent },
      { path: 'change--password', component: CompanyChangePasswordComponent },
    ]
  },

  // ── Student ────────────────
  {
    path: 'student',
    canActivate: [studentGuard],
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'academic', component: AcademicComponent },
      { path: 'skills', component: SkillsComponent },
      { path: 'resume', component: ResumeUploadComponent },
      { path: 'eligible-jobs', component: EligibleJobsComponent },
      { path: 'applied-jobs', component: AppliedJobsComponent },
      { path: 'application-status', component: ApplicationStatusComponent },
      { path: 'placement-result', component: PlacementResultComponent },
      { path: 'notifications', component: NotificationsComponent },
      { path: 'change-password', component: ChangePasswordComponent }
    ]
  },

  // ── Wildcard ───────────────────────────────────────
  { path: '**', redirectTo: '' }
];
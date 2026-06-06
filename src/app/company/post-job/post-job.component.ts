import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { CompanyDataService } from '../../shared/company-data.service';

@Component({
  selector: 'app-post-job',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './post-job.component.html',
  styleUrls: ['./post-job.component.css']
})
export class PostJobComponent {
  jobForm = {
    title: '', department: '', type: '' as any, location: '',
    salary: '', positions: 1, deadline: '', description: '',
    requirements: [] as string[], skills: [] as string[], status: 'Active' as any
  };
  newReq = ''; newSkill = '';
  errors: any = {}; validationErrors: string[] = [];
  today = new Date().toISOString().split('T')[0];
  loading = false;

  suggestedSkills = ['Angular','React','TypeScript','Node.js','Python','SQL',
    'MongoDB','AWS','Docker','Figma','Java','Machine Learning','REST APIs','Git','Agile','CI/CD'];

 constructor(private api: ApiService, public auth: AuthService, private router: Router, public companyService: CompanyDataService) {}

  addReq()  { if (this.newReq.trim()) { this.jobForm.requirements.push(this.newReq.trim()); this.newReq=''; } }
  removeReq(i: number) { this.jobForm.requirements.splice(i, 1); }
  toggleSkill(s: string) {
    const i = this.jobForm.skills.indexOf(s);
    if (i>-1) this.jobForm.skills.splice(i,1); else this.jobForm.skills.push(s);
  }
  addSkill() {
    if (this.newSkill.trim() && !this.jobForm.skills.includes(this.newSkill.trim())) {
      this.jobForm.skills.push(this.newSkill.trim()); this.newSkill='';
    }
  }
  removeSkill(i: number) { this.jobForm.skills.splice(i, 1); }

  validate(pub=true): boolean {
    this.errors = {}; this.validationErrors = [];
    if (!this.jobForm.title.trim())        { this.errors.title=true;       this.validationErrors.push('Job title required'); }
    if (!this.jobForm.department)          { this.errors.department=true;  this.validationErrors.push('Department required'); }
    if (pub && !this.jobForm.type)         { this.errors.type=true;        this.validationErrors.push('Job type required'); }
    if (pub && !this.jobForm.location.trim()){ this.errors.location=true;  this.validationErrors.push('Location required'); }
    if (pub && !this.jobForm.deadline)     { this.errors.deadline=true;    this.validationErrors.push('Deadline required'); }
    if (pub && !this.jobForm.description.trim()){ this.errors.description=true; this.validationErrors.push('Description required'); }
    return this.validationErrors.length === 0;
  }

  private submitToApi(status: string) {
    const company = this.auth.getCompany();
    const payload = {
      jobtitle:    this.jobForm.title,
      department:  this.jobForm.department,
      company:     company?.name || 'My Company',
      location:    this.jobForm.location,
      type:        this.jobForm.type,
      salary:      this.jobForm.salary,
      positions:   this.jobForm.positions,
      deadline:    this.jobForm.deadline,
      description: this.jobForm.description,
      requirements: this.jobForm.requirements,
      skills:      this.jobForm.skills,
      status
    };
    this.loading = true;
    this.api.postJob(payload).subscribe({
      next: () => { this.loading=false; this.router.navigate(['/company/manage-jobs']); },
      error: (err) => { this.loading=false; alert(err.error?.message || 'Error posting job'); }
    });
  }

  saveDraft()   { if (this.validate(false)) this.submitToApi('Draft'); }
  publishJob()  { if (this.validate(true))  this.submitToApi('Active'); }
}

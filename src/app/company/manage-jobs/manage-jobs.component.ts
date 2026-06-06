import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-manage-jobs',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DatePipe],
  templateUrl: './manage-jobs.component.html',
  styleUrls: ['./manage-jobs.component.css']
})
export class ManageJobsComponent implements OnInit {
  all: any[]          = [];
  filteredJobs: any[] = [];
  searchQuery  = '';
  filterStatus = '';
  filterType   = '';
  activeTab    = 'all';
  loading      = true;

  // ── Edit modal ─────────────────────────────────────────────────────────
  showEditModal = false;
  editJob: any  = null;
  editSaving    = false;

  // ── View modal ─────────────────────────────────────────────────────────
  showViewModal = false;
  viewJob: any  = null;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() { this.loadJobs(); }

  loadJobs() {
    this.api.getMyJobs().subscribe({
      next: (data: any) => {
        this.all = data.map((j: any) => ({
          ...j,
          id:    j._id,
          title: j.jobtitle,
          // skills may be array or undefined
          skills: j.skills || [],
        }));
        this.filterJobs();
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  setTab(tab: string) {
    this.activeTab    = tab;
    this.filterStatus = tab !== 'all' ? tab.charAt(0).toUpperCase() + tab.slice(1) : '';
    this.filterJobs();
  }

  filterJobs() {
    this.filteredJobs = this.all.filter(j => {
      const q = this.searchQuery.toLowerCase();
      return (
        (!q || j.title?.toLowerCase().includes(q) ||
               j.jobtitle?.toLowerCase().includes(q) ||
               j.department?.toLowerCase().includes(q)) &&
        (!this.filterStatus || j.status === this.filterStatus) &&
        (!this.filterType   || j.type   === this.filterType)
      );
    });
  }

  countByStatus(s: string) { return this.all.filter(j => j.status === s).length; }

  getStatusBadge(s: string): string {
    return { 'Active': 'badge-active', 'Closed': 'badge-closed', 'Draft': 'badge-draft' }[s] || '';
  }

  getDeptIcon(dept: string): string {
    const m: Record<string,string> = {
      'Engineering': 'code', 'Analytics': 'bar_chart', 'Design': 'brush',
      'Marketing': 'campaign', 'Finance': 'attach_money', 'Product': 'inventory_2',
      'Infrastructure': 'dns', 'Sales': 'trending_up', 'HR': 'people',
    };
    return m[dept] ?? 'work';
  }

  getTypeBadge(type: string): string {
    return { 'Full-Time':'badge-shortlisted','Part-Time':'badge-applied',
             'Internship':'badge-interview','Contract':'badge-draft' }[type] || '';
  }

  viewApplications(jobId: any) {
    this.router.navigate(['/company/applications'], { queryParams: { job: jobId } });
  }

  deleteJob(id: any) {
    if (confirm('Delete this job permanently?')) {
      this.api.deleteJob(id).subscribe({
        next: () => { this.all = this.all.filter(j => j._id !== id); this.filterJobs(); },
        error: () => alert('Error deleting job')
      });
    }
  }

  // ── View modal ─────────────────────────────────────────────────────────
  openViewModal(job: any) { this.viewJob = job; this.showViewModal = true; }
  closeViewModal()        { this.showViewModal = false; this.viewJob = null; }

  // ── Edit modal — opens with deep copy so original is untouched ─────────
  openEditModal(job: any) {
    this.editJob = {
      ...job,
      skills:       [...(job.skills || [])],
      requirements: [...(job.requirements || [])],
    };
    this.showEditModal = true;
  }
  closeEditModal() { this.showEditModal = false; this.editJob = null; }

  // ── SAVE EDIT — pushes to MongoDB via PUT /api/jobs/:id ───────────────
  saveEditJob() {
    if (!this.editJob?.title?.trim()) { alert('Job title is required'); return; }
    this.editSaving = true;

    const payload = {
      jobtitle:     this.editJob.title,
      department:   this.editJob.department,
      location:     this.editJob.location,
      type:         this.editJob.type,
      salary:       this.editJob.salary,
      positions:    this.editJob.positions,
      deadline:     this.editJob.deadline,
      description:  this.editJob.description,
      requirements: this.editJob.requirements,
      skills:       this.editJob.skills,
      status:       this.editJob.status,
    };

    this.api.updateJob(this.editJob._id, payload).subscribe({
      next: (res: any) => {
        // Update local array — no duplication, replace in place
        const idx = this.all.findIndex(j => j._id === this.editJob._id);
        if (idx !== -1) {
          this.all[idx] = { ...this.all[idx], ...payload, title: payload.jobtitle };
        }
        this.filterJobs();
        this.editSaving = false;
        this.closeEditModal();
      },
      error: (err) => {
        this.editSaving = false;
        alert(err.error?.message || 'Error saving job');
      }
    });
  }

  // ── Skills helpers in edit modal ───────────────────────────────────────
  newEditSkill = '';
  addEditSkill() {
    if (this.newEditSkill.trim() && !this.editJob.skills.includes(this.newEditSkill.trim())) {
      this.editJob.skills.push(this.newEditSkill.trim());
      this.newEditSkill = '';
    }
  }
  removeEditSkill(i: number) { this.editJob.skills.splice(i, 1); }

  updateJobStatus(job: any, status: string) {
    this.api.updateJob(job._id, { status }).subscribe({
      next: () => { job.status = status; this.filterJobs(); },
      error: () => alert('Error updating status')
    });
  }
}
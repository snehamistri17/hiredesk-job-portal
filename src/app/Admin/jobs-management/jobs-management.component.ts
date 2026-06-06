import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-jobs-management',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './jobs-management.component.html',
  styleUrl: './jobs-management.component.css'
})
export class JobsManagementComponent implements OnInit {

  all:      any[] = [];
  filtered: any[] = [];
  fStatus = ''; fType = ''; fDept = ''; q = '';
  loading  = true;
  saving   = false;

  showModal     = false;
  showViewModal = false;
  showEditModal = false;
  viewDrive: any = null;
  editDrive: any = null;

  // ── New drive form — fields match job schema ──────────────────────────
  nd = {
    jobtitle:    '',
    company:     '',
    department:  'Engineering',
    location:    '',
    type:        'Full-Time',
    salary:      '',
    positions:   1,
    deadline:    '',
    description: '',
    eligibility: '',
    skills:      [] as string[],
    status:      'Active',
  };
  ndSkillInput = '';

  // ── Stats (computed from live data) ───────────────────────────────────
  get dStats() {
    return [
      { icon: '💼', val: this.all.length,                                          label: 'Total Jobs'   },
      { icon: '✅', val: this.all.filter(d => d.status === 'Active').length,       label: 'Active'       },
      { icon: '📋', val: this.all.filter(d => d.status === 'Draft').length,        label: 'Draft'        },
      { icon: '🔒', val: this.all.filter(d => d.status === 'Closed').length,       label: 'Closed'       },
    ];
  }

  departments = ['Engineering', 'Analytics', 'Design', 'Marketing', 'Finance', 'Product', 'Infrastructure', 'Sales', 'HR'];

  private BASE = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  private headers() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('hd_token')}`
    });
  }

  ngOnInit(): void { this.loadJobs(); }

  // ── LOAD all jobs from MongoDB ─────────────────────────────────────────
  loadJobs(): void {
    this.loading = true;
    this.http.get(`${this.BASE}/jobs/all`, { headers: this.headers() }).subscribe({
      next: (data: any) => {
        this.all = data.map((j: any) => ({
          ...j,
          title:    j.jobtitle,
          skills:   j.skills   || [],
          branches: j.skills   || [],   // keep branches alias for view modal
        }));
        this.updateStats();
        this.filter();
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  updateStats(): void {}   // stats are computed getters now

  filter(): void {
    this.filtered = this.all.filter(d => {
      const ms = !this.fStatus || d.status     === this.fStatus;
      const mt = !this.fType   || d.type       === this.fType;
      const md = !this.fDept   || d.department === this.fDept;
      const mq = !this.q ||
        d.jobtitle?.toLowerCase().includes(this.q.toLowerCase()) ||
        d.company?.toLowerCase().includes(this.q.toLowerCase()) ||
        d.department?.toLowerCase().includes(this.q.toLowerCase());
      return ms && mt && md && mq;
    });
  }

  // ── DELETE from MongoDB ────────────────────────────────────────────────
  del(id: string): void {
    if (!confirm('Delete this job?')) return;
    this.http.delete(`${this.BASE}/jobs/${id}`, { headers: this.headers() }).subscribe({
      next: () => {
        this.all = this.all.filter(d => d._id !== id);
        this.filter();
      },
      error: () => alert('Error deleting job')
    });
  }

  // ── CREATE modal ───────────────────────────────────────────────────────
  openModal():  void { this.showModal = true; }
  closeModal(): void {
    this.showModal = false;
    this.nd = { jobtitle:'', company:'', department:'Engineering', location:'',
                type:'Full-Time', salary:'', positions:1, deadline:'',
                description:'', eligibility:'', skills:[], status:'Active' };
    this.ndSkillInput = '';
  }

  addNdSkill(): void {
    const s = this.ndSkillInput.trim();
    if (s && !this.nd.skills.includes(s)) { this.nd.skills.push(s); }
    this.ndSkillInput = '';
  }
  removeNdSkill(i: number): void { this.nd.skills.splice(i, 1); }

  // ── SAVE NEW JOB to MongoDB ────────────────────────────────────────────
  create(): void {
    if (!this.nd.jobtitle.trim())  { alert('Job title is required');  return; }
    if (!this.nd.company.trim())   { alert('Company is required');    return; }
    if (!this.nd.location.trim())  { alert('Location is required');   return; }
    if (!this.nd.salary.trim())    { alert('Salary is required');     return; }

    this.saving = true;
    const payload = {
      jobtitle:    this.nd.jobtitle.trim(),
      company:     this.nd.company.trim(),
      department:  this.nd.department,
      location:    this.nd.location.trim(),
      type:        this.nd.type,
      salary:      this.nd.salary.trim(),
      positions:   this.nd.positions,
      deadline:    this.nd.deadline,
      description: this.nd.description.trim(),
      skills:      this.nd.skills,
      status:      this.nd.status,
    };

    this.http.post(`${this.BASE}/jobs`, payload, { headers: this.headers() }).subscribe({
      next: () => {
        this.saving = false;
        this.loadJobs();     // reload from MongoDB so Compass shows it
        this.closeModal();
      },
      error: (err) => {
        this.saving = false;
        alert(err.error?.message || 'Error creating job');
      }
    });
  }

  // ── VIEW modal ─────────────────────────────────────────────────────────
  openViewModal(d: any):  void { this.viewDrive = d; this.showViewModal = true; }
  closeViewModal(): void { this.showViewModal = false; this.viewDrive = null; }

  // ── EDIT modal ─────────────────────────────────────────────────────────
  openEditModal(d: any): void {
    this.editDrive = {
      ...d,
      skills:   [...(d.skills   || [])],
      branches: [...(d.branches || [])],
    };
    this.editSkillInput = '';
    this.showEditModal = true;
  }
  closeEditModal(): void { this.showEditModal = false; this.editDrive = null; }

  editSkillInput = '';
  addEditSkill(): void {
    const s = this.editSkillInput.trim();
    if (s && !this.editDrive.skills.includes(s)) { this.editDrive.skills.push(s); }
    this.editSkillInput = '';
  }
  removeEditSkill(i: number): void { this.editDrive.skills.splice(i, 1); }

  // ── SAVE EDIT to MongoDB ───────────────────────────────────────────────
  saveEdit(): void {
    if (!this.editDrive?.jobtitle?.trim()) { alert('Job title is required'); return; }
    this.saving = true;

    const payload = {
      jobtitle:    this.editDrive.jobtitle,
      company:     this.editDrive.company,
      department:  this.editDrive.department,
      location:    this.editDrive.location,
      type:        this.editDrive.type,
      salary:      this.editDrive.salary,
      positions:   this.editDrive.positions,
      deadline:    this.editDrive.deadline,
      description: this.editDrive.description,
      skills:      this.editDrive.skills,
      status:      this.editDrive.status,
    };

    this.http.put(`${this.BASE}/jobs/${this.editDrive._id}`, payload, { headers: this.headers() }).subscribe({
      next: () => {
        this.saving = false;
        // Update local array in place — no duplication
        const idx = this.all.findIndex(d => d._id === this.editDrive._id);
        if (idx !== -1) {
          this.all[idx] = { ...this.all[idx], ...payload, title: payload.jobtitle };
        }
        this.filter();
        this.closeEditModal();
      },
      error: (err) => {
        this.saving = false;
        alert(err.error?.message || 'Error saving job');
      }
    });
  }

  // ── Helpers ────────────────────────────────────────────────────────────
  getDay(date: string): string {
    try { return new Date(date).getDate().toString().padStart(2, '0'); } catch { return '--'; }
  }
  getMon(date: string): string {
    try { return new Date(date).toLocaleString('en', { month: 'short' }).toUpperCase(); } catch { return '---'; }
  }
  boxClass(s: string): string {
    if (s === 'Active')  return 'box-blue';
    if (s === 'Closed')  return 'box-green';
    return 'box-orange';
  }
  statusBadge(s: string): string {
    return { 'Active': 'active', 'Closed': 'completed', 'Draft': 'scheduled' }[s] ?? 'scheduled';
  }
}
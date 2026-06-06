import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  all: any[]      = [];
  filtered: any[] = [];
  fStatus = ''; fBranch = ''; q = '';
  loading = true;

  showAddModal  = false;
  showViewModal = false;
  showEditModal = false;
  viewStudent: any = null;
  editStudent: any = null;

  branches = ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil'];

  ns = {
    name: '', email: '', phone: '', rollNo: '', branch: 'Computer Science',
    department: 'Engineering', password: 'Student@123',
  };

  qstats: any[] = [];

  private BASE = 'http://localhost:3000/api';

  constructor(private api: ApiService, private http: HttpClient) {}

  private headers() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('hd_token')}`
    });
  }

  ngOnInit() { this.loadStudents(); }

  loadStudents() {
    this.loading = true;
    this.api.getStudents().subscribe({
      next: (data: any) => {
        this.all = data;
        this.updateStats();
        this.filter();
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  updateStats() {
    this.qstats = [
      { icon: '🎓', val: this.all.length,                                                        label: 'Total'        },
      { icon: '🏆', val: this.all.filter(s => s.placementStatus === 'Placed').length,            label: 'Placed'       },
      { icon: '✅', val: this.all.filter(s => s.placementStatus === 'Eligible').length,          label: 'Eligible'     },
      { icon: '📝', val: this.all.filter(s => s.placementStatus === 'Applied').length,           label: 'Applied'      },
      { icon: '❌', val: this.all.filter(s => s.placementStatus === 'Not Eligible').length,      label: 'Not Eligible' },
    ];
  }

  filter() {
    this.filtered = this.all.filter(s => {
      const ms = !this.fStatus || s.placementStatus === this.fStatus;
      const mb = !this.fBranch || s.branch === this.fBranch;
      const mq = !this.q ||
        s.name?.toLowerCase().includes(this.q.toLowerCase()) ||
        s.email?.toLowerCase().includes(this.q.toLowerCase()) ||
        s.rollNo?.toLowerCase().includes(this.q.toLowerCase());
      return ms && mb && mq;
    });
  }

  // ── ADD
  add() {
    if (!this.ns.name.trim() || !this.ns.email.trim() || !this.ns.phone.trim() || !this.ns.rollNo.trim()) {
      alert('Name, Email, Phone and Roll No are required');
      return;
    }
    const payload = {
      name:       this.ns.name.trim(),
      email:      this.ns.email.trim().toLowerCase(),
      phone:      this.ns.phone.trim(),
      rollNo:     this.ns.rollNo.trim(),
      branch:     this.ns.branch || 'Computer Science',
      department: this.ns.department || 'Engineering',
      password:   this.ns.password || 'Student@123',
    };

    this.http.post(`${this.BASE}/auth/register`, payload).subscribe({
      next: () => {
        this.loadStudents();
        this.ns = { name: '', email: '', phone: '', rollNo: '', branch: 'Computer Science',
                    department: 'Engineering', password: 'Student@123' };
        this.closeAddModal();
      },
      error: (err) => alert(err.error?.message || 'Error adding student')
    });
  }

  // ── DELETE
  del(id: any) {
    if (confirm('Remove student? This cannot be undone.')) {
      this.http.delete(`${this.BASE}/admin/students/${id}`, { headers: this.headers() }).subscribe({
        next: () => {
          this.all = this.all.filter(s => s._id !== id);
          this.filter();
          this.updateStats();
        },
        error: () => alert('Error deleting student')
      });
    }
  }

  openAddModal()  { this.showAddModal  = true; }
  closeAddModal() { this.showAddModal  = false; }

  openViewModal(s: any)  { this.viewStudent = s; this.showViewModal = true; }
  closeViewModal() { this.showViewModal = false; }

  openEditModal(s: any) {
    // Merge technicalSkills + softSkills into a flat skills array for the editor
    const techSkills = (s.technicalSkills || []).map((sk: any) => sk.name || sk);
    const softSkills = (s.softSkills || []).map((sk: any) => sk.name || sk);
    this.editStudent = {
      ...s,
      skills: [...techSkills, ...softSkills],
      // Map placementStatus → status for the edit form
      status: s.placementStatus || 'Eligible',
      // Map currentSem → year for the edit form
      year: s.currentSem || '',
    };
    this.showEditModal = true;
  }
  closeEditModal() { this.showEditModal = false; }

  // ── EDIT — saves ALL fields to MongoDB using correct field names
  saveEdit() {
    // Convert flat skills array back to technicalSkills objects
    const technicalSkills = (this.editStudent.skills || []).map((sk: string) => ({ name: sk, level: 'Intermediate', pct: 70 }));

    const payload = {
      placementStatus: this.editStudent.status,
      placedAt:        this.editStudent.company     || '',
      branch:          this.editStudent.branch      || '',
      currentSem:      this.editStudent.year        || '',
      cgpa:            this.editStudent.cgpa        ?? '',
      technicalSkills: technicalSkills,
      softSkills:      this.editStudent.softSkills  || [],
      name:            this.editStudent.name        || '',
      phone:           this.editStudent.phone       || '',
    };

    this.api.updateStudentStatus(this.editStudent._id, payload).subscribe({
      next: (res: any) => {
        const idx = this.all.findIndex(s => s._id === this.editStudent._id);
        if (idx !== -1) this.all[idx] = { ...this.all[idx], ...res.student };
        this.filter();
        this.updateStats();
        this.closeEditModal();
      },
      error: () => alert('Error saving changes')
    });
  }

  // ── Skill helpers in edit modal
  editSkillInput = '';
  addEditSkill() {
    const s = this.editSkillInput.trim();
    if (s && !this.editStudent.skills.includes(s)) {
      this.editStudent.skills.push(s);
    }
    this.editSkillInput = '';
  }
  removeEditSkill(i: number) { this.editStudent.skills.splice(i, 1); }

  // Helper: get all skills from a student record (technical + soft)
  getSkills(s: any): string[] {
    const tech = (s.technicalSkills || []).map((sk: any) => sk.name || sk);
    const soft = (s.softSkills || []).map((sk: any) => sk.name || sk);
    return [...tech, ...soft];
  }

  cgpaClass(c: any) {
    const n = parseFloat(c);
    return n >= 9 ? 'ex' : n >= 8 ? 'gd' : n >= 7 ? 'ok' : 'lw';
  }

  statusClass(s: string) {
    const m: any = { 'Placed': 'placed', 'Eligible': 'eligible', 'Applied': 'applied', 'Not Eligible': 'ineligible' };
    return m[s] ?? 'eligible';
  }
}
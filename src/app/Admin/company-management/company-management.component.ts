import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-manage-companies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './company-management.component.html',   // ← FIXED (was user-management.component.html)
  styleUrls: ['./company-management.component.css'],    // ← FIXED
})
export class CompanyManagementComponent implements OnInit {  // ← FIXED class name & export
  all: any[] = [];
  filtered: any[] = [];
  fStatus = ''; fInd = ''; q = '';
  industries: string[] = [];
  loading = true;

  showAddModal  = false;
  showViewModal = false;
  showEditModal = false;
  viewCompany: any = null;
  editCompany: any = null;

  nc = { name: '', industry: 'IT', location: '', hr: '', package: '', status: 'Pending' };

  constructor(private api: ApiService) {}

  ngOnInit() { this.loadCompanies(); }

  loadCompanies() {
    this.api.getAllCompanies().subscribe({
      next: (data: any) => {
        this.all = data;
        this.industries = [...new Set(data.map((c: any) => c.industry))] as string[];
        this.filter();
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  filter() {
    this.filtered = this.all.filter((c: any) =>
      (!this.fStatus || c.status   === this.fStatus) &&
      (!this.fInd    || c.industry === this.fInd) &&
      (!this.q       || c.name.toLowerCase().includes(this.q.toLowerCase()))
    );
  }

  approve(c: any) {
    this.api.approveCompany(c._id).subscribe({
      next: () => { c.status = 'Approved'; this.filter(); },
      error: () => alert('Error approving')
    });
  }

  reject(c: any) {
    this.api.rejectCompany(c._id).subscribe({
      next: () => { c.status = 'Rejected'; this.filter(); },
      error: () => alert('Error rejecting')
    });
  }

  del(id: any) {
    if (confirm('Remove company?')) {
      this.api.deleteCompany(id).subscribe({
        next: () => { this.all = this.all.filter(c => c._id !== id); this.filter(); },
        error: () => alert('Error deleting')
      });
    }
  }

  // ── Add company ──────────────────────────────────────────────────────────
  addCompany() {
  if (!this.nc.name.trim()) { alert('Company name is required'); return; }

  // Admin-created companies don't need a password — use a default hashed one
  // The register route requires email+password, so we send a placeholder
  const payload = {
    name:         this.nc.name,
    email:        this.nc.name.toLowerCase().replace(/\s+/g, '') + '@company.com',
    password:     'Admin@1234',   // default password, company can change later
    industry:     this.nc.industry,
    phone:        '',
    headquarters: this.nc.location,
  };

  this.api.registerCompany(payload).subscribe({
    next: () => {
      this.loadCompanies();   // reload from MongoDB so it appears correctly
      this.nc = { name: '', industry: 'IT', location: '', hr: '', package: '', status: 'Pending' };
      this.closeAddModal();
    },
    error: (err) => alert(err.error?.message || 'Error adding company')
  });
}

  openAddModal()  { this.showAddModal  = true; }
  closeAddModal() { this.showAddModal  = false; }

  openViewModal(c: any)  { this.viewCompany = c; this.showViewModal = true; }
  closeViewModal() { this.showViewModal = false; }

  openEditModal(c: any) { this.editCompany = { ...c }; this.showEditModal = true; }
  closeEditModal() { this.showEditModal = false; }

 saveEdit() {
  this.api.approveCompany(this.editCompany._id); // only status update available via API
  // Update local copy immediately for UI
  const idx = this.all.findIndex(c => c._id === this.editCompany._id);
  if (idx !== -1) this.all[idx] = { ...this.editCompany };
  this.filter();
  this.closeEditModal();
}
}
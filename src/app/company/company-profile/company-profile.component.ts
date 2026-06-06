import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CompanyDataService } from '../../shared/company-data.service';

@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],  // SlicePipe removed — we use a getter instead
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css']
})
export class CompanyProfileComponent implements OnInit {
  cs: CompanyDataService;

  editing          = false;
  saveSuccess      = false;
  errors: any      = {};
  loading          = true;
  validationErrors: string[] = [];

  // Snapshot of saved data — left side always shows this, never the live form values
  snapshot: any = {};

  // Computed getter avoids passing unknown[] to the slice pipe
  get snapshotInitial(): string {
    const name = this.snapshot?.name;
    return typeof name === 'string' && name.length > 0
      ? name.charAt(0).toUpperCase()
      : '?';
  }

  constructor(private api: ApiService, cs: CompanyDataService) {
    this.cs = cs;
  }

  ngOnInit() {
    (this.api.getMyCompanyProfile() as any).subscribe({
      next: (data: any) => {
        Object.assign(this.cs.companyProfile, data);
        this.snapshot = { ...this.cs.companyProfile };
        this.loading  = false;
      },
      error: () => { this.loading = false; }
    });
  }

  startEdit() {
    this.snapshot          = { ...this.cs.companyProfile };
    this.editing           = true;
    this.saveSuccess       = false;
    this.validationErrors  = [];
  }

  cancelEdit() {
    Object.assign(this.cs.companyProfile, this.snapshot);
    this.editing  = false;
    this.errors   = {};
    this.validationErrors = [];
  }

  validateField(field: string) {
    const p = this.cs.companyProfile as any;
    this.errors[field] = false;
    if (field === 'name'     && !p.name?.trim())    { this.errors.name     = true; }
    if (field === 'industry' && !p.industry?.trim()){ this.errors.industry = true; }
    if (field === 'email'    && !p.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) { this.errors.email = true; }
    if (field === 'founded'  && p.founded && isNaN(Number(p.founded))) { this.errors.founded = true; }
    this._rebuildValidationErrors();
  }

  private _rebuildValidationErrors() {
    const msgs: string[] = [];
    if (this.errors.name)     msgs.push('Company name is required');
    if (this.errors.industry) msgs.push('Industry is required');
    if (this.errors.email)    msgs.push('Valid email is required');
    if (this.errors.founded)  msgs.push('Enter a valid year');
    this.validationErrors = msgs;
  }

  saveProfile() {
    this.errors = {};
    this.validationErrors = [];
    const p = this.cs.companyProfile as any;
    if (!p.name?.trim())    { this.errors.name    = true; }
    if (!p.industry?.trim()){ this.errors.industry = true; }
    if (!p.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) { this.errors.email = true; }
    this._rebuildValidationErrors();
    if (this.validationErrors.length > 0) return;

    (this.api.updateMyCompanyProfile(p) as any).subscribe({
      next: (res: any) => {
        if (res?.company) {
          Object.assign(this.cs.companyProfile, res.company);
        }
        this.snapshot    = { ...this.cs.companyProfile };
        this.editing     = false;
        this.saveSuccess = true;
        setTimeout(() => this.saveSuccess = false, 3000);
      },
      error: (err: any) => alert(err.error?.message || 'Error saving profile')
    });
  }
}

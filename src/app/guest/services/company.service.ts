import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CompanyService {

  constructor(private api: ApiService) {}

  // GET /api/companies
  getAllCompanies(): Observable<any> {
    return this.api.get('/companies');
  }

  // GET /api/companies/:id
  getCompanyById(id: string): Observable<any> {
    return this.api.get(`/companies/${id}`);
  }

  // POST /api/companies  (needs login)
  createCompany(data: any): Observable<any> {
    return this.api.post('/companies', data);
  }
}

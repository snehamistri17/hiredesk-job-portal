import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FaqService {
  constructor(private api: ApiService) {}

  getAllFaqs(): Observable<any> {
    return this.api.get('/faqs');
  }
}
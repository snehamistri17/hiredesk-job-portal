import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PlacementService {
  constructor(private api: ApiService) {}

  getAllRules(): Observable<any> {
    return this.api.get('/placement-rules');
  }
}

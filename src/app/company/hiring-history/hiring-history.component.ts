import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CompanyDataService } from '../../shared/company-data.service';

@Component({
  selector: 'app-hiring-history',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DatePipe],
  templateUrl: './hiring-history.component.html',
  styleUrls: ['./hiring-history.component.css']
})
export class HiringHistoryComponent implements OnInit {
  q = '';
  filtered: any[] = [];

  get activeHires() {
    return this.cs.hiringHistory.filter(h => h.status === 'Active').length;
  }

  constructor(public cs: CompanyDataService) { }

  ngOnInit() { this.filter(); }

  filter() {
    this.filtered = this.cs.hiringHistory.filter(h =>
      !this.q ||
      h.name.toLowerCase().includes(this.q.toLowerCase()) ||
      h.jobTitle.toLowerCase().includes(this.q.toLowerCase()) ||
      h.department.toLowerCase().includes(this.q.toLowerCase())
    );
  }
}

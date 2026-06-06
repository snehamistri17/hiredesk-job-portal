// src/app/academic-details/academic-details.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-academic',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './academic-details.component.html',
  styleUrls: ['./academic-details.component.css']
})
export class AcademicComponent implements OnInit {
  editing = false;
  saved   = false;
  loading = true;
  error   = '';

  academic: any = {
    college: '', university: '', branch: '', degree: '',
    rollNo: '', admissionYear: '', passoutYear: '',
    currentSem: '', cgpa: '', backlogs: '0',
    tenth: '', tenthBoard: '', tenthYear: '',
    twelfth: '', twelfthBoard: '', twelfthYear: '',
  };

  semesters = [
    { sem: 'Sem 1', sgpa: '—', backlog: 0, status: 'Pending'  },
    { sem: 'Sem 2', sgpa: '—', backlog: 0, status: 'Pending'  },
    { sem: 'Sem 3', sgpa: '—', backlog: 0, status: 'Pending'  },
    { sem: 'Sem 4', sgpa: '—', backlog: 0, status: 'Pending'  },
    { sem: 'Sem 5', sgpa: '—', backlog: 0, status: 'Pending'  },
    { sem: 'Sem 6', sgpa: '—', backlog: 0, status: 'Ongoing'  },
  ];

  constructor(private http: HttpClient) {}

  private get headers() {
    return new HttpHeaders({ Authorization: `Bearer ${localStorage.getItem('hd_token')}` });
  }

  ngOnInit() {
    this.http.get<any>('http://localhost:3000/api/user/academic', { headers: this.headers })
      .subscribe({
        next: (data) => {
          // Fill in whatever exists in DB
          Object.keys(this.academic).forEach(k => {
            if (data[k] !== undefined && data[k] !== null && data[k] !== '') {
              this.academic[k] = data[k];
            }
          });
          this.loading = false;
        },
        error: () => { this.loading = false; }
      });
  }

  save() {
    this.error = '';
    this.http.put<any>('http://localhost:3000/api/user/academic', this.academic, { headers: this.headers })
      .subscribe({
        next: () => {
          this.editing = false;
          this.saved   = true;
          setTimeout(() => this.saved = false, 3000);
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to save. Try again.';
        }
      });
  }
}
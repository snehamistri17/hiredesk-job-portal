// src/app/resume/resume.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.css']
})
export class ResumeComponent implements OnInit {
  dragOver  = false;
  uploaded  = false;
  uploading = false;
  error     = '';

  uploadedFile = {
    name: '',
    size: '',
    date: '',
    url:  ''
  };

  guidelines = [
    'PDF format only (max 5MB)',
    'Include all academic details and CGPA',
    'Add project details with tech stack used',
    'Include internship/work experience',
    'Keep it to 1-2 pages maximum',
    'Professional email address required',
  ];

  constructor(private http: HttpClient) {}

  private get headers() {
    return new HttpHeaders({ Authorization: `Bearer ${localStorage.getItem('hd_token')}` });
  }

  ngOnInit() {
    // Check if resume already uploaded
    this.http.get<any>('http://localhost:3000/api/user/profile', { headers: this.headers })
      .subscribe({
        next: (user) => {
          if (user.resumeUrl) {
            this.uploaded = true;
            this.uploadedFile = {
              name: user.resumeName || 'Resume.pdf',
              size: '',
              date: user.updatedAt
                ? new Date(user.updatedAt).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })
                : 'Previously uploaded',
              url:  user.resumeUrl
            };
          }
        },
        error: () => {}
      });
  }

  onDragOver(e: DragEvent)  { e.preventDefault(); this.dragOver = true; }
  onDragLeave()              { this.dragOver = false; }

  onDrop(e: DragEvent) {
    e.preventDefault();
    this.dragOver = false;
    const file = e.dataTransfer?.files[0];
    if (file) this.uploadFile(file);
  }

  selectFile(input: HTMLInputElement) { input.click(); }

  onFileSelected(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) this.uploadFile(file);
  }

  uploadFile(file: File) {
    this.error = '';

    if (file.type !== 'application/pdf') {
      this.error = 'Only PDF files are allowed.'; return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.error = 'File size must be under 5MB.'; return;
    }

    this.uploading = true;
    const formData = new FormData();
    formData.append('resume', file);

    // Use plain headers for multipart (no Content-Type override)
    const token   = localStorage.getItem('hd_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.post<any>('http://localhost:3000/api/user/resume', formData, { headers })
      .subscribe({
        next: (res) => {
          this.uploading = false;
          this.uploaded  = true;
          this.uploadedFile = {
            name: file.name,
            size: (file.size / 1024).toFixed(0) + ' KB',
            date: new Date().toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' }),
            url:  res.resumeUrl
          };
        },
        error: (err) => {
          this.uploading = false;
          this.error = err.error?.message || 'Upload failed. Please try again.';
        }
      });
  }

  removeFile() {
    this.uploaded     = false;
    this.uploadedFile = { name:'', size:'', date:'', url:'' };
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit {
  newSkill   = '';
  newLevel   = 'Beginner';
  newType    = 'technical';   // ← NEW: which list to add to
  saved      = false;
  loading    = true;
  activeTab  = 'technical';

  levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  technicalSkills: any[] = [];
  softSkills:      any[] = [];

  levelPct: { [key: string]: number } = {
    Beginner: 25, Intermediate: 55, Advanced: 80, Expert: 100
  };
  colorMap = ['pf-blue', 'pf-teal', 'pf-green', 'pf-orange'];

  constructor(private http: HttpClient) {}

  private get headers() {
    return new HttpHeaders({ Authorization: `Bearer ${localStorage.getItem('hd_token')}` });
  }

  ngOnInit() {
    this.http.get<any>('http://localhost:3000/api/user/skills', { headers: this.headers })
      .subscribe({
        next: (data) => {
          this.technicalSkills = (data.technicalSkills || []).map((s: any, i: number) => ({
            ...s, color: this.colorMap[i % this.colorMap.length]
          }));
          this.softSkills = (data.softSkills || []).map((s: any, i: number) => ({
            ...s, color: this.colorMap[i % this.colorMap.length]
          }));
          this.loading = false;
        },
        error: () => { this.loading = false; }
      });
  }

  addSkill() {
    if (!this.newSkill.trim()) return;
    const entry = {
      name:  this.newSkill.trim(),
      level: this.newLevel,
      pct:   this.levelPct[this.newLevel] || 25,
      color: this.colorMap[0]
    };

    if (this.newType === 'technical') {
      entry.color = this.colorMap[this.technicalSkills.length % this.colorMap.length];
      this.technicalSkills.push(entry);
      this.activeTab = 'technical';
    } else {
      entry.color = this.colorMap[this.softSkills.length % this.colorMap.length];
      this.softSkills.push(entry);
      this.activeTab = 'soft';
    }

    this.newSkill = '';
    this.saveToBackend();
  }

  removeSkill(i: number) {
    this.technicalSkills.splice(i, 1);
    this.saveToBackend();
  }

  removeSoft(i: number) {
    this.softSkills.splice(i, 1);
    this.saveToBackend();
  }

  saveToBackend() {
    this.http.put('http://localhost:3000/api/user/skills', {
      technicalSkills: this.technicalSkills,
      softSkills:      this.softSkills
    }, { headers: this.headers }).subscribe({
      next: () => {
        this.saved = true;
        setTimeout(() => this.saved = false, 2500);
      },
      error: () => {}
    });
  }
}

// settings.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { settingsData } from '../../shared/admin-data';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent {

  s = { ...settingsData };

  toast    = false;
  toastMsg = '';

  save(section: string): void {
    this.toastMsg = section + ' settings saved!';
    this.toast    = true;
    setTimeout(() => { this.toast = false; }, 3000);
  }
}

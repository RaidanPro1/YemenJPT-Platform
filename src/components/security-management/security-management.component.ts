
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-security-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './security-management.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecurityManagementComponent {
  isUfwActive = signal(true);
  isHstsEnabled = signal(true);

  // In a real app, these methods would make API calls to the backend
  // which would then execute shell commands to manage the services.
  toggleUfw() {
    this.isUfwActive.update(v => !v);
    console.log(`Simulating UFW status change to: ${this.isUfwActive()}`);
  }

  toggleHsts() {
    this.isHstsEnabled.update(v => !v);
    console.log(`Simulating HSTS status change to: ${this.isHstsEnabled()}`);
  }
}

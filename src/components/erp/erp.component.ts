import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-erp',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './erp.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErpComponent {
  private sanitizer: DomSanitizer = inject(DomSanitizer);
  
  // The URL is now set to localhost for local development.
  erpUrl = signal<string>('http://localhost:8000'); 
  safeUrl: SafeResourceUrl;
  isLoading = signal(true);

  constructor() {
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.erpUrl());
  }

  onFrameLoad() {
    this.isLoading.set(false);
  }
}

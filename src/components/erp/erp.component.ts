
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
  // FIX: Explicitly type injected service to prevent type inference to 'unknown'.
  private sanitizer: DomSanitizer = inject(DomSanitizer);
  
  // The domain is hardcoded based on the deployment script's convention.
  erpUrl = signal<string>('https://erp.ph-ye.org'); 
  safeUrl: SafeResourceUrl;
  isLoading = signal(true);

  constructor() {
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.erpUrl());
  }

  onFrameLoad() {
    this.isLoading.set(false);
  }
}

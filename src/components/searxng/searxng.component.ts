import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-searxng',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './searxng.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearxngComponent {
  private sanitizer = inject(DomSanitizer);
  private notificationService = inject(NotificationService);

  // The domain is hardcoded based on the deployment script's convention.
  searxngUrl = signal<string>('https://search.ph-ye.org');
  safeUrl: SafeResourceUrl;
  isLoading = signal(true);
  isMonitoring = signal(false);
  lastQuery = signal('');

  constructor() {
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.searxngUrl());
  }

  onFrameLoad() {
    this.isLoading.set(false);
  }

  monitorSearch(query: string) {
    if (!query || this.isMonitoring()) return;
    
    this.isMonitoring.set(true);
    this.lastQuery.set(query);

    // Simulate a background monitoring task
    setTimeout(() => {
      const isError = Math.random() < 0.2; // 20% chance of error
      
      if (isError) {
        this.notificationService.addNotification(
          `حدث خطأ أثناء مراقبة نتائج البحث عن: "${query}"`,
          'system'
        );
      } else {
        this.notificationService.addNotification(
          `تم تحديث نتائج البحث عن: "${query}"`,
          'system'
        );
      }
      
      this.isMonitoring.set(false);
    }, 5000); // Simulate a 5-second monitoring task
  }
}

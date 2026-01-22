import { Component, ChangeDetectionStrategy, output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NewsletterService } from '../../services/newsletter.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  navigate = output<string>();
  private newsletterService = inject(NewsletterService);
  
  subscriberEmail = signal('');
  subscriptionStatus = signal<{ type: 'idle' | 'success' | 'error'; message: string }>({ type: 'idle', message: '' });

  onNavigate(page: string) {
    this.navigate.emit(page);
  }

  subscribe() {
    if (!this.subscriberEmail()) return;
    const result = this.newsletterService.addSubscriber(this.subscriberEmail());
    if (result.success) {
      this.subscriptionStatus.set({ type: 'success', message: result.message });
      this.subscriberEmail.set('');
    } else {
      this.subscriptionStatus.set({ type: 'error', message: result.message });
    }
    setTimeout(() => this.subscriptionStatus.set({ type: 'idle', message: '' }), 3000);
  }
}

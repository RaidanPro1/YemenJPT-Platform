import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../services/settings.service';
import { SystemStatsComponent } from '../system-stats/system-stats.component';
import { ToolManagementComponent } from '../tool-management/tool-management.component';
import { SeoManagementComponent } from '../seo-management/seo-management.component';
import { ApiKeyManagementComponent } from '../api-key-management/api-key-management.component';
import { AiFeedbackManagementComponent } from '../ai-feedback-management/ai-feedback-management.component';
import { SecurityManagementComponent } from '../security-management/security-management.component';
import { GeminiCodeAssistComponent } from '../gemini-code-assist/gemini-code-assist.component';
import { AutomationComponent } from '../automation/automation.component';
import { ContentManagementComponent } from '../content-management/content-management.component';
import { SocialBotManagementComponent } from '../social-bot-management/social-bot-management.component';
import { UserService } from '../../services/user.service';
import { ThemeManagementComponent } from '../theme-management/theme-management.component';
import { NewsletterManagementComponent } from '../newsletter-management/newsletter-management.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SystemStatsComponent,
    ToolManagementComponent,
    SeoManagementComponent,
    ApiKeyManagementComponent,
    AiFeedbackManagementComponent,
    SecurityManagementComponent,
    GeminiCodeAssistComponent,
    AutomationComponent,
    ContentManagementComponent,
    SocialBotManagementComponent,
    ThemeManagementComponent,
    NewsletterManagementComponent
  ],
  templateUrl: './admin.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent {
  settingsService = inject(SettingsService);
  userService = inject(UserService);

  isRoot = computed(() => this.userService.currentUser()?.role === 'super-admin');

  // --- Social Login State ---
  socialLogins = signal({
    google: { clientId: '', clientSecret: '', active: false },
    facebook: { clientId: '', clientSecret: '', active: false },
    x: { clientId: '', clientSecret: '', active: false },
  });

  // --- AI Training State ---
  trainingStatus = signal<'idle' | 'preparing' | 'running' | 'complete'>('idle');
  trainingLogs = signal<string[]>([]);

  saveSocialLogins() {
    console.log("Saving Social Login Config:", this.socialLogins());
    // This would typically make a backend call to save the credentials securely.
  }
  
  startFineTuning() {
    this.trainingLogs.set([]); // Clear logs
    this.logTrainingStep('Initiating fine-tuning process...');
    this.trainingStatus.set('preparing');

    setTimeout(() => {
        this.logTrainingStep('Data preparation complete. Found 50 new valid feedback entries.');
        this.logTrainingStep('Starting training job on local AI cluster...');
        this.trainingStatus.set('running');
        
        setTimeout(() => {
            this.logTrainingStep('Training epoch 1/5 complete. Loss: 0.89');
             setTimeout(() => {
              this.logTrainingStep('Training epoch 3/5 complete. Loss: 0.52');
               setTimeout(() => {
                this.logTrainingStep('Training epoch 5/5 complete. Loss: 0.31');
                this.logTrainingStep('Model fine-tuning successful! New model version: yemenjpt-v1.2');
                this.trainingStatus.set('complete');
                setTimeout(() => this.trainingStatus.set('idle'), 5000);
              }, 4000);
            }, 4000);
        }, 2000);
    }, 2000);
  }

  private logTrainingStep(message: string) {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    this.trainingLogs.update(logs => [...logs, `[${timestamp}] ${message}`]);
  }
}

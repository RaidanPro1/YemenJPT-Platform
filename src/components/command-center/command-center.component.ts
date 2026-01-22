import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SystemStatsComponent } from '../system-stats/system-stats.component';
import { LoggerService } from '../../services/logger.service';
import { UserService } from '../../services/user.service';
import { ConfirmationService } from '../../services/confirmation.service';
import { SettingsService } from '../../services/settings.service';

// Import all management components
import { ToolManagementComponent } from '../tool-management/tool-management.component';
import { UserManagementComponent } from '../user-management/user-management.component';
import { SeoManagementComponent } from '../seo-management/seo-management.component';
import { ApiKeyManagementComponent } from '../api-key-management/api-key-management.component';
import { AiFeedbackManagementComponent } from '../ai-feedback-management/ai-feedback-management.component';
import { SecurityManagementComponent } from '../security-management/security-management.component';
import { AutomationComponent } from '../automation/automation.component';
import { ContentManagementComponent } from '../content-management/content-management.component';
import { SocialBotManagementComponent } from '../social-bot-management/social-bot-management.component';
import { ThemeManagementComponent } from '../theme-management/theme-management.component';
import { NewsletterManagementComponent } from '../newsletter-management/newsletter-management.component';

interface SecurityLog {
    id: number;
    timestamp: string;
    level: 'Info' | 'Warning' | 'Critical';
    event: string;
    details: string;
}

interface QuickLink {
    name: string;
    description: string;
    icon: string;
    url: string;
}

type AdminTab = 'overview' | 'platform' | 'content' | 'ai' | 'infra';

@Component({
  selector: 'app-command-center',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SystemStatsComponent,
    ToolManagementComponent,
    UserManagementComponent,
    SeoManagementComponent,
    ApiKeyManagementComponent,
    AiFeedbackManagementComponent,
    SecurityManagementComponent,
    AutomationComponent,
    ContentManagementComponent,
    SocialBotManagementComponent,
    ThemeManagementComponent,
    NewsletterManagementComponent
  ],
  templateUrl: './command-center.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommandCenterComponent {
    private logger = inject(LoggerService);
    private userService = inject(UserService);
    private confirmationService = inject(ConfirmationService);
    settingsService = inject(SettingsService);

    activeTab = signal<AdminTab>('overview');

    logs = signal<SecurityLog[]>([
        { id: 1, timestamp: '10:35:12', level: 'Info', event: 'User Login', details: 'User "Ahmed" logged in successfully.'},
        { id: 2, timestamp: '10:33:05', level: 'Warning', event: 'Failed Login', details: 'Failed login attempt for user "admin" from IP 192.168.1.10.'},
        { id: 3, timestamp: '10:20:41', level: 'Critical', event: 'Service Down', details: 'Archive Service (archivebox) is unresponsive.'},
        { id: 4, timestamp: '09:55:18', level: 'Info', event: 'Tool Disabled', details: 'Tool "Amass" was disabled by "Raidan Al-Huraibi".'},
    ]);
    
    infrastructureLinks: QuickLink[] = [
        { name: 'إدارة الحاويات', description: 'Manage all Docker containers', icon: 'docker', url: 'https://sys.ph-ye.org'},
        { name: 'مراقبة الأداء', description: 'Live server performance stats', icon: 'line-chart', url: 'https://glances.ph-ye.org'},
        { name: 'حالة الخدمات', description: 'Uptime monitoring for all services', icon: 'heartbeat', url: 'https://status.ph-ye.org'},
        { name: 'إدارة الهوية', description: 'Manage users, roles, and SSO', icon: 'users-cog', url: 'https://auth.ph-ye.org'},
    ];

    intelligenceLinks: QuickLink[] = [
        { name: 'حلقة التعلم (AI)', description: 'Review and correct AI interactions', icon: 'edit', url: 'https://feedback.ph-ye.org'},
        { name: 'قاعدة البيانات المتجهة', description: 'Manage the RAG memory (Qdrant)', icon: 'database', url: 'https://qdrant.ph-ye.org/dashboard'},
        { name: 'واجهة نماذج AI', description: 'Manage local models (Open WebUI)', icon: 'robot', url: 'https://ai-ui.ph-ye.org'},
    ];

    // --- Social Login State ---
    socialLogins = signal({
      google: { clientId: '', clientSecret: '', active: false },
      facebook: { clientId: '', clientSecret: '', active: false },
      x: { clientId: '', clientSecret: '', active: false },
    });

    // --- AI Training State ---
    trainingStatus = signal<'idle' | 'preparing' | 'running' | 'complete'>('idle');
    trainingLogs = signal<string[]>([]);

    setTab(tab: AdminTab) {
      this.activeTab.set(tab);
    }

    async triggerPanicMode() {
        const confirmed = await this.confirmationService.confirm(
            'تفعيل وضع الطوارئ (Panic Mode)',
            'هل أنت متأكد من تفعيل وضع الحرباء الرقمي؟ سيتم فوراً تحويل الواجهة الرئيسية لعرض موقع تمويهي.'
        );

        if (confirmed) {
            const currentUser = this.userService.currentUser();
            this.logger.logEvent(
                'CRITICAL: PANIC MODE ACTIVATED',
                'Digital Chameleon mode has been engaged via Command Center.',
                currentUser?.name,
                true // isRoot event
            );
            console.log("PANIC MODE ACTIVATED. The 'panic.sh' script would be executed now.");
        }
    }
    
    saveSocialLogins() {
      console.log("Saving Social Login Config:", this.socialLogins());
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

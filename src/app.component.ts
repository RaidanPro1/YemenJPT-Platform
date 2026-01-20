import { Component, ChangeDetectionStrategy, signal, effect, Renderer2, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { PlaceholderComponent } from './components/placeholder/placeholder.component';
import { HomeComponent } from './components/home/home.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { RegisterComponent } from './components/register/register.component';
import { FooterComponent } from './components/footer/footer.component';
import { OnboardingComponent } from './components/onboarding/onboarding.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { TermsOfServiceComponent } from './components/terms-of-service/terms-of-service.component';
import { CookiePolicyComponent } from './components/cookie-policy/cookie-policy.component';
import { DisclaimerComponent } from './components/disclaimer/disclaimer.component';

// New Dashboard
import { DashboardComponent } from './components/dashboard/dashboard.component';

// Role-based components
import { JournalistWorkspaceComponent } from './components/journalist-workspace/journalist-workspace.component';
import { EditorialHubComponent } from './components/editorial-hub/editorial-hub.component';
import { CommandCenterComponent } from './components/command-center/command-center.component';
import { AiCoreComponent } from './components/ai-core/ai-core.component';
import { CollaborationComponent } from './components/collaboration/collaboration.component';
import { AdminComponent } from './components/admin/admin.component';
import { IndilabComponent } from './components/indilab/indilab.component';
import { MapsComponent } from './components/maps/maps.component';
import { ArchivingComponent } from './components/archiving/archiving.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { DocumentationComponent } from './components/documentation/documentation.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AutomationComponent } from './components/automation/automation.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SystemInternalsComponent } from './components/system-internals/system-internals.component';
import { ErpComponent } from './components/erp/erp.component';
import { SocialMediaAnalysisComponent } from './components/social-media-analysis/social-media-analysis.component';
import { ProjectManagementPortalComponent } from './components/project-management-portal/project-management-portal.component';
import { ViolationsObservatoryComponent } from './components/violations-observatory/violations-observatory.component';
import { TrainingPortalComponent } from './components/training-portal/training-portal.component';
import { TechSupportPortalComponent } from './components/tech-support-portal/tech-support-portal.component';

// New public portal pages
import { ViolationsObservatoryPublicComponent } from './components/violations-observatory-public/violations-observatory-public.component';
import { TrainingPortalPublicComponent } from './components/training-portal-public/training-portal-public.component';
import { TechSupportPublicComponent } from './components/tech-support-public/tech-support-public.component';
import { NewsPublicComponent } from './components/news-public/news-public.component';
import { ProjectsPublicComponent } from './components/projects-public/projects-public.component';
import { LoginModalComponent } from './components/login-modal/login-modal.component';

import { UserService, UserRole } from './services/user.service';
import { SeoService } from './services/seo.service';
import { SettingsService } from './services/settings.service';
import { LoggerService } from './services/logger.service';
import { TrialService } from './services/trial.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule, 
    SidebarComponent, 
    HeaderComponent, 
    PlaceholderComponent,
    HomeComponent,
    AboutUsComponent,
    PrivacyPolicyComponent,
    RegisterComponent,
    FooterComponent,
    OnboardingComponent,
    ConfirmationModalComponent,
    TermsOfServiceComponent,
    CookiePolicyComponent,
    DisclaimerComponent,
    // New Dashboard
    DashboardComponent,
    // Role Dashboards
    JournalistWorkspaceComponent,
    EditorialHubComponent,
    CommandCenterComponent,
    // Other Pages
    AiCoreComponent,
    CollaborationComponent,
    AdminComponent,
    IndilabComponent,
    MapsComponent,
    ArchivingComponent,
    UserManagementComponent,
    DocumentationComponent,
    SettingsComponent,
    AutomationComponent,
    ProfileComponent,
    SystemInternalsComponent,
    ErpComponent,
    SocialMediaAnalysisComponent,
    ProjectManagementPortalComponent,
    ViolationsObservatoryComponent,
    TrainingPortalComponent,
    TechSupportPortalComponent,
    // New Public Portal Pages
    ViolationsObservatoryPublicComponent,
    TrainingPortalPublicComponent,
    TechSupportPublicComponent,
    NewsPublicComponent,
    ProjectsPublicComponent,
    LoginModalComponent
  ],
})
export class AppComponent {
  private seoService = inject(SeoService);
  private settingsService = inject(SettingsService);
  private loggerService = inject(LoggerService);
  private renderer = inject(Renderer2);
  userService = inject(UserService);
  trialService = inject(TrialService);

  currentPage = signal<string>('home'); // Default to home page
  isSidebarOpen = signal<boolean>(false);
  showOnboarding = signal<boolean>(false);

  constructor() {
    // Effect to update SEO tags when they change in the service
    effect(() => {
      this.seoService.updateTitle(this.seoService.pageTitle());
      this.seoService.updateMetaTag('description', this.seoService.metaDescription());
      this.seoService.updateMetaTag('keywords', this.seoService.metaKeywords());
    });
    
    // Dark mode has been disabled by user request.

    // Global Error Handling for unhandled promises
    window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
      console.error('Unhandled Promise Rejection:', event.reason);
      
      const user = this.userService.currentUser();
      const userName = user?.name ?? 'Anonymous';
      const isRoot = user?.role === 'super-admin';
      
      let errorDetails = 'An unknown error occurred in a promise.';
      if (event.reason instanceof Error) {
        errorDetails = `${event.reason.message}\n${event.reason.stack}`;
      } else if (typeof event.reason === 'string') {
        errorDetails = event.reason;
      } else {
        try {
          errorDetails = JSON.stringify(event.reason);
        } catch {
          errorDetails = 'Could not stringify the promise rejection reason.';
        }
      }
      
      this.loggerService.logEvent(
        'Global Error: Unhandled Promise Rejection',
        errorDetails,
        userName,
        isRoot
      );
    });
  }
  
  private getDefaultPageForRole(role: UserRole | undefined): string {
    if (!role) return 'home';
    switch (role) {
      case 'investigative-journalist': return 'workspace';
      case 'editor-in-chief': return 'editorial';
      case 'super-admin': return 'command-center';
      default: return 'dashboard';
    }
  }

  handleNavigation(pageKey: string) {
     if (pageKey === 'dashboard_redirect') {
      this.currentPage.set(this.getDefaultPageForRole(this.userService.currentUser()?.role));
      return;
    }
    
    if (this.userService.isAuthenticated() && !this.userService.hasPermission(pageKey)) {
        console.warn(`Access denied for role "${this.userService.currentUser()?.role}" to page "${pageKey}"`);
        this.currentPage.set(this.getDefaultPageForRole(this.userService.currentUser()?.role));
        return;
    }
    this.currentPage.set(pageKey);
    this.isSidebarOpen.set(false); // Close sidebar on navigation
  }

  toggleSidebar() {
    this.isSidebarOpen.update(value => !value);
  }

  handleLogin() {
    this.trialService.closeModal();
    this.userService.login('investigative-journalist');
    this.currentPage.set(this.getDefaultPageForRole('investigative-journalist'));

    // Onboarding logic
    const onboardingComplete = localStorage.getItem('onboardingComplete') === 'true';
    if (!onboardingComplete && this.settingsService.isOnboardingEnabled()) {
      this.showOnboarding.set(true);
    }
  }

  switchUser(role: UserRole) {
    this.userService.login(role);
    this.currentPage.set(this.getDefaultPageForRole(role));
  }
  
  handleRegister() {
    this.userService.login('investigative-journalist'); 
    this.currentPage.set(this.getDefaultPageForRole('investigative-journalist'));
  }

  handleLogout() {
    this.userService.logout();
    this.currentPage.set('home'); // Go to home page on logout
  }

  handleFinishOnboarding() {
    this.showOnboarding.set(false);
  }
}

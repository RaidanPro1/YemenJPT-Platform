import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { ToolService } from '../../services/tool.service';
import { SearchService } from '../../services/search.service';
import { UserService, UserRole } from '../../services/user.service';
import { Tool } from '../../models/tool.model';
import { ToolCardComponent } from '../tool-card/tool-card.component';
import { ToolCardListComponent } from '../tool-card-list/tool-card-list.component';
import { PlaceholderComponent } from '../placeholder/placeholder.component';
import { AiCoreComponent } from '../ai-core/ai-core.component';
import { SocialMediaAnalysisComponent } from '../social-media-analysis/social-media-analysis.component';
import { IndilabComponent } from '../indilab/indilab.component';
import { MapsComponent } from '../maps/maps.component';
import { ArchivingComponent } from '../archiving/archiving.component';
import { CollaborationComponent } from '../collaboration/collaboration.component';
import { DocumentationComponent } from '../documentation/documentation.component';
import { AutomationComponent } from '../automation/automation.component';
import { CrmComponent } from '../crm/crm.component';
import { ToolDetailModalComponent } from '../tool-detail-modal/tool-detail-modal.component';
import { ToolStateService } from '../../services/tool-state.service';
import { SearxngComponent } from '../searxng/searxng.component';

interface Activity {
  user: string;
  action: string;
  tool: string;
  time: string;
  avatar: string;
}

interface ServiceStatus {
  name: string;
  status: 'Online' | 'Degraded' | 'Offline';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NgClass, 
    ToolCardComponent, 
    ToolCardListComponent,
    PlaceholderComponent,
    AiCoreComponent,
    SocialMediaAnalysisComponent,
    IndilabComponent,
    MapsComponent,
    ArchivingComponent,
    CollaborationComponent,
    DocumentationComponent,
    AutomationComponent,
    CrmComponent,
    ToolDetailModalComponent,
    SearxngComponent
  ],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private toolService = inject(ToolService);
  private searchService = inject(SearchService);
  userService = inject(UserService);
  toolStateService = inject(ToolStateService);
  
  user = this.userService.currentUser;
  private allTools = this.toolService.tools;
  private searchTerm = this.searchService.searchTerm;
  
  // --- NEW STATE for new widgets ---
  quickActions = signal<Tool[]>([]);
  systemStatus = signal<ServiceStatus[]>([]);
  recentActivity = signal<Activity[]>([]);

  showTabs = computed(() => this.toolStateService.openTools().length > 0);
  selectedToolForDetail = signal<Tool | null>(null);

  constructor() {
    this.systemStatus.set([
      { name: 'البوابة الرئيسية (Gateway)', status: 'Online' },
      { name: 'النواة المعرفية (AI Core)', status: 'Online' },
      { name: 'قاعدة البيانات (Postgres)', status: 'Online' },
      { name: 'خدمة الأرشفة (Archive)', status: 'Offline' },
    ]);

    this.recentActivity.set([
      { user: 'أحمد خالد', action: 'أرشفة رابط', tool: 'ArchiveBox', time: 'منذ 5 دقائق', avatar: 'https://i.pravatar.cc/150?u=ahmed' },
      { user: 'فاطمة علي', action: 'بدء تحليل', tool: 'SpiderFoot', time: 'منذ 20 دقيقة', avatar: 'https://i.pravatar.cc/150?u=fatima' },
      { user: 'أنت', action: 'بحث آمن', tool: 'SearXNG', time: 'منذ ساعة', avatar: 'assets/team/mohammed-alharibi.jpg' },
    ]);

    const quickActionIds = ['ai-assistant', 'searxng', 'invid-weverify'];
    this.quickActions.set(
      this.allTools().filter(t => quickActionIds.includes(t.id))
    );
  }

  private hasPermission(tool: Tool, userRole: UserRole | undefined): boolean {
    if (!userRole) return false;
    if (userRole === 'super-admin') return true;
    return tool.allowedRoles.includes(userRole);
  }

  visibleTools = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const userRole = this.user()?.role;
    
    const roleFilteredTools = this.allTools().filter(tool => {
        if (userRole === 'investigative-journalist') {
            return tool.isActive && this.hasPermission(tool, userRole);
        }
        return this.hasPermission(tool, userRole);
    });

    if (!term) return roleFilteredTools;

    return roleFilteredTools.filter(tool => 
      tool.name.toLowerCase().includes(term) || 
      tool.englishName.toLowerCase().includes(term) ||
      tool.description.toLowerCase().includes(term) ||
      tool.category.toLowerCase().includes(term)
    );
  });

  favoriteTools = computed(() => this.visibleTools().filter(t => t.isFavorite));
  
  categorizedTools = computed(() => {
    return this.visibleTools().reduce((acc, tool) => {
      if (!acc[tool.category]) {
        acc[tool.category] = [];
      }
      acc[tool.category].push(tool);
      return acc;
    }, {} as Record<string, Tool[]>);
  });

  get categories(): string[] {
    return Object.keys(this.categorizedTools()).sort((a, b) => a.localeCompare(b));
  }
  
  handleToolToggle(toolId: string) {
    this.toolService.toggleToolStatus(toolId);
  }

  handleToggleFavorite(toolId: string) {
    this.toolService.toggleFavoriteStatus(toolId);
  }

  showToolDetails(tool: Tool) {
    this.selectedToolForDetail.set(tool);
  }

  closeToolDetails() {
    this.selectedToolForDetail.set(null);
  }
  
  handleRunTool(tool: Tool) {
    this.toolStateService.runTool(tool.id);
    this.closeToolDetails();
  }

  selectTab(toolId: string) {
    this.toolStateService.selectTab(toolId);
  }

  closeTab(toolId: string, event: MouseEvent) {
    event.stopPropagation();
    this.toolStateService.closeTab(toolId);
  }

  getToolById(toolId: string): Tool | undefined {
    return this.allTools().find(t => t.id === toolId);
  }
}
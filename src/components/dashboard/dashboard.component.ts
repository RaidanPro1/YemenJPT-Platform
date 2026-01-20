

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
import { ErpComponent } from '../erp/erp.component';
import { ToolDetailModalComponent } from '../tool-detail-modal/tool-detail-modal.component';
import { ToolStateService } from '../../services/tool-state.service';
import { SearxngComponent } from '../searxng/searxng.component';

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
    ErpComponent,
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

  viewMode = signal<'grid' | 'list'>('grid');
  activeDashboardTab = signal<'all' | 'favorites' | 'categories'>('all');
  
  // --- Tab Management is now handled by ToolStateService ---
  showTabs = computed(() => this.toolStateService.openTools().length > 0);

  // --- Detail Modal State ---
  selectedToolForDetail = signal<Tool | null>(null);

  // --- STATS ---
  totalToolsCount = computed(() => this.allTools().length);
  activeToolsCount = computed(() => this.allTools().filter(t => t.isActive).length);
  usersCount = signal(5); // Updated count

  private hasPermission(tool: Tool, userRole: UserRole | undefined): boolean {
    if (!userRole) return false;
    if (userRole === 'super-admin') return true;
    return tool.allowedRoles.includes(userRole);
  }

  // Display tools based on user role and search term
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
  
  setTab(tab: 'all' | 'favorites' | 'categories') {
    this.activeDashboardTab.set(tab);
  }

  toggleViewMode() {
    this.viewMode.update(current => current === 'grid' ? 'list' : 'grid');
  }

  handleToolToggle(toolId: string) {
    this.toolService.toggleToolStatus(toolId);
  }

  handleToggleFavorite(toolId: string) {
    this.toolService.toggleFavoriteStatus(toolId);
  }

  // --- Detail Modal Methods ---
  showToolDetails(tool: Tool) {
    this.selectedToolForDetail.set(tool);
  }

  closeToolDetails() {
    this.selectedToolForDetail.set(null);
  }
  
  // --- Methods for running tools in tabs ---
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
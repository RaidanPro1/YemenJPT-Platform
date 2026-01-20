
import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { AdminComponent } from '../admin/admin.component';
import { AutomationComponent } from '../automation/automation.component';
import { SettingsComponent } from '../settings/settings.component';
import { UserManagementComponent } from '../user-management/user-management.component';
import { SystemInternalsComponent } from '../system-internals/system-internals.component';
import { ToolDetailModalComponent } from '../tool-detail-modal/tool-detail-modal.component';
import { ToolStateService } from '../../services/tool-state.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
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
    AdminComponent,
    AutomationComponent,
    SettingsComponent,
    UserManagementComponent,
    SystemInternalsComponent,
    ToolDetailModalComponent
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
  favoriteToolsCount = computed(() => this.allTools().filter(t => t.isFavorite).length);
  usersCount = signal(5); // Updated count

  private hasPermission(tool: Tool, userRole: UserRole | undefined): boolean {
    if (!userRole) return false;
    // FIX: Corrected logic. Only 'super-admin' (root) bypasses specific tool permissions.
    // This resolves the type error as 'super-admin' is a valid UserRole.
    if (userRole === 'super-admin') return true;
    return tool.allowedRoles.includes(userRole);
  }

  // Display tools based on user role and search term
  visibleTools = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const userRole = this.user()?.role;
    
    const roleFilteredTools = this.allTools().filter(tool => {
        // For journalists, only show active tools they have permission for
        // FIX: Replaced 'journalist' with the correct UserRole 'investigative-journalist'.
        if (userRole === 'investigative-journalist') {
            return tool.isActive && this.hasPermission(tool, userRole);
        }
        // For admin/root/supervisor, show all tools they have permission for (active or not)
        return this.hasPermission(tool, userRole);
    });

    if (!term) return roleFilteredTools;

    return roleFilteredTools.filter(tool => 
      tool.name.toLowerCase().includes(term) || 
      tool.englishName.toLowerCase().includes(term) ||
      tool.description.toLowerCase().includes(term) ||
      tool.category.toLowerCase().includes(term) // Enhanced search by category
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
    // Also close the detail modal if it's open
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

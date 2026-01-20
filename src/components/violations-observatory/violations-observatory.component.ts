import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolService } from '../../services/tool.service';
import { UserService } from '../../services/user.service';
import { ToolCardComponent } from '../tool-card/tool-card.component';
import { Tool } from '../../models/tool.model';

@Component({
  selector: 'app-violations-observatory',
  standalone: true,
  imports: [CommonModule, ToolCardComponent],
  templateUrl: './violations-observatory.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViolationsObservatoryComponent {
  private toolService = inject(ToolService);
  userService = inject(UserService);

  user = this.userService.currentUser;

  portalTools = computed(() => 
    this.toolService.tools().filter(tool => tool.category === 'مرصد الانتهاكات الصحفية')
  );

  handleToolToggle(toolId: string) {
    this.toolService.toggleToolStatus(toolId);
  }

  handleToggleFavorite(toolId: string) {
    this.toolService.toggleFavoriteStatus(toolId);
  }

  handleRunTool(tool: Tool) {
    // In a real app, this would navigate or open the tool's interface
    console.log(`Running tool: ${tool.name}`);
  }
}

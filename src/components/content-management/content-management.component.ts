
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-content-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './content-management.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentManagementComponent {
  // Logic can be added here if needed in the future
}

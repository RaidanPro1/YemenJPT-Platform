import { Component, ChangeDetectionStrategy, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  activePage = input.required<string>();
  isSidebarOpen = input.required<boolean>();
  navigate = output<string>();

  navigationService = inject(NavigationService);
  
  navLinks = this.navigationService.mainLinks;
  portalLinks = this.navigationService.portalLinks;
  adminLinks = this.navigationService.adminLinks;

  onNavigate(pageKey: string) {
    this.navigate.emit(pageKey);
  }
}

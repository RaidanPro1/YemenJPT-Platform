import { Injectable, computed, inject, signal } from '@angular/core';
import { UserService, UserRole } from './user.service';

export interface NavLink {
  key: string;
  name: string;
  icon: string;
  allowedRoles: UserRole[];
  section: 'main' | 'portal' | 'admin';
}

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private userService = inject(UserService);

  private allLinks = signal<NavLink[]>([
    // Main Links
    { key: 'workspace', name: 'مساحة عملي', icon: 'clipboard-document-list', allowedRoles: ['investigative-journalist'], section: 'main' },
    { key: 'editorial', name: 'مركز التحرير', icon: 'pencil-square', allowedRoles: ['editor-in-chief'], section: 'main' },
    { key: 'command-center', name: 'مركز القيادة', icon: 'command-line', allowedRoles: ['super-admin'], section: 'main' },
    
    { key: 'dashboard', name: 'استعراض الأدوات', icon: 'squares-2x2', allowedRoles: ['investigative-journalist', 'editor-in-chief', 'super-admin'], section: 'main' },
    { key: 'newsroom', name: 'غرفة الأخبار', icon: 'newspaper', allowedRoles: ['editor-in-chief', 'super-admin'], section: 'main' },
    { key: 'ai-core', name: 'النواة المعرفية', icon: 'sparkles', allowedRoles: ['investigative-journalist', 'editor-in-chief', 'super-admin'], section: 'main' },
    { key: 'social-media', name: 'الإعلام الاجتماعي', icon: 'megaphone', allowedRoles: ['investigative-journalist', 'editor-in-chief', 'super-admin'], section: 'main' },
    { key: 'indilab', name: 'مختبر المؤشرات', icon: 'beaker', allowedRoles: ['investigative-journalist', 'editor-in-chief', 'super-admin'], section: 'main' },
    { key: 'maps', name: 'الخرائط', icon: 'map-alt', allowedRoles: ['investigative-journalist', 'editor-in-chief', 'super-admin'], section: 'main' },
    { key: 'archiving', name: 'الأرشيف', icon: 'archive-box', allowedRoles: ['investigative-journalist', 'editor-in-chief', 'super-admin'], section: 'main' },
    { key: 'collaboration', name: 'التعاون', icon: 'users', allowedRoles: ['investigative-journalist', 'editor-in-chief', 'super-admin'], section: 'main' },
    { key: 'crm', name: 'إدارة العلاقات (CRM)', icon: 'building-office', allowedRoles: ['super-admin'], section: 'main' },
    { key: 'documentation', name: 'التوثيق', icon: 'book-open', allowedRoles: ['investigative-journalist', 'editor-in-chief', 'super-admin'], section: 'main' },

    // Portal Links
    { key: 'project-management', name: 'إدارة المشاريع', icon: 'briefcase', allowedRoles: ['editor-in-chief', 'super-admin'], section: 'portal' },
    { key: 'violations-observatory', name: 'مرصد الانتهاكات', icon: 'shield-exclamation', allowedRoles: ['investigative-journalist', 'editor-in-chief', 'super-admin'], section: 'portal' },
    { key: 'training', name: 'بوابة التدريب', icon: 'academic-cap', allowedRoles: ['investigative-journalist', 'editor-in-chief', 'super-admin'], section: 'portal' },
    { key: 'tech-support', name: 'دعم الصحفيين', icon: 'lifebuoy', allowedRoles: ['investigative-journalist', 'editor-in-chief', 'super-admin'], section: 'portal' },

    // Admin Links
    { key: 'admin', name: 'التحكم الإداري', icon: 'shield-check', allowedRoles: ['editor-in-chief', 'super-admin'], section: 'admin' },
    { key: 'automation', name: 'الأتمتة المتقدمة', icon: 'bolt', allowedRoles: ['super-admin'], section: 'admin' },
    { key: 'users', name: 'المستخدمون', icon: 'user-plus', allowedRoles: ['super-admin'], section: 'admin' },
    { key: 'settings', name: 'الإعدادات', icon: 'cog-6-tooth', allowedRoles: ['investigative-journalist', 'editor-in-chief', 'super-admin'], section: 'admin' },
    { key: 'system-internals', name: 'بنية النظام', icon: 'server-stack', allowedRoles: ['super-admin'], section: 'admin' },
  ]);

  private visibleLinks = computed(() => {
    const userRole = this.userService.currentUser()?.role;
    if (!userRole) return [];
    
    // Custom logic to show the correct workspace link
    const roleSpecificWorkspaceKey = {
      'investigative-journalist': 'workspace',
      'editor-in-chief': 'editorial',
      'super-admin': 'command-center'
    };

    return this.allLinks().filter(link => {
      // Hide all generic workspace links
      if (['workspace', 'editorial', 'command-center'].includes(link.key)) {
        return link.key === roleSpecificWorkspaceKey[userRole];
      }
      return link.allowedRoles.includes(userRole);
    });
  });

  mainLinks = computed(() => this.visibleLinks().filter(l => l.section === 'main'));
  portalLinks = computed(() => this.visibleLinks().filter(l => l.section === 'portal'));
  adminLinks = computed(() => this.visibleLinks().filter(l => l.section === 'admin'));
}

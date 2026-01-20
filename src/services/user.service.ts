import { Injectable, signal, inject } from '@angular/core';
import { LoggerService } from './logger.service';

export type UserRole = 'super-admin' | 'editor-in-chief' | 'investigative-journalist' | 'public';
export type UserStatus = 'active' | 'suspended';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  status: UserStatus;
  joinedDate: string;
}

// Centralized role definitions
export const ROLES: UserRole[] = ['super-admin', 'editor-in-chief', 'investigative-journalist'];

export const ROLE_DISPLAY_NAMES: { [key in UserRole]: string } = {
  'super-admin': 'مدير عام',
  'editor-in-chief': 'مدير التحرير',
  'investigative-journalist': 'صحفي استقصائي',
  'public': 'زائر'
};

/**
 * Returns the display name for a given user role.
 * @param role The user role key.
 * @returns The Arabic display name for the role.
 */
export function getRoleDisplayName(role: UserRole): string {
  return ROLE_DISPLAY_NAMES[role] || role;
}

const pagePermissions: Record<string, UserRole[]> = {
    'dashboard': ['super-admin', 'editor-in-chief', 'investigative-journalist'],
    'ai-core': ['investigative-journalist'],
    'social-media': ['investigative-journalist'],
    'collaboration': ['investigative-journalist', 'editor-in-chief'],
    'admin': ['super-admin', 'editor-in-chief'],
    'indilab': ['investigative-journalist'],
    'maps': ['investigative-journalist'],
    'archiving': ['investigative-journalist'],
    'users': ['super-admin'],
    'documentation': ['super-admin', 'editor-in-chief', 'investigative-journalist'],
    'settings': ['super-admin', 'editor-in-chief', 'investigative-journalist'],
    'automation': ['super-admin'],
    'profile': ['super-admin', 'editor-in-chief', 'investigative-journalist'],
    'system-internals': ['super-admin'],
    'erp': ['super-admin'],
    'project-management': ['super-admin', 'editor-in-chief'],
    'violations-observatory': ['investigative-journalist', 'editor-in-chief'],
    'training': ['investigative-journalist', 'editor-in-chief'],
    'tech-support': ['super-admin', 'editor-in-chief', 'investigative-journalist'],
};


@Injectable({
  providedIn: 'root',
})
export class UserService {
  private logger = inject(LoggerService);

  isAuthenticated = signal<boolean>(false);
  currentUser = signal<User | null>(null);
  
  // All possible users for simulation
  private users: User[] = [
     { id: 1, name: 'Raidan Al-Huraibi', email: 'raidan@ph-ye.org', role: 'super-admin', avatar: 'assets/team/mohammed-alharibi.jpg', status: 'active', joinedDate: '2024-01-10' },
     { id: 2, name: 'Mazen Fares', email: 'mazen@ph-ye.org', role: 'editor-in-chief', avatar: 'assets/team/mazen-fares.jpg', status: 'active', joinedDate: '2024-02-11' },
     { id: 3, name: 'Ahmed Khalid', email: 'ahmed@example.com', role: 'investigative-journalist', avatar: 'https://i.pravatar.cc/150?u=ahmed', status: 'active', joinedDate: '2024-02-20' }
  ];

  login(role: UserRole = 'investigative-journalist') {
    const user = this.users.find(u => u.role === role) ?? this.users[2];
    
    this.currentUser.set(user);
    this.isAuthenticated.set(true);

    this.logger.logEvent(
      'تسجيل دخول', 
      `تم تفعيل الجلسة بدور: ${getRoleDisplayName(user.role)}.`, 
      user.name,
      user.role === 'super-admin'
    );
  }

  logout() {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
  }
  
  hasPermission(pageKey: string): boolean {
    const userRole = this.currentUser()?.role;
    if (!userRole) {
      return false; // Not logged in
    }
    const allowedRoles = pagePermissions[pageKey];
    if (!allowedRoles) {
      return true; // Assume public page if not in map
    }
    return allowedRoles.includes(userRole);
  }
}

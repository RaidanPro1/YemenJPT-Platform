
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemStatsComponent } from '../system-stats/system-stats.component';

interface SecurityLog {
    id: number;
    timestamp: string;
    level: 'Info' | 'Warning' | 'Critical';
    event: string;
    details: string;
}

@Component({
  selector: 'app-command-center',
  standalone: true,
  imports: [CommonModule, SystemStatsComponent],
  templateUrl: './command-center.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommandCenterComponent {
    logs = signal<SecurityLog[]>([
        { id: 1, timestamp: '10:35:12', level: 'Info', event: 'User Login', details: 'User "Ahmed" logged in successfully.'},
        { id: 2, timestamp: '10:33:05', level: 'Warning', event: 'Failed Login', details: 'Failed login attempt for user "admin" from IP 192.168.1.10.'},
        { id: 3, timestamp: '10:20:41', level: 'Critical', event: 'Service Down', details: 'Archive Service (archivebox) is unresponsive.'},
        { id: 4, timestamp: '09:55:18', level: 'Info', event: 'Tool Disabled', details: 'Tool "Amass" was disabled by "Raidan Al-Huraibi".'},
    ]);
}

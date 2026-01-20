import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Stat {
  name: string;
  value: number;
  unit: string;
  color: string;
}

@Component({
  selector: 'app-system-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './system-stats.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SystemStatsComponent {
  cpuStat = signal<Stat>({ name: 'المعالج', value: 25, unit: '%', color: 'bg-green-500' });
  ramStat = signal<Stat>({ name: 'الذاكرة', value: 60, unit: '%', color: 'bg-yellow-500' });
  diskStat = signal<Stat>({ name: 'التخزين', value: 85, unit: '%', color: 'bg-red-500' });
  networkStat = signal<Stat>({ name: 'الشبكة (تنزيل)', value: 12.5, unit: 'MB/s', color: 'bg-sky-500' });
  
  services = [
    { name: 'Gateway (Traefik)', status: 'Online', color: 'text-green-500' },
    { name: 'AI Core (Ollama)', status: 'Online', color: 'text-green-500' },
    { name: 'Database (Postgres)', status: 'Online', color: 'text-green-500' },
    { name: 'Mail Server', status: 'Degraded', color: 'text-yellow-500' },
    { name: 'Archive Service', status: 'Offline', color: 'text-red-500' },
  ];

  restartService(serviceName: string) {
    // In a real application, this would trigger a backend API call
    // that executes a command like `docker restart <container_name>`
    console.log(`[SIMULATION] Attempting to restart service: ${serviceName}`);
  }
}
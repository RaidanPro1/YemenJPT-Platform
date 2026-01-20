
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  // FIX: Explicitly type injected service to prevent type inference to 'unknown'.
  private http: HttpClient = inject(HttpClient);
  // This URL is now relative to the domain, so it will be proxied by Nginx
  private botApiUrl = '/api/notify';

  logEvent(event: string, details: string, user: string = 'زائر', isRoot: boolean = false) {
    this.http.post(this.botApiUrl, { event, details, user, isRoot }).subscribe({
      next: () => console.log('Event logged to bot server.'),
      error: (err: HttpErrorResponse) => {
        // Log a more descriptive error message instead of [object Object]
        console.error('Failed to log event to bot server:', err.status, err.statusText, err.url);
      }
    });
  }
}

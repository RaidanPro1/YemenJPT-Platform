import { Injectable, signal } from '@angular/core';

export interface Subscriber {
  email: string;
  subscribedAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class NewsletterService {
  subscribers = signal<Subscriber[]>([]);

  constructor() {
    // Load subscribers from localStorage for simulation
    const saved = localStorage.getItem('newsletter-subscribers');
    if (saved) {
      try {
        this.subscribers.set(JSON.parse(saved).map((s: any) => ({...s, subscribedAt: new Date(s.subscribedAt)})));
      } catch(e) {
        console.error('Failed to parse subscribers from localStorage', e);
        localStorage.removeItem('newsletter-subscribers');
      }
    }
  }

  addSubscriber(email: string): { success: boolean, message: string } {
    if (!email || !this.isValidEmail(email)) {
      return { success: false, message: 'البريد الإلكتروني غير صالح.' };
    }
    if (this.subscribers().some(s => s.email === email)) {
      return { success: false, message: 'هذا البريد الإلكتروني مشترك بالفعل.' };
    }

    this.subscribers.update(subs => [...subs, { email, subscribedAt: new Date() }]);
    localStorage.setItem('newsletter-subscribers', JSON.stringify(this.subscribers()));
    return { success: true, message: 'شكراً لاشتراكك!' };
  }
  
  private isValidEmail(email: string): boolean {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
}

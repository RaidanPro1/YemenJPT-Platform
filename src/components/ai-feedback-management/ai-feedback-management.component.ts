
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface AiFeedback {
  id: number;
  prompt: string;
  response: string;
  rating: 'good' | 'bad';
  user: string;
  timestamp: string;
}

@Component({
  selector: 'app-ai-feedback-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-feedback-management.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiFeedbackManagementComponent {
  feedbackEntries = signal<AiFeedback[]>([
    { 
      id: 1, 
      prompt: 'لخص المقال التالي عن الوضع في مأرب...', 
      response: 'الوضع في مأرب يتضمن توترات عسكرية متزايدة و...', 
      rating: 'good', 
      user: 'أحمد خالد', 
      timestamp: '2024-07-20 10:30' 
    },
    { 
      id: 2, 
      prompt: 'ما هي آخر التطورات في عدن؟', 
      response: 'عذراً، لا يمكنني الوصول إلى معلومات آنية...', 
      rating: 'bad', 
      user: 'فاطمة علي', 
      timestamp: '2024-07-19 15:45' 
    }
  ]);

  archiveFeedback(id: number) {
    this.feedbackEntries.update(entries => entries.filter(e => e.id !== id));
    // In a real app, this would mark the feedback as archived or send it to a training pipeline.
    console.log(`Archiving feedback ID: ${id}`);
  }
}

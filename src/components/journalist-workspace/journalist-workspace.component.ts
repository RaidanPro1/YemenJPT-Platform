import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiService } from '../../services/gemini.service';
import { TranslationService } from '../../services/translation.service';
import { Content } from '@google/genai';

interface Investigation {
  id: number;
  title: string;
  status: 'مسودة' | 'قيد المراجعة' | 'نُشر';
  lastUpdated: string;
}

interface IndiLabAlert {
  id: number;
  text: string;
  timestamp: string;
}

interface Message {
  id: number;
  text: string;
  from: 'user' | 'ai';
}

@Component({
  selector: 'app-journalist-workspace',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './journalist-workspace.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JournalistWorkspaceComponent {
  private geminiService = inject(GeminiService);
  private translationService = inject(TranslationService);

  investigations = signal<Investigation[]>([
    { id: 1, title: 'تحقيق: شبكات التهريب عبر السواحل', status: 'قيد المراجعة', lastUpdated: '2024-07-22' },
    { id: 2, title: 'مسودة: تأثير انقطاع الإنترنت على التعليم', status: 'مسودة', lastUpdated: '2024-07-20' },
    { id: 3, title: 'تحليل: بيانات الطيران فوق مأرب', status: 'مسودة', lastUpdated: '2024-07-18' },
  ]);

  alerts = signal<IndiLabAlert[]>([
    { id: 1, text: 'تغير مفاجئ في بيانات صرف العملة في عدن', timestamp: 'منذ 3 ساعات' },
    { id: 2, text: 'رصد تشويش GPS عالي الكثافة بالقرب من ميناء الحديدة', timestamp: 'منذ 8 ساعات' },
    { id: 3, text: 'زيادة بنسبة 200% في عمليات البحث عن كلمة "أزمة وقود" في صنعاء', timestamp: 'منذ 12 ساعة' },
  ]);

  // New state for embedded chat
  messages = signal<Message[]>([{ id: Date.now(), text: 'أهلاً بك. كيف يمكنني المساعدة في بحثك اليوم؟', from: 'ai' }]);
  isTyping = signal(false);
  chatError = signal<string>('');

  async handleSend(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const input = form.querySelector('input');
    if (!input || !input.value) return;

    const userMessageText = input.value;
    const userMessage: Message = { id: Date.now(), text: userMessageText, from: 'user' };
    this.messages.update(m => [...m, userMessage]);
    input.value = '';
    this.isTyping.set(true);
    this.chatError.set('');

    const history: Content[] = this.messages().slice(0, -1).map(msg => ({
      role: msg.from === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    try {
      const response = await this.geminiService.getChatResponse(history, userMessageText);
      const aiResponseText = response.text;
      if (aiResponseText) {
        const aiMessage: Message = { id: Date.now(), text: aiResponseText, from: 'ai' };
        this.messages.update(m => [...m, aiMessage]);
      }
    } catch (error) {
      console.error("Error getting chat response:", error);
      const errorMessage = this.translationService.translate('gemini_error');
      const aiMessage: Message = { id: Date.now(), text: errorMessage, from: 'ai' };
      this.messages.update(m => [...m, aiMessage]);
    } finally {
      this.isTyping.set(false);
    }
  }
}

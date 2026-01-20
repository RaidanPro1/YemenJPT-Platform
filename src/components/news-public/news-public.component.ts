import { Component, ChangeDetectionStrategy, output, signal, OnDestroy, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Slide {
  imageUrl: string;
  category: string;
  title: string;
  subtitle: string;
  actionText: string;
}

@Component({
  selector: 'app-news-public',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news-public.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsPublicComponent implements OnDestroy {
  login = output<void>();

  slides = signal<Slide[]>([
    {
      imageUrl: 'assets/images/news/investigation.jpg',
      category: 'تحقيق استقصائي',
      title: 'تحقيق: شبكات التهريب عبر السواحل وأثرها على الاقتصاد المحلي',
      subtitle: 'يكشف هذا التحقيق الذي استمر ستة أشهر عن شبكات معقدة لتهريب الأسلحة والوقود عبر السواحل اليمنية...',
      actionText: 'اقرأ المزيد',
    },
    {
      imageUrl: 'assets/images/news/education.jpg',
      category: 'تقرير',
      title: 'تأثير انقطاع الإنترنت على قطاع التعليم في اليمن',
      subtitle: 'تقرير يسلط الضوء على التحديات التي يواجهها الطلاب والمعلمون بسبب ضعف البنية التحتية للاتصالات.',
      actionText: 'اقرأ المزيد',
    },
    {
      imageUrl: 'assets/images/news/training.jpg',
      category: 'خبر',
      title: 'بيت الصحافة يختتم دورة تدريبية حول الأمان الرقمي للصحفيين',
      subtitle: 'شارك في الدورة 20 صحفياً وصحفية من مختلف المحافظات اليمنية لتعزيز مهاراتهم في حماية أنفسهم رقمياً.',
      actionText: 'اقرأ المزيد',
    },
  ]);
  currentSlide = signal(0);
  private intervalId: any;

  constructor() {
    afterNextRender(() => {
      this.startAutoSlider();
    });
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  startAutoSlider() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  nextSlide() {
    this.currentSlide.update(s => (s + 1) % this.slides().length);
  }

  prevSlide() {
    this.currentSlide.update(s => (s - 1 + this.slides().length) % this.slides().length);
  }

  goToSlide(index: number) {
    this.currentSlide.set(index);
    clearInterval(this.intervalId);
    this.startAutoSlider();
  }

  onLogin() {
    this.login.emit();
  }
}

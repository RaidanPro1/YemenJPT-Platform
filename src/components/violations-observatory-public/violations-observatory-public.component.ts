import { Component, ChangeDetectionStrategy, output, signal, OnDestroy, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Slide {
  imageUrl: string;
  title: string;
  subtitle: string;
  actionText: string;
}

@Component({
  selector: 'app-violations-observatory-public',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './violations-observatory-public.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViolationsObservatoryPublicComponent implements OnDestroy {
  login = output<void>();

  slides = signal<Slide[]>([
    {
      imageUrl: 'assets/images/violations/observatory-1.jpg',
      title: 'مرصد الانتهاكات الصحفية',
      subtitle: 'توثيق، تحليل، وعرض الانتهاكات بحق الصحفيين والمؤسسات الإعلامية في اليمن.',
      actionText: 'الوصول لقاعدة البيانات',
    },
    {
      imageUrl: 'assets/images/violations/report.jpg',
      title: 'بلّغ عن انتهاك بسرية تامة',
      subtitle: 'نظام آمن لاستقبال البلاغات من الصحفيين والمراقبين لحماية المصادر.',
      actionText: 'قدم بلاغاً الآن',
    },
    {
      imageUrl: 'assets/images/violations/analysis.jpg',
      title: 'استكشف التقارير التفاعلية',
      subtitle: 'تصفح تحليلاتنا الدورية ولوحات المعلومات التفاعلية لفهم حالة حرية الصحافة.',
      actionText: 'عرض التقارير',
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

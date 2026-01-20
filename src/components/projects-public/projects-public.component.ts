import { Component, ChangeDetectionStrategy, output, signal, OnDestroy, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Slide {
  imageUrl: string;
  title: string;
  subtitle: string;
  actionText: string;
}

@Component({
  selector: 'app-projects-public',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects-public.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsPublicComponent implements OnDestroy {
  login = output<void>();

  slides = signal<Slide[]>([
    {
      imageUrl: 'assets/images/about/slider-1.jpg',
      title: 'مشاريعنا',
      subtitle: 'مبادرات استراتيجية لدعم وتمكين الصحافة والصحفيين في اليمن.',
      actionText: 'استكشف المشاريع',
    },
    {
      imageUrl: 'assets/images/projects/yemenjpt.jpg',
      title: 'مشروع منصة YemenJPT',
      subtitle: 'بيئة عمل رقمية سيادية ومؤمنة، مصممة خصيصاً لتمكين الصحافة الاستقصائية في اليمن.',
      actionText: 'اعرف المزيد عن المنصة',
    },
    {
      imageUrl: 'assets/images/projects/training.jpg',
      title: 'مشروع برامج التدريب والتطوير',
      subtitle: 'دورات تدريبية متخصصة لرفع كفاءة الصحفيين اليمنيين في مجالات حيوية.',
      actionText: 'عرض برامج التدريب',
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

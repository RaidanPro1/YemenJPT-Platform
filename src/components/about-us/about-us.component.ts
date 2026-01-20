import { Component, ChangeDetectionStrategy, signal, OnDestroy, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Slide {
  imageUrl: string;
  title: string;
  subtitle: string;
}

interface TeamMember {
  name: string;
  title: string;
  imageUrl: string;
}

interface Partner {
  name: string;
  logoUrl: string;
}

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-us.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutUsComponent implements OnDestroy {
  
  slides = signal<Slide[]>([
    {
      imageUrl: 'assets/images/about/slider-1.jpg',
      title: 'مؤسسة بيت الصحافة',
      subtitle: 'مؤسسة مجتمع مدني تهدف إلى تعزيز حرية الإعلام وخلق مساحة نقاش مهني وعملي للصحفيين والصحفيات.',
    },
    {
      imageUrl: 'assets/images/about/slider-2.jpg',
      title: 'رؤيتنا',
      subtitle: 'صحافة مهنية حرة أولويتها الإنسان.',
    },
    {
      imageUrl: 'assets/images/about/slider-3.jpg',
      title: 'رسالتنا',
      subtitle: 'أن نصبح المؤسسة الأولى في تعزيز حرية الصحافة والدفاع عن الإنسان أولاً وأخيراً.',
    },
  ]);
  currentSlide = signal(0);
  private intervalId: any;

  team = signal<TeamMember[]>([
    { name: 'محمد الحريبي', title: 'رئيس المؤسسة', imageUrl: 'assets/team/mohammed-alharibi.jpg' },
    { name: 'مازن فارس', title: 'المدير التنفيذي', imageUrl: 'assets/team/mazen-fares.jpg' },
    { name: 'الفتح العيسائي', title: 'مدير البرامج', imageUrl: 'assets/team/alfateh-alissai.jpg' },
    { name: 'مكين العوجري', title: 'مدير وحدة المالية', imageUrl: 'assets/team/makeen-alawjari.jpg' },
    { name: 'رانيا عبدالله', title: 'وحدة العمليات', imageUrl: 'assets/team/rania-abdullah.jpg' },
    { name: 'أبرار مصطفى', title: 'العلاقات العامة', imageUrl: 'assets/team/abrar-mustafa.jpg' },
    { name: 'أحمد منعم', title: 'إدارة الإعلام', imageUrl: 'assets/team/ahmed-monem.jpg' },
    { name: 'محمد الصلاحي', title: 'مدير وحدة الرصد', imageUrl: 'assets/team/mohammed-alsalahi.jpg' },
    { name: 'إيهاب العبسي', title: 'متابعة وتقييم', imageUrl: 'assets/team/ehab-alabsi.jpg' },
    { name: 'نعمة البرحي', title: 'الموارد البشرية', imageUrl: 'assets/team/naama-albarhi.png' },
  ]);

  advisors = signal<TeamMember[]>([
    { name: 'أ. زكريا الكمالي', title: 'عضو الهيئة الاستشارية', imageUrl: 'assets/advisors/zakaria-alkamali.jpg' },
    { name: 'د. منصور القدسي', title: 'عضو الهيئة الاستشارية', imageUrl: 'assets/advisors/mansour-alqudsi.jpg' },
    { name: 'أ. وداد البدوي', title: 'عضو الهيئة الاستشارية', imageUrl: 'assets/advisors/wedad-albadawi.jpg' },
    { name: 'أ. سعيد الصوفي', title: 'عضو الهيئة الاستشارية', imageUrl: 'assets/advisors/saeed-alsoufi.jpg' },
    { name: 'أ. بسام غبر', title: 'عضو الهيئة الاستشارية', imageUrl: 'assets/advisors/bassam-ghobber.jpg' },
  ]);

  partners = signal<Partner[]>([
    { name: 'YoopYupFact', logoUrl: 'assets/logos/partners/yoopyupfact.png' },
    { name: 'Qarar Foundation', logoUrl: 'assets/logos/partners/qarar.png' },
    { name: 'Arnyada Foundation', logoUrl: 'assets/logos/partners/arnyada.png' },
    { name: 'Wahaj Youth Bloc', logoUrl: 'assets/logos/partners/wahaj.png' },
    { name: 'Alef Center', logoUrl: 'assets/logos/partners/alef.png' },
  ]);

  objectives = [
      'إيجاد مساحات نقاش عملية ومهنية للصحفيات والصحفيين.',
      'توفير حاضنة أعمال صحفية لتحسين جودة حياتهم.',
      'الدفاع عن حرية الصحافة والسعي لتطوير العمل الصحفي.',
      'تقديم صحافة مهنية متطورة تخدم الإنسان أولاً وأخيراً.',
      'الارتقاء بقدرات الصحفيات والصحفيين في مختلف المجالات.',
      'تفعيل القدرات التقييمية لتطوير المادة الإعلامية.',
      'خلق آليات شراكة وتشبيك مع الجامعات.',
      'المساهمة في رصد الانتهاكات ضد الصحفيين.',
      'ربط المجتمع الصحفي اليمني بنظرائه في الدول العربية والعالم.'
  ];

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
    clearInterval(this.intervalId); // Reset timer
    this.startAutoSlider();
  }
}

import { Component, ChangeDetectionStrategy, inject, output, computed, signal, OnDestroy, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolService } from '../../services/tool.service';
import { TrialService } from '../../services/trial.service';
import { ToolCardComponent } from '../tool-card/tool-card.component';
import { LoginModalComponent } from '../login-modal/login-modal.component';

interface Slide {
  imageUrl: string;
  title: string;
  subtitle: string;
  actionText: string;
  actionLink: string;
  actionIsExternal?: boolean;
}

interface QuickLink {
  key: string;
  title: string;
  description: string;
  icon: string;
}

interface Objective {
  title: string;
  icon: string;
}

interface Project {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
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
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ToolCardComponent, LoginModalComponent],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnDestroy {
  private toolService = inject(ToolService);
  private trialService = inject(TrialService);
  
  login = output<void>();
  navigate = output<string>();
  
  trial = this.trialService;

  slides = signal<Slide[]>([
    // Core
    {
      imageUrl: 'assets/images/about/slider-1.jpg',
      title: 'بيت الصحافة - اليمن',
      subtitle: 'صحافة مهنية حرة أولويتها الإنسان. نعمل على تمكين الصحفيين وحماية حرياتهم في اليمن.',
      actionText: 'اعرف المزيد عنا',
      actionLink: 'about',
    },
    {
      imageUrl: 'assets/images/about/slider-2.jpg',
      title: 'اكتشف أدوات المنصة',
      subtitle: 'مجموعة متكاملة من أدوات التقصي، التحقق، والتحليل مصممة خصيصاً للصحفي اليمني.',
      actionText: 'استكشف الأدوات الآن',
      actionLink: '#tools',
    },
    // Violations Observatory
    {
      imageUrl: 'assets/images/violations/observatory-1.jpg',
      title: 'مرصد الانتهاكات الصحفية',
      subtitle: 'توثيق، تحليل، وعرض الانتهاكات بحق الصحفيين والمؤسسات الإعلامية في اليمن.',
      actionText: 'ادخل إلى المرصد',
      actionLink: 'violations-observatory-public',
    },
    {
      imageUrl: 'assets/images/violations/report.jpg',
      title: 'بلّغ عن انتهاك بسرية تامة',
      subtitle: 'نظام آمن لاستقبال البلاغات من الصحفيين والمراقبين لحماية المصادر.',
      actionText: 'قدم بلاغاً الآن',
      actionLink: 'violations-observatory-public',
    },
    // Training
    {
      imageUrl: 'assets/images/training/portal-1.jpg',
      title: 'بوابة التدريب والتطوير',
      subtitle: 'تمكين الصحفيين بأدوات ومهارات العصر الرقمي.',
      actionText: 'تصفح الدورات المتاحة',
      actionLink: 'training-portal-public',
    },
    {
      imageUrl: 'assets/images/training/digital-security.jpg',
      title: 'دورة الأمان الرقمي للصحفيين',
      subtitle: 'تعلم كيفية حماية اتصالاتك، تأمين أجهزتك، والتصفح الآمن أثناء عملك.',
      actionText: 'التسجيل في الدورة',
      actionLink: 'training-portal-public',
    },
    // Tech Support
    {
      imageUrl: 'assets/images/support/portal-1.jpg',
      title: 'بوابة دعم الصحفيين',
      subtitle: 'ملاذ آمن للصحفيين للحصول على المساعدة التقنية والقانونية الطارئة.',
      actionText: 'اطلب المساعدة الآن',
      actionLink: 'tech-support-public',
    },
    {
      imageUrl: 'assets/images/support/legal.jpg',
      title: 'مساعدة قانونية عاجلة',
      subtitle: 'هل تواجه ملاحقة قضائية بسبب عملك؟ تواصل مع شبكة المحامين المتخصصين لدينا.',
      actionText: 'احصل على دعم قانوني',
      actionLink: 'tech-support-public',
    },
    // Projects
    {
      imageUrl: 'assets/images/projects/yemenjpt.jpg',
      title: 'مشروع منصة بيت الصحافة',
      subtitle: 'بيئة عمل رقمية سيادية ومؤمنة، مصممة خصيصاً لتمكين الصحافة الاستقصائية في اليمن.',
      actionText: 'اعرف المزيد عن المنصة',
      actionLink: 'projects-public',
    },
  ]);
  currentSlide = signal(0);
  private intervalId: any;

  quickLinks = signal<QuickLink[]>([
    {
      key: 'violations-observatory-public',
      title: 'مرصد الانتهاكات',
      description: 'توثيق وتحليل الانتهاكات ضد الصحفيين والمؤسسات الإعلامية في اليمن.',
      icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.007H12v-.007Z'
    },
    {
      key: 'training-portal-public',
      title: 'بوابة التدريب',
      description: 'تمكين الصحفيين بأدوات ومهارات العصر الرقمي من خلال دورات متخصصة.',
      icon: 'M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5'
    },
    {
      key: 'tech-support-public',
      title: 'دعم الصحفيين',
      description: 'ملاذ آمن للحصول على المساعدة التقنية والقانونية الطارئة.',
      icon: 'M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z'
    },
    {
      key: 'news-public',
      title: 'الأخبار والتقارير',
      description: 'آخر التحقيقات والتقارير الصادرة عن بيت الصحافة وشركائه.',
      icon: 'M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5'
    }
  ]);

  objectives = signal<Objective[]>([
    { title: 'إيجاد مساحات نقاش عملية ومهنية للصحفيين', icon: 'M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 0 1-2.53-.423l-4.28 1.07a.375.375 0 0 1-.427-.427l1.07-4.28A9.756 9.756 0 0 1 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z' },
    { title: 'توفير حاضنة أعمال صحفية لتحسين جودة حياتهم', icon: 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6h1.5m-1.5 3h1.5m-1.5 3h1.5M15 21v-3.375c0-.621-.504-1.125-1.125-1.125H10.125c-.621 0-1.125.504-1.125 1.125V21' },
    { title: 'الدفاع عن حرية الصحافة وتطوير العمل الصحفي', icon: 'M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z' },
    { title: 'تقديم صحافة مهنية متطورة تخدم الإنسان', icon: 'M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5' },
    { title: 'الارتقاء بقدرات الصحفيين في مختلف المجالات', icon: 'M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347' },
    { title: 'تفعيل القدرات التقييمية لتطوير المادة الإعلامية', icon: 'M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 1.083-1.558 1.685-1.558 1.686M8.25 16.5l1-1.083 1.558-1.685 1.558-1.686m0 4.455 1 1.083 1.558 1.685 1.558 1.686M15.75 16.5l-1-1.083-1.558-1.685-1.558-1.686M9 21h6' },
    { title: 'خلق آليات شراكة وتشبيك مع الجامعات', icon: 'M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L12 14.25l-5.571-3Z' },
    { title: 'المساهمة في رصد الانتهاكات ضد الصحفيين', icon: 'M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z' },
    { title: 'ربط المجتمع الصحفي اليمني بنظرائه في العالم', icon: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M4.635 15.635a9 9 0 1 0 12.728 0M12 3v18' },
  ]);

  featuredProjects = signal<Project[]>([
    { title: 'مشروع احياء القيم الصحفية', description: 'يهدف المشروع إلى إحياء ذكرى أعلام الصحافة في اليمن والاحتفاء بالقيم التي تمثلوها ليصبحوا رموزاً يشار إليهم.', imageUrl: 'assets/images/projects/values.jpg', link: 'projects-public' },
    { title: 'مشروع قوة الذكاء الاصطناعي بمسؤولية', description: 'تدريب الصحفيين وطلاب الإعلام على استخدام أدوات الذكاء الاصطناعي في العمل الصحفي بمسؤولية وأخلاقية.', imageUrl: 'assets/images/projects/ai.jpg', link: 'projects-public' },
    { title: 'مشروع إنهاء الإفلات من العقاب', description: 'التأكيد على أهمية ضمان عدم إفلات مرتكبي الانتهاكات ضد الصحفيين من العقاب وتوثيق القضايا بشكل قانوني.', imageUrl: 'assets/images/projects/impunity.jpg', link: 'projects-public' },
  ]);

  team = signal<TeamMember[]>([
    { name: 'محمد الحريبي', title: 'رئيس المؤسسة', imageUrl: 'assets/team/mohammed-alharibi.jpg' },
    { name: 'مازن فارس', title: 'المدير التنفيذي', imageUrl: 'assets/team/mazen-fares.jpg' },
    { name: 'الفتح العيسائي', title: 'مدير البرامج', imageUrl: 'assets/team/alfateh-alissai.jpg' },
    { name: 'أبرار مصطفى', title: 'العلاقات العامة', imageUrl: 'assets/team/abrar-mustafa.jpg' },
    { name: 'أحمد منعم', title: 'إدارة الإعلام', imageUrl: 'assets/team/ahmed-monem.jpg' },
  ]);

  partners = signal<Partner[]>([
    { name: 'YoopYupFact', logoUrl: 'assets/logos/partners/yoopyupfact.png' },
    { name: 'Qarar Foundation', logoUrl: 'assets/logos/partners/qarar.png' },
    { name: 'Arnyada Foundation', logoUrl: 'assets/logos/partners/arnyada.png' },
    { name: 'Wahaj Youth Bloc', logoUrl: 'assets/logos/partners/wahaj.png' },
    { name: 'Alef Center', logoUrl: 'assets/logos/partners/alef.png' },
  ]);

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

  showcasedTools = computed(() => {
    const allTools = this.toolService.tools();
    const toolIds = [
      'searxng', 
      'sherlock-maigret', 
      'invid-weverify', 
      'ai-fact-checker', 
      'whisper', 
      'haystack', 
      'social-analyzer', 
      'telegram-scraper', 
      'adsb-exchange', 
      'nasa-firms', 
      'changedetection', 
      'deepfake-detector'
    ];
    return toolIds.map(id => allTools.find(t => t.id === id)).filter(t => t && t.isVisiblePublicly);
  });

  onLogin() {
    this.login.emit();
  }

  onNavigate(page: string) {
    if (page.startsWith('#')) {
      document.querySelector(page)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      this.navigate.emit(page);
    }
  }

  handleTrialClick() {
    this.trialService.recordInteraction();
  }
}

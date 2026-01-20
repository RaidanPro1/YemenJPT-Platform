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
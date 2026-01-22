import { Component, ChangeDetectionStrategy, signal, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

interface QuickAccessTool {
  id: string;
  name: string;
  description: string;
  icon: string;
  url: string;
}

interface NewsroomService {
  name: string;
  status: 'Online' | 'Degraded' | 'Offline';
  url: string;
}

interface KnowledgeBaseArticle {
  title: string;
  summary: string;
  urlKey: string;
}

interface ActivityItem {
  user: string;
  avatar: string;
  action: string;
  target: string;
  time: string;
}

@Component({
  selector: 'app-journalist-workspace',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './journalist-workspace.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JournalistWorkspaceComponent {
  navigate = output<string>();

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

  quickAccessTools = signal<QuickAccessTool[]>([
    { id: 'ai-assistant', name: 'المساعد الذكي', description: 'YemenJPT للبحث والتحليل', icon: 'robot', url: 'https://ai-ui.ph-ye.org' },
    { id: 'searxng', name: 'البحث الآمن', description: 'محرك بحث خاص لا يتتبعك', icon: 'search', url: 'https://search.ph-ye.org' },
    { id: 'webtop', name: 'المتصفح الآمن', description: 'لتصفح المواقع المشبوهة بأمان', icon: 'window-maximize', url: 'https://browser.ph-ye.org' },
    { id: 'mattermost', name: 'منصة التعاون', description: 'للتواصل مع فريق العمل', icon: 'comments', url: 'https://chat.ph-ye.org' },
    { id: 'nextcloud', name: 'الملفات الآمنة', description: 'لتخزين ومشاركة المستندات', icon: 'cloud', url: 'https://files.ph-ye.org' },
    { id: 'libretranslate', name: 'الترجمة الآمنة', description: 'ترجمة النصوص والمستندات بسرية', icon: 'language', url: 'https://translate.ph-ye.org' },
  ]);

  newsroomServices = signal<NewsroomService[]>([
    { name: 'منصة التعاون (Chat)', status: 'Online', url: 'https://chat.ph-ye.org' },
    { name: 'المكتب السحابي (Files)', status: 'Online', url: 'https://files.ph-ye.org' },
    { name: 'المتصفح الآمن (Browser)', status: 'Degraded', url: 'https://browser.ph-ye.org' },
    { name: 'أرشيف الويب (Archive)', status: 'Online', url: 'https://archive.ph-ye.org' },
  ]);
  
  knowledgeBaseSpotlight = signal<KnowledgeBaseArticle>({
    title: 'دليل التحليل الجنائي الرقمي للوسائط',
    summary: 'سير عمل مقترح للتحقق من صحة الصور ومقاطع الفيديو باستخدام أدوات InVID, ExifTool, و FotoForensics.',
    urlKey: 'documentation'
  });

  activityFeed = signal<ActivityItem[]>([
    { user: 'أحمد خالد', avatar: 'https://i.pravatar.cc/150?u=ahmed', action: 'أضاف مهمة جديدة:', target: 'جمع شهادات من شهود عيان', time: 'منذ 25 دقيقة' },
    { user: 'فاطمة علي', avatar: 'https://i.pravatar.cc/150?u=fatima', action: 'رفع ملف جديد:', target: 'تقرير مبدئي.docx', time: 'منذ ساعة' },
    { user: 'أنت', avatar: 'assets/team/mohammed-alharibi.jpg', action: 'أرسلت رسالة في نقاش:', target: 'تحقيق انتهاكات 2024', time: 'منذ 3 ساعات' },
  ]);

  onNavigate(pageKey: string) {
    this.navigate.emit(pageKey);
  }
}
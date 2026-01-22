import { Injectable, signal, inject } from '@angular/core';
import { Tool } from '../models/tool.model';
import { LoggerService } from './logger.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class ToolService {
  private logger = inject(LoggerService);
  private userService = inject(UserService);

  tools = signal<Tool[]>([
    // 1. AI Core
    {
      id: 'ai-assistant',
      name: 'المساعد الذكي',
      englishName: 'AI Assistant (Cloud/Local)',
      category: 'النواة المعرفية والتحليل الذكي',
      description: 'نموذج لغوي يمكنه العمل سحابياً أو محلياً للإجابة على الأسئلة، تلخيص النصوص، والمساعدة في صياغة التقارير.',
      iconSvg: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09ZM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456Z',
      iconColor: 'text-ph-blue',
      isActive: true, isFavorite: true, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief'],
    },
    {
      id: 'whisper',
      name: 'التفريغ الصوتي',
      englishName: 'Audio Transcription',
      category: 'النواة المعرفية والتحليل الذكي',
      description: 'نظام فائق الدقة لتحويل التسجيلات الصوتية ومقاطع الفيديو إلى نصوص مكتوبة، مع دعم متخصص ومُحسَّن لمختلف اللهجات اليمنية.',
      iconSvg: 'M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zM17 8h-1.35c-.32 3.11-2.94 5.5-6.15 5.5S3.67 11.11 3.35 8H2c.36 3.82 3.24 6.88 7 7.29V19H5v2h14v-2h-4v-3.71c3.76-.41 6.64-3.47 7-7.29z',
      iconColor: 'text-cyan-500',
      isActive: true, isFavorite: true, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief'],
    },
    { id: 'haystack', name: 'اسأل وثائقك', englishName: 'Haystack (Document AI)', category: 'النواة المعرفية والتحليل الذكي', description: 'نظام يمكنك من "الدردشة مع بياناتك". ارفع ملفات (PDF, DOCX) واسأل الذكاء الاصطناعي أسئلة مباشرة عن محتواها.', iconSvg: 'M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z', iconColor: 'text-yellow-600', isActive: true, isFavorite: false, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief'] },

    // 2. OSINT
    {
      id: 'searxng',
      name: 'محرك البحث الآمن',
      englishName: 'SearXNG Metasearch',
      category: 'التقصي والاستخبارات مفتوحة المصدر',
      description: 'محرك بحث "ميتا" يجمع النتائج من جوجل ومصادر أخرى دون تتبعك أو تسجيل ما تبحث عنه، مما يوفر طبقة حماية أساسية لعمليات البحث الاستقصائي.',
      iconSvg: 'm21.71 20.29-5.23-5.23A8 8 0 1 0 15 16.42l5.29 5.29a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42zM4 10a6 6 0 1 1 6 6a6 6 0 0 1-6-6z',
      iconColor: 'text-emerald-500',
      isActive: true, isFavorite: true, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief', 'public'],
    },
    {
      id: 'sherlock-maigret',
      name: 'أداة Sherlock',
      englishName: 'Username Search',
      category: 'التقصي والاستخبارات مفتوحة المصدر',
      description: 'أداة متخصصة للبحث عن أسماء المستخدمين عبر مئات منصات التواصل الاجتماعي والمواقع الإلكترونية لرسم خريطة البصمة الرقمية للأفراد.',
      iconSvg: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-4.683c.65-.935 1-2.104 1-3.328M3 4.5a5.25 5.25 0 0 1 10.5 0v.75a5.25 5.25 0 0 1-10.5 0v-.75z',
      iconColor: 'text-violet-500',
      isActive: true, isFavorite: true, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief'],
    },
    {
      id: 'spiderfoot',
      name: 'أداة SpiderFoot',
      englishName: 'OSINT Automation',
      category: 'التقصي والاستخبارات مفتوحة المصدر',
      description: 'منصة أتمتة لعمليات الاستخبارات مفتوحة المصدر لرسم البصمة الرقمية لشخص أو منظمة.',
      iconSvg: 'M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4l1.4-1.4M17 7l1.4-1.4M9 12a3 3 0 1 1 6 0 3 3 0 0 1-6 0',
      iconColor: 'text-pink-500',
      isActive: true, isFavorite: false, isVisiblePublicly: false, allowedRoles: ['super-admin', 'investigative-journalist'],
    },
    
    // 3. Social Media Analysis
    {
      id: 'social-analyzer',
      name: 'المحلل الاجتماعي',
      englishName: 'Social Analyzer',
      category: 'تحليل الإعلام الاجتماعي',
      description: 'أداة لتحليل البصمة الرقمية والبحث عن الحسابات المرتبطة بشخص ما عبر أكثر من 1000 منصة تواصل اجتماعي.',
      iconSvg: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
      iconColor: 'text-blue-500',
      isActive: true, isFavorite: true, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief']
    },
    
    // 4. Verification
    { id: 'meedan-check', name: 'منصة Meedan Check', englishName: 'Fact-Checking Platform', category: 'التحقق وكشف التزييف', description: 'منصة تعاونية للتحقق من الأخبار والوسائط، تستخدمها غرف الأخبار لإدارة البلاغات والتحقيقات.', iconSvg: 'M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z', iconColor: 'text-green-600', isActive: true, isFavorite: false, isVisiblePublicly: false, allowedRoles: ['editor-in-chief', 'super-admin'] },
    
    // 5. Maps & Geospatial
    { id: 'ushahidi', name: 'الرصد الميداني (Ushahidi)', englishName: 'Crowdsourced Reporting', category: 'الخرائط والرصد الجغرافي', description: 'منصة للرصد الجماعي وجمع البلاغات من الميدان ورسمها على الخرائط.', iconSvg: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z', iconColor: 'text-red-500', isActive: true, isFavorite: false, isVisiblePublicly: false, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief'] },
    
    // 6. Archiving
    { id: 'archivebox', name: 'الأرشيف الدائم', englishName: 'ArchiveBox', category: 'الأرشفة والتوثيق الرقمي', description: 'لحفظ نسخ دائمة من صفحات الويب لضمان بقاء الأدلة الرقمية حتى لو حُذفت المصادر الأصلية.', iconSvg: 'M3.75 9.75h16.5v1.5H3.75v-1.5Z M4.5 3.75h15v1.5h-15v-1.5Z M3 19.5h18V21H3v-1.5Z M3.75 14.25h16.5v1.5H3.75v-1.5Z', iconColor: 'text-indigo-500', isActive: true, isFavorite: true, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist'] },
    { id: 'changedetection', name: 'راصد التغييرات', englishName: 'ChangeDetection.io', category: 'الأرشفة والتوثيق الرقمي', description: 'أداة لمراقبة صفحات الويب وإرسال تنبيهات عند حدوث أي تغييرات في محتواها.', iconSvg: 'M12 4.5C7.305 4.5 3.197 7.633 1.5 12c1.697 4.367 5.805 7.5 10.5 7.5s8.803-3.133 10.5-7.5C20.803 7.633 16.695 4.5 12 4.5zm0 10.5a3 3 0 1 1 0-6 3 3 0 0 1 0 6z', iconColor: 'text-orange-500', isActive: true, isFavorite: true, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief'] },
    
    // 7. Automation
    { id: 'n8n', name: 'منصة الأتمتة (n8n)', englishName: 'Workflow Automation', category: 'الأتمتة وسير العمل', description: 'بناء تدفقات عمل آلية لربط الأدوات المختلفة وأتمتة المهام المتكررة.', iconSvg: 'm13.42 17.58-2.83-2.83 2.83-2.83-1.41-1.41-2.83 2.83-2.83-2.83-1.41 1.41 2.83 2.83-2.83 2.83 1.41 1.41 2.83-2.83 2.83 2.83zM3 3h18v2H3zm11 15h5v2h-5zm-7-1h2v2H7z', iconColor: 'text-purple-600', isActive: true, isFavorite: false, isVisiblePublicly: false, allowedRoles: ['super-admin'] },
  ]);

  toggleToolStatus(toolId: string) {
    this.tools.update(tools =>
      tools.map(tool =>
        tool.id === toolId ? { ...tool, isActive: !tool.isActive } : tool
      )
    );
    const tool = this.tools().find(t => t.id === toolId);
    if (tool) {
        this.logger.logEvent(
            `Tool Status Changed: ${tool.name}`,
            `New status: ${tool.isActive ? 'Active' : 'Inactive'}`,
            this.userService.currentUser()?.name,
            this.userService.currentUser()?.role === 'super-admin'
        );
    }
  }

  toggleFavoriteStatus(toolId: string) {
    this.tools.update(tools =>
      tools.map(tool =>
        tool.id === toolId ? { ...tool, isFavorite: !tool.isFavorite } : tool
      )
    );
  }

  updateTool(toolId: string, updates: Partial<Tool>) {
    this.tools.update(tools =>
      tools.map(tool =>
        tool.id === toolId ? { ...tool, ...updates } : tool
      )
    );
  }
}

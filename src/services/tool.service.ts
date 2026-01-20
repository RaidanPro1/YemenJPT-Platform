
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
      description: 'نموذج لغوي يمكنه العمل سحابياً أو محلياً للإجابة على الأسئلة، تلخيص النصوص، والمساعدة في صياغة التقارير. يمكن تشغيله بنماذج مختلفة مثل OpenAssistant عبر محرك Ollama المحلي.',
      iconSvg: 'M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72-3.72a1.054 1.054 0 00-1.49 0L12 14.47l-2.06-2.061a1.054 1.054 0 00-1.49 0L4.72 16.146C3.654 16.052 2.75 15.118 2.75 14v-4.286c0-.97.616-1.813 1.5-2.097m16.5 0c1.868.592 3.25 2.28 3.25 4.185v4.286c0 2.28-1.853 4.14-4.14 4.235l.01-.01-4.72-4.72a1.054 1.054 0 00-1.49 0L12 15.939l-2.06-2.061a1.054 1.054 0 00-1.49 0l-4.72 4.72.01.01C3.853 20.14 2 18.28 2 16v-4.286c0-1.905 1.382-3.593 3.25-4.185m12.75 0A9.753 9.753 0 0012 5.25c-1.472 0-2.842.368-4.085 1.011',
      iconColor: 'text-ph-blue',
      // FIX: Updated user roles to match UserRole type
      isActive: true, isFavorite: true, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief'],
    },
    {
      id: 'whisper',
      name: 'التفريغ الصوتي',
      englishName: 'Audio Transcription',
      category: 'النواة المعرفية والتحليل الذكي',
      description: 'نظام فائق الدقة لتحويل التسجيلات الصوتية ومقاطع الفيديو إلى نصوص مكتوبة، مع دعم متخصص ومُحسَّن لمختلف اللهجات اليمنية.',
      iconSvg: 'M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m12 0v-1.5a6 6 0 00-12 0v1.5m12 0v-1.5a6 6 0 00-12 0v1.5m6 7.5a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 9a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z',
      iconColor: 'text-cyan-500',
      // FIX: Updated user roles to match UserRole type
      isActive: true, isFavorite: true, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief'],
    },
    // FIX: Updated user roles to match UserRole type
    { id: 'quaily-assist', name: 'مساعد الكتابة الصحفية', englishName: 'Quaily Journalist AI', category: 'النواة المعرفية والتحليل الذكي', description: 'مساعد ذكاء اصطناعي متخصص في صياغة المقالات الصحفية، اقتراح العناوين، وضمان الالتزام بالمعايير المهنية.', iconSvg: 'M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125', iconColor: 'text-teal-500', isActive: true, isFavorite: false, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief'] },
    // FIX: Updated user roles to match UserRole type
    { id: 'ai-source-discovery', name: 'مكتشف المصادر الذكي', englishName: 'AI Source Discovery (Bitbat)', category: 'النواة المعرفية والتحليل الذكي', description: 'أداة ذكاء اصطناعي للمساعدة في العثور على خبراء ومصادر محتملة حول مواضيع معينة لتحقيقاتك.', iconSvg: 'M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z', iconColor: 'text-lime-600', isActive: true, isFavorite: false, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief'] },
     {
      id: 'libretranslate',
      name: 'الترجمة الآمنة',
      englishName: 'LibreTranslate',
      category: 'النواة المعرفية والتحليل الذكي',
      description: 'خدمة ترجمة فورية للنصوص والمستندات تعمل محلياً بشكل كامل، مما يضمن سرية الوثائق الحساسة وعدم مشاركتها مع أطراف ثالثة.',
      iconSvg: 'M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C13.18 7.061 14.287 7.5 15.5 7.5c1.213 0 2.32-.439 3.166-1.136m0 0 is greater than 3.032 3.032 0 0 1-3.675 3.675-3.032 3.032 0 0 1-3.675-3.675M12 12.75h.008v.008H12v-.008Z',
      iconColor: 'text-blue-600',
      // FIX: Updated user roles to match UserRole type
      isActive: true, isFavorite: false, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief'],
    },
    {
      id: 'haystack',
      name: 'اسأل وثائقك',
      englishName: 'Haystack (Document AI)',
      category: 'النواة المعرفية والتحليل الذكي',
      description: 'نظام يمكنك من "الدردشة مع بياناتك". ارفع ملفات (PDF, DOCX) واسأل الذكاء الاصطناعي أسئلة مباشرة عن محتواها.',
      iconSvg: 'M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z',
      iconColor: 'text-yellow-600',
      // FIX: Updated user roles to match UserRole type
      isActive: true, isFavorite: false, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief'],
    },
    {
      id: 'brainerd-dispatch',
      name: 'مساعد الأخبار المحلية',
      englishName: 'Local News AI',
      category: 'النواة المعرفية والتحليل الذكي',
      description: 'أدوات ذكاء اصطناعي من AP لمساعدة الصحفيين في مهام الأخبار المحلية مثل إنشاء الملخصات واقتراح العناوين.',
      iconSvg: 'M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5',
      iconColor: 'text-purple-500',
      // FIX: Updated user roles to match UserRole type
      isActive: true, isFavorite: false, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief'],
    },

    // 2. OSINT
    {
      id: 'searxng',
      name: 'محرك البحث الآمن',
      englishName: 'SearXNG Metasearch',
      category: 'التقصي والاستخبارات مفتوحة المصدر',
      description: 'محرك بحث "ميتا" يجمع النتائج من جوجل ومصادر أخرى دون تتبعك أو تسجيل ما تبحث عنه، مما يوفر طبقة حماية أساسية لعمليات البحث الاستقصائي.',
      iconSvg: 'm21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z',
      iconColor: 'text-emerald-500',
      // FIX: Updated user roles to match UserRole type
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
      // FIX: Updated user roles to match UserRole type
      isActive: true, isFavorite: true, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief'],
    },
    {
      id: 'amass',
      name: 'كاشف الشبكات (Amass)',
      englishName: 'Network Infrastructure Mapping',
      category: 'التقصي والاستخبارات مفتوحة المصدر',
      description: 'أداة متقدمة لرسم خرائط البنية التحتية الرقمية لكيان مستهدف. مثالية لتحقيق صحفي حول شركة أو جهة حكومية، حيث يمكنها كشف نطاقات فرعية غير معلنة (مثل "private-servers.company.com") أو خوادم بريد إلكتروني مخفية، مما قد يقود إلى معلومات داخلية أو ثغرات أمنية.',
      iconSvg: 'M13.5 10.5h2.25A3.75 3.75 0 0 1 19.5 14.25v2.25a3.75 3.75 0 0 1-3.75 3.75h-2.25m-6 0h-2.25A3.75 3.75 0 0 1 1.5 16.5v-2.25a3.75 3.75 0 0 1 3.75-3.75h2.25m6 0v-2.25A3.75 3.75 0 0 1 11.25 4.5h1.5a3.75 3.75 0 0 1 3.75 3.75v2.25m-6 0h-1.5a3.75 3.75 0 0 0-3.75 3.75v1.5a3.75 3.75 0 0 0 3.75 3.75h1.5m6-1.5v-1.5a3.75 3.75 0 0 0-3.75-3.75h-1.5a3.75 3.75 0 0 0-3.75 3.75v1.5m6 0h1.5a3.75 3.75 0 0 0 3.75-3.75v-1.5a3.75 3.75 0 0 0-3.75-3.75h-1.5',
      iconColor: 'text-gray-500',
      // FIX: Updated user roles to match UserRole type
      isActive: true, isFavorite: false, isVisiblePublicly: false, allowedRoles: ['super-admin', 'editor-in-chief'],
    },
    {
      id: 'spiderfoot',
      name: 'أداة SpiderFoot',
      englishName: 'OSINT Automation',
      category: 'التقصي والاستخبارات مفتوحة المصدر',
      description: 'منصة أتمتة لعمليات الاستخبارات مفتوحة المصدر لرسم البصمة الرقمية لشخص أو منظمة. مثال للاستخدام الصحفي: ابدأ ببريد إلكتروني لمسؤول، وستقوم الأداة تلقائياً بالبحث عن حساباته الاجتماعية، أسماء النطاقات المسجلة باسمه، عناوين IP، وحتى الملفات التي قام برفعها وقد تسربت للعامة، مما يساعد على كشف شبكة علاقاته الرقمية ومصالحه.',
      iconSvg: 'M8.25 7.5l.415-.207a.75.75 0 0 1 1.085.67V10.5m0 0h6.375m-6.375 0v3.75m0-3.75L15 15M4.5 20.25l1.086-1.086a.75.75 0 0 1 1.06 0l1.086 1.086M6.75 18l.01.01M6.75 19.5l.01.01M8.25 21l.01.01M9.75 19.5l.01.01M9.75 18l.01.01M11.25 20.25l1.086-1.086a.75.75 0 0 1 1.06 0l1.086 1.086',
      iconColor: 'text-pink-500',
      // FIX: Updated user roles to match UserRole type
      isActive: true, isFavorite: false, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief'],
    },
    // FIX: Updated user roles to match UserRole type
    { id: 'harvester-ap', name: 'Harvester (AP)', englishName: 'AP Harvester', category: 'التقصي والاستخبارات مفتوحة المصدر', description: 'أداة لأتمتة جمع البيانات من وكالة Associated Press ومصادر إخبارية أخرى.', iconSvg: 'M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5', iconColor: 'text-gray-700', isActive: true, isFavorite: false, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief'] },
    { 
      id: 'desarquivo', 
      name: 'آلة الزمن للويب', 
      englishName: 'Web Time Machine (Archive)', 
      category: 'التقصي والاستخبارات مفتوحة المصدر', 
      description: 'أداة استكشاف قوية لأرشيف الإنترنت العالمي. تمكنك من العثور على نسخ قديمة من المواقع الإلكترونية، المقالات التي تم حذفها، والتغيرات التي طرأت على الصفحات الحكومية أو حسابات الشخصيات العامة بمرور الوقت.', 
      iconSvg: 'M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25', 
      iconColor: 'text-red-400', 
      isActive: true, 
      isFavorite: false, 
      isVisiblePublicly: true, 
      // FIX: Updated user roles to match UserRole type
      allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief', 'public'] 
    },

    // 2.5 Financial Investigations
    {
      id: 'arkham-mirror',
      name: 'متتبع الكريبتو',
      englishName: 'ArkhamMirror',
      category: 'التحقيقات المالية',
      description: 'أداة استخباراتية لتحليل وتتبع معاملات العملات المشفرة على البلوك تشين لكشف الشبكات المالية.',
      iconSvg: 'M12 6v12m-3-6h6m-3 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm9 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
      iconColor: 'text-blue-400',
      // FIX: Updated user roles to match UserRole type
      isActive: true, isFavorite: false, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief'],
    },
    // FIX: Updated user roles to match UserRole type
    { id: 'openduka', name: 'OpenDuka (بيانات الشركات)', englishName: 'OpenDuka Corporate Data', category: 'التحقيقات المالية', description: 'أداة للبحث في سجلات الشركات لكشف الملكية، والربط بين الشخصيات والكيانات التجارية.', iconSvg: 'M14.25 7.563c.097.05.192.104.287.162l-3.958 3.958a.75.75 0 0 0 0 1.06l3.958 3.958c-.095.058-.19.112-.287.162a3.751 3.751 0 0 1-4.437-.162l-3.958-3.958a.75.75 0 0 0-1.06 0l-3.958 3.958a3.751 3.751 0 0 1-4.275-4.437c.05-.097.104-.192.162-.287l3.958-3.958a.75.75 0 0 0 0-1.06L.25 6.475a3.751 3.751 0 0 1 4.437-4.275c.097.05.192.104.287.162l3.958 3.958a.75.75 0 0 0 1.06 0l3.958-3.958A3.751 3.751 0 0 1 14.25 7.563Z', iconColor: 'text-orange-500', isActive: true, isFavorite: false, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief'] },

    // 3. Social Media Analysis
    {
      id: 'nitter-snscrape',
      name: 'أداة Snscrape',
      englishName: 'Social Media Scraper',
      category: 'تحليل الإعلام الاجتماعي',
      description: 'لتجميع وتحليل كميات ضخمة من التغريدات والمنشورات من منصات متعددة دون الحاجة لواجهات برمجية رسمية، لكشف التوجهات والشبكات.',
      iconSvg: 'M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.753 9.753 0 01-4.322-.994L4.5 19.5l.94-2.685A8.965 8.965 0 013 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z',
      iconColor: 'text-blue-500',
      // FIX: Updated user roles to match UserRole type
      isActive: true, isFavorite: false, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief'],
    },
    {
      id: 'mediacloud',
      name: 'منصة Mediacloud',
      englishName: 'Global News Analysis',
      category: 'تحليل الإعلام الاجتماعي',
      description: 'منصة بحثية عالمية لمراقبة وتحليل التغطية الإعلامية للأحداث والقضايا في آلاف المصادر الإخبارية العالمية لفهم سياق الروايات الإعلامية.',
      iconSvg: 'M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5',
      iconColor: 'text-orange-500',
      // FIX: Updated user roles to match UserRole type
      isActive: true, isFavorite: true, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief'],
    },
    {
      id: 'telegram-scraper',
      name: 'جامع بيانات تيليجرام',
      englishName: 'Telegram Scraper',
      category: 'تحليل الإعلام الاجتماعي',
      description: 'أداة متخصصة لجمع الرسائل والوسائط من قنوات ومجموعات تيليجرام العامة لتحليل النقاشات، رصد الأنشطة، وتوثيق المحتوى.',
      iconSvg: 'M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-6.66L21 3l-5.508 9.352-4.256-4.024-8.242 2.165 4.256 4.024L6.084 21.672l7.6-5.072z',
      iconColor: 'text-sky-600',
      // FIX: Updated user roles to match UserRole type
      isActive: true, isFavorite: false, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief'],
    },
    {
      id: 'social-analyzer',
      name: 'المحلل الاجتماعي',
      englishName: 'Social Analyzer',
      category: 'تحليل الإعلام الاجتماعي',
      description: 'محرك بحث وتحليل للبصمة الرقمية. يبحث عن ملفات شخصية عبر أكثر من 1000 منصة ويحلل البيانات المتاحة حول الأفراد والشركات.',
      iconSvg: 'M12 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm9 11a1 1 0 0 1-2 0v-1a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v1a1 1 0 0 1-2 0v-1a6 6 0 0 1 6-6h6a6 6 0 0 1 6 6v1Z',
      iconColor: 'text-indigo-600',
      // FIX: Updated user roles to match UserRole type
      isActive: true, isFavorite: true, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief'],
    },
    
    // 4. Verification & Forensics
    {
      id: 'invid-weverify',
      name: 'أداة InVID',
      englishName: 'Video Verification',
      category: 'التحقق من الوسائط وكشف التزييف',
      description: 'يُلقب بـ "السكين السويسري" للتحقق الرقمي. أداة قوية جداً لفحص الفيديوهات، استخراج الإطارات الرئيسية (Keyframes)، والبحث العكسي المتقدم.',
      iconSvg: 'm15.75 10.5 4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z',
      iconColor: 'text-red-500',
      // FIX: Updated user roles to match UserRole type
      isActive: true, isFavorite: true, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief'],
    },
    {
      id: 'exiftool',
      name: 'أداة ExifTool',
      englishName: 'Metadata Analysis',
      category: 'التحقق من الوسائط وكشف التزييف',
      description: 'أداة قوية لاستخراج وتحليل أعمق البيانات الوصفية (Metadata) من الصور والملفات لكشف معلومات المصدر، نوع الكاميرا، الموقع، وتاريخ التعديل.',
      iconSvg: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
      iconColor: 'text-indigo-500',
      // FIX: Updated user roles to match UserRole type
      isActive: true, isFavorite: false, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief'],
    },
    { id: 'ai-fact-checker', name: 'مدقق الحقائق الذكي', englishName: 'AI Fact-Checker (Factcheck-GPT)', category: 'التحقق من الوسائط وكشف التزييف', description: 'أداة ذكاء اصطناعي لتحليل الادعاءات والتحقق من صحتها عبر مقارنتها بمصادر موثوقة على الويب. مثال: إدخال ادعاء منتشر على واتساب حول "إغلاق ميناء الحديدة"، وستقوم الأداة بالبحث في وكالات الأنباء الموثوقة وبيانات تتبع السفن لتقديم ملخص مدعوم بالمصادر حول صحة الادعاء.', iconSvg: 'M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.745 3.745 0 0 1 3.296-1.043A3.745 3.745 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.745 3.745 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z', iconColor: 'text-cyan-600', isActive: true, isFavorite: true, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief'] },
    {
      id: 'fotoforensics',
      name: 'التحليل الجنائي للصور',
      englishName: 'FotoForensics',
      category: 'التحقق من الوسائط وكشف التزييف',
      description: 'يستخدم تحليل مستوى الخطأ (ELA) لتحديد الأجزاء التي تم التلاعب بها في الصور والتي لا يمكن رؤيتها بالعين المجردة.',
      iconSvg: 'M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5ZM12 12.75h.008v.008H12v-.008Z',
      iconColor: 'text-slate-500',
      // FIX: Updated user roles to match UserRole type
      isActive: true, isFavorite: false, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief'],
    },
    {
      id: 'loki-fact-check',
      name: 'Loki (التحقق الآلي)',
      englishName: 'Loki (OpenFactVerification)',
      category: 'التحقق من الوسائط وكشف التزييف',
      description: 'نظام متكامل لأتمتة التحقق. يقسم النصوص إلى "ادعاءات"، يبحث عن أدلة، ويصدر حكماً بالصحة. مثال: تحليل بيان صحفي حكومي وتفكيكه إلى ادعاءات فردية، ثم البحث تلقائياً عن مصادر إعلامية معارضة أو تقارير منظمات دولية للتحقق من كل ادعاء.',
      iconSvg: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6',
      iconColor: 'text-teal-600',
      isActive: true, isFavorite: true, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief'],
    },
    {
      id: 'deepfake-detector',
      name: 'كاشف التزييف العميق',
      englishName: 'Deepfake Detector',
      category: 'التحقق من الوسائط وكشف التزييف',
      description: 'أداة متخصصة تستخدم الذكاء الاصطناعي لتحليل مقاطع الفيديو وكشف علامات التلاعب والتزييف العميق (Deepfake).',
      iconSvg: 'M15.59 14.37a6 6 0 0 1-5.23 0 6 6 0 0 1-5.23 0 6 6 0 0 1 10.46 0Zm-4.8 1.95a4.5 4.5 0 0 0 4.08 0 4.5 4.5 0 0 0 4.08 0 4.5 4.5 0 0 0-8.16 0ZM9 12a3 3 0 1 1 6 0 3 3 0 0 1-6 0Z M3 15.75a9 9 0 0 1 18 0v.16a2.09 2.09 0 0 1-2.09 2.09H5.09A2.09 2.09 0 0 1 3 15.91v-.16Z',
      iconColor: 'text-rose-500',
      // FIX: Updated user roles to match UserRole type
      isActive: true, isFavorite: true, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief'],
    },
    // FIX: Updated user roles to match UserRole type
    { id: 'aletheia', name: 'Aletheia (كشف التزييف)', englishName: 'Aletheia Deepfake Detection', category: 'التحقق من الوسائط وكشف التزييف', description: 'مجموعة أدوات متقدمة للتحليل الجنائي للوسائط وكشف التزييف العميق. مثال: تحليل مقطع فيديو مصور لمسؤول يدلي بتصريحات مثيرة للجدل للبحث عن علامات تلاعب دقيقة في حركة الشفاه، أو تناقضات في الإضاءة والظلال، مما قد يكشف عن كونه تزييفاً عميقاً.', iconSvg: 'M7.864 4.243A7.5 7.5 0 0 1 19.5 12c0 1.82-1.07 3.428-2.655 4.195M15.75 17.25c-.23 2.118-2.02 3.75-4.245 3.75a4.5 4.5 0 0 1-4.245-3.75M9.75 3.75c-.23-2.118 1.56-3.75 3.785-3.75a4.5 4.5 0 0 1 3.785 3.75', iconColor: 'text-fuchsia-500', isActive: true, isFavorite: false, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief'] },
    {
      id: 'meedan-check',
      name: 'Meedan Check',
      englishName: 'Collaborative Verification',
      category: 'التحقق من الوسائط وكشف التزييف',
      description: 'منصة تعاونية ضخمة لإدارة البلاغات والتحقق الجماعي من الوسائط. مثال: خلال حدث كبير مثل النزاعات، يمكن لفريق من الصحفيين استخدام المنصة لتلقي مئات الصور والفيديوهات من المواطنين، وتوزيع مهام التحقق منها، وتتبع حالة كل معلومة (تم التحقق، مضلل، إلخ) بشكل مركزي.',
      iconSvg: 'M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.006 3 11.55c0 2.43.91 4.683 2.41 6.336l-.618 2.169a.75.75 0 0 0 .966.966l2.17-2.17A8.959 8.959 0 0 0 12 20.25Z M9.75 11.25a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1-.75-.75Z',
      iconColor: 'text-sky-700',
      // FIX: Updated user roles to match UserRole type
      isActive: true, isFavorite: false, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief'],
    },

    // 5. IndiLab (Early Warning)
    {
      id: 'changedetection',
      name: 'راصد التغييرات',
      englishName: 'ChangeDetection.io',
      category: 'مختبر المؤشرات والإنذار المبكر',
      description: 'يراقب أي تغيير في صفحات الويب (مثل مواقع الوزارات) ويرسل تنبيهات فورية عند تغيير أي كلمة أو رقم، مما يجعله أداة رصد رقمية فعالة.',
      iconSvg: 'M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
      iconColor: 'text-red-600',
      // FIX: Updated user roles to match UserRole type
      isActive: true, isFavorite: false, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief'],
    },
    {
      id: 'adsb-exchange',
      name: 'متتبع الطيران (ADSBx)',
      englishName: 'Flight Tracking',
      category: 'مختبر المؤشرات والإنذار المبكر',
      description: 'شبكة عالمية مفتوحة المصدر لتتبع حركة الطائرات العسكرية والخاصة التي لا تظهر على الرادارات التقليدية، مما يساعد في كشف التحركات السرية.',
      iconSvg: 'M12.352 4.975A4.5 4.5 0 008.25 7.5h7.5a4.5 4.5 0 00-3.398-2.525zM9.75 16.5a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5zM12 2.25c-5.18 0-9.442 3.93-9.94 8.857-1.25.43-2.06 1.63-2.06 3.018V15a2.25 2.25 0 002.25 2.25h1.5a.75.75 0 000-1.5H2.25V15c0-1.03.845-1.875 1.875-1.875h15.75c1.03 0 1.875.845 1.875 1.875v.75h-1.5a.75.75 0 000 1.5h1.5A2.25 2.25 0 0024 15v-.875c0-1.388-.81-2.588-2.06-3.018C21.442 6.18 17.18 2.25 12 2.25z',
      iconColor: 'text-teal-500',
      // FIX: Updated user roles to match UserRole type
      isActive: true, isFavorite: true, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief'],
    },
     {
      id: 'misp',
      name: 'منصة معلومات التهديدات',
      englishName: 'MISP Threat Intelligence',
      category: 'مختبر المؤشرات والإنذار المبكر',
      description: 'منصة تعاونية لجمع ومشاركة وتحليل مؤشرات التهديدات السيبرانية، مما يساعد في فهم الهجمات الرقمية والاستعداد لها بشكل استباقي.',
      iconSvg: 'M11.023 1.984a2.25 2.25 0 0 1 3.955 0l6.25 11.25a2.25 2.25 0 0 1-1.977 3.266H3.749a2.25 2.25 0 0 1-1.977-3.266l6.25-11.25ZM12 14.25a.75.75 0 0 1-.75-.75v-3a.75.75 0 0 1 1.5 0v3a.75.75 0 0 1-.75-.75Zm.002 2.002a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z',
      iconColor: 'text-orange-600',
      // FIX: Updated user roles to match UserRole type
      isActive: true, isFavorite: false, isVisiblePublicly: false, allowedRoles: ['super-admin', 'editor-in-chief'],
    },
    {
      id: 'nasa-firms',
      name: 'راصد الحرائق (NASA FIRMS)',
      englishName: 'Fire Information System',
      category: 'مختبر المؤشرات والإنذار المبكر',
      description: 'نظام معلومات إدارة الحرائق من وكالة ناسا. يوفر بيانات شبه آنية عن الحرائق النشطة حول العالم، وهو مؤشر حاسم لرصد النزاعات والقصف.',
      iconSvg: 'M15.362 5.214A12.003 12.003 0 0 0 12 5.25c-2.31 0-4.46.642-6.362 1.736a.75.75 0 0 1-.5-.135 11.96 11.96 0 0 1-2.24-3.153.75.75 0 0 1 1.258-.813 10.46 10.46 0 0 0 2.02 2.537A13.454 13.454 0 0 1 12 3c2.463 0 4.786.666 6.824 1.839a.75.75 0 1 1-.95 1.375Z M12 6.75c-5.185 0-9.442 3.93-9.941 8.857-.425 4.145 2.533 7.643 6.441 7.643 2.93 0 5.44-1.613 6.578-3.881a.75.75 0 0 0-1.332-.664A5.5 5.5 0 0 1 12 18.75a5.5 5.5 0 0 1-5.5-5.5 5.5 5.5 0 0 1 1.764-4.032.75.75 0 0 0-1.06-1.06A7.001 7.001 0 0 0 5.25 13.25c0 3.866 3.134 7 7 7 2.894 0 5.414-1.76 6.46-4.243.2-.483.313-.994.34-1.507A9.42 9.42 0 0 0 12 6.75Z',
      iconColor: 'text-amber-600',
      // FIX: Updated user roles to match UserRole type
      isActive: true, isFavorite: false, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief'],
    },

    // 6. Geospatial Analysis & Violation Observatory
    // FIX: Updated user roles to match UserRole type
    { id: 'ushahidi', name: 'منصة Ushahidi', englishName: 'Crowdsourced Mapping', category: 'مرصد الانتهاكات الصحفية', description: 'منصة لجمع البيانات من مصادر متعددة (رسائل، ويب) وعرضها على خريطة تفاعلية، مثالية لتوثيق الانتهاكات أو رصد الأحداث في الوقت الفعلي.', iconSvg: 'M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z', iconColor: 'text-green-600', isActive: true, isFavorite: true, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief'] },
    // FIX: Updated user roles to match UserRole type
    { id: 'kepler-gl', name: 'أداة Kepler.gl', englishName: 'Large-scale Geospatial Viz', category: 'الخرائط والرصد الجغرافي', description: 'أداة قوية مبنية على Deck.gl لتصور مجموعات البيانات الجغرافية الضخمة وإنشاء خرائط ورسوم بيانية تفاعلية لكشف الأنماط.', iconSvg: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5', iconColor: 'text-blue-500', isActive: true, isFavorite: false, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief'] },
    // FIX: Updated user roles to match UserRole type
    { id: 'earth-engine', name: 'محرك جوجل إيرث', englishName: 'Google Earth Engine', category: 'الخرائط والرصد الجغرافي', description: 'منصة تحليل سحابية تتيح الوصول إلى عقود من صور الأقمار الصناعية وتحليلها على نطاق واسع لرصد التغيرات البيئية، التوسع العمراني، أو الأضرار.', iconSvg: 'M12 21a9 9 0 0 1-6.82-14.82l.71.71A8 8 0 1 0 12 4.5V3a9 9 0 0 1 9 9h-1.5a7.5 7.5 0 1 0-7.5 7.5V21Z', iconColor: 'text-gray-700', isActive: true, isFavorite: true, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief'] },
    // FIX: Updated user roles to match UserRole type
    { id: 'qgis-server', name: 'خادم QGIS', englishName: 'QGIS Server', category: 'الخرائط والرصد الجغرافي', description: 'نسخة خادم من نظام المعلومات الجغرافية QGIS، تتيح نشر الخرائط والبيانات الجغرافية عبر الويب ومشاركتها بشكل آمن داخل المؤسسة.', iconSvg: 'M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9Z M12 10.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z M10.5 13.5c0 .828.672 1.5 1.5 1.5s1.5-.672 1.5-1.5H15V12h-1.5v-1.5H12V12h-1.5v1.5h0Z', iconColor: 'text-lime-700', isActive: true, isFavorite: false, isVisiblePublicly: true, allowedRoles: ['super-admin', 'editor-in-chief'] },
    
    // 7. Archiving & Violation Observatory
    // FIX: Updated user roles to match UserRole type
    { id: 'archivebox', name: 'الأرشيف الرقمي', englishName: 'ArchiveBox', category: 'الأرشفة والتوثيق الرقمي', description: 'نظام متكامل لحفظ نسخ دائمة وموثوقة من صفحات الويب والمقالات كدليل رقمي لا يمكن تغييره أو حذفه، مما يضمن بقاء الأدلة.', iconSvg: 'M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z', iconColor: 'text-amber-500', isActive: true, isFavorite: false, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief'] },
    // FIX: Updated user roles to match UserRole type
    { id: 'nocodb', name: 'بنك معلومات الانتهاكات', englishName: 'NocoDB', category: 'مرصد الانتهاكات الصحفية', description: 'قاعدة بيانات مرنة لبناء بنوك معلومات للتحقيقات (مثل: قاعدة بيانات الفساد، الشخصيات، الشركات) مع واجهة رسومية سهلة الاستخدام.', iconSvg: 'M3.375 21V3h17.25v18H3.375ZM9 18.375h12V8.625H9v9.75Zm-3.375 0H9v-12h9.375V3.375H5.625v15Z', iconColor: 'text-lime-600', isActive: true, isFavorite: true, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief'] },
    // FIX: Updated user roles to match UserRole type
    { id: 'webrecorder', name: 'الأرشيف التفاعلي', englishName: 'Webrecorder', category: 'الأرشفة والتوثيق الرقمي', description: 'أداة لإنشاء نسخ تفاعلية وعالية الدقة من مواقع الويب، بما في ذلك المحتوى الديناميكي والفيديوهات، لضمان بقاء الدليل الرقمي كما كان بالضبط.', iconSvg: 'M9 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm3 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm3 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm-9 2.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm3 0a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm3 0a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm3 0a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm3 0a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z M4.5 21a2.25 2.25 0 0 0 2.25-2.25V7.5A2.25 2.25 0 0 0 4.5 5.25v13.5Zm15 0a2.25 2.25 0 0 0 2.25-2.25V7.5a2.25 2.25 0 0 0-2.25-2.25v13.5Z M8.25 21a2.25 2.25 0 0 0 2.25-2.25V7.5A2.25 2.25 0 0 0 8.25 5.25v13.5Zm7.5 0a2.25 2.25 0 0 0 2.25-2.25V7.5a2.25 2.25 0 0 0-2.25-2.25v13.5Z', iconColor: 'text-cyan-600', isActive: true, isFavorite: false, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief'] },
    
    // 8. Security & Management
    // FIX: Updated user roles to match UserRole type
    { id: 'vaultwarden', name: 'خزنة الأسرار', englishName: 'Password Manager', category: 'الأمان وإدارة النظام', description: 'نظام مؤسسي آمن لإدارة كلمات المرور والملاحظات السرية ومشاركتها بشكل مشفر بين أعضاء الفريق لتعزيز الأمان الرقمي.', iconSvg: 'M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v-2.25L9.937 13.5c.404-.404.527-1 .43-1.563A6 6 0 1121 8.25z', iconColor: 'text-gray-600', isActive: true, isFavorite: true, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief', 'public'] },
    // FIX: Updated user roles to match UserRole type
    { id: 'uptime-kuma', name: 'مراقب الحالة', englishName: 'Status Monitoring', category: 'الأمان وإدارة النظام', description: 'لوحة مراقبة شاملة لحالة جميع الخدمات والمواقع الحيوية لضمان استمراريتها، مع نظام تنبيهات فورية لإعلام المسؤولين عن أي انقطاع.', iconSvg: 'M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z', iconColor: 'text-green-600', isActive: true, isFavorite: false, isVisiblePublicly: false, allowedRoles: ['super-admin', 'editor-in-chief'] },
    // FIX: Updated user roles to match UserRole type
    { id: 'kasm', name: 'المتصفح الآمن المعزول', category: 'دعم الصحفيين', englishName: 'Kasm Workspaces', description: 'يوفر متصفح ويب يعمل داخل حاوية معزولة لفتح الروابط المشبوهة وفحصها بأمان تام دون تعريض جهازك أو شبكتك للخطر.', iconSvg: 'M9.75 3.104v1.244a3.75 3.75 0 0 0 0 7.292v1.244M9.75 3.104a3.75 3.75 0 1 0 0 7.292M9.75 3.104a3.75 3.75 0 1 1 0 7.292M14.25 3.104v1.244a3.75 3.75 0 0 0 0 7.292v1.244M14.25 3.104a3.75 3.75 0 1 0 0 7.292M14.25 3.104a3.75 3.75 0 1 1 0 7.292M4.5 21V3.75A3.75 3.75 0 0 1 8.25 0h7.5A3.75 3.75 0 0 1 19.5 3.75V21', iconColor: 'text-fuchsia-600', isActive: true, isFavorite: false, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief'] },
    // FIX: Updated user roles to match UserRole type
    { id: 'mvt-toolkit', name: 'MVT', englishName: 'Mobile Verification Toolkit', category: 'الأمان وإدارة النظام', description: 'أداة من منظمة العفو الدولية لفحص الهواتف والبحث عن برمجيات التجسس (مثل بيغاسوس)، لتعزيز الأمان الرقمي للصحفي.', iconSvg: 'M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75A2.25 2.25 0 0 0 15.75 1.5h-2.25m-3 0V3M12 18.75h.008v.008H12v-.008Z', iconColor: 'text-red-700', isActive: true, isFavorite: false, isVisiblePublicly: false, allowedRoles: ['super-admin', 'editor-in-chief'], },
    
    // 9. Portals & Collaboration
    // FIX: Updated user roles to match UserRole type
    { id: 'mattermost', name: 'التواصل الداخلي', englishName: 'Mattermost Chat', category: 'بوابة التدريب', description: 'بديل آمن ومستضاف محلياً لـ Slack، يتيح التواصل المشفر والمنظم بين فرق العمل لضمان سرية المناقشات والملفات.', iconSvg: 'M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.006 3 11.55c0 2.43.91 4.683 2.41 6.336l-.618 2.169a.75.75 0 0 0 .966.966l2.17-2.17A8.959 8.959 0 0 0 12 20.25Z', iconColor: 'text-sky-500', isActive: true, isFavorite: false, isVisiblePublicly: false, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief'] },
    // FIX: Updated user roles to match UserRole type
    { id: 'nextcloud', name: 'مشاركة الملفات', englishName: 'Nextcloud Files', category: 'بوابة التدريب', description: 'بديل لـ Google Drive، يوفر تخزين ومشاركة الملفات، تحرير المستندات بشكل تعاوني، التقويم، وجهات الاتصال، كل ذلك على خادمك الخاص.', iconSvg: 'M2.25 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5', iconColor: 'text-blue-700', isActive: true, isFavorite: false, isVisiblePublicly: false, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief'] },
    // FIX: Updated user roles to match UserRole type
    { id: 'jupyterhub', name: 'تحليل البيانات (Jupyter)', englishName: 'JupyterHub', category: 'التعاون والبيئة المكتبية', description: 'بيئة برمجية تفاعلية (بايثون) لصحافة البيانات، تتيح تحليل البيانات المتقدم، وتدريب نماذج AI، وإنشاء تصورات بيانية معقدة.', iconSvg: 'M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z', iconColor: 'text-orange-600', isActive: true, isFavorite: false, isVisiblePublicly: false, allowedRoles: ['super-admin', 'editor-in-chief'] },
    // FIX: Updated user roles to match UserRole type
    { id: 'superset', name: 'لوحات معلومات الانتهاكات', englishName: 'Apache Superset', category: 'مرصد الانتهاكات الصحفية', description: 'أداة قوية لإنشاء رسوم بيانية ولوحات معلومات تفاعلية مباشرة من قواعد البيانات، مما يسهل عرض نتائج التحقيقات بشكل بصري.', iconSvg: 'M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z', iconColor: 'text-teal-600', isActive: true, isFavorite: false, isVisiblePublicly: false, allowedRoles: ['super-admin', 'editor-in-chief'] },

    // 10. Automation & DevOps
    // FIX: Updated user roles to match UserRole type
    { id: 'n8n', name: 'أتمتة المهام (n8n)', englishName: 'Workflow Automation', category: 'الأتمتة وسير العمل', description: 'منصة قوية لبناء تدفقات عمل آلية لربط التطبيقات المختلفة وأتمتة المهام المتكررة (مثل التنبيهات والبلاغات) دون الحاجة لخبرة برمجية.', iconSvg: 'M13.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75M13.5 10.5h-9v6.75a4.5 4.5 0 009 0v-6.75z', iconColor: 'text-purple-600', isActive: true, isFavorite: false, isVisiblePublicly: false, allowedRoles: ['super-admin', 'editor-in-chief'] },
    // FIX: Updated user roles to match UserRole type
    { id: 'tooljet', name: 'بناء استمارات التسجيل', englishName: 'ToolJet', category: 'بوابة التدريب', description: 'منصة تمكن المسؤولين من بناء أدوات وتطبيقات داخلية بسيطة وسريعة (مثل استمارة رصد انتهاك) دون الحاجة لبرمجة معقدة.', iconSvg: 'M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h12A2.25 2.25 0 0 0 20.25 14.25V3M3.75 3H5.25m-1.5 0h-1.5m1.5 0p1.5 0m13.5 0h1.5m-1.5 0h-1.5m1.5 0h-1.5M12 9.75h.008v.008H12V9.75Z', iconColor: 'text-rose-500', isActive: true, isFavorite: false, isVisiblePublicly: false, allowedRoles: ['super-admin', 'editor-in-chief'] },
    // FIX: Updated user roles to match UserRole type
    { id: 'gitea', name: 'مستودع الكود', englishName: 'Gitea (Self-hosted Git)', category: 'الأتمتة وسير العمل', description: 'مستودع كود خاص لحفظ البرمجيات، السكريبتات، وملفات تدريب الذكاء الاصطناعي بشكل آمن ومحلي داخل المنصة.', iconSvg: 'M17.25 6.75h-10.5a.75.75 0 0 0-.75.75v10.5a.75.75 0 0 0 .75.75h10.5a.75.75 0 0 0 .75-.75v-10.5a.75.75 0 0 0-.75-.75Zm-10.5 1.5h10.5v10.5h-10.5v-10.5Z M12 15.75a.75.75 0 0 1-.75-.75v-3a.75.75 0 0 1 1.5 0v3a.75.75 0 0 1-.75-.75Z M9 12.75a.75.75 0 0 1-.75-.75v-1.5a.75.75 0 0 1 1.5 0v1.5a.75.75 0 0 1-.75-.75Zm6 0a.75.75 0 0 1-.75-.75v-1.5a.75.75 0 0 1 1.5 0v1.5a.75.75 0 0 1-.75-.75Z', iconColor: 'text-green-500', isActive: true, isFavorite: false, isVisiblePublicly: false, allowedRoles: ['super-admin', 'editor-in-chief'] },
    // FIX: Updated user roles to match UserRole type
    { id: 'social-bot-manager', name: 'مدير البوتات الاجتماعية', englishName: 'Social Bot Manager', category: 'الأتمتة وسير العمل', description: 'واجهة مركزية لإدارة وجدولة مهام بوتات النشر والرد الآلي على منصات التواصل الاجتماعي، تعمل بالتكامل مع Gitea و n8n.', iconSvg: 'M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z', iconColor: 'text-blue-gray-500', isActive: true, isFavorite: false, isVisiblePublicly: false, allowedRoles: ['super-admin', 'editor-in-chief'], },
    
    // 11. System & Content Management
    // FIX: Updated user roles to match UserRole type
    { id: 'glances', name: 'مراقبة أداء الخادم', englishName: 'Glances System Monitoring', category: 'إدارة النظام', description: 'لوحة تحكم لحظية لمراقبة استهلاك موارد الخادم (CPU, RAM, Disk, Network) لتشخيص المشاكل وضمان استقرار المنصة.', iconSvg: 'M3.75 12a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Zm.75-4.5a.75.75 0 0 0 0 1.5h15a.75.75 0 0 0 0-1.5h-15Zm0 9a.75.75 0 0 0 0 1.5h15a.75.75 0 0 0 0-1.5h-15Z', iconColor: 'text-indigo-500', isActive: true, isFavorite: false, isVisiblePublicly: false, allowedRoles: ['super-admin'], },
    // FIX: Updated user roles to match UserRole type
    { id: 'typo3', name: 'إدارة المحتوى العام', englishName: 'TYPO3 CMS', category: 'إدارة المحتوى', description: 'نظام إدارة محتوى احترافي (CMS) لنشر المقالات والتقارير على الموقع العام للمؤسسة (ph-ye.org) بشكل مستقل عن أدوات التحقيق.', iconSvg: 'M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z', iconColor: 'text-orange-500', isActive: true, isFavorite: false, isVisiblePublicly: false, allowedRoles: ['super-admin', 'editor-in-chief'], },
    // FIX: Updated user roles to match UserRole type
    { id: 'ghost-cms', name: 'منصة النشر (Ghost)', englishName: 'Ghost Publishing Platform', category: 'مرصد الانتهاكات الصحفية', description: 'منصة نشر حديثة وسريعة لكتابة ونشر المقالات والتقارير المطولة بواجهة تحرير بسيطة وأنيقة.', iconSvg: 'M12 6.252a1.5 1.5 0 0 1 .66 2.833l-2.38 3.667a1.5 1.5 0 0 1-2.58 0l-2.38-3.667A1.5 1.5 0 0 1 6 6.252V6h6v.252zM4.5 9.75a1.5 1.5 0 0 0-1.06.44l-2.25 2.25a1.5 1.5 0 0 0 0 2.12l2.25 2.25a1.5 1.5 0 0 0 2.12 0l2.25-2.25a1.5 1.5 0 0 0 0-2.12l-2.25-2.25a1.5 1.5 0 0 0-1.06-.44zM19.5 9.75a1.5 1.5 0 0 0-1.06.44l-2.25 2.25a1.5 1.5 0 0 0 0 2.12l2.25 2.25a1.5 1.5 0 0 0 2.12 0l2.25-2.25a1.5 1.5 0 0 0 0-2.12l-2.25-2.25a1.5 1.5 0 0 0-1.06-.44z', iconColor: 'text-gray-800', isActive: true, isFavorite: true, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief'], },
    
    // 12. Organizational Management & Portals
    // FIX: Updated user roles to match UserRole type
    { id: 'erpnext', name: 'نظام ERPNext', englishName: 'ERPNext System', category: 'إدارة المشاريع المؤسسية', description: 'نظام متكامل لإدارة موارد المؤسسة: المحاسبة، التدريب، علاقات الممولين، والموارد البشرية.', iconSvg: 'M3.75 21V3h16.5v18H3.75z M9 18.375h12V8.625H9v9.75z', iconColor: 'text-blue-500', isActive: true, isFavorite: true, isVisiblePublicly: false, allowedRoles: ['super-admin', 'editor-in-chief'], },
    // FIX: Updated user roles to match UserRole type
    { id: 'chatwoot-violations', name: 'صندوق بلاغات الانتهاكات', englishName: 'Chatwoot Violations Inbox', category: 'مرصد الانتهاكات الصحفية', description: 'منصة مركزية لاستقبال الرسائل والبلاغات من مصادر متعددة (واتساب، فيسبوك، إيميل) بشكل آمن ومنظم، مثالية لإدارة تواصل المصادر السرية.', iconSvg: 'M21.75 9v.906a2.25 2.25 0 0 1-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 0 0 1.183 1.981l6.478 3.488m8.863-11.412 6.478 3.488m0 0a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25H2.25a2.25 2.25 0 0 1-2.25-2.25v-7.5a2.25 2.25 0 0 1 2.25-2.25l6.478-3.488m11.138 0-11.138 0m11.138 0-6.478 3.488m-4.66-3.488 6.478 3.488', iconColor: 'text-teal-500', isActive: true, isFavorite: false, isVisiblePublicly: false, allowedRoles: ['super-admin', 'editor-in-chief'], },
    // FIX: Updated user roles to match UserRole type
    { id: 'chatwoot-helpdesk', name: 'فتح تذكرة دعم', englishName: 'Chatwoot Helpdesk', category: 'دعم الصحفيين', description: 'قناة الدعم الفني المباشر لحل المشاكل التقنية التي تواجه الصحفيين أثناء استخدام المنصة.', iconSvg: 'M21.75 9v.906a2.25 2.25 0 0 1-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 0 0 1.183 1.981l6.478 3.488m8.863-11.412 6.478 3.488m0 0a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25H2.25a2.25 2.25 0 0 1-2.25-2.25v-7.5a2.25 2.25 0 0 1 2.25-2.25l6.478-3.488m11.138 0-11.138 0m11.138 0-6.478 3.488m-4.66-3.488 6.478 3.488', iconColor: 'text-teal-500', isActive: true, isFavorite: false, isVisiblePublicly: true, allowedRoles: ['super-admin', 'editor-in-chief', 'investigative-journalist'] },

    // 13. Training Portal Tools
    // FIX: Updated user roles to match UserRole type
    { id: 'moodle', name: 'منصة Moodle للتعلم', englishName: 'Moodle LMS', category: 'بوابة التدريب', description: 'نظام إدارة تعلم متكامل لإدارة الدورات التدريبية، المواد، والواجبات. يتكامل مع BigBlueButton للجلسات المباشرة و Mautic لأتمتة التواصل والتسجيل.', iconSvg: 'M12 18.25a.75.75 0 0 1-.75-.75V7.16l-3.22 3.22a.75.75 0 1 1-1.06-1.06l4.5-4.5a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 1 1-1.06 1.06l-3.22-3.22v10.34a.75.75 0 0 1-.75-.75Z M3.75 18a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5H3.75Z', iconColor: 'text-orange-500', isActive: true, isFavorite: true, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief'] },
    // FIX: Updated user roles to match UserRole type
    { id: 'bigbluebutton', name: 'الفصول الافتراضية', englishName: 'BigBlueButton', category: 'بوابة التدريب', description: 'منصة مؤتمرات فيديو مفتوحة المصدر مخصصة للتعليم والتدريب، تتيح إنشاء فصول افتراضية تفاعلية.', iconSvg: 'M15.75 10.5l4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M12 18.75h-9a2.25 2.25 0 0 1-2.25-2.25v-9A2.25 2.25 0 0 1 3.75 5.25h9A2.25 2.25 0 0 1 15 7.5v9a2.25 2.25 0 0 1-2.25 2.25Z', iconColor: 'text-blue-600', isActive: true, isFavorite: false, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief'] },
    // FIX: Updated user roles to match UserRole type
    { id: 'mautic', name: 'أتمتة التسويق', englishName: 'Mautic', category: 'بوابة التدريب', description: 'نظام لأتمتة حملات البريد الإلكتروني والتواصل مع المتدربين، بدءاً من التسجيل وحتى إرسال الشهادات.', iconSvg: 'M21.75 9v.906a2.25 2.25 0 0 1-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 0 0 1.183 1.981l6.478 3.488m8.863-11.412 6.478 3.488m0 0a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25H2.25a2.25 2.25 0 0 1-2.25-2.25v-7.5a2.25 2.25 0 0 1 2.25-2.25l6.478-3.488m11.138 0-11.138 0m11.138 0-6.478 3.488m-4.66-3.488 6.478 3.488', iconColor: 'text-indigo-500', isActive: true, isFavorite: false, isVisiblePublicly: false, allowedRoles: ['super-admin', 'editor-in-chief'] },
  ]);

  updateTool(toolId: string, updates: Partial<Tool>) {
    this.tools.update(tools =>
      tools.map(tool => (tool.id === toolId ? { ...tool, ...updates } : tool))
    );
  }

  toggleToolStatus(toolId: string) {
    const tool = this.tools().find(t => t.id === toolId);
    if (tool) {
      this.updateTool(toolId, { isActive: !tool.isActive });
      
      const user = this.userService.currentUser();
      if (user) {
        const action = !tool.isActive ? 'تفعيل' : 'تعطيل';
        this.logger.logEvent(
          'تعديل حالة الأداة', 
          `تم ${action} الأداة: ${tool.name}`, 
          user.name, 
          // FIX: Updated user role to match UserRole type
          user.role === 'super-admin'
        );
      }
    }
  }

  toggleFavoriteStatus(toolId: string) {
     const tool = this.tools().find(t => t.id === toolId);
    if (tool) {
      this.updateTool(toolId, { isFavorite: !tool.isFavorite });
    }
  }
}

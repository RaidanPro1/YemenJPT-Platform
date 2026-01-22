import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Article {
  id: number;
  title: string;
  author: string;
  submittedAt: string;
}

type ArticleStatus = 'ideas' | 'inProgress' | 'review' | 'published';

interface NewsroomService {
  name: string;
  status: 'Online' | 'Degraded' | 'Offline';
  url: string;
}

interface TeamActivity {
  member: string;
  avatar: string;
  task: string;
  status: 'review' | 'inProgress';
}


@Component({
  selector: 'app-editorial-hub',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './editorial-hub.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorialHubComponent {

  articles = signal<{ [key in ArticleStatus]: Article[] }>({
    ideas: [
      { id: 1, title: 'تحليل اقتصادي لتأثير الحرب على العملة', author: 'فريق الاقتصاد', submittedAt: '' },
    ],
    inProgress: [
      { id: 2, title: 'تحقيق: شبكات التهريب عبر السواحل', author: 'أحمد خالد', submittedAt: '' },
    ],
    review: [
      { id: 3, title: 'تقرير: حالة التعليم في المناطق النائية', author: 'فاطمة علي', submittedAt: '2024-07-21' },
    ],
    published: [
       { id: 4, title: 'خبر: افتتاح مشروع مياه جديد في تعز', author: 'قسم الأخبار', submittedAt: '' },
       { id: 5, title: 'بيان إدانة لاستهداف الصحفيين في مأرب', author: 'بيت الصحافة', submittedAt: '' },
    ]
  });

  // Computed stats for the dashboard
  articlesInReviewCount = computed(() => this.articles().review.length);
  publishedThisWeekCount = computed(() => this.articles().published.length); // Simplified for demo
  ideasCount = computed(() => this.articles().ideas.length);

  newsroomServices = signal<NewsroomService[]>([
    { name: 'منصة النشر (Ghost)', status: 'Online', url: 'http://localhost:2368/ghost' },
    { name: 'نظام الإدارة (TYPO3)', status: 'Online', url: 'http://localhost:8080/typo3' },
    { name: 'منصة التعاون (Chat)', status: 'Degraded', url: 'https://chat.ph-ye.org' },
    { name: 'إدارة المهام (Superdesk)', status: 'Online', url: '#' },
  ]);

  teamActivity = signal<TeamActivity[]>([
    { member: 'أحمد خالد', avatar: 'https://i.pravatar.cc/150?u=ahmed', task: 'تحقيق شبكات التهريب', status: 'inProgress' },
    { member: 'فاطمة علي', avatar: 'https://i.pravatar.cc/150?u=fatima', task: 'تقرير حالة التعليم', status: 'review' },
    { member: 'خالد عبدالله', avatar: 'https://i.pravatar.cc/150?u=khaled', task: 'مراجعة وثائق المناقصات', status: 'inProgress' },
  ]);

  draggedArticleId = signal<number | null>(null);
  dragOverStatus = signal<ArticleStatus | null>(null);

  onDragStart(articleId: number) {
    this.draggedArticleId.set(articleId);
  }

  onDragOver(event: DragEvent, status: ArticleStatus) {
    event.preventDefault();
    this.dragOverStatus.set(status);
  }

  onDragLeave() {
    this.dragOverStatus.set(null);
  }

  onDrop(event: DragEvent, newStatus: ArticleStatus) {
    event.preventDefault();
    const articleId = this.draggedArticleId();
    if (!articleId) return;

    let draggedArticle: Article | undefined;
    let oldStatus: ArticleStatus | undefined;

    // Find article and its old status
    for (const status of Object.keys(this.articles()) as ArticleStatus[]) {
      const article = this.articles()[status].find(a => a.id === articleId);
      if (article) {
        draggedArticle = article;
        oldStatus = status;
        break;
      }
    }

    if (draggedArticle && oldStatus && oldStatus !== newStatus) {
      this.articles.update(articles => {
        const newArticles = { ...articles };
        newArticles[oldStatus!] = newArticles[oldStatus!].filter(a => a.id !== articleId);
        newArticles[newStatus].push(draggedArticle!);
        return newArticles;
      });
    }

    this.draggedArticleId.set(null);
    this.dragOverStatus.set(null);
  }
}

import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * --- Pseudo-code for Block Editor Logic (as requested) ---
 *
 * 1. INITIALIZATION:
 *    - Import Editor.js and its tools (e.g., Header, Paragraph, List).
 *    - In the component, create a new EditorJS instance.
 *    - `const editor = new EditorJS({ holder: 'editor-js-container', tools: { ... }, data: initialData });`
 *    - `initialData` would be a JSON object fetched from the backend representing the saved page content.
 *
 * 2. SAVING CONTENT:
 *    - Create a "Save" button that triggers `editor.save()`.
 *    - This method returns a Promise that resolves with a clean JSON object:
 *      `{ time: ..., blocks: [ { id: ..., type: 'header', data: { text: 'Title', level: 1 } }, ... ], version: ... }`
 *    - Send this JSON object to a backend API endpoint (e.g., `POST /api/pages/home`).
 *    - The backend stores this JSON in a database field (e.g., a `jsonb` column in PostgreSQL).
 *
 * 3. RENDERING CONTENT (for the public site):
 *    - The public-facing site (e.g., Next.js or a different Angular app) fetches the saved JSON from the backend.
 *    - It then iterates through the `blocks` array.
 *    - For each block, it renders the appropriate HTML tag based on the `type`.
 *      - `if (block.type === 'header') return <h{block.data.level}>{block.data.text}</h{...}>`
 *      - `if (block.type === 'paragraph') return <p>{block.data.text}</p>`
 *    - This approach separates content from presentation, making the CMS very flexible.
 */

interface Article {
  id: number;
  title: string;
  author: string;
  submittedAt: string;
}

type ArticleStatus = 'ideas' | 'inProgress' | 'review' | 'published';

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
    ]
  });

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

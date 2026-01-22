import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { SettingsService } from '../../services/settings.service';
import { WebrtcCallComponent } from '../webrtc-call/webrtc-call.component';
import { ConfirmationService } from '../../services/confirmation.service';
import { LoggerService } from '../../services/logger.service';
import { UserService } from '../../services/user.service';

// --- Interfaces for a more structured data model ---
interface TeamMember {
  id: number;
  name: string;
  avatar: string;
}

type TaskDifficulty = 'Easy' | 'Medium' | 'Hard';

interface Task {
  id: string;
  title: string;
  assignee: TeamMember;
  priority: 'High' | 'Medium' | 'Low';
  difficulty: TaskDifficulty;
  dueDate: string;
}

interface ProjectFile {
  name: string;
  type: 'PDF' | 'Image' | 'Document' | 'Audio';
  size: string;
  lastModified: string;
}

interface DiscussionMessage {
  id: number;
  text: string;
  sender: TeamMember;
  timestamp: string;
}

type TaskStatus = 'todo' | 'inProgress' | 'done';

interface Project {
  id: number;
  name: string;
  team: TeamMember[];
  tasks: { [key in TaskStatus]: Task[] };
  files: ProjectFile[];
  discussion: DiscussionMessage[];
}

type CollaborationTab = 'tasks' | 'files' | 'discussion' | 'meeting';

@Component({
  selector: 'app-collaboration',
  standalone: true,
  imports: [CommonModule, FormsModule, WebrtcCallComponent],
  templateUrl: './collaboration.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollaborationComponent {
  private notificationService = inject(NotificationService);
  private settingsService = inject(SettingsService);
  private confirmationService = inject(ConfirmationService);
  private logger = inject(LoggerService);
  private userService = inject(UserService);

  // Feature Flags
  isDataExportEnabled = this.settingsService.isDataExportEnabled;
  isWebRtcEnabled = this.settingsService.isWebRtcEnabled;

  // --- State Signals ---
  projects = signal<Project[]>([]);
  selectedProjectId = signal<number>(1);
  isCreateProjectModalOpen = signal(false);
  isInviteMemberModalOpen = signal(false);
  newProjectName = signal('');
  activeTab = signal<CollaborationTab>('tasks');

  // New task modal state
  isAddTaskModalOpen = signal(false);
  newTaskTitle = signal('');
  newTaskAssigneeId = signal<number>(0);
  newTaskPriority = signal<'High' | 'Medium' | 'Low'>('Medium');
  newTaskDifficulty = signal<TaskDifficulty>('Medium');
  newTaskStatus = signal<TaskStatus>('todo');

  // Discussion state
  newMessageText = signal('');
  discussionTemplates = signal<string[]>(['مشاركة نتائج بحث:', 'طلب توضيح:', 'تقرير تقدم:']);

  // Drag and Drop state
  draggedTaskId = signal<string | null>(null);
  dragOverStatus = signal<TaskStatus | null>(null);
  
  // Filtering state
  filterAssigneeId = signal<number | 'all'>('all');

  // --- Computed Signals for Dynamic Data ---
  selectedProject = computed(() => this.projects().find(p => p.id === this.selectedProjectId()));
  
  projectProgress = computed(() => {
    const project = this.selectedProject();
    if (!project) return 0;
    const todo = project.tasks.todo.length;
    const inProgress = project.tasks.inProgress.length;
    const done = project.tasks.done.length;
    const total = todo + inProgress + done;
    if (total === 0) return 0;
    return Math.round((done / total) * 100);
  });

  filteredTasks = computed(() => {
    const project = this.selectedProject();
    const filterId = this.filterAssigneeId();
    if (!project) return { todo: [], inProgress: [], done: [] };
    if (filterId === 'all') return project.tasks;

    const filterFn = (task: Task) => task.assignee.id === filterId;

    return {
        todo: project.tasks.todo.filter(filterFn),
        inProgress: project.tasks.inProgress.filter(filterFn),
        done: project.tasks.done.filter(filterFn),
    };
  });

  constructor() {
    this.loadInitialData();
  }

  // --- Data Loading ---
  private loadInitialData() {
    const teamMembers: TeamMember[] = [
      { id: 1, name: 'Raidan Al-Huraibi', avatar: 'assets/team/mohammed-alharibi.jpg' },
      { id: 2, name: 'أحمد خالد', avatar: 'https://i.pravatar.cc/150?u=ahmed' },
      { id: 3, name: 'فاطمة علي', avatar: 'https://i.pravatar.cc/150?u=fatima' },
      { id: 4, name: 'خالد عبدالله', avatar: 'https://i.pravatar.cc/150?u=khaled' },
    ];
    
    this.projects.set([
      {
        id: 1,
        name: 'تحقيق انتهاكات 2024',
        team: [teamMembers[0], teamMembers[1], teamMembers[2]],
        tasks: {
          todo: [
            { id: 'p1-t1', title: 'جمع شهادات أولية من شهود عيان', assignee: teamMembers[1], priority: 'High', difficulty: 'Hard', dueDate: this.getFutureDate(1) },
            { id: 'p1-t2', title: 'تحليل صور الأقمار الصناعية لمنطقة الاستهداف', assignee: teamMembers[2], priority: 'High', difficulty: 'Hard', dueDate: this.getFutureDate(2) },
          ],
          inProgress: [
            { id: 'p1-t4', title: 'مقابلة المصدر "س" عبر قناة آمنة', assignee: teamMembers[0], priority: 'High', difficulty: 'Medium', dueDate: this.getFutureDate(0) },
          ],
          done: [
            { id: 'p1-t7', title: 'تحديد الموقع الجغرافي للفيديو المنتشر', assignee: teamMembers[2], priority: 'Medium', difficulty: 'Easy', dueDate: this.getFutureDate(-2) },
          ]
        },
        files: [
          { name: 'تقرير مبدئي.docx', type: 'Document', size: '1.2 MB', lastModified: '2024-07-21' },
          { name: 'خريطة المنطقة.png', type: 'Image', size: '3.5 MB', lastModified: '2024-07-21' },
        ],
        discussion: [
            { id: 1, sender: teamMembers[1], text: 'لقد حصلت على بعض الصور الجديدة، سأقوم برفعها قريباً.', timestamp: '10:30 صباحاً' },
            { id: 2, sender: teamMembers[0], text: 'ممتاز أحمد، بانتظارك. فاطمة، هل هناك أي تحديث بخصوص تحليل الأقمار الصناعية؟', timestamp: '10:32 صباحاً' },
        ]
      },
      {
        id: 2,
        name: 'تحقيق فساد العقود الحكومية',
        team: [teamMembers[0], teamMembers[3]],
        tasks: {
          todo: [{ id: 'p2-t1', title: 'مراجعة وثائق المناقصات المسربة', assignee: teamMembers[3], priority: 'High', difficulty: 'Medium', dueDate: this.getFutureDate(4) }],
          inProgress: [{ id: 'p2-t2', title: 'تحديد الشركات الوهمية المتورطة', assignee: teamMembers[0], priority: 'Medium', difficulty: 'Hard', dueDate: this.getFutureDate(1) }],
          done: []
        },
        files: [
          { name: 'وثائق مسربة.pdf', type: 'PDF', size: '15.8 MB', lastModified: '2024-07-19' },
        ],
        discussion: []
      }
    ]);
    this.newTaskAssigneeId.set(teamMembers[0].id); // Set default assignee
  }

  private getFutureDate(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }

  // --- UI Methods ---
  setTab(tab: CollaborationTab) {
    this.activeTab.set(tab);
  }
  
  selectProject(event: Event) {
    const projectId = parseInt((event.target as HTMLSelectElement).value, 10);
    this.selectedProjectId.set(projectId);
    this.filterAssigneeId.set('all'); // Reset filter on project change
  }
  
  setFilter(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.filterAssigneeId.set(value === 'all' ? 'all' : parseInt(value, 10));
  }

  // --- Modal Management ---
  openCreateProjectModal() { this.isCreateProjectModalOpen.set(true); }
  openInviteMemberModal() { this.isInviteMemberModalOpen.set(true); }

  closeModals() {
    this.isCreateProjectModalOpen.set(false);
    this.isInviteMemberModalOpen.set(false);
    this.isAddTaskModalOpen.set(false);
    this.newProjectName.set('');
    this.newTaskTitle.set('');
  }
  
  // --- Data Manipulation Methods ---
  createProject() {
    if (!this.newProjectName()) return;

    const newProject: Project = {
      id: Date.now(),
      name: this.newProjectName(),
      team: [this.projects()[0].team[0]],
      tasks: { todo: [], inProgress: [], done: [] },
      files: [],
      discussion: []
    };

    this.projects.update(projects => [...projects, newProject]);
    this.selectedProjectId.set(newProject.id);
    
    const currentUser = this.userService.currentUser();
    this.logger.logEvent(
      'إنشاء مشروع جديد',
      `قام المستخدم بإنشاء مشروع جديد باسم: "${this.newProjectName()}".`,
      currentUser?.name,
      currentUser?.role === 'super-admin'
    );

    this.closeModals();
  }
  
  inviteMember(email: string) {
     if (!email) return;
     const newMember: TeamMember = { id: Date.now(), name: email.split('@')[0], avatar: `https://i.pravatar.cc/150?u=${email}` };
     this.projects.update(projects => {
       return projects.map(p => {
         if (p.id === this.selectedProjectId()) {
           if (!p.team.find(m => m.name === newMember.name)) {
             return { ...p, team: [...p.team, newMember] };
           }
         }
         return p;
       });
     });
     
     const currentUser = this.userService.currentUser();
     const project = this.selectedProject();
     this.logger.logEvent(
        'دعوة عضو جديد',
        `تم دعوة المستخدم صاحب البريد "${email}" لمشروع "${project?.name}".`,
        currentUser?.name,
        currentUser?.role === 'super-admin'
     );

     this.closeModals();
  }

  // --- New Task Methods ---
  openAddTaskModal(status: TaskStatus) {
    this.newTaskStatus.set(status);
    this.isAddTaskModalOpen.set(true);
  }

  saveNewTask() {
    const project = this.selectedProject();
    if (!project || !this.newTaskTitle()) return;
    
    const assignee = project.team.find(m => m.id === this.newTaskAssigneeId());
    if (!assignee) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: this.newTaskTitle(),
      assignee: assignee,
      priority: this.newTaskPriority(),
      difficulty: this.newTaskDifficulty(),
      dueDate: this.getFutureDate(3) // Default due date 3 days from now
    };
    
    this.projects.update(projects => projects.map(p => {
      if (p.id === project.id) {
        const newTasks = { ...p.tasks };
        newTasks[this.newTaskStatus()].push(newTask);
        return { ...p, tasks: newTasks };
      }
      return p;
    }));
    
    // Add notification
    this.notificationService.addNotification(
      `مهمة جديدة لك: "${newTask.title}" في مشروع "${project.name}"`, 
      'task'
    );

    const currentUser = this.userService.currentUser();
    this.logger.logEvent(
      'إضافة مهمة جديدة',
      `تمت إضافة مهمة "${newTask.title}" إلى مشروع "${project.name}" وأسندت إلى "${assignee.name}".`,
      currentUser?.name,
      currentUser?.role === 'super-admin'
    );
    
    this.closeModals();
  }

  async deleteTask(taskId: string, status: TaskStatus) {
    const project = this.selectedProject();
    if (!project) return;

    const task = project.tasks[status].find(t => t.id === taskId);
    if (!task) return;

    const confirmed = await this.confirmationService.confirm(
      'حذف مهمة',
      `هل أنت متأكد من رغبتك في حذف المهمة "${task.title}"؟ لا يمكن التراجع عن هذا الإجراء.`
    );

    if (confirmed) {
      this.projects.update(projects => projects.map(p => {
        if (p.id === project.id) {
          const newTasks = { ...p.tasks };
          newTasks[status] = newTasks[status].filter(t => t.id !== taskId);
          return { ...p, tasks: newTasks };
        }
        return p;
      }));

      const currentUser = this.userService.currentUser();
      this.logger.logEvent(
        'حذف مهمة',
        `تم حذف المهمة "${task.title}" من مشروع "${project.name}".`,
        currentUser?.name,
        currentUser?.role === 'super-admin'
      );
    }
  }

  // --- Discussion Methods ---
  sendMessage() {
    const project = this.selectedProject();
    // Simulate current user is the first in the team
    const currentUser = project?.team[0]; 
    if (!project || !this.newMessageText() || !currentUser) return;
    
    const newMessage: DiscussionMessage = {
      id: Date.now(),
      sender: currentUser,
      text: this.newMessageText(),
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };

    this.projects.update(projects => projects.map(p => {
        if (p.id === project.id) {
            return { ...p, discussion: [...p.discussion, newMessage] };
        }
        return p;
    }));

    this.newMessageText.set('');
  }

  applyTemplate(template: string) {
    this.newMessageText.set(this.newMessageText() + template + ' ');
  }

  // --- Drag and Drop Methods ---
  onDragStart(taskId: string) {
    this.draggedTaskId.set(taskId);
  }

  onDragOver(event: DragEvent, status: TaskStatus) {
    event.preventDefault();
    this.dragOverStatus.set(status);
  }

  onDragLeave() {
    this.dragOverStatus.set(null);
  }

  async onDrop(event: DragEvent, newStatus: TaskStatus) {
    event.preventDefault();
    const taskId = this.draggedTaskId();
    const project = this.selectedProject();
    if (!taskId || !project) {
        this.draggedTaskId.set(null);
        this.dragOverStatus.set(null);
        return;
    }
    
    let draggedTask: Task | undefined;
    let oldStatus: TaskStatus | undefined;

    // Find task and its old status from the complete tasks list
    for (const status of Object.keys(project.tasks) as TaskStatus[]) {
      const task = project.tasks[status].find(t => t.id === taskId);
      if (task) {
        draggedTask = task;
        oldStatus = status;
        break;
      }
    }

    if (!draggedTask || !oldStatus || oldStatus === newStatus) {
        this.draggedTaskId.set(null);
        this.dragOverStatus.set(null);
        return;
    }
    
    // Confirmation for moving to 'Done'
    if (newStatus === 'done' && oldStatus !== 'done') {
        const confirmed = await this.confirmationService.confirm(
            'إكمال المهمة',
            `هل أنت متأكد من رغبتك في نقل المهمة "${draggedTask.title}" إلى "تم الإنجاز"؟`
        );
        if (!confirmed) {
            this.draggedTaskId.set(null);
            this.dragOverStatus.set(null);
            return;
        }
    }

    // Proceed with moving the task
    this.projects.update(projects => projects.map(p => {
        if (p.id === project.id) {
            const newTasks = { ...p.tasks };
            // Remove from old list
            newTasks[oldStatus!] = newTasks[oldStatus!].filter(t => t.id !== taskId);
            // Add to new list
            newTasks[newStatus].push(draggedTask!);
            return { ...p, tasks: newTasks };
        }
        return p;
    }));

    const currentUser = this.userService.currentUser();
    this.logger.logEvent(
      'تغيير حالة مهمة',
      `تم نقل المهمة "${draggedTask.title}" من "${oldStatus}" إلى "${newStatus}" في مشروع "${project.name}".`,
      currentUser?.name,
      currentUser?.role === 'super-admin'
    );

    this.draggedTaskId.set(null);
    this.dragOverStatus.set(null);
  }

  // --- Data Export Method ---
  exportData(format: 'csv' | 'json') {
    const project = this.selectedProject();
    if (!project) return;

    const dataToExport = [
      ...project.tasks.todo.map(t => ({ ...t, status: 'To Do' })),
      ...project.tasks.inProgress.map(t => ({ ...t, status: 'In Progress' })),
      ...project.tasks.done.map(t => ({ ...t, status: 'Done' })),
    ].map(task => ({
        id: task.id,
        title: task.title,
        assignee: task.assignee.name,
        priority: task.priority,
        status: task.status,
        due_date: task.dueDate
    }));

    if (dataToExport.length === 0) {
      alert("No tasks to export.");
      return;
    }

    let fileContent = '';
    let mimeType = '';
    let fileExtension = '';

    if (format === 'json') {
      fileContent = JSON.stringify(dataToExport, null, 2);
      mimeType = 'application/json';
      fileExtension = 'json';
    } else { // csv
      const header = Object.keys(dataToExport[0]).join(',');
      const rows = dataToExport.map(row => 
        Object.values(row).map(value => `"${String(value).replace(/"/g, '""')}"`).join(',')
      ).join('\n');
      fileContent = `${header}\n${rows}`;
      mimeType = 'text/csv';
      fileExtension = 'csv';
    }

    const blob = new Blob([`\uFEFF${fileContent}`], { type: `${mimeType};charset=utf-8;` });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name}-tasks.${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}

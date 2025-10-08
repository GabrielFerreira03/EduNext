import { Component, OnInit, OnDestroy } from '@angular/core';
import { CourseService, Course, Activity, Module } from '../../services/course.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css']
})
export class ProgressComponent implements OnInit, OnDestroy {
  courseProgress: Course[] = [];
  selectedCourse: Course | null = null;
  currentUser: any = null;
  private subscription?: Subscription;

  constructor(
    private courseService: CourseService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadCourseProgress();
  }

  private loadCourseProgress(): void {
    this.subscription = this.courseService.getEnrolledCourses().subscribe(
      courses => {
        this.courseProgress = courses.map(course => ({
          ...course,
          enrolledAt: new Date(),
          lastAccessed: new Date(),
          totalStudyTime: Math.floor(Math.random() * 50) + 10,
          estimatedCompletion: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          completedModules: this.getCompletedModules(course),
          totalModules: this.getTotalModules(course),
          completedActivities: this.getCompletedActivities(course),
          totalActivities: this.getTotalActivities(course)
        }));
        
        if (this.courseProgress.length > 0) {
          this.selectedCourse = this.courseProgress[0];
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  selectCourse(course: Course): void {
    this.selectedCourse = course;
  }

  getProgressPercentage(course: Course): number {
    return course.progress || 0;
  }

  getCompletedActivities(course: Course): number {
    if (!course.modules) return 0;
    
    let completed = 0;
    course.modules.forEach(module => {
      completed += module.activities.filter(activity => activity.completed).length;
    });
    return completed;
  }

  getTotalActivities(course: Course): number {
    if (!course.modules) return 0;
    
    let total = 0;
    course.modules.forEach(module => {
      total += module.activities.length;
    });
    return total;
  }

  getCompletedModules(course: Course): number {
    if (!course.modules) return 0;
    
    return course.modules.filter(module => {
      return module.activities.every(activity => activity.completed);
    }).length;
  }

  getTotalModules(course: Course): number {
    return course.modules?.length || 0;
  }

  getEstimatedTimeRemaining(course: Course): string {
    const progress = this.getProgressPercentage(course);
    if (progress >= 100) return '0 horas';
    
    const totalHours = parseInt(course.duration) || 0;
    const completedHours = (progress / 100) * totalHours;
    const remainingHours = totalHours - completedHours;
    
    return `${Math.ceil(remainingHours)} horas`;
  }

  getProgressColor(progress: number): string {
    if (progress >= 80) return '#4CAF50';
    if (progress >= 50) return '#FF9800';
    if (progress >= 25) return '#FFC107';
    return '#F44336';
  }

  getActivityTypeIcon(type: string): string {
    switch (type) {
      case 'video': return '🎥';
      case 'quiz': return '❓';
      case 'assignment': return '📝';
      case 'reading': return '📖';
      default: return '📄';
    }
  }

  formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('pt-BR');
  }

  getModuleProgress(module: any): number {
    if (!module.activities || module.activities.length === 0) return 0;
    
    const completedActivities = module.activities.filter((activity: any) => activity.completed).length;
    return Math.round((completedActivities / module.activities.length) * 100);
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'video': return 'fas fa-play-circle';
      case 'quiz': return 'fas fa-question-circle';
      case 'assignment': return 'fas fa-file-alt';
      case 'reading': return 'fas fa-book-open';
      default: return 'fas fa-file';
    }
  }

  getActivityTypeLabel(type: string): string {
    switch (type) {
      case 'video': return 'Vídeo';
      case 'quiz': return 'Quiz';
      case 'assignment': return 'Atividade';
      case 'reading': return 'Leitura';
      default: return 'Conteúdo';
    }
  }
}

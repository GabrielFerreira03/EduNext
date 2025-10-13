import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { CourseService, Course } from '../../services/course.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  
  currentUser: User | null = null;
  userName = '';
  
  completedCourses = 0;
  studyHours = 0;
  currentLevel = 'Iniciante';
  certificates = 0;
  averageProgress = 0;

  enrolledCourses: Course[] = [];

  private enrolledCoursesSubscription?: Subscription;

  weeklyStats = {
    lessonsCompleted: 12,
    hoursStudied: 8.5,
    streak: 5
  };

  constructor(
    private authService: AuthService,
    private courseService: CourseService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUserData();
    this.loadEnrolledCourses();
    this.calculateWeeklyStats();
  }

  private loadUserData(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.userName = this.currentUser?.name || '';
  }



  private loadEnrolledCourses(): void {
    this.enrolledCoursesSubscription = this.courseService.enrolledCourses$.subscribe(
      courses => {
        this.enrolledCourses = courses;
        this.calculateUserStats();
      }
    );
  }

  ngOnDestroy(): void {
    if (this.enrolledCoursesSubscription) {
      this.enrolledCoursesSubscription.unsubscribe();
    }
  }

  private calculateUserStats(): void {
    // Resetar estatísticas se não há cursos matriculados
    if (!this.enrolledCourses || this.enrolledCourses.length === 0) {
      this.completedCourses = 0;
      this.studyHours = 0;
      this.currentLevel = 'Iniciante';
      this.certificates = 0;
      this.averageProgress = 0;
      return;
    }

    // Calcular cursos completados (progresso >= 100%)
    this.completedCourses = this.enrolledCourses.filter(course => 
      course.progress && course.progress >= 100
    ).length;

    // Calcular certificados (mesmo que cursos completados)
    this.certificates = this.completedCourses;

    // Calcular progresso médio de todos os cursos
    const totalProgress = this.enrolledCourses.reduce((total, course) => {
      return total + (course.progress || 0);
    }, 0);
    this.averageProgress = this.enrolledCourses.length > 0 
      ? Math.round(totalProgress / this.enrolledCourses.length) 
      : 0;

    // Calcular total de horas estudadas baseado no progresso dos cursos
    this.studyHours = this.enrolledCourses.reduce((total, course) => {
      // Estimar horas estudadas baseado no progresso do curso
      const estimatedCourseHours = 20; // Assumindo 20 horas por curso
      const progressPercentage = (course.progress || 0) / 100;
      return total + (estimatedCourseHours * progressPercentage);
    }, 0);

    // Arredondar para uma casa decimal
    this.studyHours = Math.round(this.studyHours * 10) / 10;

    // Determinar nível baseado nas horas estudadas e cursos completados
    if (this.studyHours < 10 && this.completedCourses === 0) {
      this.currentLevel = 'Iniciante';
    } else if (this.studyHours < 50 && this.completedCourses < 2) {
      this.currentLevel = 'Intermediário';
    } else if (this.studyHours < 100 && this.completedCourses < 5) {
      this.currentLevel = 'Avançado';
    } else {
      this.currentLevel = 'Expert';
    }
  }

  private calculateWeeklyStats(): void {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    let lessonsCompleted = 0;
    let hoursStudied = 0;
    let activeDays = new Set<string>();

    this.enrolledCourses.forEach(course => {
      if (course.modules) {
        course.modules.forEach(module => {
          module.activities.forEach(activity => {
            if (activity.completed && activity.completedAt && activity.completedAt >= oneWeekAgo) {
              lessonsCompleted++;
              
              const activityDuration = activity.duration || 30;
              hoursStudied += activityDuration / 60;
              
              const dayKey = activity.completedAt.toDateString();
              activeDays.add(dayKey);
            }
          });
        });
      }
    });

    const streak = this.calculateStreak(activeDays);

    this.weeklyStats = {
      lessonsCompleted: Math.round(lessonsCompleted),
      hoursStudied: Math.round(hoursStudied * 10) / 10,
      streak
    };
  }

  private calculateStreak(activeDays: Set<string>): number {
    if (activeDays.size === 0) return 0;

    const sortedDays = Array.from(activeDays)
      .map(day => new Date(day))
      .sort((a, b) => b.getTime() - a.getTime());

    let streak = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const mostRecentDay = sortedDays[0];
    mostRecentDay.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((today.getTime() - mostRecentDay.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff > 1) {
      return 0;
    }
    for (let i = 1; i < sortedDays.length; i++) {
      const currentDay = sortedDays[i];
      const previousDay = sortedDays[i - 1];
      
      currentDay.setHours(0, 0, 0, 0);
      previousDay.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((previousDay.getTime() - currentDay.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }





  goToMyCourses(): void {
    // Fazer scroll até a seção de cursos matriculados
    const coursesSection = document.querySelector('.courses-section');
    if (coursesSection) {
      coursesSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }

  cancelEnrollment(course: Course): void {
    this.courseService.cancelEnrollment(course);
  }

  scrollToAvailableCourses(): void {
    // Fazer scroll até a seção de cursos disponíveis
    const availableCoursesSection = document.querySelector('.available-courses-section');
    if (availableCoursesSection) {
      availableCoursesSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }

  navigateToMyCourses(): void {
    this.router.navigate(['/my-courses']);
  }

}
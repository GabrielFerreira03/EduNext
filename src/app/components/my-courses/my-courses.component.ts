import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CourseService, Course } from '../../services/course.service';

@Component({
  selector: 'app-my-courses',
  templateUrl: './my-courses.component.html',
  styleUrls: ['./my-courses.component.css']
})
export class MyCoursesComponent implements OnInit, OnDestroy {
  enrolledCourses: Course[] = [];
  availableCourses: Course[] = [];
  isLoading = true;
  
 
  showConfirmModal = false;
  courseToCancel: Course | null = null;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private courseService: CourseService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCourses();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private loadCourses(): void {
    const enrolledSub = this.courseService.getEnrolledCourses().subscribe(courses => {
      this.enrolledCourses = courses;
      this.isLoading = false;
    });

    const availableSub = this.courseService.getAvailableCourses().subscribe(courses => {
      this.availableCourses = courses;
    });

    this.subscriptions.add(enrolledSub);
    this.subscriptions.add(availableSub);
  }

  enrollInCourse(courseId: string): void {
    this.courseService.enrollInCourse(courseId).subscribe({
      next: (success: boolean) => {
        if (success) {
          this.loadCourses();
          this.showSuccessMessage();
        }
      },
      error: (error: any) => {
        console.error('Erro ao matricular no curso:', error);
      }
    });
  }

  private showSuccessMessage(): void {
    this.showNotification('Matrícula realizada com sucesso!');
  }

  private showNotification(message: string): void {
    console.log(message);
  }

  cancelEnrollment(courseId: string): void {
    const course = this.enrolledCourses.find(c => c.id === courseId);
    if (course) {
      this.courseToCancel = course;
      this.showConfirmModal = true;
    }
  }

  confirmCancelEnrollment(): void {
    if (this.courseToCancel) {
      this.courseService.cancelEnrollment(this.courseToCancel);
      this.loadCourses();
      this.showNotification('Matrícula cancelada com sucesso!');
      this.closeConfirmModal();
    }
  }

  closeConfirmModal(): void {
    this.showConfirmModal = false;
    this.courseToCancel = null;
  }

  viewCertificate(courseId: string): void {
    this.router.navigate(['/certificates'], { queryParams: { courseId } });
  }
}

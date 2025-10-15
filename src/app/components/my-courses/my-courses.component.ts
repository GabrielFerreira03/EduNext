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
  
  // Modal de pagamento
  showPaymentModal = false;
  paymentCourse: Course | null = null;

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

  openPaymentInfo(courseId: string): void {
    const course = this.enrolledCourses.find(c => c.id === courseId) || null;
    this.paymentCourse = course;
    this.showPaymentModal = true;
  }

  closePaymentModal(): void {
    this.showPaymentModal = false;
    this.paymentCourse = null;
  }

  getPaymentDueDate(course: Course | null | undefined): string {
    const enrolledAt = (course?.enrolledAt ? new Date(course.enrolledAt) : new Date());
    const due = new Date(enrolledAt);
    due.setDate(due.getDate() + 7);
    return this.formatDate(due);
  }

  getFirstExpirationDate(course: Course | null | undefined): string {
    const enrolledAt = (course?.enrolledAt ? new Date(course.enrolledAt) : new Date());
    const exp = new Date(enrolledAt);
    exp.setDate(exp.getDate() + 30);
    return this.formatDate(exp);
  }

  getRenewalDueDate(course: Course | null | undefined): string {
    const enrolledAt = (course?.enrolledAt ? new Date(course.enrolledAt) : new Date());
    const exp = new Date(enrolledAt);
    exp.setDate(exp.getDate() + 30);
    const renewal = new Date(exp);
    renewal.setDate(renewal.getDate() + 7);
    return this.formatDate(renewal);
  }

  private formatDate(date: Date): string {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  viewCertificate(courseId: string): void {
    this.router.navigate(['/certificates'], { queryParams: { courseId } });
  }
}

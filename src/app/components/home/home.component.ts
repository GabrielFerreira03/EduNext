import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Course, CourseService } from '../../services/course.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  courses: any[] = [];
  showLGPDModal: boolean = false;
  lgpdConsent = {
    functional: true,
    analytics: false,
    marketing: false
  };

  // Carrossel
  carouselCourses: Course[] = [];
  currentSlide: number = 0;
  private slideIntervalId: any;

  constructor(private router: Router, private courseService: CourseService) { }

  ngOnInit(): void {
    this.loadCourses();
    this.checkLGPDConsent();
    this.loadCarouselCourses();
    this.startAutoSlide();
  }

  private loadCourses(): void {
    this.courses = [
      {
        title: 'HTML & CSS',
        description: 'Criação de páginas web modernas',
        level: 'Básico',
        duration: '30 horas',
        technology: 'Web'
      },
      {
        title: 'JavaScript Essencial',
        description: 'Programação dinâmica para web',
        level: 'Intermediário',
        duration: '40 horas',
        technology: 'JavaScript'
      },
      {
        title: 'Angular Framework',
        description: 'Desenvolvimento de aplicações web',
        level: 'Avançado',
        duration: '60 horas',
        technology: 'Angular'
      }
    ];
  }

  private checkLGPDConsent(): void {
    const consent = localStorage.getItem('lgpd-consent');
    if (!consent) {
      this.showLGPDModal = true;
    }
  }

  goToRegister(): void {
    this.router.navigate(['/register']).then(() => {
      
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    });
  }

  goToCourses(): void {
    const element = document.getElementById('courses');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  goToAbout(): void {
    const element = document.getElementById('about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  acceptLGPDConsent(): void {
    localStorage.setItem('lgpd-consent', JSON.stringify(this.lgpdConsent));
    this.showLGPDModal = false;
  }

  rejectLGPDConsent(): void {
    const essentialConsent = {
      functional: true,
      analytics: false,
      marketing: false
    };
    localStorage.setItem('lgpd-consent', JSON.stringify(essentialConsent));
    this.showLGPDModal = false;
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']).then(() => {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    });
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']).then(() => {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    });
  }

  private loadCarouselCourses(): void {
    this.courseService.availableCourses$.subscribe(courses => {
      this.carouselCourses = courses;
      if (this.currentSlide >= this.carouselCourses.length) {
        this.currentSlide = 0;
      }
    });
  }

  // Resolve caminho da imagem baseado na tecnologia do curso usando assets existentes
  getCourseImage(course: Course): string {
    const techKey = (course.technology || '').toLowerCase().replace(/\s+/g, '').replace(/\./g, '');
    const imageMap: Record<string, string> = {
      angular: 'assets/images/angular.png',
      react: 'assets/images/react.png',
      nodejs: 'assets/images/nodejs.png',
      python: 'assets/images/python.png',
      vuejs: 'assets/images/vuejs.png',
      vue: 'assets/images/vuejs.png'
    };
    return imageMap[techKey] || 'assets/images/logofundoinvisivel.png';
  }

  private startAutoSlide(): void {
    this.clearAutoSlide();
    this.slideIntervalId = setInterval(() => {
      this.nextSlide();
    }, 4000);
  }

  private clearAutoSlide(): void {
    if (this.slideIntervalId) {
      clearInterval(this.slideIntervalId);
      this.slideIntervalId = null;
    }
  }

  nextSlide(): void {
    if (!this.carouselCourses.length) return;
    this.currentSlide = (this.currentSlide + 1) % this.carouselCourses.length;
  }

  prevSlide(): void {
    if (!this.carouselCourses.length) return;
    this.currentSlide = (this.currentSlide - 1 + this.carouselCourses.length) % this.carouselCourses.length;
  }

  goToSlide(index: number): void {
    if (index >= 0 && index < this.carouselCourses.length) {
      this.currentSlide = index;
    }
  }

  onCarouselMouseEnter(): void {
    this.clearAutoSlide();
  }

  onCarouselMouseLeave(): void {
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    this.clearAutoSlide();
  }

}
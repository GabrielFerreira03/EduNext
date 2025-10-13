import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  courses: any[] = [];
  showLGPDModal: boolean = false;
  lgpdConsent = {
    functional: true,
    analytics: false,
    marketing: false
  };

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.loadCourses();
    this.checkLGPDConsent();
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
      // Aguarda um pequeno delay para garantir que a página carregou
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

}
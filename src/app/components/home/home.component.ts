import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Course {
  id: number;
  title: string;
  description: string;
  duration: string;
  level: string;
  technology: string;
}

interface LGPDConsent {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // Propriedades para demonstrar lógica de programação
  courses: Course[] = [];
  featuredCourse: Course | null = null;
  currentDate: Date = new Date();
  userProgress: number = 0;
  
  // LGPD - Controle de consentimento
  showLGPDModal: boolean = false;
  lgpdConsent: LGPDConsent = {
    analytics: false,
    marketing: false,
    functional: true
  };



  constructor(private router: Router) {
    this.initializeCourses();
    this.checkLGPDConsent();
  }

  ngOnInit(): void {
    this.setFeaturedCourse();
  }

  // Lógica de programação - Inicializar cursos
  private initializeCourses(): void {
    this.courses = [
      {
        id: 1,
        title: 'Lógica de Programação',
        description: 'Fundamentos da programação e resolução de problemas',
        duration: '40 horas',
        level: 'Iniciante',
        technology: 'Algoritmos'
      },
      {
        id: 2,
        title: 'HTML & CSS',
        description: 'Criação de páginas web modernas e responsivas',
        duration: '60 horas',
        level: 'Iniciante',
        technology: 'Frontend'
      },
      {
        id: 3,
        title: 'JavaScript Avançado',
        description: 'Programação avançada com JavaScript ES6+',
        duration: '80 horas',
        level: 'Intermediário',
        technology: 'JavaScript'
      },
      {
        id: 4,
        title: 'Angular com TypeScript',
        description: 'Desenvolvimento de aplicações SPA com Angular',
        duration: '100 horas',
        level: 'Avançado',
        technology: 'Angular'
      },
      {
        id: 5,
        title: 'Git & GitHub',
        description: 'Versionamento de código e colaboração',
        duration: '30 horas',
        level: 'Iniciante',
        technology: 'Versionamento'
      }
    ];
  }



  // Lógica de programação - Definir curso em destaque
  private setFeaturedCourse(): void {
    const randomIndex = Math.floor(Math.random() * this.courses.length);
    this.featuredCourse = this.courses[randomIndex];
  }

  // LGPD - Verificar consentimento
  private checkLGPDConsent(): void {
    const consent = localStorage.getItem('lgpd-consent');
    if (!consent) {
      this.showLGPDModal = true;
    } else {
      this.lgpdConsent = JSON.parse(consent);
    }
  }

  // LGPD - Aceitar consentimento
  acceptLGPDConsent(): void {
    localStorage.setItem('lgpd-consent', JSON.stringify(this.lgpdConsent));
    this.showLGPDModal = false;
    console.log('Consentimento LGPD salvo:', this.lgpdConsent);
  }

  // LGPD - Rejeitar consentimento
  rejectLGPDConsent(): void {
    this.lgpdConsent = {
      analytics: false,
      marketing: false,
      functional: true
    };
    this.acceptLGPDConsent();
  }



  // Lógica de programação - Filtrar cursos por nível
  getCoursesByLevel(level: string): Course[] {
    return this.courses.filter(course => course.level === level);
  }

  // Lógica de programação - Buscar curso por ID
  getCourseById(id: number): Course | undefined {
    return this.courses.find(course => course.id === id);
  }

  // Navegação - Ir para cadastro
  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  // Navegação - Ir para seção de cursos
  goToCourses(): void {
    const element = document.getElementById('cursos');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
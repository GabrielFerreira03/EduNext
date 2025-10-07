import { Component, OnInit } from '@angular/core';

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

  // Metodologias Ágeis - Sprint atual
  currentSprint = {
    number: 1,
    goal: 'Implementar página inicial da plataforma EduNext',
    tasks: [
      { name: 'Criar estrutura HTML', completed: true },
      { name: 'Implementar CSS responsivo', completed: true },
      { name: 'Adicionar lógica JavaScript/TypeScript', completed: true },
      { name: 'Configurar roteamento Angular', completed: true },
      { name: 'Implementar conformidade LGPD', completed: false }
    ]
  };

  constructor() {
    this.initializeCourses();
    this.checkLGPDConsent();
  }

  ngOnInit(): void {
    this.calculateProgress();
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

  // Lógica de programação - Calcular progresso
  private calculateProgress(): void {
    const completedTasks = this.currentSprint.tasks.filter(task => task.completed).length;
    this.userProgress = Math.round((completedTasks / this.currentSprint.tasks.length) * 100);
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

  // Metodologia Ágil - Completar tarefa
  completeTask(taskIndex: number): void {
    this.currentSprint.tasks[taskIndex].completed = true;
    this.calculateProgress();
    console.log(`Tarefa completada: ${this.currentSprint.tasks[taskIndex].name}`);
  }

  // Lógica de programação - Filtrar cursos por nível
  getCoursesByLevel(level: string): Course[] {
    return this.courses.filter(course => course.level === level);
  }

  // Lógica de programação - Buscar curso por ID
  getCourseById(id: number): Course | undefined {
    return this.courses.find(course => course.id === id);
  }
}
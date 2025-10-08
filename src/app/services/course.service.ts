import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Activity {
  id: string;
  title: string;
  type: 'video' | 'quiz' | 'assignment' | 'reading';
  duration: number;
  completed: boolean;
  score?: number;
  completedAt?: Date;
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  activities: Activity[];
  completed?: boolean;
  expanded?: boolean;
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  level: 'Básico' | 'Iniciante' | 'Intermediário' | 'Avançado';
  duration: string;
  technology: string;
  description: string;
  image: string;
  progress?: number;
  totalStudyTime?: number;
  modules?: Module[];
  enrolledAt?: Date;
  lastAccessed?: Date;
  estimatedCompletion?: Date;
  completedModules?: number;
  totalModules?: number;
  completedActivities?: number;
  totalActivities?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private enrolledCoursesSubject = new BehaviorSubject<Course[]>([]);
  private availableCoursesSubject = new BehaviorSubject<Course[]>([]);

  public enrolledCourses$ = this.enrolledCoursesSubject.asObservable();
  public availableCourses$ = this.availableCoursesSubject.asObservable();

  constructor() {
    this.initializeCourses();
  }

  private initializeCourses(): void {
    // Cursos já matriculados com progresso
    const enrolledCourses: Course[] = [
      {
        id: 'enrolled-1',
        title: 'Fundamentos de Programação',
        instructor: 'Prof. Ana Silva',
        level: 'Básico',
        duration: '20 horas',
        technology: 'Lógica',
        description: 'Aprenda os conceitos básicos de programação',
        image: 'assets/images/programming-course.jpg',
        progress: 75,
        totalStudyTime: 15,
        enrolledAt: new Date(2024, 0, 15),
        lastAccessed: new Date(2024, 1, 10),
        ...this.generateDetailedCourseData(75, 'Básico')
      },
      {
        id: 'enrolled-2',
        title: 'HTML & CSS',
        instructor: 'Prof. Carlos Santos',
        level: 'Básico',
        duration: '30 horas',
        technology: 'Web',
        description: 'Criação de páginas web modernas',
        image: 'assets/images/html-css-course.jpg',
        progress: 45,
        totalStudyTime: 14,
        enrolledAt: new Date(2024, 1, 1),
        lastAccessed: new Date(2024, 1, 8),
        ...this.generateDetailedCourseData(45, 'Básico')
      },
      {
        id: 'enrolled-3',
        title: 'JavaScript Essencial',
        instructor: 'Prof. Maria Costa',
        level: 'Intermediário',
        duration: '40 horas',
        technology: 'JavaScript',
        description: 'Programação dinâmica para web',
        image: 'assets/images/js-course.jpg',
        progress: 90,
        totalStudyTime: 36,
        enrolledAt: new Date(2023, 11, 10),
        lastAccessed: new Date(2024, 1, 12),
        ...this.generateDetailedCourseData(90, 'Intermediário')
      }
    ];

    this.enrolledCoursesSubject.next(enrolledCourses);

    const availableCourses: Course[] = [
      {
        id: '1',
        title: 'Fundamentos do Angular',
        instructor: 'Prof. Maria Silva',
        level: 'Iniciante',
        duration: '40 horas',
        technology: 'Angular',
        description: 'Aprenda os conceitos básicos do Angular, incluindo componentes, serviços e roteamento.',
        image: 'assets/images/angular-course.jpg'
      },
      {
        id: '2',
        title: 'React Avançado',
        instructor: 'Prof. João Santos',
        level: 'Avançado',
        duration: '60 horas',
        technology: 'React',
        description: 'Domine técnicas avançadas do React, incluindo hooks customizados, context API e performance.',
        image: 'assets/images/react-course.jpg'
      },
      {
        id: '3',
        title: 'Node.js para Iniciantes',
        instructor: 'Prof. Ana Costa',
        level: 'Iniciante',
        duration: '35 horas',
        technology: 'Node.js',
        description: 'Introdução ao desenvolvimento backend com Node.js, Express e MongoDB.',
        image: 'assets/images/nodejs-course.jpg'
      },
      {
        id: '4',
        title: 'Python Data Science',
        instructor: 'Prof. Carlos Lima',
        level: 'Intermediário',
        duration: '50 horas',
        technology: 'Python',
        description: 'Análise de dados com Python, pandas, numpy e visualização com matplotlib.',
        image: 'assets/images/python-course.jpg'
      },
      {
        id: '5',
        title: 'Vue.js Completo',
        instructor: 'Prof. Lucia Ferreira',
        level: 'Intermediário',
        duration: '45 horas',
        technology: 'Vue.js',
        description: 'Desenvolvimento completo com Vue.js, incluindo Vuex, Vue Router e composição API.',
        image: 'assets/images/vue-course.jpg'
      }
    ];

    this.availableCoursesSubject.next(availableCourses);
  }

  enrollInCourse(courseId: string): Observable<boolean> {
    return new Observable(observer => {
      const currentEnrolled = this.enrolledCoursesSubject.value;
      const currentAvailable = this.availableCoursesSubject.value;
      const course = currentAvailable.find(c => c.id === courseId);

      if (course && !currentEnrolled.find(c => c.id === courseId)) {
        const courseWithProgress = {
          ...course,
          ...this.generateCourseProgressData(course)
        };

        this.enrolledCoursesSubject.next([...currentEnrolled, courseWithProgress]);
        this.availableCoursesSubject.next(currentAvailable.filter(c => c.id !== courseId));
        observer.next(true);
      } else {
        observer.next(false);
      }
      observer.complete();
    });
  }

  cancelEnrollment(course: Course): void {
    const currentEnrolled = this.enrolledCoursesSubject.value;
    const currentAvailable = this.availableCoursesSubject.value;

    const originalCourse = {
      id: course.id,
      title: course.title,
      instructor: course.instructor,
      level: course.level,
      duration: course.duration,
      technology: course.technology,
      description: course.description,
      image: course.image
    };

    this.enrolledCoursesSubject.next(currentEnrolled.filter(c => c.id !== course.id));
    this.availableCoursesSubject.next([...currentAvailable, originalCourse]);
  }

  private generateCourseProgressData(course: Course) {
    const progress = Math.floor(Math.random() * 76) + 10;
    
    const moduleCount = course.level === 'Iniciante' ? 4 : 
                       course.level === 'Intermediário' ? 6 : 8;
    
    const activitiesPerModule = 4;
    const totalActivities = moduleCount * activitiesPerModule;
    const completedActivities = Math.floor((progress / 100) * totalActivities);
    
    const modules: Module[] = [];
    let activityIdCounter = 1;
    let completedCount = 0;

    const activityTemplates = [
      { type: 'video' as const, titlePrefix: 'Vídeo:', duration: 45 },
      { type: 'reading' as const, titlePrefix: 'Leitura:', duration: 20 },
      { type: 'quiz' as const, titlePrefix: 'Quiz:', duration: 15 },
      { type: 'assignment' as const, titlePrefix: 'Exercício:', duration: 60 }
    ];

    for (let moduleIndex = 0; moduleIndex < moduleCount; moduleIndex++) {
      const activities: Activity[] = [];
      
      for (let actIndex = 0; actIndex < activitiesPerModule; actIndex++) {
        const template = activityTemplates[actIndex];
        const isCompleted = completedCount < completedActivities;
        
        const activity: Activity = {
          id: `activity-${activityIdCounter++}`,
          title: `${template.titlePrefix} ${course.title} - Módulo ${moduleIndex + 1}.${actIndex + 1}`,
          type: template.type,
          duration: template.duration,
          completed: isCompleted
        };

        if (isCompleted) {
          const daysAgo = Math.floor(Math.random() * 30);
          activity.completedAt = new Date();
          activity.completedAt.setDate(activity.completedAt.getDate() - daysAgo);
          
          if (template.type === 'quiz' || template.type === 'assignment') {
            activity.score = Math.floor(Math.random() * 31) + 70;
          }
          
          completedCount++;
        }

        activities.push(activity);
      }

      modules.push({
        id: `module-${moduleIndex + 1}`,
        title: `Módulo ${moduleIndex + 1}: ${this.getModuleTitle(course.technology, moduleIndex)}`,
        activities
      });
    }

    const totalStudyTime = Math.floor(parseInt(course.duration) * (progress / 100));

    return {
      progress,
      totalStudyTime,
      modules
    };
  }

  private getModuleTitle(technology: string, moduleIndex: number): string {
    const moduleTitles: { [key: string]: string[] } = {
      'Angular': [
        'Introdução e Setup',
        'Componentes e Templates',
        'Serviços e Injeção de Dependência',
        'Roteamento',
        'Formulários',
        'HTTP e APIs',
        'Testes',
        'Deploy e Otimização'
      ],
      'React': [
        'Fundamentos do React',
        'Hooks e Estado',
        'Context API',
        'Roteamento com React Router',
        'Gerenciamento de Estado',
        'Performance e Otimização',
        'Testes em React',
        'Deploy e Produção'
      ],
      'Node.js': [
        'Introdução ao Node.js',
        'Express Framework',
        'Banco de Dados',
        'Autenticação',
        'APIs RESTful',
        'Middleware',
        'Testes',
        'Deploy'
      ],
      'Python': [
        'Fundamentos do Python',
        'Pandas e NumPy',
        'Visualização de Dados',
        'Machine Learning',
        'Análise Estatística',
        'Projetos Práticos',
        'Deploy de Modelos',
        'Otimização'
      ],
      'Vue.js': [
        'Introdução ao Vue.js',
        'Componentes',
        'Vuex',
        'Vue Router',
        'Composition API',
        'Testes',
        'Performance',
        'Deploy'
      ]
    };

    const titles = moduleTitles[technology] || ['Módulo Genérico'];
    return titles[moduleIndex] || `Tópico ${moduleIndex + 1}`;
  }

  getEnrolledCourses(): Observable<Course[]> {
    return this.enrolledCourses$;
  }

  getAvailableCourses(): Observable<Course[]> {
    return this.availableCourses$;
  }

  private generateDetailedCourseData(progress: number, level: 'Básico' | 'Iniciante' | 'Intermediário' | 'Avançado') {
    const moduleCount = level === 'Básico' ? 3 :
                       level === 'Iniciante' ? 4 : 
                       level === 'Intermediário' ? 6 : 8;
    
    const activitiesPerModule = 4;
    const totalActivities = moduleCount * activitiesPerModule;
    const completedActivities = Math.floor((progress / 100) * totalActivities);
    const completedModules = Math.floor((progress / 100) * moduleCount);
    
    return {
      totalModules: moduleCount,
      completedModules,
      totalActivities,
      completedActivities,
      estimatedCompletion: this.calculateEstimatedCompletion(progress)
    };
  }

  private calculateEstimatedCompletion(progress: number): Date {
    const daysRemaining = Math.floor((100 - progress) / 5); // 5% por dia em média
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + daysRemaining);
    return estimatedDate;
  }
}
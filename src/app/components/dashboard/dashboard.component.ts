import { Component, OnInit, OnDestroy } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  userName: string = 'Usuário';
  currentView: string = 'home';
  sidebarOpen: boolean = false;
  private sidebarSubscription: Subscription = new Subscription();

  // Dados do Sprint Atual
  currentSprint = {
    title: 'Sprint Atual - Metodologia Ágil (Scrum)',
    sprintNumber: 3,
    startDate: '2025-01-01',
    endDate: '2025-01-14',
    progress: 75,
    tasks: [
      { id: 1, title: 'Implementar autenticação', status: 'completed', assignee: 'João Silva' },
      { id: 2, title: 'Criar dashboard', status: 'in-progress', assignee: 'Maria Santos' },
      { id: 3, title: 'Testes unitários', status: 'pending', assignee: 'Pedro Costa' },
      { id: 4, title: 'Deploy em produção', status: 'pending', assignee: 'Ana Lima' }
    ],
    burndownData: [
      { day: 1, planned: 100, actual: 100 },
      { day: 2, planned: 90, actual: 95 },
      { day: 3, planned: 80, actual: 85 },
      { day: 4, planned: 70, actual: 75 },
      { day: 5, planned: 60, actual: 65 },
      { day: 6, planned: 50, actual: 50 },
      { day: 7, planned: 40, actual: 35 }
    ]
  };

  menuItems = [
    { id: 'home', icon: 'fas fa-home', label: 'Início', active: true },
    { id: 'courses', icon: 'fas fa-book', label: 'Meus Cursos', active: false },
    { id: 'sprint', icon: 'fas fa-tasks', label: 'Sprint Atual', active: false },
    { id: 'progress', icon: 'fas fa-chart-line', label: 'Progresso', active: false },
    { id: 'calendar', icon: 'fas fa-calendar', label: 'Calendário', active: false },
    { id: 'profile', icon: 'fas fa-user', label: 'Perfil', active: false },
    { id: 'settings', icon: 'fas fa-cog', label: 'Configurações', active: false }
  ];

  constructor(
    private router: Router, 
    private authService: AuthService,
    private sidebarService: SidebarService
  ) {}

  ngOnInit() {
    // Verificar se o usuário está logado
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    // Obter dados do usuário logado
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.userName = currentUser.name;
    }
    
    // Restaurar o item selecionado do localStorage
    this.restoreSelectedMenuItem();
    
    // Inscrever-se no estado da sidebar
    this.sidebarSubscription = this.sidebarService.sidebarOpen$.subscribe(
      isOpen => this.sidebarOpen = isOpen
    );
  }

  ngOnDestroy() {
    this.sidebarSubscription.unsubscribe();
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  selectMenuItem(itemId: string) {
    this.menuItems.forEach(item => item.active = false);
    const selectedItem = this.menuItems.find(item => item.id === itemId);
    if (selectedItem) {
      selectedItem.active = true;
      this.currentView = itemId;
      
      // Salvar o item selecionado no localStorage
      localStorage.setItem('selectedMenuItem', itemId);
    }
    
    // Fechar sidebar automaticamente após seleção
    this.sidebarService.closeSidebar();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  // Método para obter a primeira letra do nome do usuário
  getUserInitial(): string {
    if (this.userName && this.userName.length > 0) {
      return this.userName.charAt(0).toUpperCase();
    }
    return 'U'; // Fallback para 'U' de Usuário
  }

  // Método para gerar cor de fundo baseada no nome
  getAvatarColor(): string {
    const colors = [
      '#007bff', '#28a745', '#dc3545', '#ffc107', 
      '#17a2b8', '#6f42c1', '#e83e8c', '#fd7e14',
      '#20c997', '#6610f2', '#e21e80', '#795548'
    ];
    
    if (this.userName && this.userName.length > 0) {
      const index = this.userName.charCodeAt(0) % colors.length;
      return colors[index];
    }
    return '#007bff'; // Cor padrão
  }

  getTaskStatusClass(status: string): string {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'in-progress': return 'status-in-progress';
      case 'pending': return 'status-pending';
      default: return '';
    }
  }

  getTaskStatusText(status: string): string {
    switch (status) {
      case 'completed': return 'Concluída';
      case 'in-progress': return 'Em Progresso';
      case 'pending': return 'Pendente';
      default: return status;
    }
  }

  getDaysRemaining(): number {
    const endDate = new Date(this.currentSprint.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }

  getCurrentViewTitle(): string {
    const activeItem = this.menuItems.find(item => item.active);
    return activeItem ? activeItem.label : 'Dashboard';
  }

  restoreSelectedMenuItem(): void {
    const savedItemId = localStorage.getItem('selectedMenuItem');
    if (savedItemId) {
      this.menuItems.forEach(item => item.active = false);
      const savedItem = this.menuItems.find(item => item.id === savedItemId);
      if (savedItem) {
        savedItem.active = true;
        this.currentView = savedItemId;
      }
    }
  }
}
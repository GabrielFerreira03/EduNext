import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SidebarService } from '../../services/sidebar.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;
  isLoggedIn = false;
  userName = '';
  sidebarOpen = false;
  isHomePage = false;
  isHeaderVisible = true;
  lastScrollTop = 0;
  scrollThreshold = 5;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private sidebarService: SidebarService
  ) {}

  ngOnInit() {
    this.checkLoginStatus();
    this.checkCurrentRoute();
    
    // Inscrever-se no estado da sidebar para atualizar o visual do botão
    this.sidebarService.sidebarOpen$.subscribe(
      isOpen => this.sidebarOpen = isOpen
    );

    // Detectar mudanças de rota para atualizar isHomePage
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkCurrentRoute();
    });
  }

  checkLoginStatus() {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      const currentUser = this.authService.getCurrentUser();
      this.userName = currentUser ? currentUser.name : '';
    }
  }

  checkCurrentRoute() {
    this.isHomePage = this.router.url === '/' || this.router.url === '/home';
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
    this.checkLoginStatus();
  }

  onLogoClick(): void {
    if (this.isLoggedIn) {
      this.router.navigate(['/dashboard']);
    } else if (this.isHomePage) {
      // Se estiver na página home, rola para o topo
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Se não estiver na home, navega para a home
      this.router.navigate(['/']);
    }
  }

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Se estiver no topo da página, sempre mostrar o navbar
    if (currentScrollTop <= 0) {
      this.isHeaderVisible = true;
      this.lastScrollTop = currentScrollTop;
      return;
    }

    // Verificar se o scroll foi significativo o suficiente
    const scrollDifference = Math.abs(currentScrollTop - this.lastScrollTop);
    
    if (scrollDifference > this.scrollThreshold) {
      if (currentScrollTop > this.lastScrollTop) {
        // Rolando para baixo - esconder navbar
        this.isHeaderVisible = false;
      } else {
        // Rolando para cima - mostrar navbar
        this.isHeaderVisible = true;
      }
      
      this.lastScrollTop = currentScrollTop;
    }
  }
}
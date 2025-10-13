import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SidebarService } from '../../services/sidebar.service';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  isHomePage = false;
  isLoginPage = false;
  isRegisterPage = false;
  hidePrimaryNavLinks = false;
  isSidebarOpen = false;
  isNavbarVisible = true;
  isHeaderVisible = true;
  sidebarOpen = false;
  isMenuOpen = false;
  lastScrollTop = 0;
  scrollThreshold = 100;
  isMobile = false;
  showResponsiveMenuButton = false;

  private subscriptions: Subscription = new Subscription();
  currentTheme: string = 'light';

  constructor(
    private authService: AuthService,
    private router: Router,
    private sidebarService: SidebarService,
    private themeService: ThemeService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.updateIsMobile();

    const themeSub = this.themeService.currentTheme$.subscribe(theme => {
      this.currentTheme = theme;
    });

    const sidebarSub = this.sidebarService.sidebarOpen$.subscribe(
      isOpen => {
        this.isSidebarOpen = isOpen;
        this.sidebarOpen = isOpen;
      }
    );

    const routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      const navEvent = event as NavigationEnd;
      this.isHomePage = navEvent.url === '/' || navEvent.url === '/home';
      this.isLoginPage = navEvent.url.startsWith('/login');
      this.isRegisterPage = navEvent.url.startsWith('/register');
      this.isLoggedIn = this.authService.isLoggedIn();
      const hiddenPaths = ['/dashboard', '/my-courses', '/progress', '/certificates', '/settings'];
      this.hidePrimaryNavLinks = hiddenPaths.some(path => navEvent.url.startsWith(path));
      this.updateResponsiveMenuButton();
    });

    this.subscriptions.add(sidebarSub);
    this.subscriptions.add(routerSub);
    this.subscriptions.add(themeSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    
    if (this.isMenuOpen) {
      this.isHeaderVisible = true;
      this.isNavbarVisible = true;
    }
  }

  onLogoClick(): void {
    this.goToHome();
  }

  goToLogin(): void {
    this.router.navigate(['/login']).then(() => {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    });
  }

  goToRegister(): void {
    this.router.navigate(['/register']).then(() => {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    });
  }


  goToCursos(): void {
    this.scrollToCourses();
  }

  goToSobre(): void {
    this.scrollToAbout();
  }



  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
    this.notificationService.showSuccess('Foi deslogado com sucesso');
  }

  goToHome(): void {
    if (this.isHomePage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
      });
    }
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  scrollToSection(sectionId: string): void {
    if (this.isHomePage) {
      this.scrollToElement(sectionId);
    } else {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => this.scrollToElement(sectionId), 100);
      });
    }
  }

  scrollToTop(): void {
    if (this.isHomePage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
      });
    }
  }

  scrollToCourses(): void {
    if (this.isHomePage) {
      this.scrollToElement('courses');
    } else {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => this.scrollToElement('courses'), 100);
      });
    }
  }

  private scrollToElement(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollToAbout(): void {
    if (this.isHomePage) {
      this.scrollToElement('about');
    } else {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => this.scrollToElement('about'), 100);
      });
    }
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  private updateIsMobile(): void {
    this.isMobile = window.innerWidth <= 768;
    this.updateResponsiveMenuButton();
  }

  private updateResponsiveMenuButton(): void {
    
    this.showResponsiveMenuButton = this.isMobile && !this.hidePrimaryNavLinks;
    
    if (!this.showResponsiveMenuButton) {
      this.isMenuOpen = false;
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    if (!this.isHomePage) return;

    
    if (this.isMenuOpen) {
      this.isHeaderVisible = true;
      this.isNavbarVisible = true;
      return;
    }

    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScrollTop <= this.scrollThreshold) {
      this.isHeaderVisible = true;
      this.isNavbarVisible = true;
      this.lastScrollTop = currentScrollTop;
      return;
    }

    const scrollDifference = Math.abs(currentScrollTop - this.lastScrollTop);
    if (scrollDifference < 10) return;

    if (currentScrollTop > this.lastScrollTop) {
      this.isHeaderVisible = false;
      this.isNavbarVisible = false;
    } else {
      this.isHeaderVisible = true;
      this.isNavbarVisible = true;
    }

    this.lastScrollTop = currentScrollTop;
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(): void {
    this.updateIsMobile();
  }
}
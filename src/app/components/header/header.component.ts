import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SidebarService } from '../../services/sidebar.service';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  isHomePage = false;
  isSidebarOpen = false;
  isNavbarVisible = true;
  isHeaderVisible = true;
  sidebarOpen = false;
  isMenuOpen = false;
  lastScrollTop = 0;
  scrollThreshold = 100;

  private subscriptions: Subscription = new Subscription();
  currentTheme: string = 'light';

  constructor(
    private authService: AuthService,
    private router: Router,
    private sidebarService: SidebarService,
    private themeService: ThemeService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();

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
      this.isLoggedIn = this.authService.isLoggedIn();
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

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    if (!this.isHomePage) return;

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
}
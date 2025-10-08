import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SidebarService } from '../../services/sidebar.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  isOpen = false;
  userName = 'Usuário';
  userEmail = 'usuario@email.com';
  userAvatar = 'assets/images/default-avatar.png';
  
  private sidebarSubscription!: Subscription;

  constructor(
    private sidebarService: SidebarService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.sidebarSubscription = this.sidebarService.sidebarOpen$.subscribe(
      isOpen => this.isOpen = isOpen
    );

    this.loadUserInfo();
  }

  ngOnDestroy(): void {
    if (this.sidebarSubscription) {
      this.sidebarSubscription.unsubscribe();
    }
  }

  private loadUserInfo(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.userName = currentUser.name;
      this.userEmail = currentUser.email;
      this.userAvatar = currentUser.avatar || 'assets/images/default-avatar.png';
    }
  }

  closeSidebar(): void {
    this.sidebarService.closeSidebar();
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.closeSidebar();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
    this.closeSidebar();
  }

  getFirstLetter(): string {
    return this.userName ? this.userName.charAt(0).toUpperCase() : 'U';
  }
}

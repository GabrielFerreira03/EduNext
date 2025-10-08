import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  fullName: string = '';
  username: string = '';
  birthDate: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  acceptTerms: boolean = false;
  acceptMarketing: boolean = false;

  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  onSubmit(): void {
    this.errorMessage = '';

    if (!this.fullName || !this.username || !this.birthDate || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Por favor, preencha todos os campos.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'As senhas não coincidem.';
      return;
    }

    if (!this.acceptTerms) {
      this.errorMessage = 'Você deve aceitar os termos de uso.';
      return;
    }

    this.isLoading = true;

    this.authService.register(this.fullName, this.email, this.password).subscribe({
      next: (success) => {
        this.isLoading = false;
        if (success) {
          // Primeiro fazer logout para não manter o usuário logado
          this.authService.logout();
          
          // Mostrar mensagem de sucesso
          this.notificationService.showSuccess('Cadastro realizado com sucesso! Agora você pode fazer login.');
          
          // Redirecionar para login após um pequeno delay
          setTimeout(() => {
            this.router.navigate(['/login']).then(() => {
              setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }, 100);
            });
          }, 1500);
        } else {
          // Verificar se o email já existe
          const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
          const emailExists = existingUsers.find((u: any) => u.email === this.email);
          
          if (emailExists) {
            this.errorMessage = 'Este email já está cadastrado. Tente fazer login ou use outro email.';
          } else {
            this.errorMessage = 'Erro ao criar conta. Tente novamente.';
          }
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Erro ao criar conta. Tente novamente.';
      }
    });
  }

  togglePasswordVisibility(field: string): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else if (field === 'confirm') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']).then(() => {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    });
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }
}
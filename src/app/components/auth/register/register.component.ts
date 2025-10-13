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

    // Validação de força da senha: mínimo 8 caracteres e pelo menos 1 símbolo
    if (!this.isStrongPassword(this.password)) {
      this.errorMessage = 'A senha deve conter pelo menos 8 caracteres e um símbolo.';
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
          // Mostrar mensagem de sucesso e redirecionar para o mesmo lugar do login (dashboard)
          this.notificationService.showSuccess('Cadastro concluído com sucesso');
          this.router.navigate(['/dashboard']).then(() => {
            setTimeout(() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 100);
          });
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

  // Validação: mínimo 8 caracteres e pelo menos 1 símbolo
  private isStrongPassword(pw: string): boolean {
    return /^(?=.*[^A-Za-z0-9]).{8,}$/.test(pw);
  }

  // Auxiliar para o template: verifica se há ao menos um símbolo
  hasSymbol(pw: string): boolean {
    return /[^A-Za-z0-9]/.test(pw || '');
  }

  // Controla habilitação do botão: todos os campos preenchidos, termos aceitos,
  // senha forte e confirmação igual
  isFormValid(): boolean {
    return !!(
      this.fullName &&
      this.username &&
      this.birthDate &&
      this.email &&
      this.password &&
      this.confirmPassword &&
      this.password === this.confirmPassword &&
      this.isStrongPassword(this.password) &&
      this.acceptTerms
    );
  }
}
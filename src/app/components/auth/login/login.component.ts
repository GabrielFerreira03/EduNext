import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  showPassword: boolean = false;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      this.email = savedEmail;
      this.rememberMe = true;
    }
  }

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, preencha todos os campos.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.email === this.email);

    if (!user) {
      this.errorMessage = 'Email não encontrado. Cadastre-se primeiro.';
      this.notificationService.showError('Email não encontrado. Cadastre-se primeiro.');
      this.isLoading = false;
      return;
    }

    if (user.password === this.password) {
      this.authService.login(this.email, this.password).subscribe({
        next: (success) => {
          this.isLoading = false;
          if (success) {
            if (this.rememberMe) {
              localStorage.setItem('rememberedEmail', this.email);
            } else {
              localStorage.removeItem('rememberedEmail');
            }
            this.notificationService.showSuccess('Login concluído com sucesso');
            this.router.navigate(['/dashboard']);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Erro ao fazer login. Tente novamente.';
          this.notificationService.showError('Erro ao fazer login. Tente novamente.');
        }
      });
    } else {
      this.errorMessage = 'Senha incorreta.';
      this.notificationService.showError('Senha incorreta.');
      this.isLoading = false;
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  goToRegister(): void {
    this.router.navigate(['/register']).then(() => {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    });
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }
}
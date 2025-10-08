import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

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

  constructor(private router: Router, private authService: AuthService) {}

  onSubmit() {
    this.errorMessage = '';
    
    // Validação básica
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, preencha todos os campos.';
      return;
    }

    // Verificar se o email está cadastrado
    if (!this.authService.isEmailRegistered(this.email)) {
      this.errorMessage = 'Email não cadastrado. Por favor, registre-se primeiro.';
      return;
    }

    // Tentar fazer login
    const user = this.authService.login(this.email, this.password);
    
    if (user) {
      // Se "Lembrar de mim" estiver marcado, salvar no localStorage
      if (this.rememberMe) {
        localStorage.setItem('rememberedEmail', this.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      // Login bem-sucedido, redirecionar para dashboard
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMessage = 'Email ou senha incorretos.';
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  ngOnInit() {
    // Verificar se há email salvo para "Lembrar senha"
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      this.email = rememberedEmail;
      this.rememberMe = true;
    }
  }
}
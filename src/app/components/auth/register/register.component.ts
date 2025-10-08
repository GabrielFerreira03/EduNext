import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  // Dados do formulário
  fullName: string = '';
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  birthDate: string = '';
  
  // Controles de senha
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  
  // Termos e LGPD
  acceptTerms: boolean = false;
  acceptMarketing: boolean = false;
  
  // Controles de validação
  passwordStrength: string = '';
  emailValid: boolean = true;
  errorMessage: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  onSubmit() {
    this.errorMessage = '';
    
    // Validações
    if (!this.validateForm()) {
      return;
    }

    // Verificar se as senhas coincidem
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'As senhas não coincidem.';
      return;
    }

    // Verificar termos obrigatórios
    if (!this.acceptTerms) {
      this.errorMessage = 'Você deve aceitar os Termos de Serviço para continuar.';
      return;
    }

    // Tentar registrar o usuário
    const success = this.authService.register(this.email, this.password, this.fullName);
    
    if (success) {
      alert('Cadastro realizado com sucesso! Você será redirecionado para o login.');
      this.router.navigate(['/login']);
    } else {
      this.errorMessage = 'Este email já está cadastrado. Tente fazer login ou use outro email.';
    }
  }

  validateForm(): boolean {
    if (!this.fullName || !this.username || !this.email || !this.password || !this.confirmPassword || !this.birthDate) {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
      return false;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Por favor, insira um e-mail válido.';
      return false;
    }

    if (this.password.length < 8) {
      this.errorMessage = 'A senha deve ter pelo menos 8 caracteres.';
      return false;
    }

    return true;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  checkPasswordStrength() {
    const password = this.password;
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    switch (strength) {
      case 0:
      case 1:
        this.passwordStrength = 'fraca';
        break;
      case 2:
      case 3:
        this.passwordStrength = 'média';
        break;
      case 4:
      case 5:
        this.passwordStrength = 'forte';
        break;
    }
  }

  togglePasswordVisibility(field: string) {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else if (field === 'confirm' || field === 'confirmPassword') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  onEmailChange() {
    this.emailValid = this.isValidEmail(this.email);
  }

  onPasswordChange() {
    this.checkPasswordStrength();
  }
}
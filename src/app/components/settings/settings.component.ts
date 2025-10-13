import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  currentUser: User | null = null;
  currentTheme: string = 'light';
  
  activeTab: string = 'profile';
  showPasswordForm: boolean = false;
  showPasswordSection: boolean = false;
  showCurrentPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;
  
  profileForm = {
    name: '',
    email: '',
    bio: '',
    phone: '',
    location: ''
  };
  
  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  
  notificationSettings = {
    emailNotifications: true,
    pushNotifications: true,
    courseReminders: true,
    weeklyProgress: true,
    newCourses: false
  };
  
  privacySettings = {
    profileVisibility: 'public',
    showProgress: true,
    showCertificates: true,
    allowMessages: true
  };

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.profileForm.name = this.currentUser.name;
      this.profileForm.email = this.currentUser.email;
    }
    
    this.themeService.currentTheme$.subscribe(theme => {
      this.currentTheme = theme;
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  togglePasswordForm(): void {
    this.showPasswordForm = !this.showPasswordForm;
    this.showPasswordSection = this.showPasswordForm;
  }

  togglePasswordVisibility(field: string): void {
    switch (field) {
      case 'current':
        this.showCurrentPassword = !this.showCurrentPassword;
        break;
      case 'new':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirm':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
    }
  }

  updateProfile(): void {
    console.log('Atualizando perfil:', this.profileForm);
    this.notificationService.showSuccess('Perfil atualizado com sucesso!');
  }

  changePassword(): void {
    
    if (!this.currentUser || !this.currentUser.email) {
      this.notificationService.showError('Você precisa estar logado para alterar a senha.');
      return;
    }

    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.notificationService.showError('As senhas não coincidem!');
      return;
    }
    
    if (this.passwordForm.newPassword.length < 8) {
      this.notificationService.showError('A nova senha deve ter pelo menos 8 caracteres!');
      return;
    }
    
    
    if (!this.hasSymbol(this.passwordForm.newPassword)) {
      this.notificationService.showError('A nova senha deve conter pelo menos um símbolo (ex: ! &#64; # $ %).');
      return;
    }

    
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = existingUsers.findIndex((u: any) => u.email === this.currentUser!.email);

    if (userIndex === -1) {
      this.notificationService.showError('Conta não encontrada. Faça login novamente.');
      return;
    }

    const storedUser = existingUsers[userIndex];

    
    if (!this.passwordForm.currentPassword || storedUser.password !== this.passwordForm.currentPassword) {
      this.notificationService.showError('Senha atual incorreta!');
      return;
    }

    
    existingUsers[userIndex].password = this.passwordForm.newPassword;
    localStorage.setItem('users', JSON.stringify(existingUsers));

    console.log('Alterando senha...');
    this.notificationService.showSuccess('Senha alterada com sucesso!');
    this.passwordForm = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  }

  updateNotifications(): void {
    console.log('Atualizando notificações:', this.notificationSettings);
    this.notificationService.showSuccess('Configurações de notificação atualizadas!');
  }

  updatePrivacy(): void {
    console.log('Atualizando privacidade:', this.privacySettings);
    this.notificationService.showSuccess('Configurações de privacidade atualizadas!');
  }

  setTheme(theme: string): void {
    this.themeService.setTheme(theme);
  }

  exportData(): void {
    console.log('Exportando dados do usuário...');
    this.notificationService.showInfo('Seus dados serão enviados por email em até 24 horas.');
  }

  deleteAccount(): void {
    const confirmation = confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.');
    if (confirmation) {
      console.log('Excluindo conta...');
      this.notificationService.showWarning('Conta excluída com sucesso.');
    }
  }

  getFirstLetter(): string {
    return this.currentUser?.name?.charAt(0).toUpperCase() || 'U';
  }

  formatDate(date: Date | string): string {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('pt-BR');
  }

  isPasswordFormValid(): boolean {
    return this.passwordForm.currentPassword.length > 0 &&
           this.passwordForm.newPassword.length >= 8 &&
           this.passwordForm.newPassword === this.passwordForm.confirmPassword &&
           this.passwordForm.newPassword !== this.passwordForm.currentPassword &&
           this.hasSymbol(this.passwordForm.newPassword);
  }

  
  hasSymbol(value: string): boolean {
    if (!value) return false;
    return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
  }
}

import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

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
    private themeService: ThemeService
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
    alert('Perfil atualizado com sucesso!');
  }

  changePassword(): void {
    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }
    
    if (this.passwordForm.newPassword.length < 6) {
      alert('A nova senha deve ter pelo menos 6 caracteres!');
      return;
    }
    
    console.log('Alterando senha...');
    alert('Senha alterada com sucesso!');
    this.passwordForm = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  }

  updateNotifications(): void {
    console.log('Atualizando notificações:', this.notificationSettings);
    alert('Configurações de notificação atualizadas!');
  }

  updatePrivacy(): void {
    console.log('Atualizando privacidade:', this.privacySettings);
    alert('Configurações de privacidade atualizadas!');
  }

  setTheme(theme: string): void {
    this.themeService.setTheme(theme);
  }

  exportData(): void {
    console.log('Exportando dados do usuário...');
    alert('Seus dados serão enviados por email em até 24 horas.');
  }

  deleteAccount(): void {
    const confirmation = confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.');
    if (confirmation) {
      console.log('Excluindo conta...');
      alert('Conta excluída com sucesso.');
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
           this.passwordForm.newPassword !== this.passwordForm.currentPassword;
  }
}

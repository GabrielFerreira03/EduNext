import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

declare global {
  interface Window {
    resetEduNextData: () => void;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'EduNext - Plataforma Educacional';
  
  constructor(private authService: AuthService) {
    console.log('EduNext iniciado com sucesso!');
    
    // Adicionar função global para resetar dados (útil para desenvolvimento)
    window.resetEduNextData = () => {
      this.authService.clearAllData();
    };
    
    console.log('Para resetar todos os dados, digite: resetEduNextData() no console');
  }
}
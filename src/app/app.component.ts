import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { NotificationService } from './services/notification.service';

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
export class AppComponent implements OnInit {
  title = 'EduNext - Plataforma Educacional';
  
  constructor(private authService: AuthService, private notificationService: NotificationService) {
    console.log('EduNext iniciado com sucesso!');
    
  
    window.resetEduNextData = () => {
      this.authService.clearAllData();
    };
    
    console.log('Para resetar todos os dados, digite: resetEduNextData() no console');
  }

  ngOnInit(): void {
    
  }
}
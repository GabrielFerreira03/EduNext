import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'EduNext - Plataforma Educacional';
  
  constructor() {
    console.log('EduNext iniciado com sucesso!');
  }
}
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  birthDate?: Date;
  joinDate?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      const user = JSON.parse(userData);
      this.currentUserSubject.next(user);
    }
  }

  login(email: string, password: string): Observable<boolean> {
    return new Observable(observer => {
      setTimeout(() => {
        if (email && password) {
          const user: User = {
            id: '1',
            name: this.extractNameFromEmail(email),
            email: email,
            avatar: 'assets/images/default-avatar.png',
            birthDate: new Date('1990-01-01'),
            joinDate: new Date('2023-01-01')
          };
          
          this.currentUserSubject.next(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
          observer.next(true);
        } else {
          observer.next(false);
        }
        observer.complete();
      }, 1000);
    });
  }

  register(name: string, email: string, password: string): Observable<boolean> {
    return new Observable(observer => {
      setTimeout(() => {
        if (name && email && password) {
          // Verificar se o email já existe
          const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
          const emailExists = existingUsers.find((u: any) => u.email === email);
          
          if (emailExists) {
            observer.next(false);
            observer.complete();
            return;
          }

          const newUser = {
            id: Date.now().toString(),
            name: name,
            email: email,
            password: password, // Salvar a senha para o login funcionar
            avatar: 'assets/images/default-avatar.png',
            birthDate: new Date('1990-01-01'),
            joinDate: new Date()
          };
          
          // Adicionar ao array de usuários
          existingUsers.push(newUser);
          localStorage.setItem('users', JSON.stringify(existingUsers));
          
          // Criar objeto User para o currentUser (sem senha)
          const user: User = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            avatar: newUser.avatar,
            birthDate: newUser.birthDate,
            joinDate: newUser.joinDate
          };
          
          this.currentUserSubject.next(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
          observer.next(true);
        } else {
          observer.next(false);
        }
        observer.complete();
      }, 1000);
    });
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  private extractNameFromEmail(email: string): string {
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  // Método para resetar todos os dados (útil para desenvolvimento/testes)
  clearAllData(): void {
    localStorage.removeItem('users');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('rememberedEmail');
    this.currentUserSubject.next(null);
    console.log('Todos os dados de usuários foram resetados.');
  }
}
import { Injectable } from '@angular/core';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users: User[] = [];

  constructor() {
    // Carregar usuários do localStorage ou inicializar com dados de exemplo
    this.loadUsers();
  }

  private loadUsers(): void {
    const storedUsers = localStorage.getItem('registeredUsers');
    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
    } else {
      // Usuários de exemplo para teste
      this.users = [
        {
          id: '1',
          email: 'admin@edunext.com',
          password: '123456',
          name: 'Administrador'
        },
        {
          id: '2',
          email: 'usuario@teste.com',
          password: 'senha123',
          name: 'Usuário Teste'
        }
      ];
      this.saveUsers();
    }
  }

  private saveUsers(): void {
    localStorage.setItem('registeredUsers', JSON.stringify(this.users));
  }

  register(email: string, password: string, name: string): boolean {
    // Verificar se o email já está cadastrado
    if (this.users.find(user => user.email === email)) {
      return false; // Email já existe
    }

    // Criar novo usuário
    const newUser: User = {
      id: Date.now().toString(),
      email,
      password,
      name
    };

    this.users.push(newUser);
    this.saveUsers();
    return true;
  }

  login(email: string, password: string): User | null {
    const user = this.users.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('isLoggedIn', 'true');
      return user;
    }
    return null;
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  isEmailRegistered(email: string): boolean {
    return this.users.some(user => user.email === email);
  }
}
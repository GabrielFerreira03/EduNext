import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  constructor() { }

  showSuccess(message: string, duration: number = 5000): void {
    this.addNotification(message, 'success', duration);
  }

  showError(message: string, duration: number = 5000): void {
    this.addNotification(message, 'error', duration);
  }

  showInfo(message: string, duration: number = 5000): void {
    this.addNotification(message, 'info', duration);
  }

  showWarning(message: string, duration: number = 5000): void {
    this.addNotification(message, 'warning', duration);
  }

  private addNotification(message: string, type: Notification['type'], duration: number): void {
    const notification: Notification = {
      id: Date.now().toString(),
      message,
      type,
      duration
    };

    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, notification]);

    // Auto remove notification after duration
    if (duration > 0) {
      setTimeout(() => {
        this.removeNotification(notification.id);
      }, duration);
    }
  }

  removeNotification(id: string): void {
    const currentNotifications = this.notificationsSubject.value;
    const filteredNotifications = currentNotifications.filter(n => n.id !== id);
    this.notificationsSubject.next(filteredNotifications);
  }

  clearAll(): void {
    this.notificationsSubject.next([]);
  }
}
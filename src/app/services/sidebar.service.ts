import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private sidebarOpenSubject = new BehaviorSubject<boolean>(false);
  public sidebarOpen$ = this.sidebarOpenSubject.asObservable();

  constructor() { }

  toggleSidebar(): void {
    this.sidebarOpenSubject.next(!this.sidebarOpenSubject.value);
  }

  setSidebarOpen(isOpen: boolean): void {
    this.sidebarOpenSubject.next(isOpen);
  }

  getSidebarState(): boolean {
    return this.sidebarOpenSubject.value;
  }

  closeSidebar(): void {
    this.sidebarOpenSubject.next(false);
  }
}
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface User {
  phoneNumber: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();
  loggedIn$ = new BehaviorSubject<boolean>(false);

  constructor() {
    // Restore session from local storage
    const savedUser = localStorage.getItem('user_session');
    if (savedUser) {
        try {
            const user = JSON.parse(savedUser);
            this.userSubject.next(user);
            this.loggedIn$.next(true);
        } catch (e) {
            localStorage.removeItem('user_session');
        }
    }
  }

  login(phoneNumber: string): void {
    const user: User = { phoneNumber };
    this.userSubject.next(user);
    this.loggedIn$.next(true);
    localStorage.setItem('user_session', JSON.stringify(user));
  }

  signOut(): void {
    localStorage.removeItem('user_session');
    this.userSubject.next(null);
    this.loggedIn$.next(false);
  }
}

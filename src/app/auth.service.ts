import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = new BehaviorSubject<boolean>(this.getLoginStatusFromSession());

  constructor() {}

  private getLoginStatusFromSession(): boolean {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    return isLoggedIn === 'true';
  }

  setLoginStatus(status: boolean) {
    this.isLoggedIn.next(status);
    sessionStorage.setItem('isLoggedIn', status.toString());
  }
}

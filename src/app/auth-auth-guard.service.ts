// auth.guard.ts

import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { AuthService } from './auth.service';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe(event => {
        if (event instanceof NavigationStart && event.url === '/') {
          this.authService.isLoggedIn.subscribe(isLoggedIn => {
            if (isLoggedIn) {
              this.router.navigate(['/home']);
            } else {
              this.router.navigate(['/login']);
            }
          });
        }
      });
  }
}

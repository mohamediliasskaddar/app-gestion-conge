import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'  
})
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

   canActivate(): Observable<boolean> {
    return this.auth.user$.pipe(
      take(1), // take the first emitted value
      map(user => {
        if (user) {
          return true;
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }
}

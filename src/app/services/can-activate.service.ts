import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { UserService } from './user.service';
import { UserRole } from '../interfaces';

@Injectable()
export class CanActivateService implements CanActivate {
  constructor(
    private userService: UserService,
    private router: Router,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (route.url.find(url => url.path === 'logout')) {
      return this.userService.logout().pipe(
        tap(() => this.router.navigate(['/'])),
        map(() => true),
      );
    }

    if (route.url.find(url => url.path === 'student') &&
      this.userService.isAuthorized() &&
      this.userService.getUser().role === UserRole.STUDENT
    ) {
      return of(true);
    }

    if (route.url.find(url => url.path === 'teacher') &&
      this.userService.isAuthorized() &&
      this.userService.getUser().role === UserRole.ADMIN
    ) {
      return of(true);
    }
    
    this.router.navigate(['/login']);
    return of(false);
  }
}

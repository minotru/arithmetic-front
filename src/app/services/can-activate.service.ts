import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable()
export class CanActivateService implements CanActivate {
  constructor(
    private userService: UserService,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (state.url.indexOf('logout') !== -1) {
      return this.userService.logout().pipe(
        tap(() => this.router.navigate(['/'])),
        map(() => true),
      );
    }
  }
}

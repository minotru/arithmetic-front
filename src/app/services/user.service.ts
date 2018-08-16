import { Injectable } from '@angular/core';
import { IUser } from '../interfaces/user';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';

const baseUrl = environment.baseUrl;

@Injectable()
export class UserService {
  private user: IUser = null;

  constructor(private http: HttpClient) {
  }

  getUser(): IUser {
    return this.user;
  }

  isAuthorized(): boolean {
    return this.user !== null;
  }

  login(login: string, password: string): Observable<IUser> {
    return this.http.post<IUser>(
      `${baseUrl}/auth/login`,
      { login, password },
      {withCredentials: true},
    ).pipe(
      tap(user => this.user = user),
    );
  }

  logout(): Observable<void> {
    return this.http.get<any>(`${baseUrl}/auth/logout`).pipe(tap(() => this.user = null));
  }

  get fullUserName(): string {
    if (!this.user) {
      return 'Unauthorized';
    }
    return `${this.user.name} ${this.user.surname}`;
  }
}

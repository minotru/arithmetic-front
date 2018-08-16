import { Injectable } from '@angular/core';
import { IUser } from '../interfaces/user';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';

const baseUrl = environment.baseUrl;

@Injectable()
export class UserService {
  private user: IUser;

  constructor(private http: HttpClient) {
    this.user = {name: 'Иван', surname: 'Петров' } as IUser ;
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
    ).pipe(
      tap(user => this.user = user),
    );
  }

  logout(): Observable<void> {
    return this.http.get<any>(`${baseUrl}/auth/logout`).pipe(tap(() => this.user = null));
  }

  get fullUserName(): string {
    return `${this.user.name} ${this.user.surname}`;
  }
}

import { Injectable } from '@angular/core';
import { IUser } from '../interfaces/user';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';
import { STUDENTS } from '../mocks/students';

const baseUrl = environment.baseUrl;
const apiUrl = `${baseUrl}/api`;

@Injectable()
export class UserService {
  private user: IUser = null;

  constructor(private http: HttpClient) {
    this.login('test', 'test').subscribe(() => {});
  }

  getUser(): IUser {
    return this.user;
  }

  getUserById(userId: string): Observable<IUser> {
    return of(STUDENTS[0]);
  }

  getStudents(): Observable<IUser[]> {
    // return of(STUDENTS);
    return this.http.get<IUser[]>(`${apiUrl}/admin/users`);
  }

  isAuthorized(): boolean {
    return this.user !== null;
  }

  editUser(userId: string, data: IUser): Observable<IUser> {
    return this.http.put<IUser>(`${apiUrl}/admin/users/${userId}`, data);
  }

  createUser(data: IUser): Observable<IUser> {
    return this.http.post<IUser>(`${apiUrl}/admin/users`, data);
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

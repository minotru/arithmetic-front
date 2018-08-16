import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return next
      .handle(req)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          if (err && err.error && err.error.error) {
            return throwError(err.error);
          }
          return throwError(err);
        }),
      );
  }
}

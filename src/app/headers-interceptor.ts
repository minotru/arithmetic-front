import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const reqClone = req.clone({
      withCredentials: true,
      setHeaders: {
        'Content-Type': 'application/json',
      },
    });
    return next.handle(reqClone);
  }
}

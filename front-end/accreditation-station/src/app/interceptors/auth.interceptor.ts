import { Observable } from 'rxjs';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private token: any;
  constructor(private router: Router) {}
  
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      
    if (this.router.url !== '/register' && this.router.url !== '/login') {
        if (sessionStorage.getItem('token')) {
            this.token = sessionStorage.getItem('token');
        } else {
            console.log("NO AUTH");
            this.router.navigate(['login']);
        }
        request = request.clone({
            headers: new HttpHeaders({
                'x-access-token': this.token
            })
        });
    }  
    return next.handle(request);
  }
}
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  constructor(private router: Router) { }

  logout() {
    if (sessionStorage.getItem('token')) {
      sessionStorage.removeItem('token');
      this.router.navigate['/login'];
    }
  }
}

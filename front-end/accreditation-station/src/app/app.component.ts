import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LogoutService } from './services/logout.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'accreditation-station';

  constructor(private logoutSvc: LogoutService, private router: Router) {

  }
  
  logout() {
    this.logoutSvc.logout();
  }

  navigateHome() {
    if (sessionStorage.getItem('user_role')) {
      let role = atob(sessionStorage.getItem('user_role'));
      if (role === 'admin') {
        this.router.navigate(['/admin']);
      } else if (role === 'instructor') {
        this.router.navigate(['/instructor']);
      } else if (role === 'audit') {
        this.router.navigate(['/audit']);
      } else {
        this.router.navigate(['/login']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }
}

import { Component } from '@angular/core';
import { Event as NavigationEvent, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { LogoutService } from './services/logout.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'accreditation-station';
  isLoggedIn = false;
  onChangePassword = false;
  constructor(private logoutSvc: LogoutService, private router: Router, private activatedRoute: ActivatedRoute) {
    
  }
  
  ngOnInit(): void {

    this.router.events.subscribe(
      (event: NavigationEvent) => {
        if(event instanceof NavigationEnd) {
          if (event.url) {
            let theUrl = event.url;
            if (theUrl.indexOf('login') === -1 && theUrl.indexOf('register') === -1 && theUrl.indexOf('forgot-password') === -1) {
              this.isLoggedIn = true;
            } else {
              this.isLoggedIn = false;
            }
            if (theUrl.indexOf('change-password') !== -1) {
              this.onChangePassword = true;
            } else {
              this.onChangePassword = false;
            }
          }
        }
      });
  }

  logout() {
    this.logoutSvc.logout();
  }

  changePassword() {
    this.router.navigate(['/change-password']);
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

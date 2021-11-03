import { Component } from '@angular/core';
import { LogoutService } from './services/logout.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'accreditation-station';

  constructor(private logoutSvc: LogoutService) {

  }
  
  logout() {
    this.logoutSvc.logout();
  }
}

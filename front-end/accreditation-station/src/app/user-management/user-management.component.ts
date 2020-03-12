import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  public addUser = false;
  public viewUsers = false;
  constructor() { }

  ngOnInit(): void {
  }

  buttonFn(btn) {
    this.clearBtn();
    switch (btn) {
      case 'add-user':
        this.addUser = true;
        break;
      case 'view-users':
        this.viewUsers = true;
        break;
      default:
        break;
    }
  }

  clearBtn() {
    this.addUser = false;
    this.viewUsers = false;
  }
}

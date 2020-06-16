import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { EditUserComponent } from '../edit-user/edit-user.component';

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.css']
})
export class ViewUsersComponent implements OnInit {

  dialogRef;
  messages = {
    updatedUserMsg: "User successfully updated.",
    removedUserMsg: "User successfully removed.",
    errMsg: "There has been an error processing your request. Please try again later."
  }
  showMessage = false;
  displayMessage = "";
  users = [
    {
      first_name: "John",
      last_name: "Doe",
      title: "Professor", //from AD
      roles: ["Instructor","Admin","ABET"],
      email_address: "john@doe.com" //from AD
    }
  ];
  constructor(private userSvc: UserService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.showMessage = false;
    this.getUsers();
  }

  getUsers() {
    this.userSvc.getAllUsers().subscribe((resp) => {
      if (resp) {
        if (resp.status === "S") {
          console.log(resp.statusMessage);
          this.users = resp.users;
        } else {
          this.displayMessage = this.messages.errMsg;
          this.showMessage = true;
        }
      }
    });
  }
  
  editUserModal(user) {
    this.showMessage = false;
    console.log(user);
    this.messages.updatedUserMsg = user.first_name + ' ' + user.last_name + ' has been successfully updated!';
    this.dialogRef = this.dialog.open(EditUserComponent, {
      height: "",
      width: "600px",
      data: user
    });
    this.dialogRef.afterClosed().subscribe((result) => {
      this.userSvc.getAllUsers().subscribe((resp) => {
        if (resp) {
          if (resp.status === "S") {
            console.log(resp.statusMessage);
            this.displayMessage = this.messages.updatedUserMsg;
            this.showMessage = true;
            this.users = resp.users;
          } else {
            this.displayMessage = this.messages.errMsg;
            this.showMessage = true;
          }
        }
      });
    });
  }

  removeUser(user) {
    this.showMessage = false;
    console.log(user);
    this.userSvc.removeUser(user).subscribe(resp => {
      if (resp) {
        console.log(resp);
        if (resp.status === "S") {
          console.log("User Successfully Removed");
          this.showMessage = true;
          this.displayMessage = this.messages.removedUserMsg;
          this.getUsers();
        } else {
          this.showMessage = true;
          this.displayMessage = this.messages.errMsg;
        }
      }
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { AreYouSureModalComponent } from 'src/app/are-you-sure-modal/are-you-sure-modal.component';

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.css']
})
export class ViewUsersComponent implements OnInit {

  dialogRef;
  areYouSureDialogRef;
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
      roles: ["Instructor","Admin","Audit"],
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
    this.messages.updatedUserMsg = user.first_name + ' ' + user.last_name + ' has been successfully updated!';
    this.dialogRef = this.dialog.open(EditUserComponent, {
      height: "",
      width: "600px",
      data: user
    });
    this.dialogRef.afterClosed().subscribe((result) => {
      if (result.data === 'submitted') {
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
      }
    });
  }

  removeUser(user) {
    this.showMessage = false;
    console.log(user);
    this.areYouSureDialogRef = this.dialog.open(AreYouSureModalComponent, {
      height: "",
      width: "600px",
      data: {data:"Are You Sure You Want To Delete This User?"}
    });
    this.areYouSureDialogRef.afterClosed().subscribe((result) => {
      if (result.data === 'yes') {
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
      } else {
        //do nothing
        console.log('Not Removing User');
      }
    });
  }
}
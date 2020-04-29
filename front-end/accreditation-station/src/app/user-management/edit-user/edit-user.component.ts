import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  userData = {
    fname: "",
    lname: "",
    email: "",
    title: "",
    roles: [],
    id: ""
  };
  roles = [
    {name: "ABET", id:"abet"},
    {name: "Admin", id:"admin"},
    {name: "Instructor", id:"instructor"}
  ]
  editUserForm: FormGroup;
  submitted = false;

  constructor(public dialogRef: MatDialogRef<EditUserComponent>, @Inject(MAT_DIALOG_DATA) public data, private fb: FormBuilder, private userSvc: UserService) { }

  ngOnInit(): void {
    this.userData.fname = this.data.first_name;
    this.userData.lname = this.data.last_name;
    this.userData.email = this.data.email;
    this.userData.title = this.data.title;
    this.userData.roles = this.data.roles;
    this.userData.id = this.data._id;

    this.editUserForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      title: ['', [Validators.required]],
      roles: ['', Validators.required],
      email: ['', [Validators.required]]
    });
    this.fillInForm();
  }

  fillInForm(){
    if (this.editUserForm && this.userData.fname) {
      this.editUserForm.patchValue({
        first_name: this.userData.fname,
        last_name: this.userData.lname,
        title: this.userData.title,
        roles: this.userData.roles,
        email: this.userData.email
      });
    }
  }
  onSubmit() {
    let userObj;
    this.submitted = true;
    if (this.editUserForm.valid) {
      
      userObj = {
        _id: this.userData.id,
        first_name: this.editUserForm.value.first_name,
        last_name: this.editUserForm.value.last_name,
        title: this.editUserForm.value.title,
        roles: [this.editUserForm.value.roles],
        email: this.editUserForm.value.email
      }
      console.log(userObj);
      this.userSvc.updateUser(userObj).subscribe(resp => {
        if (resp) {
          console.log(resp);
          this.dialogRef.close();
        }
      });
    }

  }

  get addUserFormControl() {
    return this.editUserForm.controls;
  }

}

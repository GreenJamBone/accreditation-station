import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  addUserForm: FormGroup;
  submitted = false;
  roles = [
    {name: "ABET", id:"abet"},
    {name: "Admin", id:"admin"},
    {name: "Instructor", id:"instructor"}
  ]
  constructor(private fb: FormBuilder, private userSvc: UserService) { }

  ngOnInit() {
    this.addUserForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      title: ['', [Validators.required]],
      roles: ['', Validators.required],
      email: ['', [Validators.required]]
    });
  }
  
  onSubmit() {
    let userObj;
    this.submitted = true;
    if (this.addUserForm.valid) {
      console.log(this.addUserForm.value);
      userObj = {
        first_name: this.addUserForm.value.first_name,
        last_name: this.addUserForm.value.last_name,
        title: this.addUserForm.value.title,
        roles: [this.addUserForm.value.roles],
        email: this.addUserForm.value.email
      }

      this.userSvc.addUser(userObj).subscribe(resp => {
        if (resp) {
          console.log(resp);
        }
      });
    }

  }

  get addUserFormControl() {
    return this.addUserForm.controls;
  }

}

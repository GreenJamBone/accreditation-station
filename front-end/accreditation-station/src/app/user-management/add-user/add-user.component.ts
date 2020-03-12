import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  addUserForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.addUserForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      title: ['', [Validators.required]],
      roles: ['', Validators.required],
      email_address: ['', [Validators.required]]
    });
  }
  
  onSubmit() {
    console.warn(this.addUserForm.value);
    this.submitted = true;
    if (this.addUserForm.valid) {
      alert('Form Submitted succesfully!!!\n Check the values in browser console.');
      console.table(this.addUserForm.value);
    }
  }

  get addUserFormControl() {
    return this.addUserForm.controls;
  }

}

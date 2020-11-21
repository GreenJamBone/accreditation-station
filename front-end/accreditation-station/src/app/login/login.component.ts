import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { Router } from '@angular/router'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm;
  userInfo = {
    _id: "5ee821a6f9d5f60e9890d570",
    first_name: "Mike",
    last_name: "Roch",
    email: "mike@roch.hah",
    title: "New Guy",
    roles: ['admin']
  }
  role = 'instructor';
  constructor(private formBuilder: FormBuilder, private router: Router) { 
    this.loginForm = this.formBuilder.group({
      username: '',
      password: ''
    });
  }

  ngOnInit(): void {
  }

  onSubmit(loginData){
    //make call
    console.log(loginData);
    sessionStorage.setItem('user_info', btoa(JSON.stringify(this.userInfo)));
    this.loginForm.reset();
    if (this.isAdmin(this.userInfo.roles)) {
      sessionStorage.setItem('user_role', 'admin');
      this.router.navigate(['admin']);
    } else if (this.isInstructor(this.userInfo.roles)) {
      sessionStorage.setItem('user_role', 'instructor');
      this.router.navigate(['instructor']);
    } else if (this.isAudit(this.userInfo.roles)) {
      sessionStorage.setItem('user_role', 'audit');
      this.router.navigate(['audit']);
    } else {
      console.log("NO ACCESS TO THIS APPLICATION - CONTACT THE ADMINISTRATOR FOR ACCESS");
    }
  }

  isAdmin(roles) {
    return roles.some(s => s.includes('admin'));
  }
  isInstructor(roles) {
    return roles.some(s => s.includes('instructor'));
  }
  isAudit(roles) {
    return roles.some(s => s.includes('audit'));
  }
}

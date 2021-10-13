import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm;
  userInfo = {
    "_id": "",
    "first_name": "",
    "last_name": "",
    "title": "",
    "roles": [""], //audit, instructor, admin
    "email": ""
}
  constructor(private formBuilder: FormBuilder, private router: Router, private loginSvc: LoginService) { 
    this.loginForm = this.formBuilder.group({
      email: '',
      password: ''
    });
  }

  ngOnInit(): void {
  }

  onSubmit(loginData) {
    console.log(loginData);

    this.loginSvc.loginUser(loginData).subscribe( resp => {
      if (resp) {
        console.log(resp);
        this.userInfo = resp;
        sessionStorage.setItem('user_info', btoa(JSON.stringify(resp)));
       
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
        } else if (this.isNew(this.userInfo.roles)) {
          alert('You Must Be Assigned A Role To Use This Application! Please Speak With Your Administrator');
        } else {
          console.log("NO ACCESS TO THIS APPLICATION - CONTACT THE ADMINISTRATOR FOR ACCESS");
        }
      }
    })
  }

  isAdmin(roles) {
    return roles.some(s => s.toLowerCase().includes('admin'));
  }
  isInstructor(roles) {
    return roles.some(s => s.toLowerCase().includes('instructor'));
  }
  isAudit(roles) {
    return roles.some(s => s.toLowerCase().includes('audit'));
  }
  isNew(roles) {
    return roles.some(s => s.toLowerCase().includes('new'));
  }
}

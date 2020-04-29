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

  constructor(private formBuilder: FormBuilder, private router: Router) { 
    this.loginForm = this.formBuilder.group({
      username: '',
      password: ''
    });
  }

  ngOnInit(): void {
  }

  onSubmit(loginData){
    console.log(loginData);
    this.loginForm.reset();
    if (loginData.username === "admin") {
      this.router.navigate(['admin']);
    }
    if (loginData.username === "instructor") {
      this.router.navigate(['instructor']);
    }
  }
}

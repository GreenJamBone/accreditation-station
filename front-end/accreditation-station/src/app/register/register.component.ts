import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { Validators } from '@angular/forms';
import { RegisterService } from '../services/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm;
  errorTxt = '';
  userObj: any;
  submitted = false;
  registered = false;
  isError = false;
  constructor(private formBuilder: FormBuilder, private router: Router, private registerSvc: RegisterService) { 
    this.registerForm = this.formBuilder.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]],
      roles: ['']
    });
  }

  ngOnInit(): void {
    
  }

  get f() { return this.registerForm.controls; }

  onSubmit(regData) {
    
    this.userObj = {
      first_name: regData.first_name,
      last_name: regData.last_name,
      email: regData.email,
      password: regData.password,
      roles: ['new']
    }

    this.registerSvc.registerUser(this.userObj).subscribe( (resp) => {
      if (resp) {
        console.log(resp);
        this.registered = true;
      }
    },
    (error) => {
      console.log(error);
      alert(error.error);
    })

    console.log(this.userObj);
    this.submitted = true;
  }

}

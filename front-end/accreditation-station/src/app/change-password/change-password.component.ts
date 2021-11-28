import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ForgotPasswordService } from '../services/forgot-password.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  changeForm;
  errorTxt = '';
  userObj: any;
  submitted = false;
  changedPass = false;
  _id: any;
  isError = false;
  showErrMsg = false;
  theToken: any;
  errMsg = "There has been an error changing your password. Please contact your administrator."
  constructor(private formBuilder: FormBuilder, private router: Router, private forgotPasswordSvc: ForgotPasswordService, private route: ActivatedRoute) { 
    this.changeForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]],
      confirmPassword: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]]
    });
  }

  ngOnInit(): void {
  }
  get f() { return this.changeForm.controls; }

  onSubmit(passData) {
    if (sessionStorage.getItem('user_info')) {
      let decodeSession: any = sessionStorage.getItem('user_info');
      decodeSession = JSON.parse(atob(decodeSession));
      this._id = decodeSession.body._id;
    }
    if (passData.password !== passData.confirmPassword) {
      this.isError = true;
      this.errorTxt = "Both Passwords Must Match";

    } else {
      this.forgotPasswordSvc.changePassword(passData.password, this._id).subscribe( (resp: any) => {
        this.showErrMsg = false;
        if (resp) {
          if (resp.status === "E") {
            this.showErrMsg = true;
            this.errMsg = resp.message;
          } else {
            console.log(resp);
            this.changedPass = true;
          }
          
        }
      },
      (error) => {
        console.log(error);
        alert(JSON.stringify(error.error));
      })
      this.submitted = true;
    }
    
  }
}

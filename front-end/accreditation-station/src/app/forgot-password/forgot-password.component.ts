import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ForgotPasswordService } from '../services/forgot-password.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  forgotForm;
  errorTxt = '';
  userObj: any;
  submitted = false;
  changedPass = false;
  email: any;
  isError = false;
  showErrMsg = false;
  theToken: any;
  errMsg = "There has been an error changing your password. Please contact your administrator."
  constructor(private formBuilder: FormBuilder, private router: Router, private forgotPasswordSvc: ForgotPasswordService, private route: ActivatedRoute) { 
    this.forgotForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]],
      confirmPassword: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]]
    });
  }


  ngOnInit(): void {
    this.theToken = this.route.snapshot.paramMap.get('theCode');
  }
  get f() { return this.forgotForm.controls; }

  onSubmit(passData) {
    
    this.userObj = {
      token: this.theToken,
      newPassword: passData.password,
      confirmPassword: passData.confirmPassword
    }

    this.forgotPasswordSvc.changePassword(this.userObj, this.email).subscribe( (resp: any) => {
      this.showErrMsg = false;
      if (resp) {
        if (resp.status === "E") {
          this.showErrMsg = true;
        } else {
          console.log(resp);
          this.changedPass = true;
        }
        
      }
    },
    (error) => {
      console.log(error);
      alert(error.error);
    })
    this.submitted = true;
  }
}

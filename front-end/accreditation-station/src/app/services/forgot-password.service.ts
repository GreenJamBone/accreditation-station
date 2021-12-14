import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {

  constructor(private http: HttpClient) { }

  forgotPassword(email) {
    let payload = {email: email}
    return this.http.post(environment.root_path + environment.forgotPass, payload);
  }

  changePassword(pass, id) {
    let payload = {password: pass, id: id}
    return this.http.post(environment.root_path + environment.changePass, payload);
  }
}

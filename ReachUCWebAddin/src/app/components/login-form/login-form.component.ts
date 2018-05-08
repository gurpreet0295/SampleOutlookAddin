import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { String, StringBuilder } from "typescript-string-operations";
import { Router } from '@angular/router';
import { Common } from '../../services/common.service';

@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  
  loginButtonText = 'Log in';
  userName: string;
  password: string;
  token: string;
  isLoginSuccessful: boolean = true;

  constructor(private commonService: Common, private loginService: LoginService, private route: Router) {
  }

  ngOnInit() {
  }

  onSubmit() {

    this.loginService.loginToReachUC(this.userName, this.password)
      .subscribe(({ access_token, refresh_token, expires_in }) => {
        this.commonService.storeLoggedInUserData(this.userName, this.password, access_token);
        if (!String.IsNullOrWhiteSpace(access_token)) {
          this.loginService.getUserDomain(this.userName, access_token, this.isLoginSuccessful);
        }
        else {
          console.log("Token is null");
          this.isLoginSuccessful = false;
          this.userName = String.Empty;
          this.password = String.Empty;
        }
      },
      (error) => {
        //Invalid login on not able to login
        console.log("Invalid login");
        this.isLoginSuccessful = false;
        this.userName = String.Empty;
        this.password = String.Empty;
        this.commonService.clearLocalStorage();
      });
  }

}

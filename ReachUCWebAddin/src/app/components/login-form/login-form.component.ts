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
  loginMessage: string;
  userName: string;
  password: string;
  token: string;

  constructor(private commonService: Common, private loginService: LoginService, private route: Router) {
    this.loginMessage = String.Empty;
  }

  ngOnInit() {
  }

  onSubmit() {

    this.loginService.loginToReachUC(this.userName, this.password)
      .subscribe(({ access_token, refresh_token, expires_in }) => {
        this.commonService.storeLoggedInUserData(this.userName, this.password, access_token);
        if (!String.IsNullOrWhiteSpace(access_token)) {
          this.loginService.getUserDomain(this.userName, access_token, this.loginMessage);
        }
        else {
          console.log("Token is null");
          this.loginMessage = "Invalid User.";
        }
      },
      (error) => {
        //Invalid login on not able to login
        console.log("Invalid login");
        this.loginMessage = "Invalid User.";
        this.commonService.clearLocalStorage();
      });
  }

}

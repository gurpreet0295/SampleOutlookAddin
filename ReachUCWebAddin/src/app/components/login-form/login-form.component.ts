import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { String, StringBuilder } from "typescript-string-operations";
import { Common } from '../../services/common.service';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit, OnDestroy {
  
  loginButtonText = 'Log in';
  userName: string;
  password: string;
  token: string;
  isLoginSuccessful: boolean = true;
  subscription: Subscription;

  constructor(private commonService: Common, private loginService: LoginService) {
  }

  ngOnInit() {
    this.subscription = this.loginService.isLoginSuccessful.subscribe((value) => {
      this.isLoginSuccessful = value;
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit() {
    this.commonService.changeLoaderStatus(true);
    this.loginService.loginToReachUC(this.userName, this.password)
      .subscribe(({ access_token, refresh_token, expires_in }) => {
        this.commonService.storeLoggedInUserData(this.userName, this.password, access_token);
        if (!String.IsNullOrWhiteSpace(access_token)) {
          this.loginService.getUserDomain(this.userName, access_token);
        }
        else {
          this.commonService.changeLoaderStatus(false);
          console.log("Token is null");
          this.loginService.isLoginSuccessful.next(false);
          this.userName = String.Empty;
          this.password = String.Empty;
        }
      },
      (error) => {
        this.commonService.changeLoaderStatus(false);
        console.log("Invalid login");
        this.loginService.isLoginSuccessful.next(false);
        this.userName = String.Empty;
        this.password = String.Empty;
        this.commonService.clearLocalStorage();
      });
  }

}

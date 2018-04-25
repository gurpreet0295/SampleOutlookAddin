import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { String, StringBuilder } from "typescript-string-operations";
import { Router } from '@angular/router';

@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  
  loginButtonText = 'Log in';
  submitData;
  userName: string;
  password: string;
  token: string;
  skyDomain: string;
  user: string;
  areaCode: string;
  domain: string;

  constructor(private loginService: LoginService, private route: Router) {
  }

  ngOnInit() {
  }

  onSubmit() {
    debugger;
    this.loginService.loginToReachUC(this.userName, this.password)
      .subscribe(({ access_token, refresh_token, expires_in }) => {

        //save login details.
        this.loginService.storeLoggedInUserData(this.userName, this.password, this.token);

        if (!String.IsNullOrWhiteSpace(access_token)) {

          //Get User Domain
          this.loginService.getUserDomain(this.userName, access_token)
            .subscribe((data) => {

              if (data && Array.isArray(data) && data[0].domain) {
                this.domain = data[0].domain;
                this.user = data[0].user;
                this.areaCode = data[0].area_code;
                console.log(this.areaCode);
                //save user domain details.
                this.loginService.storeUserDomain(this.domain, this.user, this.areaCode);
                try {
                  console.log("After button click...!!");
                  console.log(this.route);
                  this.route.navigateByUrl('home');
                }
                catch (Error) {
                  console.log("In Exception");
                  console.log(Error);
                }
              }
              else {
                console.log("No domain");
              }
            },
            (error) => {
              console.log(error);
            });
        }
        else {
          console.log("Token is null");
        }
      },
      (error) => {
        //Invalid login on not able to login
        console.log("Invalid login");
        this.loginService.clearLocalStorage();
      });
  }

}

import { Component } from '@angular/core';
import { String } from "typescript-string-operations";
import { SkySwitchAPIService } from './services/api.service';
import { LoginService } from './services/login.service';
import { Http } from '@angular/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  localStorage: Storage;
  userName: string;
  password: string;
  token: string;
  skyDomain: string;
  user: string;
  areaCode: string;
  domain: string;
  apiService: SkySwitchAPIService;
  loginService: LoginService;
  isLoggedIn: boolean;

  constructor(private http: Http, private router: Router) {
    this.apiService = new SkySwitchAPIService(http);
    this.loginService = new LoginService(http);
    this.localStorage = window.localStorage;
    this.userName = this.localStorage.getItem('userName');
    this.password = this.localStorage.getItem('password');
    this.token = this.localStorage.getItem('accesstoken');
    this.domain = this.localStorage.getItem('domain');
    this.user = this.localStorage.getItem('user');
    this.areaCode = this.localStorage.getItem('areaCode');
    console.log(this.userName + this.password + this.token + this.domain + this.user + this.areaCode);
    this.checkIsUserLoggedIn();
  }

  ngOnInit() {
   
  }

  checkIsUserLoggedIn() {
    debugger;
    this.localStorage.setItem('skyToken', String.Empty);
    this.localStorage.setItem('skyUser', String.Empty);
    this.localStorage.setItem('domain', String.Empty);

    if (!String.IsNullOrWhiteSpace(this.localStorage.getItem('userName')) && !String.IsNullOrWhiteSpace(this.localStorage.getItem('password'))) {

      this.apiService.getToken(this.userName, this.password, "oauth2/token")
        .map(response => response.json())
        .subscribe(({ access_token, refresh_token, expires_in }) => {

          //save login details.
          this.loginService.storeLoggedInUserData(this.userName, this.password, this.token);

          if (!String.IsNullOrWhiteSpace(access_token)) {

            //Get User Domain
            this.apiService.getUserDomain(this.userName, access_token)
              .map(response => response.json())
              .subscribe((data) => {

                if (data && Array.isArray(data) && data[0].domain) {
                  this.domain = data[0].domain;
                  this.user = data[0].user;
                  this.areaCode = data[0].area_code;
                  console.log(this.areaCode);
                  //save user domain details.
                  this.loginService.storeUserDomain(this.domain, this.user, this.areaCode);
                  this.isLoggedIn = true;
                  console.log(this.router);
                  try {
                    this.router.navigateByUrl('home');
                  }
                  catch (error) {
                    console.log("Navigation Error:");
                    console.log(error);
                  }
                }
                else {
                  console.log("No domain");
                  this.isLoggedIn = false;
                  this.router.navigateByUrl('');
                }
              },
              (error) => {
                console.log(error);
                this.isLoggedIn = false;
              });
          }
          else {
            console.log("Token is null");
            this.isLoggedIn = false;
          }
        },
        (error) => {
          //Invalid login on not able to login
          console.log("Invalid login");
          this.loginService.clearLocalStorage();
          this.isLoggedIn = false;
        });
    }
    else {
      this.isLoggedIn = false;
    }

  }
}

import { Component } from '@angular/core';
import { String } from "typescript-string-operations";
import { SkySwitchAPIService } from './services/api.service';
import { LoginService } from './services/login.service';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { Common } from './services/common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private localStorage: Storage;
  private userName: string;
  private password: string;
  private apiService: SkySwitchAPIService;
  private loginService: LoginService;
  private isLoggedIn: boolean;
  private commonService: Common;

  constructor(private http: Http, private router: Router) {
    this.apiService = new SkySwitchAPIService(http);
    this.loginService = new LoginService(http, router);
    this.commonService = new Common();
    this.localStorage = window.localStorage;
    this.userName = this.commonService.userName;
    this.password = this.commonService.password;
    this.checkIsUserLoggedIn();
  }

  ngOnInit() {
   
  }

  checkIsUserLoggedIn() {
    debugger;
    this.localStorage.setItem('skyToken', String.Empty);
    this.localStorage.setItem('user', String.Empty);
    this.localStorage.setItem('domain', String.Empty);

    if (!String.IsNullOrWhiteSpace(this.localStorage.getItem('userName')) && !String.IsNullOrWhiteSpace(this.localStorage.getItem('password'))) {

      this.apiService.getToken(this.userName, this.password, "oauth2/token")
        .map(response => response.json())
        .subscribe(({ access_token, refresh_token, expires_in }) => {
          debugger;
          this.commonService.storeLoggedInUserData(this.userName, this.password, access_token);
          if (!String.IsNullOrWhiteSpace(access_token)) {

            this.apiService.getUserDomain(this.userName, access_token)
              .map(response => response.json())
              .subscribe((data) => {

                if (data && Array.isArray(data) && data[0].domain) {
                  let domain = data[0].domain;
                  let user = data[0].user;
                  let areaCode = data[0].area_code;
                  this.commonService.storeUserDomain(domain, user, areaCode);
                  this.isLoggedIn = true;
                  this.router.navigateByUrl('home');
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
          this.commonService.clearLocalStorage();
          this.isLoggedIn = false;
        });
    }
    else {
      this.isLoggedIn = false;
    }
  }
}

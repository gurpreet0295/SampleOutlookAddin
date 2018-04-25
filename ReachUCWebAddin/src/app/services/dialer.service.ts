import { Injectable } from "@angular/core";
import { SkySwitchAPIService } from "./api.service";
import { Http } from "@angular/http";
import { String } from "typescript-string-operations";
import { LoginService } from "./login.service";
import { Router } from "@angular/router";
import { Guid } from "guid-typescript";
import { toASCII } from "punycode";

@Injectable()
export class DialerService {

  apiService: SkySwitchAPIService;
  token: string;
  localStorage: Storage;
  userName: string;
  password: string;
  domain: string;
  user: string;
  areaCode: string;
  loginService: LoginService;
  route: Router;

  constructor(private http: Http) {
    this.apiService = new SkySwitchAPIService(http);
    this.loginService = new LoginService(http);
    this.localStorage = window.localStorage;
    this.token = localStorage.getItem('accessToken');
    this.userName = localStorage.getItem('userName');
    this.password = localStorage.getItem('password');
  }

  makeCall(phoneNumber: string) {
    debugger;
    if (!String.IsNullOrWhiteSpace(this.token)) {
      this.localStorage.setItem('accessToken', String.Empty);
      this.localStorage.setItem('user', String.Empty);
      this.localStorage.setItem('domain', String.Empty);
    }

    if (String.IsNullOrWhiteSpace(localStorage.getItem('accessToken'))) {
      this.apiService.getToken(this.userName, this.password, "oauth2/token")
        .map(response => response.json())
        .subscribe(({ access_token, refresh_token, expires_in }) => {

          //move common data to new service
          this.loginService.storeLoggedInUserData(this.userName, this.password, this.token);
          if (!String.IsNullOrWhiteSpace(access_token)) {

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

                  //making call
                  phoneNumber.replace(" ", "");
                  let callReponse: string;
                  let callId = Guid.create().toString().replace('-', String.Empty);
                  let parts = this.user.split('@');
                  this.call(this.userName, callId, phoneNumber, this.domain, parts[0], access_token)
                    .subscribe((data) => {
                      console.log("CALL DATA : ");
                      console.log(data);
                    },
                    (error) => {
                      console.log("Call Exception");
                      console.log(error);
                    });

                  //this.route.navigateByUrl('home');
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

  call(userName: string, callId: string, destination: string, domain: string, origination: string, token: string) {
    return this.apiService.call(userName, callId, destination, domain, origination, token);
  }


}

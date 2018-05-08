import { Injectable } from "@angular/core";
import { SkySwitchAPIService } from "./api.service";
import { Http } from "@angular/http";
import { String } from "typescript-string-operations";
import { LoginService } from "./login.service";
import { Router } from "@angular/router";
import { Guid } from "guid-typescript";
import { toASCII } from "punycode";
import { Common } from "./common.service";

@Injectable()
export class DialerService {

  
  token: string;
  localStorage: Storage;
  userName: string;
  password: string;
  domain: string;
  user: string;
  areaCode: string;
  

  constructor(private apiService: SkySwitchAPIService, private commonService: Common, private http: Http, private route: Router) {
    this.localStorage = window.localStorage;
    this.token = this.commonService.skyToken;
    this.userName = this.commonService.userName;
    this.password = this.commonService.password;
  }

  makeCall(phoneNumber: string, callResponse: string) {
    debugger;
    if (!String.IsNullOrWhiteSpace(this.token)) {
      this.localStorage.setItem('skyToken', String.Empty);
      this.localStorage.setItem('user', String.Empty);
      this.localStorage.setItem('domain', String.Empty);
    }

    if (String.IsNullOrWhiteSpace(localStorage.getItem('skyToken'))) {
      this.apiService.getToken(this.userName, this.password, "oauth2/token")
        .map(response => response.json())
        .subscribe(({ access_token, refresh_token, expires_in }) => {

          this.commonService.storeLoggedInUserData(this.userName, this.password, this.token);
          if (!String.IsNullOrWhiteSpace(access_token)) {

            this.apiService.getUserDomain(this.userName, access_token)
              .map(response => response.json())
              .subscribe((data) => {
                if (data && Array.isArray(data) && data[0].domain) {
                  this.domain = data[0].domain;
                  this.user = data[0].user;
                  this.areaCode = data[0].area_code;
                  this.commonService.storeUserDomain(this.domain, this.user, this.areaCode);

                  phoneNumber.replace(" ", String.Empty);
                  let callId = Guid.create().toString().replace('-', String.Empty);
                  let parts = this.user.split('@');
                  this.call(this.userName, callId, phoneNumber, this.domain, parts[0], access_token)
                    .subscribe((data) => {
                      callResponse = "Call made successfully.";
                      this.route.navigateByUrl('home');
                    },
                    (error) => {
                      console.log(error);
                      callResponse = "Not able to make call."
                    });
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
          this.commonService.clearLocalStorage();
        });
    }
  }

  call(userName: string, callId: string, destination: string, domain: string, origination: string, token: string) {
    return this.apiService.call(userName, callId, destination, domain, origination, token);
  }


}

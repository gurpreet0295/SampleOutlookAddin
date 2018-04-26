import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions } from "@angular/http";
import { String, StringBuilder } from "typescript-string-operations";
import { SkySwitchAPIService } from "./api.service"
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Response } from "@angular/http/src/static_response";
import { Common } from "./common.service";
import { Router } from "@angular/router";

@Injectable()
export class LoginService {

  constructor(private apiResponse: SkySwitchAPIService, private commonService: Common, private http: Http, private route: Router) {
  }

  loginToReachUC(username: string, password: string) {
    return this.apiResponse.getToken(username, password, "oauth2/token")
      .map(response => response.json());
  }

  getUserDomain(userName: string, token: any, loginMessage: string) {
    return this.apiResponse.getUserDomain(userName, token)
      .map(response => response.json())
      .subscribe((data) => {

        debugger;
        if (data && Array.isArray(data) && data[0].domain) {
          loginMessage = "Successfully Logged in.";
          let domain = data[0].domain;
          let user = data[0].user;
          let areaCode = data[0].area_code;

          this.commonService.storeUserDomain(domain, user, areaCode);
          this.route.navigateByUrl('home');
        }
        else {
          console.log("No domain");
          loginMessage = "Invalid User.";
        }
      },
      (error) => {
        console.log(error);
        loginMessage = "Invalid User.";
      });
  }

}

import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions } from "@angular/http";
import { String, StringBuilder } from "typescript-string-operations";
import { SkySwitchAPIService } from "./api.service";
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

  getUserDomain(userName: string, token: any, isLoginSuccessful: boolean) {
    return this.apiResponse.getUserDomain(userName, token)
      .map(response => response.json())
      .subscribe((data) => {

        if (data && Array.isArray(data) && data[0].domain) {
          isLoginSuccessful = true;
          let domain = data[0].domain;
          let user = data[0].user;
          let areaCode = data[0].area_code;

          this.commonService.isGettingResponse = false;
          this.commonService.storeUserDomain(domain, user, areaCode);
          this.route.navigateByUrl('home');
        }
        else {
          this.commonService.isGettingResponse = false;
          console.log("No domain");
          isLoginSuccessful = false;
        }
      },
      (error) => {
        this.commonService.isGettingResponse = false;
        console.log(error);
        isLoginSuccessful = false;
      });
  }

}

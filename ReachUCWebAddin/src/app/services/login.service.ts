import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions } from "@angular/http";
import { String, StringBuilder } from "typescript-string-operations";
import { SkySwitchAPIService } from "./api.service"
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Response } from "@angular/http/src/static_response";

@Injectable()
export class LoginService {

  apiResponse: SkySwitchAPIService;
  localStorage: Storage;

  constructor(private http: Http) {
    this.apiResponse = new SkySwitchAPIService(this.http);
    this.localStorage = window.localStorage;
  }

  loginToReachUC(username: string, password: string) {
    return this.apiResponse.getToken(username, password, "oauth2/token")
      .map(response => response.json());
  }

  getUserDomain(userName: string, token: any) {
    return this.apiResponse.getUserDomain(userName, token)
      .map(response => response.json());
  }

  storeLoggedInUserData(userName: string, password: string, accessToken: string) {
    this.localStorage.setItem('userName', userName);
    this.localStorage.setItem('password', password);
    this.localStorage.setItem('accessToken', accessToken);
  }

  storeUserDomain(domain: string, user: string, areaCode: string) {
    this.localStorage.setItem('domain', domain);
    this.localStorage.setItem('user', user);
    console.log(areaCode);
    this.localStorage.setItem('areaCode', areaCode);
    console.log(this.localStorage.getItem('areaCode'));
  }

  clearLocalStorage() {
    this.localStorage.removeItem('userName');
    this.localStorage.removeItem('password');
    this.localStorage.removeItem('accesstoken');
    this.localStorage.removeItem('domain');
    this.localStorage.removeItem('user');
    this.localStorage.removeItem('areaCode');
  }
}

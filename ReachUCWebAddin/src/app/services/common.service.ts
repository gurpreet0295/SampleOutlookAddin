import { Injectable } from "@angular/core";
import { String } from "typescript-string-operations";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class Common {
  telkoToken: string;
  telkoRefreshToken: string;
  telkoTokenExpireTime: string;
  
  userName: string;
  password: string;
  user: string;
  domain: string;
  skyToken: string;
  areaCode: string;
  localStorage: Storage;
  meetingText:string = `1. Please join my MeetingManager session on {2}.
Link: {0}

Meeting ID: {3}
Meeting Password: {4}

2. Use your microphone and speakers(VoIP - a headset is recommended).Or, call in using your telephone.

Phone Number: {1}

TIPS: Avoid wireless connections since they may cause disconnections and slow down screen updates.
A headset is recommended when using your microphone and speakers(VoIP).`;

  private dataSource = new BehaviorSubject<boolean>(true);
  isGettingResponse = this.dataSource.asObservable();

  changeLoaderStatus(show: boolean) {
    this.dataSource.next(show);
  }

  constructor() {
    this.localStorage = window.localStorage;
    this.userName = localStorage.getItem('userName') || "";
    this.password = localStorage.getItem('password') || "";
    this.user = localStorage.getItem('user') || "";
    this.domain = localStorage.getItem('domain') || "";
    this.areaCode = localStorage.getItem('areaCode') || "";
    this.skyToken = localStorage.getItem('skyToken') || "";
  }

  storeLoggedInUserData(userName: string, password: string, skyToken: string) {
    this.userName = userName;
    this.localStorage.setItem('userName', userName);
    this.password = password;
    this.localStorage.setItem('password', password);
    this.skyToken = skyToken;
    this.localStorage.setItem('skyToken', skyToken);
  }

  storeUserDomain(domain: string, user: string, areaCode: string) {
    this.domain = domain;
    this.localStorage.setItem('domain', domain);
    this.user = user;
    this.localStorage.setItem('user', user);
    this.areaCode = areaCode;
    this.localStorage.setItem('areaCode', areaCode);
  }

  storeOuthTokenDetials(accessToken: string, refreshToken: string, expireTime: string) {
    this.telkoToken = accessToken;
    this.localStorage.setItem('telkoToken', accessToken);
    this.telkoRefreshToken = refreshToken;
    this.localStorage.setItem('telkoRefreshToken', refreshToken);
    this.telkoTokenExpireTime = expireTime;
    this.localStorage.setItem('telkoTokenExpireTime', expireTime);
  }

  setUserProperties(countryCode: string, prefix: string, dialerLength: string) {
    this.localStorage.setItem('countryCode', countryCode);
    this.localStorage.setItem('prefix', prefix);
    this.localStorage.setItem('dialerLength', dialerLength);
  }

  clearLocalStorage() {
    this.localStorage.clear();
  }
}

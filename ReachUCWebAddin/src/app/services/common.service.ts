import { Injectable } from "@angular/core";
import { String } from "typescript-string-operations";

@Injectable()
export class Common {

  userName: string;
  password: string;
  user: string;
  domain: string;
  skyToken: string;
  areaCode: string;
  localStorage: Storage;
  isGettingResponse: boolean = false;
  meetingText:string = `1. Please join my MeetingManager session on {2}.
Link: {0}

Meeting ID: {3}
Meeting Password: {4}

2. Use your microphone and speakers(VoIP - a headset is recommended).Or, call in using your telephone.

Phone Number: {1}

TIPS: Avoid wireless connections since they may cause disconnections and slow down screen updates.
A headset is recommended when using your microphone and speakers(VoIP).`;

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

  clearLocalStorage() {
    this.localStorage.setItem('userName', String.Empty);
    this.localStorage.setItem('password', String.Empty);
    this.localStorage.setItem('skyToken', String.Empty);
    this.localStorage.setItem('domain', String.Empty);
    this.localStorage.setItem('user', String.Empty);
    this.localStorage.setItem('areaCode', String.Empty);
  }
}

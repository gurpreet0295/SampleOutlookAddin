import { Injectable } from "@angular/core";
import { SkySwitchAPIService } from "./api.service";
import { Http } from "@angular/http";
import { String } from "typescript-string-operations";
import { LoginService } from "./login.service";
import { Router } from "@angular/router";
import { Guid } from "guid-typescript";
import { Common } from "./common.service";
import { Observable } from "rxjs/Observable";
import { LoggerService } from "./logger.service";

@Injectable()
export class CommunicationService {

  
  token: string;
  localStorage: Storage;
  userName: string;
  password: string;
  domain: string;
  user: string;
  areaCode: string;
  billingIdentifier: string;
  callerIds: string[];

    constructor(private apiService: SkySwitchAPIService, private commonService: Common, private http: Http, private route: Router, private loggerService: LoggerService) {
    this.localStorage = window.localStorage;
  }

    makeCall(phoneNumber: string) {
        this.token = this.commonService.skyToken;
        this.userName = this.commonService.userName;
        this.password = this.commonService.password;
        if (!String.IsNullOrWhiteSpace(this.token)) {
            this.localStorage.setItem('skyToken', String.Empty);
            this.localStorage.setItem('user', String.Empty);
            this.localStorage.setItem('domain', String.Empty);
        }

        if (String.IsNullOrWhiteSpace(localStorage.getItem('skyToken'))) {
            this.commonService.changeLoaderStatus(true);
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

                                    let callId = Guid.create().toString().replace('-', String.Empty);
                                    let parts = this.user.split('@');
                                    this.call(this.userName, callId, phoneNumber, this.domain, parts[0], access_token)
                                        .subscribe((data) => {
                                            this.loggerService.logMessage({ message: 'Successfully made call!', type: 'success' });
                                            this.commonService.changeLoaderStatus(false);
                                            this.route.navigateByUrl('home');
                                        },
                                        (error) => {
                                            this.loggerService.logMessage({ message: 'Unable to make call!', type: 'danger' });
                                            this.commonService.changeLoaderStatus(false);
                                            console.log(error);
                                        });
                                }
                                else {
                                    this.loggerService.logMessage({ message: 'Unable to make call!', type: 'danger' });
                                    this.commonService.changeLoaderStatus(false);
                                    console.log("No domain");
                                }
                            },
                            (error) => {
                                this.loggerService.logMessage({ message: 'Unable to make call!', type: 'danger' });
                                this.commonService.changeLoaderStatus(false);
                                console.log(error);
                            });
                    }
                    else {
                        this.loggerService.logMessage({ message: 'Unable to make call!', type: 'danger' });
                        this.commonService.changeLoaderStatus(false);
                        console.log("Token is null");
                    }
                },
                (error) => {
                    //Invalid login on not able to login
                    this.loggerService.logMessage({ message: 'Unable to make call!', type: 'danger' });
                    console.log("Unable to make call");
                    this.commonService.changeLoaderStatus(false);
                    this.commonService.clearLocalStorage();
                });
        }
    }

  call(userName: string, callId: string, destination: string, domain: string, origination: string, token: string) {
    return this.apiService.call(userName, callId, destination, domain, origination, token);
  }

  sendSms(destinationNumber: string, message: string) {
    this.commonService.changeLoaderStatus(true);
    this.apiService.sendSms(destinationNumber, message)
        .map(response => response.json())
        .subscribe(
        (response) => {
            this.loggerService.logMessage({ message: 'Sms sent successfully!', type: 'success' });
            this.commonService.changeLoaderStatus(false);
            console.log(response);
        },
        (error) => {
            this.loggerService.logMessage({ message: 'Unable to send Sms!', type: 'danger' });
            this.commonService.changeLoaderStatus(false);
            console.log(error);
        })
  }

  sendFax(appliedNumber: string, file: any, callerId: any) {
      this.billingIdentifier = this.commonService.user + "@" + this.commonService.domain;
      this.commonService.changeLoaderStatus(true);
      this.apiService.sendFax(appliedNumber, file, callerId, "fax", this.billingIdentifier)
          .map(response => response.json())
          .subscribe(
          (response) => {
              this.loggerService.logMessage({ message: 'Fax sent successfully!', type: 'success' });
              this.commonService.changeLoaderStatus(false);
              console.log(response);
          },
          (error) => {
              this.loggerService.logMessage({ message: 'Unable to send Fax!', type: 'danger' });
              this.commonService.changeLoaderStatus(false);
              console.log(error);
          })
  }

  getCallerIdsList() {
      if (this.callerIds && this.callerIds.length > 0) {
          return Observable.of(this.callerIds);
      }
      return this.apiService.getCallerIdsList("numberList")
          .map(response => {
              let { data } = { data: [] } = response.json();
              let callerIds = data.map(d => d.number)
              return callerIds;
          })
          .do(ids => this.callerIds = ids)
  }
}

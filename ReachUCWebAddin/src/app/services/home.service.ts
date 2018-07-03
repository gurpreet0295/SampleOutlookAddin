import { Injectable } from "@angular/core";
import { Common } from "./common.service";
import { SkySwitchAPIService } from "./api.service";
import { Observable } from "rxjs/Observable";
import { DataService } from "./data-sharing.service";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { OutlookService } from "./outlook.service";
import { count } from "rxjs/operator/count";
import { last } from "rxjs/operator/last";

@Injectable()
export class HomeService {
 
  phoneNumbers: string[];
  callerIds: string[];
  billingIdentifier: string;
  countryCode: string;
  prefix: string;
  dialerLength: string;

  constructor(private outlookService: OutlookService, private apiService: SkySwitchAPIService, private commonService: Common, private dataService: DataService) {
    this.phoneNumbers = new Array<string>();
  }

  getPhoneNumbers(dialerLength: string): Observable<any[]> {
    if (this.phoneNumbers && this.phoneNumbers.length > 0 && this.dialerLength == dialerLength) {
      return Observable.of(this.phoneNumbers);
    }
    this.dialerLength = dialerLength;
    return this.outlookService.getPhoneNumbers(dialerLength)
      .do((result) => {
        this.phoneNumbers = result;
      }) 
  }

  translateNumberToFixedFormat(phoneNumbers: string[], countryCode: string, internationalPrefix: string): any[] {
    this.countryCode = countryCode;
    this.prefix = internationalPrefix;
    this.commonService.setUserProperties(this.countryCode, this.prefix, this.dialerLength);
    let translatedPhoneNumbers: string[] = new Array<string>();
    phoneNumbers.forEach(number => {
      number = number.replace("+", "").replace("(", "").replace(")", "");
      if (countryCode && internationalPrefix && number.indexOf(countryCode) != 0 && number.indexOf(internationalPrefix) != 0) {
        number = internationalPrefix + number;
      } else if (countryCode && number.indexOf(countryCode) != 0) {
        number = countryCode + number;
      }
      translatedPhoneNumbers.push(number);
    });
    return translatedPhoneNumbers;
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

  sendFax(appliedNumber: string, file: any, callerId: any) {
    this.billingIdentifier = this.commonService.user + "@" + this.commonService.domain;
    this.commonService.changeLoaderStatus(true);
    this.apiService.sendFax(appliedNumber, file, callerId, "fax", this.billingIdentifier)
      .map(response => response.json())
      .subscribe(
      (response) => {
        this.commonService.changeLoaderStatus(false);
        console.log(response);
      },
      (error) => {
        this.commonService.changeLoaderStatus(false);
        console.log(error);
      })
  }

  sendSms(destinationNumber: string, message: string) {
    this.commonService.changeLoaderStatus(true);
    this.apiService.sendSms(destinationNumber, message)
      .map(response => response.json())
      .subscribe(
      (response) => {
        console.log(response);
        this.commonService.changeLoaderStatus(false);
      },
      (error) => {
        this.commonService.changeLoaderStatus(false);
        console.log(error);
      })
  }
}

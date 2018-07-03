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
}

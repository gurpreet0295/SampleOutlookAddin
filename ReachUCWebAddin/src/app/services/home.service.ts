import { Injectable} from "@angular/core";
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
        if (this.phoneNumbers && this.phoneNumbers.length > 0) {
            return Observable.of(this.phoneNumbers);
        }
        this.dialerLength = dialerLength;
        return this.outlookService.getPhoneNumbers(dialerLength)
            .do((result) => {
                this.phoneNumbers = result;
            })
    }

    translateNumberToFixedFormat(phoneNumbers: string[], countryCode: string, internationalPrefix: string, dialLength: string): any[] {
        this.countryCode = countryCode;
        this.prefix = internationalPrefix;
        this.dialerLength = dialLength;
        this.commonService.setUserProperties(this.countryCode, this.prefix, this.dialerLength);
        let translatedPhoneNumbers: string[] = new Array<string>();
        phoneNumbers.forEach(
            number => {
                number = number.replace(/\(/g, "").replace(/\)/g, "").replace(/\./g, "").replace(/-/g, "").replace(/ /g, "");
                let dialLength = Number(this.dialerLength);
                number = number.substr(0, dialLength);

                if (number.indexOf('+') == 0) {
                    number = number.replace('+', '');
                    if (number.indexOf(this.countryCode) != 0 && this.prefix) {
                        number = this.prefix + number;
                    }
                    translatedPhoneNumbers.push(number);
                    return;
                }

                if (number.length == dialLength) {
                    translatedPhoneNumbers.push(number);
                    return;
                }

                if (number.length < dialLength && this.countryCode != '') {
                    number = this.countryCode + number;
                    translatedPhoneNumbers.push(number);
                    return;
                }

                translatedPhoneNumbers.push(number);
            }
        );
        return translatedPhoneNumbers;
    }
}

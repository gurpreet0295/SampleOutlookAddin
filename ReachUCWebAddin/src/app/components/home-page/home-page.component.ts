import { Component, OnInit } from '@angular/core';
import { OutlookService } from '../../services/outlook.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { Router } from '@angular/router';
import { String, StringBuilder } from 'typescript-string-operations';
import { Common } from '../../services/common.service';
import { DialerService } from '../../services/dialer.service';
import { HomeService } from '../../services/home.service';
import { SkySwitchAPIService } from '../../services/api.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  phoneNumbers: string[];
  domain: string;
  user: string;
  areaCode: string;

  countryCode: string;
  prefix: string;
  dialerLength: string = "12";

  showSms: boolean = true;
  showFax: boolean = true;

  file: any;

  constructor(private outlookService: OutlookService, private commonService: Common, private dialerService: DialerService, private homeService: HomeService, private route: Router, private api: SkySwitchAPIService) {
    this.domain = commonService.domain;
    this.user = commonService.user;
    this.areaCode = commonService.areaCode;
    this.phoneNumbers = new Array<string>();
  }

  ngOnInit() {
    this.getNumbersFromMail();
    //numbers.forEach((num) => {
    //  if (num.originalPhoneString && !String.IsNullOrWhiteSpace(num.originalPhoneString)) {
    //    this.phoneNumbers.push(num.originalPhoneString);
    //  }
    //})
    //this.phoneNumbers = ["988776654", "8776655443"];
  }


  getNumbersFromMail() {
    this.phoneNumbers = this.outlookService.getPhoneNumbers(this.dialerLength);
  }

  makeCall(number: string) {
    number = this.countryCode + number;
    this.dialerService.makeCall(number);

  }

  openDialer() {
    this.route.navigateByUrl('dialer');
  }

  openMeetingManager() {
    this.route.navigateByUrl('meeting');
  }

  logout() {
    this.commonService.clearLocalStorage();
    this.route.navigateByUrl('login');
  }

  getOuthToken() {
    this.api.getOuthToken()
      .subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      })
  }
}

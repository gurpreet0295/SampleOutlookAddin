import { Component, OnInit } from '@angular/core';
import { OutlookService } from '../../services/outlook.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { Router } from '@angular/router';
import { String, StringBuilder } from 'typescript-string-operations';
import { Common } from '../../services/common.service';
import { CommunicationService } from '../../services/communication.service';
import { HomeService } from '../../services/home.service';
import { DataService } from "../../services/data-sharing.service";
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit, OnDestroy {

  phoneNumbers: string[];
  domain: string;
  user: string;
  areaCode: string;

  countryCode: string;
  prefix: string;
  dialerLength: string;

  file: any;
  toPhoneNumber: string;
  callerId: string;
  callerIds: string[];
  defaultCallerId: string[];

  smsMessage: string;

  isPropertiesCollapsed: boolean = true;
  isFaxAllowed: boolean = false;
  isSmsAllowed: boolean = false;
  subscription: Subscription;

  constructor(private outlookService: OutlookService, private commonService: Common, private communicationService: CommunicationService, private homeService: HomeService, private route: Router, private dataService: DataService) {
    this.domain = commonService.domain;
    this.user = commonService.user;
    this.areaCode = commonService.areaCode;
    this.defaultCallerId = new Array<string>();
    this.phoneNumbers = this.homeService.phoneNumbers;
    this.defaultCallerId.push("0000000000");
    this.countryCode = this.homeService.countryCode = localStorage.getItem('countryCode');
    this.prefix = this.homeService.prefix = localStorage.getItem('prefix');
    this.dialerLength = this.homeService.dialerLength = localStorage.getItem('dialerLength');
    this.smsMessage = String.Empty;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    //this.getNumbersFromMail();
    this.phoneNumbers = ["988776654", "8776655443", "6328100976"];
    this.getPermissions();
    this.getCallerIds();
  }

  getPermissions() {
    this.subscription = this.dataService.userPermissions
      .subscribe(permission => {
        if (permission.length > 0) {
          permission.indexOf("allowFax") > -1 ? this.isFaxAllowed = true : this.isFaxAllowed = false;
          permission.indexOf("outboundSMS") > -1 ? this.isSmsAllowed = true : this.isSmsAllowed = false;
        }
      },
      (error) => {
        console.log(error);
      })
  }
   
  getCallerIds() {
    this.communicationService.getCallerIdsList()
      .subscribe(
      response => {
        if (Array.isArray(response) && response.length > 0) {
          this.callerIds = response;
          this.callerId = response[0];
        }
        else {
          this.callerIds = this.defaultCallerId;
          this.callerId = this.defaultCallerId[0];
        }
      },
      err => {
        console.log(err);
      })
  }

  getNumbersFromMail() {
    this.homeService.getPhoneNumbers(this.dialerLength)
      .subscribe((result) => {
        this.phoneNumbers = result;
        this.phoneNumbers = this.homeService.translateNumberToFixedFormat(this.phoneNumbers, this.countryCode, this.prefix);
      },
      (error) => {
        console.log(error);
      });
  }

  makeCall(number: string) {
      this.communicationService.makeCall(number);
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

  stopPropogation(event: any) {
    event.stopPropagation();
  }

  handleFileInput(event: any) {
    let file = event[0];
    if (file) {
      this.file = file;
    }
  }

  sendSms(destinationNumber: string) {
      if (!String.IsNullOrWhiteSpace(this.smsMessage)) {
          this.communicationService.sendSms(destinationNumber, this.smsMessage)
      }
      this.smsMessage = String.Empty;
  }

  sendFax(event: any) {
    let toPhoneNumber = event.target[1].value || "";
    this.communicationService.sendFax(toPhoneNumber, this.file, this.callerId);
  }

}

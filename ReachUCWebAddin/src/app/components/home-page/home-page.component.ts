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
import { NgbDropdownConfig, NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { LoggerService } from '../../services/logger.service';
import { OutlookAuthService } from '../../services/outlook-auth.service';
import { UserPermissionModel } from '../../models/userpermissions.model';

declare let Office: any;

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

    constructor(private outlookService: OutlookService, private commonService: Common, private communicationService: CommunicationService, private homeService: HomeService, private route: Router, private dataService: DataService, private loggerService: LoggerService, config: NgbDropdownConfig, private authService: OutlookAuthService) {
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
        config.autoClose = 'outside';
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    ngOnInit() {
        //this.getNumbersFromMail();
        this.phoneNumbers = ["988776654", "8776655443", "6328100976"];
        this.getPermissions();
        this.getCallerIds();
        this.authService.initAuth();
        console.log(window.location);
    }

    getPermissions() {
        this.subscription = this.dataService.userPermissions
            .subscribe(
                result => {
                    if (result.length > 0) {
                        result.forEach(x => {
                            switch (x.name) {
                                case "allowFax": (x.value == "1" ? this.isFaxAllowed = true : this.isFaxAllowed = false);
                                    break;

                                case "outboundSMS": (x.value == "1" ? this.isSmsAllowed = true : this.isSmsAllowed = false);
                                    break;
                            }
                        });

                        if (this.isFaxAllowed || this.isSmsAllowed) {
                            this.loggerService.logMessage({ message: 'You are allowed to send fax or sms!', type: 'primary' });
                        } else {
                            this.loggerService.logMessage({ message: 'You are not allowed to send fax or sms. Kindly contact admin.', type: 'warning' });
                        }
                        this.clearSubscription();
                    }
                },
                error => {
                    console.log(error);
                }
            );
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
                this.phoneNumbers = this.homeService.translateNumberToFixedFormat(this.phoneNumbers, this.countryCode, this.prefix, this.dialerLength);
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
        this.file = file;
    }

    sendSms(destinationNumber: string, dropdown: NgbDropdown) {
        if (!String.IsNullOrWhiteSpace(this.smsMessage)) {
            this.communicationService.sendSms(destinationNumber, this.smsMessage)
            dropdown.close();
        }
        this.smsMessage = String.Empty;
    }

    sendFax(event: any, dropdown: NgbDropdown) {
        if (this.file) {
            let toPhoneNumber = event.target[1].value || "";
            this.communicationService.sendFax(toPhoneNumber, this.file, this.callerId);
            dropdown.close();
            this.file = null;
        }
    }

    navigateToContacts() {
        this.authService.login();
    }

    clearSubscription() {
        this.dataService.changeData(new Array<UserPermissionModel>());
    }
}

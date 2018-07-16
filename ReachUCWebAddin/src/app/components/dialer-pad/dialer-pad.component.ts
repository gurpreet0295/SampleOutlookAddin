import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommunicationService } from '../../services/communication.service';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { HomeService } from '../../services/home.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { DataService } from '../../services/data-sharing.service';
import { LoggerService } from '../../services/logger.service';

declare var $: any;

@Component({
    selector: 'app-dialer-pad',
    templateUrl: './dialer-pad.component.html',
    styleUrls: ['./dialer-pad.component.css']
})
export class DialerPadComponent implements OnInit, OnDestroy {

    phoneNumber: string;
    callResponse: string;
    callerId: string;
    callerIds: string[];
    defaultCallerId: string[];
    file: any;
    smsMessage: string;
    dialValues: string[];
    isSmsAllowed: boolean = false;
    isFaxAllowed: boolean = false;
    subscription: Subscription;
    imgSrcUrl: string;

    constructor(private communicationService: CommunicationService, private homeService: HomeService, private http: Http, private dataService:DataService, private router: Router,private loggerService:LoggerService, private modalService: NgbModal) {
        this.phoneNumber = "";
        this.callResponse = "";
        this.smsMessage = "";
        this.defaultCallerId = new Array<string>();
        this.defaultCallerId.push("0000000000");
        this.dialValues = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];
    }

    ngOnInit() {
        this.getPermissions();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    updatePhoneNumber(value: string) {
        if (Number.isInteger(Number.parseInt(value))) {
            this.phoneNumber += value;
        }
    }

    makeCall() {
        if (!this.phoneNumber) {
            this.loggerService.logMessage({ message: 'Please enter a valid number!', type: 'warning' });
            return;
        }
        this.communicationService.makeCall(this.phoneNumber);
    }

    sendSms(cb) {
        if (this.smsMessage && this.smsMessage.trim() != "") {
            this.communicationService.sendSms(this.phoneNumber, this.smsMessage)
            cb();
        }
        this.smsMessage = "";
        return;
    }

    sendFax(cb) {
        if (this.file) {
            this.communicationService.sendFax(this.phoneNumber, this.file, this.callerId);
            cb();
        }
    }

    openSmsModal(content) {
        if (!this.phoneNumber) {
            this.loggerService.logMessage({ message: 'Please enter a valid number!', type: 'warning' });
            return;
        }
        this.modalService.open(content, { centered: true, });
    }

    openFaxModal(content) {
        if (!this.phoneNumber) {
            this.loggerService.logMessage({ message: 'Please enter a valid number!', type: 'warning' });
            return;
        }
        this.getCallerIds();
        this.modalService.open(content, { centered: true });
    }

    navigateToHome() {
        this.router.navigateByUrl('home');
    }

    handleFileInput(event: any) {
        let file = event[0];
        this.file = file;
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

    getPermissions() {
        this.subscription = this.dataService.userPermissions
            .subscribe(permission => {
                if (permission.length > 0) {
                    permission.forEach(x => {
                        switch (x.name) {
                            case "allowFax": (x.value == "1" ? this.isFaxAllowed = true : this.isFaxAllowed = false);
                                break;

                            case "outboundSMS": (x.value == "1" ? this.isSmsAllowed = true : this.isSmsAllowed = false);
                                break;
                        }
                    });
                }
            },
            (error) => {
                console.log(error);
            })
    }
}
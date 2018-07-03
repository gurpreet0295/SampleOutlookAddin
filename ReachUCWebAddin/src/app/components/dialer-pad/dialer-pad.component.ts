import { Component, OnInit } from '@angular/core';
import { CommunicationService } from '../../services/communication.service';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { HomeService } from '../../services/home.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

declare var $: any;

@Component({
    selector: 'app-dialer-pad',
    templateUrl: './dialer-pad.component.html',
    styleUrls: ['./dialer-pad.component.css']
})
export class DialerPadComponent implements OnInit {

    phoneNumber: string;
    callResponse: string;
    callerId: string;
    callerIds: string[];
    defaultCallerId: string[];
    file: any;
    smsMessage: string;

    constructor(private communicationService: CommunicationService, private homeService: HomeService, private http: Http, private router: Router, private modalService: NgbModal) {
        this.phoneNumber = "";
        this.callResponse = "";
        this.smsMessage = "";
        this.defaultCallerId = new Array<string>();
        this.defaultCallerId.push("0000000000");
    }

    ngOnInit() {
        $('.num').click(function () {
            var num = $(this);
            var text = $.trim(num.find('.txt').clone().children().remove().end().text());
            var telNumber = $('#telNumber');
            $(telNumber).val(telNumber.val() + text);
            //telNumber.trigger('change');
        });
    }

    onChange(event: any) {
        this.phoneNumber = event.target.value;
    }

    makeCall() {
        var telNumber = $('#telNumber');
        this.phoneNumber = $(telNumber).val();
        this.communicationService.makeCall(this.phoneNumber);
    }

    sendSms() {
        //this.communicationService.sendSms();
    }

    sendFax() {
        //this.communicationService.sendFax();
    }

    openSmsModal(content) {
        this.modalService.open(content, { centered: true, });
    }

    openFaxModal(content) {
        this.getCallerIds();
        this.modalService.open(content, { centered: true });
    }

    navigateToHome() {
        this.router.navigateByUrl('home');
    }

    handleFileInput(event: any) {
        let file = event[0];
        if (file) {
            this.file = file;
        }
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
}

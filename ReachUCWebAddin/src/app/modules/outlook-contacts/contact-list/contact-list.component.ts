import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContactListService } from '../contact-list.service';
import { OutlookAuthService } from '../../../services/outlook-auth.service';
import { Subscription } from 'rxjs/Subscription';

import * as MicrosoftGraph from "@microsoft/microsoft-graph-types"
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { ContactModalComponent } from '../contact-modal/contact-modal.component';

declare let Office: any;
declare var $: any;


@Component({
    selector: 'app-contact-list',
    templateUrl: './contact-list.component.html',
    styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit, OnDestroy {

    events: MicrosoftGraph.Event[];
    me: MicrosoftGraph.User;
    message: MicrosoftGraph.Message;
    subsGetUsers: Subscription;
    subsGetMe: Subscription;
    myContacts: Subscription;
    subsSendMail: Subscription;
    contacts: any;
    error: boolean;
    smsMessage: string;
    isSmsAllowed: boolean = true;
    isFaxAllowed: boolean = true;
    contactPhoneNumbers: string[];
    contactsMap = {};

    constructor(private contactListService: ContactListService,
        private authService: OutlookAuthService,
        private route: ActivatedRoute,
        private modalService: NgbModal) {
        this.error = false;
        this.smsMessage = "";
    }

    ngOnInit() {
        if (!this.isAuthenticated()) {
            this.subsGetMe = this.contactListService.getMe().subscribe(me => this.me = me);
            this.myContacts = this.contactListService.getUserContacts()
                                                        .subscribe(result => {
                                                            this.contacts = result.value;
                                                            console.log('contacts');
                                                            console.log(this.contacts);
                                                            if (Array.isArray(this.contacts)) {
                                                                this.contacts.forEach(x => {
                                                                    let contactPhoneNumbers = new Array<string>();
                                                                    x.businessPhones && Array.isArray(x.businessPhones) && x.businessPhones.forEach(number => contactPhoneNumbers.push(number));
                                                                    x.homePhones && Array.isArray(x.homePhones) && x.homePhones.forEach(number => contactPhoneNumbers.push(number));
                                                                    x.mobilePhone && contactPhoneNumbers.push(x.mobilePhone);
                                                                    this.contactsMap[x.displayName] = contactPhoneNumbers;
                                                                    console.log(this.contactsMap);
                                                                });
                                                            }
                                                        });

        } else {
            this.error = false;
            this.contacts = [{
                'businessPhones': ["9999999999"],
                'homePhones': ["8776655443"],
                'mobilePhone': "9898988776",
                'displayName': "Tester 1"
            },
            {
                'businessPhones': ["9999s23999"],
                'homePhones': ["8756655443"],
                'mobilePhone': "9213412776",
                'displayName': "Tester 2"
            }];
            if (Array.isArray(this.contacts)) {
                this.contacts.forEach(x => {
                    let contactPhoneNumbers = new Array<string>();
                    x.businessPhones && Array.isArray(x.businessPhones) && x.businessPhones.forEach(number => contactPhoneNumbers.push(number));
                    x.homePhones && Array.isArray(x.homePhones) && x.homePhones.forEach(number => contactPhoneNumbers.push(number));
                    x.mobilePhone && contactPhoneNumbers.push(x.mobilePhone);
                    this.contactsMap[x.displayName] = contactPhoneNumbers;
                    console.log(this.contactsMap);
                });
            }
        }

    }

    ngOnDestroy() {
        //this.myContacts.unsubscribe();
    }

    isAuthenticated() {
        let value = this.route.snapshot.paramMap.get('err');
        return value || "";
    }

    onLogout() {
        this.authService.logout();
    }

    onLogin() {
        this.authService.login();
    }

    openSmsAndCallModal(name: string) {
        console.log(this.contactsMap[name]);
        let modalRef = this.modalService.open(ContactModalComponent, { centered: true });
        modalRef.componentInstance.contactPhoneNumbers = this.contactsMap[name];
    }

    addContactToPbx(contact) {

    }

    sendSms(destinationNumber: string, dropdown: NgbDropdown) {
        if (this.smsMessage) {
            //this.communicationService.sendSms(destinationNumber, this.smsMessage)
            dropdown.close();
        }
        this.smsMessage = "";
    }


}

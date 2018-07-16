import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-contact-modal',
  templateUrl: './contact-modal.component.html',
  styleUrls: ['./contact-modal.component.css']
})
export class ContactModalComponent implements OnInit {

    @Input() contactPhoneNumbers:string[];

    ngOnInit() {
        console.log('on comp intialize.....');
        console.log(this.contactPhoneNumbers);
    }

    constructor(public activeModal: NgbActiveModal) {
    }

}

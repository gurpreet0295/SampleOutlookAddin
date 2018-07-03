import { Component, OnInit } from '@angular/core';
import { DialerService } from '../../services/dialer.service';
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
  

  constructor(private dialerService: DialerService, private homeService: HomeService, private http: Http, private router: Router, private modalService: NgbModal) {
    this.phoneNumber = "";
    this.callResponse = "";
  }

  ngOnInit() {
      $('.num').click(function () {
        var num = $(this);
        var text = $.trim(num.find('.txt').clone().children().remove().end().text());
        var telNumber = $('#telNumber');
        $(telNumber).val(telNumber.val() + text);
      });
  }

  makeCall() {
    var telNumber = $('#telNumber');
    this.phoneNumber = $(telNumber).val();
    this.dialerService.makeCall(this.phoneNumber);
  }

  sendSms(content) {
      this.modalService.open(content, { centered: true });
  }

  sendFax(content) {
      this.modalService.open(content, { centered: true });
  }

  navigateToHome() {
    this.router.navigateByUrl('home');
  }
}

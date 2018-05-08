import { Component, OnInit } from '@angular/core';
import { DialerService } from '../../services/dialer.service';
import { Http } from '@angular/http';
import { Router } from '@angular/router';


declare var $: any;

@Component({
  selector: 'app-dialer-pad',
  templateUrl: './dialer-pad.component.html',
  styleUrls: ['./dialer-pad.component.css']
})
export class DialerPadComponent implements OnInit {

  phoneNumber: string;
  callResponse: string;
  

  constructor(private dialerService: DialerService, private http: Http, private route: Router) {
    this.phoneNumber = "";
    this.callResponse = "";
  }

  ngOnInit() {
    debugger;
      $('.num').click(function () {
        var num = $(this);
        var text = $.trim(num.find('.txt').clone().children().remove().end().text());
        var telNumber = $('#telNumber');
        $(telNumber).val(telNumber.val() + text);
      });
  }

  makeCall() {
    debugger;
    var telNumber = $('#telNumber');
    this.phoneNumber = $(telNumber).val();
    this.dialerService.makeCall(this.phoneNumber, this.callResponse);
  }

}

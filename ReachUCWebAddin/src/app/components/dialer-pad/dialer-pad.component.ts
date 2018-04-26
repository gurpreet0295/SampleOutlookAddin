import { Component, OnInit } from '@angular/core';
import { DialerService } from '../../services/dialer.service';
import { Http } from '@angular/http';


declare var $: any;

@Component({
  selector: 'app-dialer-pad',
  templateUrl: './dialer-pad.component.html',
  styleUrls: ['./dialer-pad.component.css']
})
export class DialerPadComponent implements OnInit {

  phoneNumber: string;
  dialerService: DialerService
  callResponse: string;

  constructor(private http: Http) {
    this.dialerService = new DialerService(http);
    this.phoneNumber = "";
    this.callResponse = "";
  }

  ngOnInit() {
    //debugger;
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
    this.dialerService.makeCall(this.phoneNumber, this.callResponse);
  }
}

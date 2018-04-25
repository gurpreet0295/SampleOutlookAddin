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
  dialerService: DialerService;
  constructor(private http: Http) {
    this.dialerService = new DialerService(http);
    this.phoneNumber = "";
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
    this.dialerService.makeCall(this.phoneNumber);
  }
}

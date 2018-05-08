import { Component, OnInit } from '@angular/core';
import { OutlookService } from '../../services/outlook.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { Router } from '@angular/router';
import { String, StringBuilder } from 'typescript-string-operations';
import { Common } from '../../services/common.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  phoneNumbers: string  
  domain: string;
  user: string;
  areaCode: string;

  constructor(private outlookService: OutlookService, private commonService: Common, private route: Router) {
    this.domain = commonService.domain;
    this.user = commonService.user;
    this.areaCode = commonService.areaCode;
    this.phoneNumbers = String.Empty;
  }

  ngOnInit() {
    let numbers = this.outlookService.getPhoneNumbers();
    if (numbers && numbers.length > 0) {
      this.phoneNumbers += '<div class="show-list">';
      this.phoneNumbers += '<ul class="list-group">';
      this.phoneNumbers += '<li class="list-group-item active" style="background-color: #76c8dc; border-color: #76c8dc; font-size:20px; padding: .5rem 1rem; border-radius:0px"> Phone Numbers</li>'
      numbers.forEach((num) => {
        if (num.originalPhoneString && !String.IsNullOrWhiteSpace(num.originalPhoneString)) {
          this.phoneNumbers += '<li class="list-group-item" style="padding: .5rem 1rem">' + num.originalPhoneString + '</li>';
        }
      });
      this.phoneNumbers += '</ul>' + '</div';
      document.getElementById('numbers').innerHTML = this.phoneNumbers;
    }
  }

  onClick() {
    this.route.navigateByUrl('dialer');
  }

  openMeetingManager() {
    this.route.navigateByUrl('meeting');
  }
}

import { Component, OnInit } from '@angular/core';
import { OutlookService } from '../../services/outlook.service';
import { Router } from '@angular/router';
import { String } from 'typescript-string-operations';
import { Common } from '../../services/common.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  phoneNumbers: Array<string>;
  domain: string;
  user: string;
  areaCode: string;

  constructor(private outlookService: OutlookService, private commonService: Common, private route: Router) {
    Array.isArray(this.phoneNumbers) ? console.log("array") : console.log("not array");
    this.domain = commonService.domain;
    this.user = commonService.user;
    this.areaCode = commonService.areaCode;
    this.phoneNumbers = new Array<string>(4);
  }

  ngOnInit() {
    debugger;
    let numbers = this.outlookService.getPhoneNumbers();
    console.log(this.phoneNumbers);
    Array.isArray(this.phoneNumbers) ? console.log("array") : console.log("not array");
    numbers.forEach((num) => {
      if (num.phonestring && !String.IsNullOrWhiteSpace(num.phoneString)) {
        console.log("in phonestring " + num.phoneString)
        this.phoneNumbers.push(num.phoneString);
      }
      else {
        if (num.originalphonestring && !String.IsNullOrWhiteSpace(num.originalPhoneString)) {
          console.log("in original " + num.originalPhoneString)
          this.phoneNumbers.push(num.originalPhoneString)
        }
      }

      console.log(this.phoneNumbers);
    })
    console.log(this.phoneNumbers);
  }

  onClick() {
    console.log("In Dialer");
    this.route.navigateByUrl('dialer');
  }
}

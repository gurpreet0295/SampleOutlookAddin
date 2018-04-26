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

  phoneNumbers: any;
  outlookService: OutlookService;
  domain: string;
  user: string;
  areaCode: string;
  commonService: Common;

  constructor(private route: Router) {
    this.outlookService = new OutlookService();
    this.commonService = new Common();
    this.domain = this.commonService.domain;
    this.user = this.commonService.user;
    this.areaCode = this.commonService.areaCode;

    this.phoneNumbers = ["test", "test"];
    Array.isArray(this.phoneNumbers) ? console.log("array") : console.log("not array");//this.phoneNumbers = numbers;
    //this.phoneNumbers = new Array<string>();
    //var x = new Object();
    //x = "Test";
    //var y = new Object();
    //y = "Tet";
    //this.phoneNumbers.push(x);
    //this.phoneNumbers.push(y);
  }

  ngOnInit() {
    let numbers = this.outlookService.getPhoneNumbers();
    console.log(this.phoneNumbers);
    Array.isArray(this.phoneNumbers) ? console.log("array") : console.log("not array");//this.phoneNumbers = numbers;
    numbers.forEach((num) => {
      if (num.phoneString && !String.IsNullOrWhiteSpace(num.phoneString)) {
        console.log("in phonestring " + num.phoneString)
        this.phoneNumbers.push(num.phoneString);
      }
      else {
        if (num.originalPhoneString && !String.IsNullOrWhiteSpace(num.originalPhoneString)) {
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

import { Component, OnInit } from '@angular/core';
import { OutlookService } from '../../services/outlook.service';
import { Router } from '@angular/router';
import { String } from 'typescript-string-operations';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  areaCode: any;
  user: any;
  domain: any;
  token: any;
  password: any;
  userName: any;
  localStorage: any;
  numbers: any;
  outlookService: OutlookService;

  constructor(private route: Router) {
    this.outlookService = new OutlookService();
    this.localStorage = window.localStorage;
    this.userName = this.localStorage.getItem('userName');
    this.password = this.localStorage.getItem('password');
    this.token = this.localStorage.getItem('accesstoken');
    this.domain = this.localStorage.getItem('domain');
    this.user = this.localStorage.getItem('user');
    this.areaCode = this.localStorage.getItem('areaCode');
  }

  ngOnInit() {
    this.outlookService.getPhoneNumbers()
      .then((numbers) => {
        console.log(numbers);
        this.numbers = numbers[0].phoneString;
        if (String.IsNullOrWhiteSpace(this.numbers)){
          this.numbers = numbers[0].originalPhoneString;
        }
        console.log(this.numbers);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  onClick() {
    console.log("In Dialer");
    this.route.navigateByUrl('dialer');
  }
}

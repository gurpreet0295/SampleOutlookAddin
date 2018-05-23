import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { String, StringBuilder } from "typescript-string-operations";
import { MeetingService } from "./meeting.service";
import { Common } from "./common.service";
//import { post } from "selenium-webdriver/http";
import { PACKAGE_ROOT_URL } from "@angular/core/src/application_tokens";

@Injectable()
export class SkySwitchAPIService {
  
  private endpointURl: string;
  private clientId: string;
  private grantType: string;
  private clientSecret: string;
  private meetingURL: string;
  private scheduleMeetingURL: string;
  private sendFaxURL: string;
  private apiKey: string;
  private apiSecret: string;
  private actionUrl: string;
  private telcoTokenURL: string;

  constructor(private http: Http, private commonService:Common) {
    this.endpointURl = "https://pbx.skyswitch.com/ns-api/";
    this.telcoTokenURL = "https://telco-api.skyswitch.com/oauth/token"
    this.meetingURL = "https://endpoint.dashmanager.com/rhub-controller/?target=remote_schedule";
    this.scheduleMeetingURL = "https://admin.dashmanager.com/default/adapter.php";
    this.sendFaxURL = "https://api.instant-fax.com/v1/";
    this.clientId = "reachucOutlookC2C";
    this.grantType = "password";
    this.clientSecret = "f2c667b49e35553837f83b53a7cc2e3b";
    this.apiKey = "eVCbwxPEmhTS";
    this.apiSecret = "AFt2MI9izTxj";
    this.actionUrl = "send";
  }

  getOuthToken() {
    let postData = String.Format('{"grant_type":"{0}","client_id":"{1}","client_secret":"{2}","username":"{3}","password":"{4}","scope":"{5}"}', this.grantType, this.clientId, this.clientSecret, this.commonService.userName, this.commonService.password, "*");
    postData = JSON.stringify(postData);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.telcoTokenURL, postData, options);
  }
  //API to get token.
  getToken(userName: string, password: string, loginParam: string) {
    let postData = String.Format("client_id={0}&client_secret={1}&grant_type={2}&username={3}&password={4}", this.clientId, this.clientSecret, this.grantType, userName, password);
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.endpointURl + loginParam, postData, options);
  }


  //API to getDomain
  getUserDomain(userName:string, token: string) {
    let postData = String.Format("action=read&object=subscriber&login={0}", userName);
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    headers.append('Authorization', 'Bearer ' + token);
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.endpointURl, postData, options);
  }

  //API for call
  call(userName: string, callId: string, destination: string, domain: string, origination: string, token: string) {
    let postData = String.Format("action=call&object=call&uid={0}&callid={1}&destination={2}&domain={3}", origination + "@" + domain, callId, destination, domain);
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    headers.append('Authorization', 'Bearer ' + token);
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.endpointURl, postData, options);
  }

  getMeetingId(startTime: string, endTime: string, meetingService: any){
    var is_recurring;
    let params: URLSearchParams = new URLSearchParams();
    if (meetingService.isRecurring) {
      is_recurring = "Y";
    }
    else {
      is_recurring = "N";
    }
    params.set('meeting_topic', meetingService.meetingTopic);
    params.set('password', meetingService.meetingPassword);
    params.set('start_time', startTime);
    params.set('end_time', endTime);
    params.set('user_id', this.commonService.userName);
    params.set('meeting_type', meetingService.meetingType);
    params.set('is_recurring', is_recurring);
    let options = new RequestOptions({ search: params });
    return this.http.get(this.meetingURL, options);
  }
  
  sheduleMeeting() {
    let params: URLSearchParams = new URLSearchParams();
    params.set('email', this.commonService.userName || "");
    params.set('password', this.commonService.password || "");
    let options = new RequestOptions({ search: params });
    return this.http.get(this.scheduleMeetingURL, options);
  }

  sendFax(toNumber: string, file: any, callerId: string, fileName: string) {
    let headers = new Headers({ 'Content-Type': 'multipart/form-data' });
    let params = new URLSearchParams();
    params.set('api_key', this.apiKey);
    params.set('api_secret', this.apiSecret);
    params.set('to', toNumber);
    params.set('caller_id', callerId);
    params.set('billing_identifier', this.commonService.domain);
    let options = new RequestOptions({ search: params });
    options.headers = headers;
    return this.http.post(this.sendFaxURL + this.actionUrl, file);
  }
}

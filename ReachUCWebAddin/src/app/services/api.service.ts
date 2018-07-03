import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { String, StringBuilder } from "typescript-string-operations";
import { MeetingService } from "./meeting.service";
import { Common } from "./common.service";

@Injectable()
export class SkySwitchAPIService {
  private endpointURl: string;
  private clientId: string;
  private grantType: string;
  private clientSecret: string;
  private meetingURL: string;
  private scheduleMeetingURL: string;
  private sendFaxURL: string;
  private sendSmsURL: string;
  private apiKey: string;
  private apiSecret: string;
  private actionUrl: string;
  private telcoTokenURL: string;

  constructor(private http: Http, private commonService:Common) {
    this.endpointURl = "https://pbx.skyswitch.com/ns-api/";
    this.telcoTokenURL = "https://telco-api.skyswitch.com/"
    this.meetingURL = "https://endpoint.dashmanager.com/rhub-controller/?target=remote_schedule";
    this.scheduleMeetingURL = "https://admin.dashmanager.com/default/adapter.php";
    this.sendFaxURL = "https://api.instant-fax.com/v2/";
    this.sendSmsURL = "https://api.reachuc.com/hub/nms/send";
    this.clientId = "reachucOutlookC2C";
    this.grantType = "password";
    this.clientSecret = "f2c667b49e35553837f83b53a7cc2e3b";
    this.apiKey = "a12b171a775ad73dad9092711929ed4d";// "eVCbwxPEmhTS";
    this.apiSecret = "d7ded347b23d884d64d0068d3a00d4d5";// "AFt2MI9izTxj";
  }

  getAuthToken() {
    let userName = "outlook.o365@reachuc.com";
    let password = "rE68Bu5B4g";
    let clientId = "12"
    let clientSecret = "cake89abbey";
    let postData = String.Format('{"grant_type":"{0}","client_id":"{1}","client_secret":"{2}","username":"{3}","password":"{4}","scope":"{5}"}', this.grantType, clientId, clientSecret, userName, password, "*");
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.telcoTokenURL + "oauth/token", postData, options);
  }

  getUserProfile() {
    let headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.commonService.telkoToken);
    let options = new RequestOptions({ headers: headers });
    return this.http.get(this.telcoTokenURL + "/profile", options);
  }

  getResellerNumber() {
    let params: URLSearchParams = new URLSearchParams();
    params.set('format', 'json');
    params.set('object', 'domain');
    params.set('action', 'read');
    params.set('domain', this.commonService.domain);
    let headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.commonService.skyToken);
    let options = new RequestOptions({ search: params, headers: headers });
    return this.http.get(this.endpointURl, options);
  }

  getUserSubAccounts(accountId: string, territory: string) {
    let accountParam = String.Format("/accounts/{0}/sub-accounts", accountId);
    let params: URLSearchParams = new URLSearchParams();
    params.set('recursive', '1');
    params.set('account_number', territory);
    let headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.commonService.telkoToken);
    let options = new RequestOptions({ search: params, headers: headers });
    return this.http.get(this.telcoTokenURL + accountParam, options);
  }

  getUserConfig(accountId: string) {
    let accountParam = String.Format("/accounts/{0}/uc/config", accountId);
    let params: URLSearchParams = new URLSearchParams();
    params.set('domain', this.commonService.domain);
    params.set('subscriber', this.commonService.user);
    params.set('include_entitlement', "1");
    params.set('class', "reachui");
    let headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.commonService.telkoToken);
    let options = new RequestOptions({ search: params, headers: headers });
    return this.http.get(this.telcoTokenURL + accountParam, options);
  }
  
  getToken(userName: string, password: string, loginParam: string) {
    let postData = String.Format("client_id={0}&client_secret={1}&grant_type={2}&username={3}&password={4}", this.clientId, this.clientSecret, this.grantType, userName, password);
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.endpointURl + loginParam, postData, options);
  }

  getUserDomain(userName:string, token: string) {
    let postData = String.Format("action=read&object=subscriber&login={0}", userName);
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    headers.append('Authorization', 'Bearer ' + token);
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.endpointURl, postData, options);
  }

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

  sendFax(toNumber: string, file: Blob, callerId: string, actionUrl: string, billingIdentifier: string) {
    let params = new URLSearchParams();
    let formdata: FormData = new FormData();
    formdata.append('filename', file);
    params.set('api_key', this.apiKey);
    params.set('api_secret', this.apiSecret);
    params.set('to', toNumber);
    params.set('caller_id', callerId);
    params.set('billing_identifier', billingIdentifier);
    let options = new RequestOptions({ search: params });
    return this.http.post(this.sendFaxURL + actionUrl, formdata, options);
  }

  sendSms(destination: string, message: string){
    let params = new URLSearchParams();
    params.set('username', this.commonService.userName);
    params.set('password', this.commonService.password);
    params.set('destination', destination);
    params.set('message', message);
    let options = new RequestOptions({ search: params });
    return this.http.get(this.sendSmsURL, options);
  }


  getCallerIdsList(actionUrl:string) {
    let params: URLSearchParams = new URLSearchParams();
    params.set('api_key', this.apiKey);
    params.set('api_secret', this.apiSecret);
    params.set('subscriber', this.commonService.domain);
    let options = new RequestOptions({ search: params });
    return this.http.get(this.sendFaxURL + actionUrl, options);
  }
}

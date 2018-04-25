import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions } from "@angular/http";
import { String, StringBuilder } from "typescript-string-operations";

@Injectable()
export class SkySwitchAPIService {

  public endpointURl: string;
  public clientId: string;
  public grantType: string;
  public clientSectret: string;

  constructor(private http: Http) {
    this.endpointURl = "https://pbx.skyswitch.com/ns-api/";
    this.clientId = "reachucOutlookC2C";
    this.grantType = "password";
    this.clientSectret = "f2c667b49e35553837f83b53a7cc2e3b";
  }

  //API to get token.
  getToken(userName: string, password: string, loginParam: string) {
    let postData = String.Format("client_id={0}&client_secret={1}&grant_type={2}&username={3}&password={4}", this.clientId, this.clientSectret, this.grantType, userName, password);
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.endpointURl + loginParam, postData, options);
  }


  //TODO: API to getDomain
  getUserDomain(userName:string, token: string) {
    let postData = String.Format("action=read&object=subscriber&login={0}", userName);
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    headers.append('Authorization', 'Bearer ' + token);
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.endpointURl, postData, options);
  }

  //TODO: API for call
  call(userName: string, callId: string, destination: string, domain: string, origination: string, token: string) {
    let postData = String.Format("action=call&object=call&uid={0}&callid={1}&destination={2}&domain={3}", origination + "@" + domain, callId, destination, domain);
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    headers.append('Authorization', 'Bearer ' + token);
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.endpointURl, postData, options);
  }

}

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromPromise';
import * as MicrosoftGraph from "@microsoft/microsoft-graph-types"
import * as MicrosoftGraphClient from "@microsoft/microsoft-graph-client"
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { OutlookAuthService } from '../../services/outlook-auth.service';

@Injectable()
export class ContactListService {
    constructor(private http: Http, private authService: OutlookAuthService) { }

    getClient(): MicrosoftGraphClient.Client {
        var client = MicrosoftGraphClient.Client.init({
            authProvider: (done) => {
                done(null, this.authService.getAccessToken()); //first parameter takes an error if you can't get an access token
            }
        });
        return client;
    }

    getMe(): Observable<MicrosoftGraph.User> {
        var client = this.getClient();
        return Observable.fromPromise(client
            .api('me')
            .select("displayName, mail, userPrincipalName")
            .get()
            .then((res => {
                return res;
            }))
        );
    }

    getUserContacts(): Observable<any> {
        var client = this.getClient();
        return Observable.fromPromise(client
            .api('/me/contacts')
            .top(10)
            .select('*')
            //.select('givenName,surname,emailAddresses')
            .orderby('givenName ASC')
            .get()
            .then((res => {
                return res;
            }))

        );
    }

}
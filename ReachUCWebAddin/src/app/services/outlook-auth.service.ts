import { Injectable, NgZone } from "@angular/core";
import { Router } from "@angular/router";
import * as hello from 'hellojs/dist/hello.all.js';
import { Configs } from '../config/config'
import { String } from 'typescript-string-operations';

@Injectable()
export class OutlookAuthService {
    constructor(private route: Router, private zone: NgZone) {
    }

    login() {
        if (!this.isValidAuthToken()) {
            hello('msft').login({ scope: Configs.scope }).then(
                () => {
                    this.zone.run(() => {
                        this.route.navigateByUrl('contacts');
                    });
                },
                e => {
                    this.zone.run(() => {
                        this.route.navigateByUrl('contacts/error');
                    });
                }
            );
        } else {
            this.route.navigateByUrl('contacts');
        }
    }

    initAuth() {
        hello.init({
            msft: {
                id: Configs.appId,
                oauth: {
                    version: 2,
                    auth: Configs.authUrl
                },
                scope_delim: ' ',
                form: false
            },
        },
            { redirect_uri: Configs.redirectUri }
        );
    }

    logout() {
        hello('msft').logout().then(
            () => window.location.href = '/',
            e => console.error(e.error.message)
        );
    }

    getAccessToken() {
        const msft = hello('msft').getAuthResponse();
        const accessToken = msft && msft.access_token;
        return accessToken || "";
    }

    isValidAuthToken() {
        let currentTime = (new Date()).getTime() / 1000;
        let session = hello('msft').getAuthResponse();
        return session && session.access_token && session.expires > currentTime;
    }
}
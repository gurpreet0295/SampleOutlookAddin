import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions } from "@angular/http";
import { String, StringBuilder } from "typescript-string-operations";
import { SkySwitchAPIService } from "./api.service";
import 'rxjs/add/operator/map';
import { Response } from "@angular/http/src/static_response";
import { Common } from "./common.service";
import { Router } from "@angular/router";
import { HomeService } from "./home.service";
import { DataService } from "./data-sharing.service";
import { BehaviorSubject } from "rxjs";
import { LoggerService } from "./logger.service";
import { UserPermissionModel } from '../models/userpermissions.model'

@Injectable()
export class LoginService {

    isLoginSuccessful = new BehaviorSubject<boolean>(true);

    constructor(private apiService: SkySwitchAPIService, private commonService: Common, private http: Http, private route: Router, private homeService: HomeService, private dataService: DataService, private loggerService: LoggerService) {
    }

    loginToReachUC(username: string, password: string) {
        return this.apiService.getToken(username, password, "oauth2/token")
            .map(response => response.json());
    }

    getUserDomain(userName: string, token: any) {
        return this.apiService.getUserDomain(userName, token)
            .map(response => response.json())
            .subscribe((data) => {

                if (data && Array.isArray(data) && data[0].domain) {
                    this.isLoginSuccessful.next(true);
                    let domain = data[0].domain;
                    let user = data[0].user;
                    let areaCode = data[0].area_code;

                    this.commonService.changeLoaderStatus(false);
                    this.commonService.storeUserDomain(domain, user, areaCode);
                    this.route.navigateByUrl('home');
                    this.dataService.changeData(new Array<UserPermissionModel>());
                    this.getUserPermissions();
                    this.commonService.setUserProperties("1", "011", "11");
                }
                else {
                    this.commonService.changeLoaderStatus(false);
                    console.log("No domain");
                    this.isLoginSuccessful.next(false);
                }
            },
            (error) => {
                this.commonService.changeLoaderStatus(false);
                console.log(error);
                this.isLoginSuccessful.next(false);
            });
    }

    getUserPermissions() {
        this.loggerService.logMessage({ message: 'Getting User Permissions..', type: 'info' });
        this.apiService.getAuthToken()
            .map(response => response.json())
            .subscribe(({ access_token, refresh_token, expires_in }) => {
                if (!String.IsNullOrWhiteSpace(access_token) && !String.IsNullOrWhiteSpace(refresh_token) && !String.IsNullOrWhiteSpace(expires_in)) {
                    this.commonService.storeOuthTokenDetials(access_token, refresh_token, expires_in);
                    this.apiService.getUserProfile()
                        .map(response => response.json())
                        .subscribe(({ account_id }) => {
                            if (!String.IsNullOrWhiteSpace(account_id)) {
                                this.apiService.getResellerNumber()
                                    .map(response => response.json())
                                    .subscribe((response) => {
                                        let territory = response[0].territory;
                                        this.apiService.getUserSubAccounts(account_id, territory)
                                            .map(response => response.json())
                                            .subscribe((response) => {
                                                let child = response && Array.isArray(response) && response[0].children || "";
                                                let subAccountId = child && Array.isArray(child) && child[0].id;
                                                this.apiService.getUserConfig(subAccountId)
                                                    .map(response => {
                                                        let settingsObject: UserPermissionModel[];
                                                        let data = response.json();
                                                        if (Array.isArray(data)) {
                                                            settingsObject = data.map(d => {
                                                                var myObject = new UserPermissionModel();
                                                                d.setting ? myObject.name = d.setting.name : myObject.name = null
                                                                myObject.value = d.setting_value
                                                                return myObject;
                                                            });
                                                        }
                                                        return settingsObject || [];
                                                    })
                                                    .subscribe((response) => {
                                                        console.log(response);
                                                        //this.loggerService.logMessage({ message: 'Succefully received user permissions.', type: 'success' });
                                                        this.dataService.changeData(response);
                                                    },
                                                    (error) => {
                                                        this.loggerService.logMessage({ message: 'Unable to receive user permissions', type: 'danger' });
                                                        console.log(error);
                                                    })
                                            },
                                            (error) => {
                                                this.loggerService.logMessage({ message: 'Unable to receive user permissions', type: 'danger' });
                                                console.log(error)
                                            });
                                    },
                                    (error) => {
                                        this.loggerService.logMessage({ message: 'Unable to receive user permissions', type: 'danger' });
                                        console.log(error);
                                    });
                            }
                        },
                        (error) => {
                            this.loggerService.logMessage({ message: 'Unable to receive user permissions', type: 'danger' });
                            console.log(error);
                        });
                }
            },
            (error) => {
                this.loggerService.logMessage({ message: 'Unable to receive user permissions', type: 'danger' });
                console.log(error);
            });
    }
}

import { Injectable } from "@angular/core";
import { Common } from "./common.service";
import { SkySwitchAPIService } from "./api.service";

@Injectable()
export class HomeService {

  constructor(private apiService: SkySwitchAPIService, private commonService: Common) {

  }

  //TODO: Implement Send FAX feature.
  send(appliedNumber: string, file: any, callerId: any, fileName: string) {
    this.apiService.sendFax(appliedNumber, file, callerId, fileName)
      .subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      })
  }
}

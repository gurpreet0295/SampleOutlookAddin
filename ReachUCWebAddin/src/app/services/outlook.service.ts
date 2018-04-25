import { Injectable } from "@angular/core";

declare let Office: any;
@Injectable()
export class OutlookService {
  constructor() {}

  public getPhoneNumbers(): Promise<any[]> {
    debugger;
    let promise: Promise<any[]> = new Promise<any[]>((resolve, reject) => {
      try {
        let currentMail: any = Office.cast.item.toItemRead(Office.context.mailbox.item);
        let numbers = currentMail.getEntitiesByType(Office.MailboxEnums.EntityType.PhoneNumber);
        //let numbers = currentMail.getRegExMatches();
        console.log(numbers);
        resolve(numbers);
      }
      catch (error) {
        console.log("in office service exception");
        console.log(error);
        reject(error);
      }
    });
    return promise;
  }
}

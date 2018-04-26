import { Injectable } from "@angular/core";

declare let Office: any;
@Injectable()
export class OutlookService {
  constructor() {}

  public getPhoneNumbers(): any[] {
    let numbers: any[];

    try {
      let currentMail: any = Office.cast.item.toItemRead(Office.context.mailbox.item);
      numbers = currentMail.getEntitiesByType(Office.MailboxEnums.EntityType.PhoneNumber);
      //let numbers = currentMail.getRegExMatches();
      console.log(numbers);
    }
    catch (error) {
      console.log("in office service exception");
      console.log(error);
    }
    return numbers;
  }
}

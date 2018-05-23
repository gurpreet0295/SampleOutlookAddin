import { Injectable } from "@angular/core";
import { String, StringBuilder } from 'typescript-string-operations';
import { forEach } from "@angular/router/src/utils/collection";

declare let Office: any;
@Injectable()
export class OutlookService {
  constructor() {}

  public getPhoneNumbers(dialerLength:string): any[] {
    let numbers: any[];
    numbers = new Array<any>();
    try {
      /*
       *This method only returns number contating '-'. 
        let currentMail: any = Office.cast.item.toItemRead(Office.context.mailbox.item);
        numbers = currentMail.getEntitiesByType(Office.MailboxEnums.EntityType.PhoneNumber);
      */

      Office.context.mailbox.item.body.getAsync(
        "text",
        { asyncContext: "This is passed to the callback" },
        function callback(result) {
          let lines = result.value.split("\n");
          let regExp = new RegExp(String.Format("([\+]?[0-9\-\(\)]{7,\{0\}})", dialerLength));
          console.log(regExp);
          lines && lines.forEach((line) => {
            let numbersFound = line.match(regExp);
            if (Array.isArray(numbersFound)) {
              numbersFound.forEach((number) => {
                if (!(numbers.indexOf(number) > -1)) {
                  numbers.push(number);
                }
              });
            } else {
              numbersFound && numbers.push(numbersFound);
            }
          });
          console.log(numbers);
        }
      );
    }
    catch (error) {
      console.log("in office service exception");
      console.log(error);
    }
    return numbers;
  }

  public openNewAppointmentWindow(meetingTopic: string, meetingStartTime: any, meetingEndTime: any, isRecurring: boolean, meetingText: string) {
    try {
      let currentMail: any = Office.context.mailbox.item;
      let address = currentMail.from;
      let emailAddress = address.emailAddress;

      Office.context.mailbox.displayNewAppointmentForm(
        {
          requiredAttendees: [emailAddress],
          start: meetingStartTime,
          end: meetingEndTime,
          location: 'ReachUC Meeting',
          subject: meetingTopic,
          body: meetingText
        });
    }
    catch (error) {
      console.log(error);
    }
    
  }
}


import { Injectable } from "@angular/core";
import { String, StringBuilder } from 'typescript-string-operations';
import { forEach } from "@angular/router/src/utils/collection";
import { Observable } from "rxjs/Observable";

declare let Office: any;
@Injectable()
export class OutlookService {

  constructor() {
  }

  public getPhoneNumbers(dialerLength: string): Observable<any[]> {
    var observable = Observable.create(function(observer){
      let numbers: any[];
      numbers = new Array<any>();
      /*
       *This method only returns number contating '-'. 
        let currentMail: any = Office.cast.item.toItemRead(Office.context.mailbox.item);
        numbers = currentMail.getEntitiesByType(Office.MailboxEnums.EntityType.PhoneNumber);
      */

      Office.context.mailbox.item.body.getAsync(
        "text",
        function callback(result) {
          let lines = result.value.split("\n");
          let regExp = new RegExp(String.Format("[\\(|\\d|\\+][0-9\\(\\)\\/\\+ \\-\\.]{6,\{0\}}[0-9]", dialerLength + 10), 'g');
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
          observer.next(numbers);
        }
      );
    });
    return observable;
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


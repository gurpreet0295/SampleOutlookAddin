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
      console.log(numbers);
    }
    catch (error) {
      console.log("in office service exception");
      console.log(error);
    }
    return numbers;
  }

  public openNewAppointmentWindow(meetingDate: Date, meetingTopic: string, meetingPassword: string, meetingType: string, meetingStartTime: string, meetingEndTime: string, isRecurring: boolean) {
    //var start = meetingDate;
    //start.setHours
    //var end = new Date();
    //end.setHours(start.getHours() + 1);
    var start = new Date(meetingStartTime).getTime();
    var end = new Date(meetingEndTime).getTime();

    Office.context.mailbox.displayNewAppointmentForm(
      {
        requiredAttendees: ['bob@contoso.com'],
        optionalAttendees: ['sam@contoso.com'],
        start: start,
        end: end,
        location: 'Home',
        resources: ['projector@contoso.com'],
        subject: meetingTopic,
        body: meetingPassword + " " + isRecurring
      });
    
  }
}

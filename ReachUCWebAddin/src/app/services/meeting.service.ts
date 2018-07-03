import { Injectable } from "@angular/core";
import { OutlookService } from "./outlook.service";
import { Common } from "./common.service";
import { SkySwitchAPIService } from "./api.service";
import { String } from 'typescript-string-operations';
import { DatePipe } from '@angular/common';
import { Element } from "@angular/compiler";

declare var jquery: any;
declare var $: any;

@Injectable()
export class MeetingService {
  
  meetingType: number;
  meetingDate: Date;
  meetingTopic: string;
  meetingPassword: string;
  meetingStartTime: any;
  meetingEndTime: any;
  isRecurring: boolean;

  meetingId: string;
  invitheURL: string;
  showMeetingDetails: boolean = true;
  meetingText: string;
  meetingInviteURL: string;
  conferenceNumber: string;
  startDate: Date;
  endDate: Date;

  constructor(private outlookService: OutlookService, private commonService: Common, private apiService: SkySwitchAPIService, private dateformat: DatePipe) {
  }

  public sheduleMeeting() {
    var longDateFormat = "yyyy/MM/dd HH:mm";
    this.startDate = new Date(this.meetingDate);
    this.startDate.setHours(this.meetingStartTime.hour);
    this.startDate.setMinutes(this.meetingStartTime.minute);
    var startTimeFormat = this.dateformat.transform(this.meetingDate, longDateFormat);
    
    this.endDate = new Date(this.meetingDate);
    this.endDate.setHours(this.meetingEndTime.hour);
    this.endDate.setMinutes(this.meetingEndTime.minute);
    var endTimeFormat = this.dateformat.transform(this.meetingDate, longDateFormat);
   
    this.commonService.changeLoaderStatus(true);
    this.apiService.getMeetingId(startTimeFormat, endTimeFormat, this)
      .map(response => response.text())
      .subscribe(
      (response) => {
        let $xmlResponse = $($.parseXML(response));
        if ($xmlResponse.find("__Status__").length && $xmlResponse.find("__Status__").text() == "SUCCEED") {
          this.meetingId = $xmlResponse.find("__MeetingID__").text();
          this.apiService.sheduleMeeting()
            .map(response => response.text())
            .subscribe(
            (response) => {
              try {
                this.commonService.changeLoaderStatus(false);
                $xmlResponse = $($.parseXML(response));
                if ($xmlResponse.find("__Return__").length && $xmlResponse.find("__Return__").find("__Status__").text() == "SUCCEED") {
                  var inviteURL = $xmlResponse.find("__MeetingInviteURL__").text();
                  this.conferenceNumber = $xmlResponse.find("__ConferenceNumber__").text();
                  this.meetingInviteURL = "https://" + inviteURL + "/" + "join?id=" + this.meetingId;
                  if (String.IsNullOrWhiteSpace(this.meetingPassword)) {
                    this.meetingPassword = "No password needed.";
                  }
                  if (inviteURL && this.conferenceNumber && this.meetingInviteURL) {
                    this.meetingText = String.Format(this.commonService.meetingText, this.meetingInviteURL, this.conferenceNumber, this.startDate.toString(), this.meetingId, this.meetingPassword);
                    this.showMeetingDetails = false;
                  }
                  else {
                    this.commonService.changeLoaderStatus(false);
                    this.showMeetingDetails = true;
                  }
                }
              }
              catch (error) {
                this.commonService.changeLoaderStatus(false);
                console.log(error);
              }
            },
            (error) => {
              console.log(error);
              this.commonService.changeLoaderStatus(false);
              this.showMeetingDetails = true;
            }
            );
        }
        else {
          this.commonService.changeLoaderStatus(false);
          console.log("Something went wrong!!");
        }
      },
      (error) => {
        this.commonService.changeLoaderStatus(false);
        console.log(error);
      }
      );
  }

  openNewAppointmentWindow() {
    this.outlookService.openNewAppointmentWindow(this.meetingTopic, this.startDate, this.endDate, this.isRecurring, this.meetingText);
  }
}

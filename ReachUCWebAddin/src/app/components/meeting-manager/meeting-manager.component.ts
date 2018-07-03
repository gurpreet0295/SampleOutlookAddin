import { Component, OnInit } from '@angular/core';
import { OutlookService } from '../../services/outlook.service';
import { MeetingService } from '../../services/meeting.service';
import { String } from 'typescript-string-operations';
import { Router } from '@angular/router';

declare var $: any;
const now = new Date();

@Component({
  selector: 'app-meeting-manager',
  templateUrl: './meeting-manager.component.html',
  styleUrls: ['./meeting-manager.component.css']
})
export class MeetingManagerComponent implements OnInit {

  small: string = "small";
  hourStep = 1;
  minuteStep = 30;
  meridian = true;
  startTime: any;
  endTime: any;
  meetingDate: any;
  meetingTopic: string;
  meetingPassword: string;
  meetingType: number;
  isRecurring: boolean;
  showMeetingDetails: boolean = true;

  constructor(private outlookService: OutlookService, public meetingService: MeetingService, private router: Router) {
    this.meetingTopic = "";
    this.meetingPassword = "";
    this.meetingType = 0;
    this.isRecurring = false;
    this.meetingDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
    this.startTime = { hour: now.getHours() + 1, minute: 0o0 };
    this.endTime = { hour: now.getHours() + 2, minute: 0o0 };
  }

  ngOnInit() {
    this.meetingService.showMeetingDetails = true;
  }

  sheduleMeeting() {
      this.setMeetingDetails();
      this.meetingService.sheduleMeeting();
  }

  formatDate() {
    return new Date(this.meetingDate.year, this.meetingDate.month - 1, this.meetingDate.day);
  }

  setMeetingDetails() {
    this.meetingService.meetingTopic = this.meetingTopic;
    this.meetingService.meetingPassword = this.meetingPassword;
    this.meetingService.meetingDate = this.formatDate();
    this.meetingService.meetingType = this.meetingType;
    this.meetingService.meetingStartTime = this.startTime;
    this.meetingService.meetingEndTime = this.endTime;
    this.meetingService.isRecurring = this.isRecurring;
  }

  sendInvite() {
    try {
      this.meetingService.openNewAppointmentWindow();
    }
    catch (e) {
      console.log(e);
    }
  }
}

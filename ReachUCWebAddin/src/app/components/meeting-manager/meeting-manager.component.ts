import { Component, OnInit } from '@angular/core';
import { OutlookService } from '../../services/outlook.service';

declare var $: any;

@Component({
  selector: 'app-meeting-manager',
  templateUrl: './meeting-manager.component.html',
  styleUrls: ['./meeting-manager.component.css']
})
export class MeetingManagerComponent implements OnInit {

  meetingType: string;
  meetingDate: Date;
  meetingTopic: string;
  meetingPassword: string;
  meetingStartTime: string;
  meetingEndTime: string;
  isRecurring: boolean;
  constructor(
    private outlookService: OutlookService
  ) { }

  ngOnInit() {
  }

  onChange() {
    this.meetingType = $(".country option:selected").val();
  }

  openMeetingManager() {
    //this.route.navigateByUrl('meeting');
    try {
      this.outlookService.openNewAppointmentWindow(this.meetingDate, this.meetingTopic, this.meetingPassword, this.meetingType, this.meetingStartTime, this.meetingEndTime, this.isRecurring);
    }
    catch (e) {
      console.log(e);
    }
  }
}

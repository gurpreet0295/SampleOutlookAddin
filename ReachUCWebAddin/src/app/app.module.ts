import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router'

import { AppComponent } from './app.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { LoginService } from './services/login.service';
import { SkySwitchAPIService } from './services/api.service';
import { HomePageComponent } from './components/home-page/home-page.component';
import { APP_BASE_HREF, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { OutlookService } from './services/outlook.service';
import { DialerPadComponent } from './components/dialer-pad/dialer-pad.component';
import { Common } from './services/common.service';
import { CommunicationService } from './services/communication.service';
import { MeetingManagerComponent } from './components/meeting-manager/meeting-manager.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MeetingService } from './services/meeting.service';
import { HomeService } from './services/home.service';
import { DataService } from './services/data-sharing.service';
import { LoggerService } from './services/logger.service';
import { OutlookAuthService } from './services/outlook-auth.service';
import { ContactModalComponent } from './modules/outlook-contacts/contact-modal/contact-modal.component';

const appRoutes: Routes = [
  { path: 'login', component: LoginFormComponent },
  { path: 'home', component: HomePageComponent },
  { path: 'dialer', component: DialerPadComponent },
    { path: 'meeting', component: MeetingManagerComponent },
    { path: 'contacts', loadChildren: 'app/modules/outlook-contacts/outlook-contacts.module#OutlookContactsModule' }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    HomePageComponent,
    DialerPadComponent,
      MeetingManagerComponent,
      ContactModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgbModule.forRoot(),
      RouterModule.forRoot(appRoutes, {onSameUrlNavigation:'ignore'})
  ],
    providers: [LoginService, SkySwitchAPIService, OutlookService, CommunicationService, Common, MeetingService, HomeService, DataService, LoggerService, OutlookAuthService, { provide: LocationStrategy, useClass: HashLocationStrategy }],
    entryComponents:[ContactModalComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }

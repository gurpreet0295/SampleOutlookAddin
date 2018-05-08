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
import { DialerService } from './services/dialer.service';
import { MeetingManagerComponent } from './components/meeting-manager/meeting-manager.component';

const appRoutes: Routes = [
  { path: 'login', component: LoginFormComponent },
  { path: 'home', component: HomePageComponent },
  { path: 'dialer', component: DialerPadComponent },
  { path: 'meeting', component: MeetingManagerComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    HomePageComponent,
    DialerPadComponent,
    MeetingManagerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [LoginService, SkySwitchAPIService, OutlookService, DialerService, Common, { provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }

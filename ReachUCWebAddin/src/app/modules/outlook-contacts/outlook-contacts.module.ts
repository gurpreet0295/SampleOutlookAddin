import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactListComponent } from './contact-list/contact-list.component';
import { RouterModule, Routes } from '@angular/router';
import { ContactListService } from './contact-list.service';
import { OutlookAuthService } from '../../services/outlook-auth.service';
import { ContactModalComponent } from './contact-modal/contact-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const appRoutes: Routes = [
    { path: '', component: ContactListComponent },
    { path: ':err', component: ContactListComponent }
];

@NgModule({
    imports: [
        CommonModule,
        NgbModule.forRoot(),
        RouterModule.forChild(appRoutes)
    ],
    declarations: [ContactListComponent],
    providers: [ContactListService, OutlookAuthService]
})
export class OutlookContactsModule { }

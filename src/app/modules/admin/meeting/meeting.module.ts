import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BsDatepickerModule, BsDropdownModule, DatepickerModule, ModalModule, TabsModule, TooltipModule} from 'ngx-bootstrap';
import {ExportAsModule} from 'ngx-export-as';
import {NgxEditorModule} from 'ngx-editor';
import {NgSelectModule} from '@ng-select/ng-select';
import {NgxPermissionsModule} from 'ngx-permissions';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {OwlDateTimeModule, OwlNativeDateTimeModule} from 'ng-pick-datetime';
import {DataTablesModule} from 'angular-datatables';

import {SharedModule} from '../../../shared/shared.module';
import {MeetingRoutingModule} from './meeting-routing.module';

import {MeetingComponent} from './pages/meeting/meeting.component';
import {CreateMeetingModalComponent} from './components/create-meeting-modal/create-meeting-modal.component';
import {EditMeetingModalComponent} from './components/edit-meeting-modal/edit-meeting-modal.component';
import {TimesheetModule} from '../../timesheet/timesheet.module';
import {MeetingDetailComponent} from './pages/meeting-detail/meeting-detail.component';
import {MeetingDetailsComponent} from './components/meeting-details/meeting-details.component';

@NgModule({
    declarations: [
        MeetingComponent,
        CreateMeetingModalComponent,
        EditMeetingModalComponent,
        MeetingDetailComponent,
        MeetingDetailsComponent
    ],
    imports: [
        CommonModule,
        MeetingRoutingModule,
        NgSelectModule,
        FormsModule,
        ReactiveFormsModule,
        NgxPermissionsModule,
        DataTablesModule,
        ExportAsModule,
        NgxEditorModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        ModalModule.forRoot(),
        TooltipModule.forRoot(),
        DatepickerModule.forRoot(),
        BsDatepickerModule.forRoot(),
        BsDropdownModule.forRoot(),
        TabsModule.forRoot(),
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (HttpLoaderFactory),
                deps: [HttpClient]
            }
        }),
        SharedModule,
        TimesheetModule
    ],
    entryComponents: [
        CreateMeetingModalComponent,
        EditMeetingModalComponent
    ]
})

export class MeetingModule {
}

// Required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

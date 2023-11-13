import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {OwlDateTimeModule, OwlNativeDateTimeModule} from 'ng-pick-datetime';
import {BsDatepickerModule, BsDropdownModule, ModalModule, TooltipModule} from 'ngx-bootstrap';
import {NgxPermissionsModule} from 'ngx-permissions';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {DataTablesModule} from 'angular-datatables';
import {ExportAsModule} from 'ngx-export-as';
import {NgSelectModule} from '@ng-select/ng-select';

import {SharedModule} from '../../shared/shared.module';
import {TimesheetRoutingModule} from './timesheet-routing.module';

import {TimesheetComponent} from './pages/timesheet/timesheet.component';
import {TimesheetListComponent} from './components/timesheet-list/timesheet-list.component';
import {CreateTimesheetModalComponent} from './components/create-timesheet-modal/create-timesheet-modal.component';
import {EditTimesheetModalComponent} from './components/edit-timesheet-modal/edit-timesheet-modal.component';
import {MyTimesheetComponent} from './pages/my-timesheet/my-timesheet.component';

@NgModule({
    declarations: [
        TimesheetComponent,
        TimesheetListComponent,
        CreateTimesheetModalComponent,
        EditTimesheetModalComponent,
        MyTimesheetComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        BsDropdownModule,
        ReactiveFormsModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        NgxPermissionsModule,
        TimesheetRoutingModule,
        DataTablesModule,
        ExportAsModule,
        NgSelectModule,
        ModalModule.forRoot(),
        TooltipModule.forRoot(),
        BsDatepickerModule.forRoot(),
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (HttpLoaderFactory),
                deps: [HttpClient]
            }
        }),
        SharedModule
    ],
    exports: [
        TimesheetListComponent
    ],
    entryComponents: [
        CreateTimesheetModalComponent,
        EditTimesheetModalComponent
    ]
})

export class TimesheetModule {
}

// Required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

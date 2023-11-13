import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {BsDatepickerModule, BsDropdownModule, DatepickerModule, ModalModule, TooltipModule} from 'ngx-bootstrap';
import {ExportAsModule} from 'ngx-export-as';
import {NgxEditorModule} from 'ngx-editor';
import {NgxPermissionsModule} from 'ngx-permissions';
import {NgSelectModule} from '@ng-select/ng-select';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {DataTablesModule} from 'angular-datatables';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {DragAndDropModule} from 'angular-draggable-droppable';
import {ResizableModule} from 'angular-resizable-element';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';

import {LeavesRoutingModule} from './leaves-routing.module';
import {SharedModule} from '../../../shared/shared.module';
import {LeaveTypesModule} from '../leave-types/leave-types.module';

import {LeavesListComponent} from './pages/leaves-list/leaves-list.component';
import {CreateLeaveComponent} from './components/create-leave/create-leave.component';
import {EditLeaveComponent} from './components/edit-leave/edit-leave.component';
import {CalendarViewComponent} from './pages/calendar-view/calendar-view.component';
import {ListViewComponent} from './pages/list-view/list-view.component';
import {LeavesReportComponent} from './pages/leaves-report/leaves-report.component';
import {LeaveTypeModalComponent} from './components/leave-type-modal/leave-type-modal.component';
import {LeaveDetailComponent} from './components/leave-detail/leave-detail.component';

@NgModule({
    declarations: [
        LeavesListComponent,
        CreateLeaveComponent,
        EditLeaveComponent,
        CalendarViewComponent,
        ListViewComponent,
        LeavesReportComponent,
        LeaveTypeModalComponent,
        LeaveDetailComponent
    ],
    imports: [
        CommonModule,
        LeavesRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        NgxPermissionsModule,
        DataTablesModule,
        ExportAsModule,
        NgxEditorModule,
        NgSelectModule,
        ModalModule.forRoot(),
        TooltipModule.forRoot(),
        BsDropdownModule.forRoot(),
        DatepickerModule.forRoot(),
        BsDatepickerModule.forRoot(),
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (HttpLoaderFactory),
                deps: [HttpClient]
            }
        }),
        DragAndDropModule,
        ResizableModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory
        }),
        SharedModule,
        LeaveTypesModule
    ],
    entryComponents: [
        CreateLeaveComponent,
        EditLeaveComponent,
        LeaveTypeModalComponent,
        LeaveDetailComponent
    ],
    providers: []
})

export class LeavesModule {
}

// Required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

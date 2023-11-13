import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
    AccordionModule,
    BsDatepickerModule,
    BsDropdownModule,
    DatepickerModule,
    ModalModule,
    TabsModule,
    TooltipModule
} from 'ngx-bootstrap';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {OwlDateTimeModule, OwlNativeDateTimeModule} from 'ng-pick-datetime';
import {ExportAsModule} from 'ngx-export-as';
import {NgSelectModule} from '@ng-select/ng-select';
import {Ng5SliderModule} from 'ng5-slider';
import {NgxEditorModule} from 'ngx-editor';
import {ProgressbarModule} from 'ngx-bootstrap/progressbar';
import {NgxPermissionsModule} from 'ngx-permissions';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {DataTablesModule} from 'angular-datatables';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {DragAndDropModule} from 'angular-draggable-droppable';
import {ResizableModule} from 'angular-resizable-element';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';

import {ProjectsRoutingModule} from './projects-routing.module';
import {SharedModule} from '../../../shared/shared.module';
import {TodoModule} from '../../admin/todo/todo.module';

import {ProjectListComponent} from './pages/project-list/project-list.component';
import {ProjectCreateComponent} from './pages/project-create/project-create.component';
import {ProjectEditComponent} from './pages/project-edit/project-edit.component';
import {ProjectDetailComponent} from './pages/project-detail/project-detail.component';
import {ProjectCalendarComponent} from './components/project-calendar/project-calendar.component';
import {ProjectCommentsComponent} from './components/project-comments/project-comments.component';
import {ProjectAttachmentsComponent} from './components/project-attachments/project-attachments.component';
import {ProjectTasksComponent} from './components/project-tasks/project-tasks.component';
import {ProjectDefectsComponent} from './components/project-defects/project-defects.component';
import {ProjectActivitiesComponent} from './components/project-activities/project-activities.component';
import {ProjectsIncidentsComponent} from './components/projects-incidents/projects-incidents.component';
import {ProjectDetailsComponent} from './components/project-details/project-details.component';
import {CreateAttachmentModalComponent} from './components/create-attachment-modal/create-attachment-modal.component';
import {ProjectImportComponent} from './components/project-import/project-import.component';
import {ProjectTimesheetComponent} from './components/project-timesheet/project-timesheet.component';
import {ProjectTimesheetEditModalComponent} from './components/project-timesheet-edit-modal/project-timesheet-edit-modal.component';

@NgModule({
    declarations: [
        ProjectListComponent,
        ProjectCreateComponent,
        ProjectEditComponent,
        ProjectDetailComponent,
        ProjectCalendarComponent,
        ProjectCommentsComponent,
        ProjectAttachmentsComponent,
        ProjectTasksComponent,
        ProjectDefectsComponent,
        ProjectActivitiesComponent,
        ProjectsIncidentsComponent,
        ProjectDetailsComponent,
        CreateAttachmentModalComponent,
        ProjectImportComponent,
        ProjectTimesheetComponent,
        ProjectTimesheetEditModalComponent
    ],
    imports: [
        CommonModule,
        ProjectsRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        NgSelectModule,
        BsDropdownModule,
        DataTablesModule,
        ExportAsModule,
        Ng5SliderModule,
        NgxEditorModule,
        NgxPermissionsModule,
        DragAndDropModule,
        ResizableModule,
        PerfectScrollbarModule,
        TooltipModule.forRoot(),
        DatepickerModule.forRoot(),
        BsDatepickerModule.forRoot(),
        ModalModule.forRoot(),
        ProgressbarModule.forRoot(),
        TabsModule.forRoot(),
        AccordionModule.forRoot(),
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory
        }),
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (HttpLoaderFactory),
                deps: [HttpClient]
            }
        }),
        TodoModule,
        SharedModule
    ],
    entryComponents: [CreateAttachmentModalComponent, ProjectImportComponent, ProjectTimesheetEditModalComponent]
})

export class ProjectsModule {
}

// Required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
	AccordionModule,
	BsDatepickerModule,
	BsDropdownModule,
	ButtonsModule,
	DatepickerModule,
	ModalModule,
	TabsModule,
	TooltipModule
} from 'ngx-bootstrap';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {ExportAsModule} from 'ngx-export-as';
import {NgSelectModule} from '@ng-select/ng-select';
import {NgxEditorModule} from 'ngx-editor';
import {ProgressbarModule} from 'ngx-bootstrap/progressbar';
import {NgxPermissionsModule} from 'ngx-permissions';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {OrderModule} from 'ngx-order-pipe';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {DataTablesModule} from 'angular-datatables';
import {DragAndDropModule} from 'angular-draggable-droppable';
import {ResizableModule} from 'angular-resizable-element';

import {IncidentsRoutingModule} from './incidents-routing.module';
import {SharedModule} from '../../../shared/shared.module';
import {TodoModule} from '../../admin/todo/todo.module';

import {IncidentListComponent} from './pages/incident-list/incident-list.component';
import {IncidentDetailComponent} from './pages/incident-detail/incident-detail.component';
import {IncidentCreateComponent} from './pages/incident-create/incident-create.component';
import {IncidentEditComponent} from './pages/incident-edit/incident-edit.component';
import {IncidentDetailsComponent} from './components/incident-details/incident-details.component';
import {IncidentCommentsComponent} from './components/incident-comments/incident-comments.component';
import {IncidentAttachmentComponent} from './components/incident-attachment/incident-attachment.component';
import {CreateAttachmentModalComponent} from './components/create-attachment-modal/create-attachment-modal.component';
import {IncidentNotesComponent} from './components/incident-notes/incident-notes.component';
import {IncidentActivitiesComponent} from './components/incident-activities/incident-activities.component';
import {IncidentHistoryComponent} from './components/incident-history/incident-history.component';
import {TimesheetModule} from '../../timesheet/timesheet.module';
import {IncidentKanbanComponent} from './pages/incident-kanban/incident-kanban.component';

@NgModule({
    declarations: [
        IncidentListComponent,
        IncidentDetailComponent,
        IncidentCreateComponent,
        IncidentEditComponent,
        IncidentDetailsComponent,
        IncidentCommentsComponent,
        IncidentAttachmentComponent,
        CreateAttachmentModalComponent,
        IncidentNotesComponent,
        IncidentActivitiesComponent,
        IncidentHistoryComponent,
        IncidentKanbanComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        IncidentsRoutingModule,
        ReactiveFormsModule,
        NgSelectModule,
        DataTablesModule,
        ExportAsModule,
        BsDropdownModule,
        NgxEditorModule,
        NgxPermissionsModule,
        DragAndDropModule,
        ResizableModule,
        DragDropModule,
        OrderModule,
        ButtonsModule,
        PerfectScrollbarModule,
        TooltipModule.forRoot(),
        DatepickerModule.forRoot(),
        BsDatepickerModule.forRoot(),
        ModalModule.forRoot(),
        ProgressbarModule.forRoot(),
        TabsModule.forRoot(),
        AccordionModule.forRoot(),
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (HttpLoaderFactory),
                deps: [HttpClient]
            }
        }),
        TodoModule,
        TimesheetModule,
        SharedModule
    ],
    entryComponents: [CreateAttachmentModalComponent]
})

export class IncidentsModule {
}

// Required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

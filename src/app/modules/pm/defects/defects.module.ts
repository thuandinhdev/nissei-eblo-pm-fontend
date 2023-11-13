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
import {OrderModule} from 'ngx-order-pipe';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {DataTablesModule} from 'angular-datatables';
import {DragAndDropModule} from 'angular-draggable-droppable';
import {ResizableModule} from 'angular-resizable-element';

import {DefectsRoutingModule} from './defects-routing.module';
import {SharedModule} from '../../../shared/shared.module';
import {TodoModule} from '../../admin/todo/todo.module';
import {TimesheetModule} from '../../timesheet/timesheet.module';

import {DefectCreateComponent} from './pages/defect-create/defect-create.component';
import {DefectEditComponent} from './pages/defect-edit/defect-edit.component';
import {DefectListComponent} from './pages/defect-list/defect-list.component';
import {DefectDetailComponent} from './pages/defect-detail/defect-detail.component';
import {DefectDetailsComponent} from './components/defect-details/defect-details.component';
import {DefectCommentsComponent} from './components/defect-comments/defect-comments.component';
import {DefectAttachmentComponent} from './components/defect-attachment/defect-attachment.component';
import {DefectActivitiesComponent} from './components/defect-activities/defect-activities.component';
import {DefectHistoryComponent} from './components/defect-history/defect-history.component';
import {CreateAttachmentModalComponent} from './components/create-attachment-modal/create-attachment-modal.component';
import {DefectKanbanComponent} from './pages/defect-kanban/defect-kanban.component';

@NgModule({
    declarations: [
        DefectCreateComponent,
        DefectEditComponent,
        DefectListComponent,
        DefectDetailComponent,
        DefectDetailsComponent,
        DefectCommentsComponent,
        DefectAttachmentComponent,
        DefectActivitiesComponent,
        DefectHistoryComponent,
        CreateAttachmentModalComponent,
        DefectKanbanComponent
    ],
    imports: [
        CommonModule,
        DefectsRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        BsDropdownModule,
        DataTablesModule,
        ExportAsModule,
        BsDropdownModule,
        NgxEditorModule,
        DragAndDropModule,
        ResizableModule,
        DragDropModule,
        OrderModule,
        PerfectScrollbarModule,
        ButtonsModule.forRoot(),
        ProgressbarModule.forRoot(),
        NgxPermissionsModule,
        TooltipModule.forRoot(),
        DatepickerModule.forRoot(),
        BsDatepickerModule.forRoot(),
        ModalModule.forRoot(),
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

export class DefectsModule {
}

// Required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

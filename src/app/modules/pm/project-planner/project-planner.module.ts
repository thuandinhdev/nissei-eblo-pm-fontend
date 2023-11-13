import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BsDatepickerModule, BsDropdownModule, DatepickerModule, ModalModule, TooltipModule} from 'ngx-bootstrap';
import {DataTablesModule} from 'angular-datatables';
import {ExportAsModule} from 'ngx-export-as';
import {NgSelectModule} from '@ng-select/ng-select';
import {Ng5SliderModule} from 'ng5-slider';
import {NgxEditorModule} from 'ngx-editor';
import {ProgressbarModule} from 'ngx-bootstrap/progressbar';
import {NgxPermissionsModule} from 'ngx-permissions';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import {SharedModule} from '../../../shared/shared.module';
import {ProjectPlannerRoutingModule} from './project-planner-routing.module';

import {CreateProjectModalComponent} from './components/create-project-modal/create-project-modal.component';
import {EditProjectModalComponent} from './components/edit-project-modal/edit-project-modal.component';
import {CreateSprintModalComponent} from './components/create-sprint-modal/create-sprint-modal.component';
import {ProjectPlannerListComponent} from './pages/project-planner-list/project-planner-list.component';
import {CreateTaskModalComponent} from './components/create-task-modal/create-task-modal.component';
import {EditSprintModalComponent} from './components/edit-sprint-modal/edit-sprint-modal.component';
import {EditTaskModalComponent} from './components/edit-task-modal/edit-task-modal.component';
import {MoveTaskModalComponent} from './components/move-task-modal/move-task-modal.component';
import {ProjectPlannerDetailComponent} from './pages/project-planner-detail/project-planner-detail.component';
import {CreateSprintTaskModalComponent} from './components/create-sprint-task-modal/create-sprint-task-modal.component';
import {EditSprintTaskModalComponent} from './components/edit-sprint-task-modal/edit-sprint-task-modal.component';

@NgModule({
    declarations: [
        CreateProjectModalComponent,
        EditProjectModalComponent,
        CreateSprintModalComponent,
        ProjectPlannerListComponent,
        CreateTaskModalComponent,
        EditSprintModalComponent,
        EditTaskModalComponent,
        MoveTaskModalComponent,
        ProjectPlannerDetailComponent,
        CreateSprintTaskModalComponent,
        EditSprintTaskModalComponent
    ],
    imports: [
        CommonModule,
        ProjectPlannerRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        BsDropdownModule,
        DataTablesModule,
        ExportAsModule,
        Ng5SliderModule,
        NgxEditorModule,
        NgxPermissionsModule,
        TooltipModule.forRoot(),
        DatepickerModule.forRoot(),
        BsDatepickerModule.forRoot(),
        ModalModule.forRoot(),
        ProgressbarModule.forRoot(),
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (HttpLoaderFactory),
                deps: [HttpClient]
            }
        }),
        SharedModule
    ],
    entryComponents: [
        CreateProjectModalComponent,
        EditProjectModalComponent,
        CreateSprintModalComponent,
        CreateSprintTaskModalComponent,
        EditSprintTaskModalComponent,
        CreateTaskModalComponent,
        EditSprintModalComponent,
        EditTaskModalComponent,
        MoveTaskModalComponent
    ]
})

export class ProjectPlannerModule {
}

// Required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

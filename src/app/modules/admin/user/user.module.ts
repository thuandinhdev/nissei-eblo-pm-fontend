import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {BsDatepickerModule, BsDropdownModule, DatepickerModule, ModalModule, TabsModule, TooltipModule} from 'ngx-bootstrap';
import {ExportAsModule} from 'ngx-export-as';
import {NgSelectModule} from '@ng-select/ng-select';
import {UiSwitchModule} from 'ngx-ui-switch';
import {NgxPermissionsModule} from 'ngx-permissions';
import {ProgressbarModule} from 'ngx-bootstrap/progressbar';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {ChecklistModule} from 'angular-checklist';
import {DataTablesModule} from 'angular-datatables';

import {UserRoutingModule} from './user-routing.module';
import {SharedModule} from '../../../shared/shared.module';

import {UserComponent} from './pages/user/user.component';
import {UserCreateComponent} from './pages/user-create/user-create.component';
import {UserEditComponent} from './pages/user-edit/user-edit.component';
import {UserDetailComponent} from './pages/user-detail/user-detail.component';
import {AssignUserComponent} from './components/assign-user/assign-user.component';
import {UserActivitiesComponent} from './components/user-activities/user-activities.component';
import {UserAvatarModalComponent} from './components/user-avatar-modal/user-avatar-modal.component';
import {ChangeEmailModalComponent} from './components/change-email-modal/change-email-modal.component';
import {ChangePasswordModalComponent} from './components/change-password-modal/change-password-modal.component';
import {UserDetailUpdateComponent} from './components/user-detail-update/user-detail-update.component';
import {UserDefectsComponent} from './components/user-defects/user-defects.component';
import {UserProjectsComponent} from './components/user-projects/user-projects.component';
import {UserTasksComponent} from './components/user-tasks/user-tasks.component';
import {ImportUserComponent} from './components/import-user/import-user.component';
import {UserIncidentsComponent} from './components/user-incidents/user-incidents.component';



@NgModule({
    declarations: [
        UserComponent,
        UserCreateComponent,
        UserEditComponent,
        UserDetailComponent,
        AssignUserComponent,
        UserActivitiesComponent,
        UserAvatarModalComponent,
        ChangeEmailModalComponent,
        ChangePasswordModalComponent,
        UserDetailUpdateComponent,
        UserDefectsComponent,
        UserProjectsComponent,
        UserTasksComponent,
        ImportUserComponent,
        UserIncidentsComponent,
    ],
    imports: [
        CommonModule,
        NgSelectModule,
        ChecklistModule,
        UserRoutingModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgxPermissionsModule,
        DataTablesModule,
        ExportAsModule,
        ModalModule.forRoot(),
        TooltipModule.forRoot(),
        DatepickerModule.forRoot(),
        BsDatepickerModule.forRoot(),
        BsDropdownModule.forRoot(),
        TabsModule.forRoot(),
        ProgressbarModule.forRoot(),
        UiSwitchModule.forRoot({
            checkedLabel: 'Active',
            uncheckedLabel: 'Inactive',
            color: 'rgb(0, 189, 99)',
            switchColor: '#FFFFFF',
            defaultBgColor: '#c6c6c6',
            defaultBoColor: '#c39ef8'
        }),
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
        AssignUserComponent,
        UserAvatarModalComponent,
        ChangeEmailModalComponent,
        ChangePasswordModalComponent,
        UserProjectsComponent,
        ImportUserComponent
    ],
})

export class UserModule {
}

// Required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

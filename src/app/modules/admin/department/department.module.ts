import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {BsDropdownModule, ModalModule, TooltipModule} from 'ngx-bootstrap';
import {LSelect2Module} from 'ngx-select2';
import {NgxPermissionsModule} from 'ngx-permissions';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {DataTablesModule} from 'angular-datatables';
import {ChecklistModule} from 'angular-checklist';

import {SharedModule} from '../../../shared/shared.module';
import {DepartmentRoutingModule} from './department-routing.module';

import {DepartmentComponent} from './pages/department/department.component';
import {CreateDepartmentModalComponent} from './components/create-department-modal/create-department-modal.component';
import {EditDepartmentModalComponent} from './components/edit-department-modal/edit-department-modal.component';
import {DepartmentDetailComponent} from './pages/department-detail/department-detail.component';

@NgModule({
    declarations: [
        DepartmentComponent,
        CreateDepartmentModalComponent,
        EditDepartmentModalComponent,
        DepartmentDetailComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DepartmentRoutingModule,
        DataTablesModule,
        ChecklistModule,
        LSelect2Module,
        NgxPermissionsModule,
        ModalModule.forRoot(),
        TooltipModule.forRoot(),
        BsDropdownModule.forRoot(),
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
        CreateDepartmentModalComponent,
        EditDepartmentModalComponent,
    ]
})

export class DepartmentModule {
}

// Required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

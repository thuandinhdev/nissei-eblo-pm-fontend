import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {BsDatepickerModule, BsDropdownModule, DatepickerModule, ModalModule, TooltipModule} from 'ngx-bootstrap';
import {DataTablesModule} from 'angular-datatables';
import {ExportAsModule} from 'ngx-export-as';
import {NgxEditorModule} from 'ngx-editor';
import {NgSelectModule} from '@ng-select/ng-select';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {NgxPermissionsModule} from 'ngx-permissions';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import {TaxesRoutingModule} from './taxes-routing.module';
import {SharedModule} from '../../../shared/shared.module';

import {TaxesListComponent} from './pages/taxes-list/taxes-list.component';
import {CreateTaxComponent} from './components/create-tax/create-tax.component';
import {EditTaxComponent} from './components/edit-tax/edit-tax.component';

@NgModule({
    declarations: [
        TaxesListComponent,
        CreateTaxComponent,
        EditTaxComponent
    ],
    imports: [
        CommonModule,
        TaxesRoutingModule,
        CommonModule,
        DataTablesModule,
        ExportAsModule,
        NgSelectModule,
        FormsModule,
        ReactiveFormsModule,
        NgxEditorModule,
        NgxPermissionsModule,
        ModalModule.forRoot(),
        TooltipModule.forRoot(),
        DatepickerModule.forRoot(),
        BsDatepickerModule.forRoot(),
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
        CreateTaxComponent,
        EditTaxComponent
    ]
})

export class TaxesModule {
}

// Required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

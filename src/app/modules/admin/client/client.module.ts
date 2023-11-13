import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {NgSelectModule} from '@ng-select/ng-select';
import {BsDatepickerModule, BsDropdownModule, DatepickerModule, TabsModule, TooltipModule} from 'ngx-bootstrap';
import {ExportAsModule} from 'ngx-export-as';
import {UiSwitchModule} from 'ngx-ui-switch';
import {NgxPermissionsModule} from 'ngx-permissions';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {DataTablesModule} from 'angular-datatables';

import {ClientRoutingModule} from './client-routing.module';
import {SharedModule} from '../../../shared/shared.module';

import {ClientComponent} from './pages/client/client.component';
import {ClientCreateComponent} from './pages/client-create/client-create.component';
import {ClientEditComponent} from './pages/client-edit/client-edit.component';
import {ClientDetailComponent} from './pages/client-detail/client-detail.component';

@NgModule({
    declarations: [
        ClientComponent,
        ClientCreateComponent,
        ClientEditComponent,
        ClientDetailComponent
    ],
    imports: [
        CommonModule,
        CommonModule,
        NgSelectModule,
        ClientRoutingModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DataTablesModule,
        ExportAsModule,
        NgxPermissionsModule,
        TooltipModule.forRoot(),
        DatepickerModule.forRoot(),
        BsDatepickerModule.forRoot(),
        BsDropdownModule.forRoot(),
        TabsModule.forRoot(),
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
        SharedModule,
    ]
})

export class ClientModule {
}

// Required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {BsDropdownModule, ModalModule, TooltipModule} from 'ngx-bootstrap';
import {ExportAsModule} from 'ngx-export-as';
import {NgxEditorModule} from 'ngx-editor';
import {NgxPermissionsModule} from 'ngx-permissions';
import {ColorPickerModule} from 'ngx-color-picker';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {DataTablesModule} from 'angular-datatables';

import {ProvidersRoutingModule} from './providers-routing.module';
import {SharedModule} from '../../../shared/shared.module';

import {ProvidersListComponent} from './pages/providers-list/providers-list.component';
import {CreateProviderComponent} from './components/create-provider/create-provider.component';
import {EditProviderComponent} from './components/edit-provider/edit-provider.component';

@NgModule({
    declarations: [
        ProvidersListComponent,
        CreateProviderComponent,
        EditProviderComponent
    ],
    imports: [
        CommonModule,
        ProvidersRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        NgxPermissionsModule,
        DataTablesModule,
        ExportAsModule,
        NgxEditorModule,
        ColorPickerModule,
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
        CreateProviderComponent,
        EditProviderComponent
    ],
    providers: []
})

export class ProvidersModule {
}

// Required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

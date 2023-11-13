import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {BsDropdownModule, TooltipModule} from 'ngx-bootstrap';
import {ColorPickerModule} from 'ngx-color-picker';
import {NgxPermissionsModule} from 'ngx-permissions';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import {LeaveTypesRoutingModule} from './leave-types-routing.module';
import {SharedModule} from '../../../shared/shared.module';

import {LeaveTypesListComponent} from './pages/leave-types-list/leave-types-list.component';

@NgModule({
    declarations: [LeaveTypesListComponent],
    imports: [
        CommonModule,
        LeaveTypesRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        NgxPermissionsModule,
        ColorPickerModule,
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
    exports: [
        LeaveTypesListComponent
    ]
})

export class LeaveTypesModule {
}

// Required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

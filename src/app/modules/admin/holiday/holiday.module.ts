import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BsDatepickerModule, BsDropdownModule, DatepickerModule, ModalModule, TabsModule, TooltipModule} from 'ngx-bootstrap';
import {ExportAsModule} from 'ngx-export-as';
import {NgxEditorModule} from 'ngx-editor';
import {ColorPickerModule} from 'ngx-color-picker';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {NgxPermissionsModule} from 'ngx-permissions';
import {DataTablesModule} from 'angular-datatables';

import {HolidayRoutingModule} from './holiday-routing.module';
import {SharedModule} from '../../../shared/shared.module';

import {HolidayComponent} from './pages/holiday/holiday.component';
import {CreateHolidayModalComponent} from './components/create-holiday-modal/create-holiday-modal.component';
import {EditHolidayModalComponent} from './components/edit-holiday-modal/edit-holiday-modal.component';

@NgModule({
    declarations: [
        CreateHolidayModalComponent,
        EditHolidayModalComponent,
        HolidayComponent
    ],
    imports: [
        CommonModule,
        HolidayRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        NgxPermissionsModule,
        DataTablesModule,
        ExportAsModule,
        NgxEditorModule,
        ColorPickerModule,
        ModalModule.forRoot(),
        TooltipModule.forRoot(),
        DatepickerModule.forRoot(),
        BsDatepickerModule.forRoot(),
        TabsModule.forRoot(),
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
    entryComponents: [CreateHolidayModalComponent, EditHolidayModalComponent]
})

export class HolidayModule {
}

// Required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

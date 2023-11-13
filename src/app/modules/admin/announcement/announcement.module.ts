import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BsDatepickerModule, BsDropdownModule, DatepickerModule, TooltipModule} from 'ngx-bootstrap';
import {ExportAsModule} from 'ngx-export-as';
import {NgxEditorModule} from 'ngx-editor';
import {NgxPermissionsModule} from 'ngx-permissions';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {DataTablesModule} from 'angular-datatables';

import {SharedModule} from '../../../shared/shared.module';
import {AnnouncementRoutingModule} from './announcement-routing.module';

import {AnnouncementComponent} from './pages/announcement/announcement.component';
import {AnnouncementCreateComponent} from './pages/announcement-create/announcement-create.component';
import {AnnouncementEditComponent} from './pages/announcement-edit/announcement-edit.component';

@NgModule({
    declarations: [
        AnnouncementComponent,
        AnnouncementCreateComponent,
        AnnouncementEditComponent
    ],
    imports: [
        CommonModule,
        AnnouncementRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        DataTablesModule,
        ExportAsModule,
        NgxEditorModule,
        NgxPermissionsModule,
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
    ]
})

export class AnnouncementModule {
}


// Required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

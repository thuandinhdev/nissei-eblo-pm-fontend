import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {BsDropdownModule, ModalModule, TooltipModule} from 'ngx-bootstrap';
import {ExportAsModule} from 'ngx-export-as';
import {NgxEditorModule} from 'ngx-editor';
import {NgxPermissionsModule} from 'ngx-permissions';
import {NgSelectModule} from '@ng-select/ng-select';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {DataTablesModule} from 'angular-datatables';

import {ItemsRoutingModule} from './items-routing.module';
import {SharedModule} from '../../../shared/shared.module';

import {ItemsListComponent} from './pages/items-list/items-list.component';
import {ItemGroupsComponent} from './components/item-groups/item-groups.component';
import {CreateItemComponent} from './components/create-item/create-item.component';
import {EditItemComponent} from './components/edit-item/edit-item.component';

@NgModule({
    declarations: [
        ItemsListComponent,
        ItemGroupsComponent,
        CreateItemComponent,
        EditItemComponent
    ],
    imports: [
        CommonModule,
        ItemsRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        NgxPermissionsModule,
        DataTablesModule,
        ExportAsModule,
        NgxEditorModule,
        NgSelectModule,
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
        ItemGroupsComponent,
        CreateItemComponent,
        EditItemComponent
    ],
    providers: []
})

export class ItemsModule {
}

// Required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


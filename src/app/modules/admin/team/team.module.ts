import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {BsDropdownModule, ModalModule, TooltipModule} from 'ngx-bootstrap';
import {ExportAsModule} from 'ngx-export-as';
import {NgSelectModule} from '@ng-select/ng-select';
import {NgxEditorModule} from 'ngx-editor';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {NgxPermissionsModule} from 'ngx-permissions';
import {DataTablesModule} from 'angular-datatables';

import {SharedModule} from '../../../shared/shared.module';
import {TeamRoutingModule} from './team-routing.module';

import {TeamComponent} from './pages/team/team.component';
import {TeamCreateModalComponent} from './components/team-create-modal/team-create-modal.component';
import {TeamEditModalComponent} from './components/team-edit-modal/team-edit-modal.component';
import {ImportTeamComponent} from './components/import-team/import-team.component';

@NgModule({
    declarations: [
        TeamComponent,
        TeamCreateModalComponent,
        TeamEditModalComponent,
        ImportTeamComponent
    ],
    imports: [
        CommonModule,
        NgSelectModule,
        FormsModule,
        ReactiveFormsModule,
        TeamRoutingModule,
        DataTablesModule,
        ExportAsModule,
        NgxEditorModule,
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
    entryComponents: [TeamCreateModalComponent, TeamEditModalComponent, ImportTeamComponent],
})

export class TeamModule {
}

// Required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {BsDropdownModule, ModalModule, TabsModule, TimepickerModule, TooltipModule} from 'ngx-bootstrap';
import {UiSwitchModule} from 'ngx-ui-switch';
import {NgxPermissionsModule} from 'ngx-permissions';
import {NgxEditorModule} from 'ngx-editor';
import {ExportAsModule} from 'ngx-export-as';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {ChecklistModule} from 'angular-checklist';
import {DataTablesModule} from 'angular-datatables';

import {SharedModule} from '../../shared/shared.module';
import {SettingsRoutingModule} from './settings-routing.module';

import {SettingsComponent} from './pages/settings/settings.component';
import {CompanyDetailComponent} from './components/company-detail/company-detail.component';
import {EmailSettingsComponent} from './components/email-settings/email-settings.component';
import {EmailTemplatesComponent} from './components/email-templates/email-templates.component';
import {EmailNotificationsComponent} from './components/email-notifications/email-notifications.component';
import {CronjobSettingsComponent} from './components/cronjob-settings/cronjob-settings.component';
import {MenuAllocationComponent} from './components/menu-allocation/menu-allocation.component';
import {ThemeSettingsComponent} from './components/theme-settings/theme-settings.component';
import {DashboardSettingsComponent} from './components/dashboard-settings/dashboard-settings.component';
import {SystemSettingsComponent} from './components/system-settings/system-settings.component';
import {DatabaseBackupComponent} from './components/database-backup/database-backup.component';
import {CustomFieldsComponent} from './components/custom-fields/custom-fields.component';
import {CustomFieldCreateComponent} from './components/custom-field-create/custom-field-create.component';
import {CustomFieldEditComponent} from './components/custom-field-edit/custom-field-edit.component';
import {TranslationsSettingsComponent} from './components/translations-settings/translations-settings.component';
import {CreateTranslationComponent} from './components/translations-settings/components/create-translation/create-translation.component';
import {EditTranslationComponent} from './components/translations-settings/components/edit-translation/edit-translation.component';
import {EstimateSettingsComponent} from './components/estimate-settings/estimate-settings.component';
import {InvoiceSettingsComponent} from './components/invoice-settings/invoice-settings.component';
import {SlackSettingsComponent} from './components/slack-settings/slack-settings.component';
import {PaypalGatewayComponent} from './components/paypal-gateway/paypal-gateway.component';

@NgModule({
    declarations: [
        SettingsComponent,
        CompanyDetailComponent,
        EmailSettingsComponent,
        EmailTemplatesComponent,
        EmailNotificationsComponent,
        CronjobSettingsComponent,
        MenuAllocationComponent,
        ThemeSettingsComponent,
        DashboardSettingsComponent,
        SystemSettingsComponent,
        DatabaseBackupComponent,
        CustomFieldsComponent,
        CustomFieldCreateComponent,
        CustomFieldEditComponent,
        TranslationsSettingsComponent,
        CreateTranslationComponent,
        EditTranslationComponent,
        EstimateSettingsComponent,
        InvoiceSettingsComponent,
        SlackSettingsComponent,
        PaypalGatewayComponent
    ],
    imports: [
        CommonModule,
        SettingsRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        ChecklistModule,
        DataTablesModule,
        NgxPermissionsModule,
        NgxEditorModule,
        ExportAsModule,
        TimepickerModule.forRoot(),
        TabsModule.forRoot(),
        ModalModule.forRoot(),
        TooltipModule.forRoot(),
        BsDropdownModule.forRoot(),
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
        CustomFieldCreateComponent,
        CustomFieldEditComponent,
        CreateTranslationComponent,
        EditTranslationComponent
    ]
})

export class SettingsModule {
}

// Required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

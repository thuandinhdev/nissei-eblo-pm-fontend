import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {NgxEditorModule} from 'ngx-editor';
import {BsDatepickerModule, DatepickerModule, TooltipModule} from 'ngx-bootstrap';
import {NgxPermissionsModule} from 'ngx-permissions';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import {InlineEditInputComponent} from './components/inline-edit-input/inline-edit-input.component';
import {InlineEditHoursComponent} from './components/inline-edit-hours/inline-edit-hours.component';
import {InlineEditSelectComponent} from './components/inline-edit-select/inline-edit-select.component';
import {InlineEditDateComponent} from './components/inline-edit-date/inline-edit-date.component';
import {InlineEditTextareaComponent} from './components/inline-edit-textarea/inline-edit-textarea.component';
import {InlineEditTextEditorComponent} from './components/inline-edit-text-editor/inline-edit-text-editor.component';
import {InlineMultiDatepickerComponent} from './components/inline-multi-datepicker/inline-multi-datepicker.component';
import {InlineEditSelectItemsComponent} from './components/inline-edit-select-items/inline-edit-select-items.component';
import {ShowCustomFieldElementComponent} from './components/show-custom-field-element/show-custom-field-element.component';
import {ShowCustomFieldElementWebComponent} from './components/show-custom-field-element-web/show-custom-field-element-web.component';
import {ShowDropzoneComponent} from './components/dropzone/dropzone.component';

import {ShortNamePipe} from './pipes/short-name.pipe';
import {StringToArrayFilterPipe} from './pipes/string-to-array-filter.pipe';
import {DecimalToColonPipe} from './pipes/decimal-to-colon.pipe';
import {AsDatePipe} from './pipes/as-date.pipe';
import {CreateShortNamePipe} from './pipes/create-short-name.pipe';
import {RoundNumberPipe} from './pipes/round-number.pipe';
import {KeysPipe} from './pipes/keys.pipe';
import {FilterUniquePipe} from './pipes/filter-unique.pipe';
import {UndersocreToSpacePipe} from './pipes/undersocre-to-space.pipe';
import {ObjToArPipe} from './pipes/obj-to-ar.pipe';
import {DateTimeFormatFilterPipe} from './pipes/date-time-format-filter.pipe';
import {UcfirstPipe} from './pipes/ucfirst.pipe';
import {StrToFirstLetterPipe} from './pipes/str-to-first-letter.pipe';

@NgModule({
    providers: [DatePipe, UndersocreToSpacePipe, DateTimeFormatFilterPipe],
    declarations: [
        InlineEditInputComponent,
        InlineEditHoursComponent,
        InlineEditSelectComponent,
        InlineEditDateComponent,
        InlineEditTextareaComponent,
        InlineEditTextEditorComponent,
        InlineMultiDatepickerComponent,
        InlineEditSelectItemsComponent,
        ShowCustomFieldElementComponent,
        ShortNamePipe,
        StringToArrayFilterPipe,
        DecimalToColonPipe,
        AsDatePipe,
        CreateShortNamePipe,
        RoundNumberPipe,
        KeysPipe,
        ObjToArPipe,
        FilterUniquePipe,
        UndersocreToSpacePipe,
        DateTimeFormatFilterPipe,
        UcfirstPipe,
        StrToFirstLetterPipe,
        ShowCustomFieldElementWebComponent,
        ShowDropzoneComponent,
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        NgSelectModule,
        NgxEditorModule,
        NgxPermissionsModule,
        DatepickerModule.forRoot(),
        BsDatepickerModule.forRoot(),
        TooltipModule.forRoot(),
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (HttpLoaderFactory),
                deps: [HttpClient]
            }
        })
    ],
    exports: [
        InlineEditInputComponent,
        InlineEditHoursComponent,
        InlineEditSelectComponent,
        InlineEditDateComponent,
        InlineEditTextareaComponent,
        InlineEditTextEditorComponent,
        InlineMultiDatepickerComponent,
        InlineEditSelectItemsComponent,
        ShowCustomFieldElementComponent,
        ShortNamePipe,
        StringToArrayFilterPipe,
        DecimalToColonPipe,
        AsDatePipe,
        CreateShortNamePipe,
        RoundNumberPipe,
        KeysPipe,
        ObjToArPipe,
        FilterUniquePipe,
        UndersocreToSpacePipe,
        DateTimeFormatFilterPipe,
        StrToFirstLetterPipe,
        UcfirstPipe,
        ShowCustomFieldElementWebComponent,
        ShowDropzoneComponent,
    ],
    entryComponents: [ShowCustomFieldElementComponent, ShowCustomFieldElementWebComponent, ShowDropzoneComponent]
})

export class SharedModule {
}

// Required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FileUploadModule} from 'ng2-file-upload';
import {FileSaverModule} from 'ngx-filesaver';
import {NgxPermissionsModule} from 'ngx-permissions';
import {NgxEditorModule} from 'ngx-editor';
import {BsDropdownModule, ModalModule, TooltipModule} from 'ngx-bootstrap';
import {ProgressbarModule} from 'ngx-bootstrap/progressbar';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import {FileBrowserRoutingModule} from './file-browser-routing.module';
import {SharedModule} from '../../shared/shared.module';

import {FileBrowserComponent} from './pages/file-browser/file-browser.component';
import {UploadFilesModelComponent} from './components/upload-files-model/upload-files-model.component';
import {CreateFolderModelComponent} from './components/create-folder-model/create-folder-model.component';
import {EditFolderModalComponent} from './components/edit-folder-modal/edit-folder-modal.component';
import {EditFileModalComponent} from './components/edit-file-modal/edit-file-modal.component';

@NgModule({
    declarations: [
        FileBrowserComponent,
        UploadFilesModelComponent,
        CreateFolderModelComponent,
        EditFolderModalComponent,
        EditFolderModalComponent,
        EditFileModalComponent
    ],
    imports: [
        CommonModule,
        FileBrowserRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        NgxPermissionsModule,
        NgxEditorModule,
        FileUploadModule,
        HttpClientModule,
        FileSaverModule,
        ModalModule.forRoot(),
        TooltipModule.forRoot(),
        ProgressbarModule.forRoot(),
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
        UploadFilesModelComponent,
        EditFileModalComponent,
        CreateFolderModelComponent,
        EditFolderModalComponent
    ]
})

export class FileBrowserModule {
}

// Required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

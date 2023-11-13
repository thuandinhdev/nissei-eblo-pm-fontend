import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeoListComponent } from './pages/seo-list/seo-list.component';
import { SeoRoutingModule } from './seo-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPermissionsModule } from 'ngx-permissions';
import { DataTablesModule } from 'angular-datatables';
import { ExportAsModule } from 'ngx-export-as';
import { NgxEditorModule } from 'ngx-editor';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDropdownModule, ModalModule, TooltipModule } from 'ngx-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory, SharedModule } from 'src/app/shared/shared.module';
import { HttpClient } from '@angular/common/http';
import { CreateSeoComponent } from './components/create-seo/create-seo.component';
import { EditSeoComponent } from './components/edit-seo/edit-seo.component';

@NgModule({
  declarations: [SeoListComponent, SeoListComponent, CreateSeoComponent, EditSeoComponent],
  imports: [
    CommonModule,
    SeoRoutingModule,
    CommonModule,
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
    CreateSeoComponent,
    EditSeoComponent
  ],
  providers: []
})
export class SeoModule { }

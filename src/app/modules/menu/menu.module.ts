import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuCreateComponent } from './components/menu-create/menu-create.component';
import { MenuListComponent } from './pages/menu-list/menu-list.component';
import { MenuRoutingModule } from './menu-routing.module';
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
import { MenuEditComponent } from './components/menu-edit/menu-edit.component';
import { SubMenuListComponent } from './pages/sub-menu-list/sub-menu-list.component';
import { SubMenuCreateComponent } from './components/sub-menu-create/sub-menu-create.component';
import { SubMenuEditComponent } from './components/sub-menu-edit/sub-menu-edit.component';

@NgModule({
  declarations: [MenuCreateComponent, MenuListComponent, MenuEditComponent, SubMenuListComponent, SubMenuCreateComponent, SubMenuEditComponent],
  imports: [
    CommonModule,
    MenuRoutingModule,
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
    MenuCreateComponent,
    MenuEditComponent,
    SubMenuCreateComponent,
    SubMenuEditComponent
  ],
})
export class MenuModule { }


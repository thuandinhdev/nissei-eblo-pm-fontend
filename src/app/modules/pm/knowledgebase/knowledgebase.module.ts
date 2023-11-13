import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BsDatepickerModule, BsDropdownModule, DatepickerModule, ModalModule, TooltipModule} from 'ngx-bootstrap';
import {ExportAsModule} from 'ngx-export-as';
import {NgSelectModule} from '@ng-select/ng-select';
import {NgxEditorModule} from 'ngx-editor';
import {NgxPermissionsModule} from 'ngx-permissions';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {DataTablesModule} from 'angular-datatables';
import {TreeModule} from 'angular-tree-component';

import {SharedModule} from '../../../shared/shared.module';
import {KnowledgebaseRoutingModule} from './knowledgebase-routing.module';

import {CreateArticalModalComponent} from './article/components/create-artical-modal/create-artical-modal.component';
import {ArticleListComponent} from './article/pages/article-list/article-list.component';
import {ArticleDetailComponent} from './article/pages/article-detail/article-detail.component';
import {CategoryListComponent} from './pages/category-list/category-list.component';
import {CategoryArticlesTreeComponent} from './category/components/category-articles-tree/category-articles-tree.component';
import {CreateCategoryModalComponent} from './category/components/create-category-modal/create-category-modal.component';
import {EditArticleModalComponent} from './article/components/edit-article-modal/edit-article-modal.component';
import {EditCategoryModalComponent} from './article/components/edit-category-modal/edit-category-modal.component';

@NgModule({
    declarations: [
        CreateArticalModalComponent,
        ArticleListComponent,
        ArticleDetailComponent,
        CategoryListComponent,
        CategoryArticlesTreeComponent,
        CreateCategoryModalComponent,
        EditArticleModalComponent,
        EditCategoryModalComponent
    ],
    imports: [
        CommonModule,
        KnowledgebaseRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        NgxPermissionsModule,
        DataTablesModule,
        ExportAsModule,
        NgxEditorModule,
        TooltipModule.forRoot(),
        DatepickerModule.forRoot(),
        BsDatepickerModule.forRoot(),
        ModalModule.forRoot(),
        TreeModule.forRoot(),
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
        CreateArticalModalComponent,
        CreateCategoryModalComponent,
        EditArticleModalComponent,
        EditCategoryModalComponent
    ]
})

export class KnowledgebaseModule {
}

// Required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from 'ngx-toastr';
import Swal from 'sweetalert2';

import {KnowledgeBaseService} from './../../../../../../core/services/knowledge-base.service';

import {CreateArticalModalComponent} from './../../../article/components/create-artical-modal/create-artical-modal.component';
import {EditArticleModalComponent} from './../../../article/components/edit-article-modal/edit-article-modal.component';
import {EditCategoryModalComponent} from './../../components/edit-category-modal/edit-category-modal.component';

@Component({
    selector: 'app-article-list',
    templateUrl: './article-list.component.html',
    styleUrls: ['./article-list.component.scss']
})

export class ArticleListComponent implements OnInit {
    public modalRef: BsModalRef;
    category: any;
    isPageLoaded = false;

    constructor(
        public translate: TranslateService,
        private toastr: ToastrService,
        private router: Router,
        private http: HttpClient,
        private route: ActivatedRoute,
        private modalService: BsModalService,
        private knowledgeBaseService: KnowledgeBaseService
    ) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            this.getArticalByCategoryId(params.get('id'));
        });
    }

    openCreateArticleModal(categoryData) {
        let modalConfigs = {
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: false,
            class: 'inmodal modal-dialog-centered modal-md animated fadeIn',
            initialState: {
                category: categoryData,
            }
        };

        this.modalRef = this.modalService.show(CreateArticalModalComponent, modalConfigs);
        this.modalRef.content.event.subscribe(data => {
            this.getArticalByCategoryId(this.category.id);
        });
    }

    openEditArticleModal(articleData) {
        let modalConfigs = {
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: false,
            class: 'inmodal modal-dialog-centered animated fadeIn',
            initialState: {
                article: articleData,
            }
        };

        this.modalRef = this.modalService.show(EditArticleModalComponent, modalConfigs);
        this.modalRef.content.event.subscribe(data => {
            this.getArticalByCategoryId(articleData.category_id);
        });
    }

    getArticalByCategoryId(categoryId) {
        this.knowledgeBaseService.getArticalByCategoryId(categoryId)
            .subscribe(data => {
                this.category = data;
                this.isPageLoaded = true;
            });
    }

    getCategoryById(categoryId) {
        this.knowledgeBaseService.getCategoryById(categoryId)
            .subscribe(data => {
                this.category = data;
                this.isPageLoaded = true;
            });
    }

    editCategory(category) {
        let modalConfigs = {
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: false,
            class: 'inmodal modal-dialog-centered animated fadeIn',
            initialState: {
                category: category,
            }
        };

        this.modalRef = this.modalService.show(EditCategoryModalComponent, modalConfigs);
        this.modalRef.content.event.subscribe(data => {
            this.getCategoryById(category.id);
        });
    }

    deleteCategory(id) {
        Swal.fire({
            title: this.translate.instant('common.swal.title'),
            text: this.translate.instant('common.swal.text') + ' ' + this.translate.instant('knowledge_base.category.title1'),
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('common.swal.confirmButtonText'),
            cancelButtonText: this.translate.instant('common.swal.cancelButtonText')
        }).then((result) => {
            if (result.value) {
                this.knowledgeBaseService.delete(id)
                    .subscribe(
                        data => {
                            this.toastr.success(this.translate.instant('knowledge_base.category.messages.delete'), this.translate.instant('knowledge_base.category.title'));
                            this.router.navigate(['/knowledgebase']);
                        });
            }
        });
    }

    deleteArticle(id) {
        Swal.fire({
            title: this.translate.instant('common.swal.title'),
            text: this.translate.instant('common.swal.text') + ' ' + this.translate.instant('knowledge_base.article.title2'),
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('common.swal.confirmButtonText'),
            cancelButtonText: this.translate.instant('common.swal.cancelButtonText')
        }).then((result) => {
            if (result.value) {
                this.knowledgeBaseService.deleteArticle(id)
                    .subscribe(
                        data => {
                            this.toastr.success(this.translate.instant('knowledge_base.article.messages.delete'), this.translate.instant('knowledge_base.article.title'));
                            this.router.navigate(['/knowledgebase']);
                        });
            }
        });
    }
}

import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';

import {KnowledgeBaseService} from '../../../../../../core/services/knowledge-base.service';

import {EditArticleModalComponent} from './../../../article/components/edit-article-modal/edit-article-modal.component';

import {AuthenticationService} from '../../../../../../core/services/authentication.service';
import {environment} from '../../../../../../../environments/environment';

@Component({
    selector: 'app-article-detail',
    templateUrl: './article-detail.component.html',
    styleUrls: ['./article-detail.component.scss']
})

export class ArticleDetailComponent implements OnInit {
    public modalRef: BsModalRef;
    article: any;
    category: any;
    articleId: any;
    loginUser: any;
    isPageLoaded = false;
    private apiUrl = environment.apiUrl;

    constructor(
        private route: ActivatedRoute,
        private knowledgeBaseService: KnowledgeBaseService,
        private modalService: BsModalService,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
    }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            this.articleId = params.get('aid');
            this.getArticleById(params.get('aid'));
        });
    }

    getArticleById(articleId) {
        this.knowledgeBaseService.getArticleById(articleId)
            .subscribe(
                data => {
                    this.article = data;
                    this.isPageLoaded = true;
                }
            );

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
            this.getArticleById(this.articleId);
        });
    }
}

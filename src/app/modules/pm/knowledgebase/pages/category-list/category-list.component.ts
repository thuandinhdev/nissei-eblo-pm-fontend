import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';

import {CreateCategoryModalComponent} from './../../category/components/create-category-modal/create-category-modal.component';

import {KnowledgeBaseService} from './../../../../../core/services/knowledge-base.service';

import {environment} from '../../../../../../environments/environment';

@Component({
    selector: 'app-category-list',
    templateUrl: './category-list.component.html',
    styleUrls: ['./category-list.component.scss']
})

export class CategoryListComponent implements OnInit {
    public modalRef: BsModalRef;
    searchForm: FormGroup;
    categories: any;
    isPageLoaded = false;
    modalConfigs = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: false,
        class: 'inmodal modal-dialog-centered animated fadeIn'
    };
    private apiUrl = environment.apiUrl;

    constructor(
        private modalService: BsModalService,
        private formBuilder: FormBuilder,
        private knowledgeBaseService: KnowledgeBaseService
    ) {
    }

    get searchControl() {
        return this.searchForm.controls;
    }

    ngOnInit() {
        this.getAllCategory();
    }

    loadForms() {
        this.searchForm = this.formBuilder.group({
            search: ['']
        });

        this.isPageLoaded = true;
    }

    getAllCategory() {
        this.knowledgeBaseService.getAllCategory()
            .subscribe(data => {
                this.categories = data;
                this.loadForms();
            });
    }

    openCreateCategoryModal() {
        this.modalRef = this.modalService.show(CreateCategoryModalComponent, this.modalConfigs);
        this.modalRef.content.event.subscribe(data => {
            this.getAllCategory();
        });
    }

    onSubmit() {
        if (this.searchForm.invalid) {
            return;
        }

        this.knowledgeBaseService.search(this.searchControl.search.value)
            .subscribe(
                data => {
                    this.categories = data;
                });
    }
}

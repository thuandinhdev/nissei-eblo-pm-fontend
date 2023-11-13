import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {KnowledgeBaseService} from './../../../../../../core/services/knowledge-base.service';

declare var $: any;

@Component({
    selector: 'category-articles-tree',
    templateUrl: './category-articles-tree.component.html',
    styleUrls: ['./category-articles-tree.component.scss']
})

export class CategoryArticlesTreeComponent implements OnInit {
    categoryLists: any;
    basURL = window.location.origin;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private knowledgeBaseService: KnowledgeBaseService
    ) {
    }

    ngOnInit() {
        this.getAllCategoryArticles();
    }

    getAllCategoryArticles() {
        this.knowledgeBaseService.getAllCategory()
            .subscribe(
                data => {
                    this.categoryLists = data;

                    setTimeout(() => {
                        $('#jstree1').jstree({
                            'core': {
                                'themes': {
                                    'name': 'default',
                                    'responsive': true
                                },
                                'check_callback': true
                            }
                        }).bind('changed.jstree', function (e, data) {
                            if (data.node) {
                                document.location = data.node.a_attr.href;
                            }
                        });
                    });
                });
    }
}

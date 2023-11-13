import {Component, OnInit} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';

import {MenuService} from '../../../../core/services/menu.service';

declare var $: any;

@Component({
    selector: 'app-menu-allocation',
    templateUrl: './menu-allocation.component.html',
    styleUrls: ['./menu-allocation.component.scss']
})

export class MenuAllocationComponent implements OnInit {
    activeInactiveMenu: any = {
        active_menu: {},
        inactive_menu: {}
    };

    constructor(
        public translate: TranslateService,
        private menuService: MenuService,
        private toastr: ToastrService
    ) {
    }

    ngOnInit() {
        this.getMenus();
    }

    getMenus() {
        this.menuService.getAll()
            .subscribe(
                data => {
                    this.activeInactiveMenu = data;
                    this.loadMenu();
                });
    }

    updateOutput(e) {
        let list = e.length ? e : $(e.target),
            output = list.data('output');

        output.val(JSON.stringify(list.nestable('serialize')));
    }

    expandAll() {
        $('.dd').nestable('expandAll');
    }

    collapseAll() {
        $('.dd').nestable('collapseAll');
    }

    loadMenu() {
        setTimeout(() => {
            let activeMenu = $('#nestable').nestable({
                group: 2,
                maxDepth: 2
            }).on('change', this.updateOutput);

            // --
            // Activate nestable for list 1
            let inActiveMenu = $('#nestable2').nestable({
                group: 2,
                maxDepth: 2
            }).on('change', this.updateOutput);

            this.updateOutput(activeMenu.data('output', $('#nestable-output')));
            this.updateOutput(inActiveMenu.data('output', $('#nestable2-output')));
        }, 200);
    }

    saveMenu() {

        // --
        // this.toastr.error(this.translate.instant('common.not_allowed'));
        // return;

        let menus = {
            'all_active_menu': $('#nestable-output').val(),
            'all_inactive_menu': $('#nestable2-output').val()
        };

        this.menuService.create(menus)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('settings.menu_allocation.messages.update'), this.translate.instant('settings.menu_allocation.title'));
                });
    }
}

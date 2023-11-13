import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NgxPermissionsGuard} from 'ngx-permissions';
import { MenuListComponent } from './pages/menu-list/menu-list.component';
import { SubMenuListComponent } from './pages/sub-menu-list/sub-menu-list.component';


const routes: Routes = [{
    path: '',
    children: [
        {
            path: '',
            canActivate: [NgxPermissionsGuard],
            component: MenuListComponent
        },
        {
            path: 'sub-menu/:id', 
            component: SubMenuListComponent,
            data: {
                breadcrumbs: {
                    text: 'common.sub_menu',
                    icon: 'fa fa-product-hunt',
                    hasParams: false,
                    show: false,
                    isHome: false
                }
            }
        },
    ]
}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class MenuRoutingModule {
}

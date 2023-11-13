import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NgxPermissionsGuard} from 'ngx-permissions';
import { SeoListComponent } from './pages/seo-list/seo-list.component';


const routes: Routes = [{
    path: '',
    children: [
        {
            path: '',
            canActivate: [NgxPermissionsGuard],
            component: SeoListComponent
        }
    ]
}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class SeoRoutingModule {
}

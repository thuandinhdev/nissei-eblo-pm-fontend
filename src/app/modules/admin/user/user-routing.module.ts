import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NgxPermissionsGuard} from 'ngx-permissions';

import {UserComponent} from './pages/user/user.component';
import {UserCreateComponent} from './pages/user-create/user-create.component';
import {UserEditComponent} from './pages/user-edit/user-edit.component';
import {UserDetailComponent} from './pages/user-detail/user-detail.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                canActivate: [NgxPermissionsGuard],
                data: {
                    permissions: {
                        only: ['admin', 'super_admin', 'users_view']
                    }
                },
                component: UserComponent
            },
            {
                path: 'create',
                canActivate: [NgxPermissionsGuard],
                data: {
                    breadcrumbs: {
                        text: 'common.create',
                        icon: 'fa fa-user-circle',
                        show: true,
                        isHome: true
                    },
                    permissions: {
                        only: ['admin', 'super_admin', 'users_create']
                    }
                },
                component: UserCreateComponent,
            },
            {
                path: 'edit/:id',
                canActivate: [NgxPermissionsGuard],
                data: {
                    breadcrumbs: {
                        text: 'common.edit',
                        icon: 'fa fa-user-circle',
                        hasParams: true,
                        show: true,
                        isHome: true
                    },
                    permissions: {
                        only: ['admin', 'super_admin', 'users_edit']
                    }
                },
                component: UserEditComponent
            },
            {
                path: 'profile/:id',
                canActivate: [NgxPermissionsGuard],
                data: {
                    breadcrumbs: {
                        text: 'common.profile',
                        icon: 'fa fa-user-circle',
                        hasParams: true,
                        show: true,
                        isHome: true
                    }
                },
                component: UserDetailComponent
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class UserRoutingModule {
}

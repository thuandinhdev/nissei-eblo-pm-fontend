import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {FileBrowserComponent} from './pages/file-browser/file-browser.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: FileBrowserComponent
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class FileBrowserRoutingModule {
}

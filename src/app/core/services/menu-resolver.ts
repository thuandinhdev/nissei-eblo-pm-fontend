import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';

import {MenuService} from './menu.service';

@Injectable()

export class MenuResolver implements Resolve<any> {
    constructor(private  menuService: MenuService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this.menuService.getSidebarMenu();
    }
}

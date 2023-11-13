import {Injectable} from '@angular/core';

import {UserService} from './user.service';

@Injectable({
    providedIn: 'root'
})

export class UtilsService {
    users = [];

    constructor(private userService: UserService) {
    }

    getusers() {
        return this.userService.getAll().subscribe(users => {
            return users;
        });
    }

    getUserIdNames() {
    }
}

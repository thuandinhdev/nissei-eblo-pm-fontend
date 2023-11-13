import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {ClientService} from '../../../../../core/services/client.service';

@Component({
    selector: 'app-client-detail',
    templateUrl: './client-detail.component.html',
    styleUrls: ['./client-detail.component.scss']
})

export class ClientDetailComponent implements OnInit {
    client: any;
    isPageLoaded = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private clientService: ClientService
    ) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            this.getClientById(params.get('id'));
        });
    }

    getClientById(id) {
        this.clientService.getById(id)
            .subscribe(
                data => {
                    this.client = data;
                    this.isPageLoaded = true;
                });
    }

}

import {Component, OnInit} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import Swal from 'sweetalert2';

import {DatabaseBackupService} from '../../../../core/services/database-backup.service';
import {AuthenticationService} from '../../../../core/services/authentication.service';

import {environment} from '../../../../../environments/environment';

@Component({
    selector: 'app-database-backup',
    templateUrl: './database-backup.component.html',
    styleUrls: ['./database-backup.component.scss']
})

export class DatabaseBackupComponent implements OnInit {
    loginUser: any;
    databases = [];
    private apiUrl = environment.apiUrl;

    constructor(
        public translate: TranslateService,
        private toastr: ToastrService,
        private databaseBackupService: DatabaseBackupService,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
    }

    ngOnInit() {
        this.getDatabaseBackups();
    }

    getDatabaseBackups() {
        this.databaseBackupService.getAll()
            .subscribe(
                data => {
                    this.databases = data;

                    setTimeout(() => {
                        if (this.databases.length > 0) {
                            $('.tfoot_dt').addClass('d-none');
                        } else {
                            $('.tfoot_dt').removeClass('d-none');
                        }
                    });
                });
    }

    backupDatabase() {

        // --
        // this.toastr.error(this.translate.instant('common.not_allowed'));
        // return;

        this.databaseBackupService.create({})
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('settings.database_backups.messages.create'), this.translate.instant('settings.database_backups.title'));
                    this.getDatabaseBackups();
                });
    }

    restoreDatabase(database) {

        // --
        // this.toastr.error(this.translate.instant('common.not_allowed'));
        // return;

        this.databaseBackupService.update(database)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('settings.database_backups.messages.restore'), this.translate.instant('settings.database_backups.title'));
                });
    }

    deleteDatatabase(id) {
        Swal.fire({
            title: this.translate.instant('common.swal.title'),
            text: this.translate.instant('common.swal.text') + ' ' + this.translate.instant('settings.database_backups.title1'),
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('common.swal.confirmButtonText'),
            cancelButtonText: this.translate.instant('common.swal.cancelButtonText')
        }).then((result) => {
            if (result.value) {
                this.databaseBackupService.delete(id)
                    .subscribe(
                        data => {
                            this.toastr.success(this.translate.instant('settings.database_backups.messages.delete'), this.translate.instant('settings.database_backups.title'));
                            this.getDatabaseBackups();
                        });
            }
        });
    }

}

import {Component, EventEmitter, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';

import {TeamService} from '../../../../../core/services/team.service';

@Component({
    selector: 'app-import-team',
    templateUrl: './import-team.component.html',
    styleUrls: ['./import-team.component.scss']
})

export class ImportTeamComponent implements OnInit {
    public event: EventEmitter<any> = new EventEmitter();
    public onClose: Subject<boolean>;
    columnName: any;
    csvData: any;
    csvFileColumnName: any;
    fileAttached: boolean = false;
    isPageLoaded = false;
    isFormSubmitted = false;
    csvFileSelected = false;

    constructor(
        public translate: TranslateService,
        public bsImportUserModalRef: BsModalRef,
        private toastr: ToastrService,
        private teamService: TeamService
    ) {
    }

    ngOnInit() {
        this.onClose = new Subject();
    }

    fileUpload(files) {
        if (files && files.length > 0) {
            let file: File = files.item(0),
                reader = new FileReader();

            reader.readAsText(file);
            reader.onload = event => {
                let csvdata: string = reader.result as string;
                this.csvData = csvdata;
                this.fileAttached = true;
                if (this.csvData != undefined) {
                    this.csvFileSelected = true;
                } else {
                    this.csvFileSelected = false;
                }

                let filename = files[0].name;
                let ext = filename.substr(filename.lastIndexOf('.') + 1);
                if (ext != 'csv') {
                    this.toastr.error(this.translate.instant('teams.create.error_messages.message6'), this.translate.instant('teams.title'));
                    this.csvFileSelected = false;
                    return;
                }

                let newLinebrk = csvdata.split('\n');
                let columnNames = newLinebrk[0].split(',');
                this.csvFileColumnName = columnNames;
            };
        }
    }

    onSubmit() {
        this.isFormSubmitted = true;
        if (!this.csvFileSelected) {
            return false;
        }

        this.teamService.import({csv_file: this.csvData})
            .subscribe(
                data => {
                    this.event.emit({data: true});
                    this.onCancel();
                });
    }

    onCancel() {
        this.onClose.next(false);
        this.bsImportUserModalRef.hide();
    }

}

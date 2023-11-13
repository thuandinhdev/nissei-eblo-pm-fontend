import {Component, EventEmitter, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';

import {ImportTaskService} from '../../../../../core/services/import-task.service';

@Component({
    selector: 'app-task-import-modal',
    templateUrl: './task-import-modal.component.html',
    styleUrls: ['./task-import-modal.component.scss']
})

export class TaskImportModalComponent implements OnInit {
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
        public bsImportTaskModalRef: BsModalRef,
        private toastr: ToastrService,
        private importTaskService: ImportTaskService
    ) {
    }

    ngOnInit() {
        this.onClose = new Subject();
    }

    fileUpload(files) {
        if (files && files.length > 0) {
            let file: File = files.item(0);
            let reader = new FileReader();
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
                    this.toastr.error(this.translate.instant('teams.create.error_messages.message15'), this.translate.instant('teams.title'));
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
        this.importTaskService.create({csv_file: this.csvData})
            .subscribe(
                data => {
                    this.event.emit({data: true});
                    this.onCancel();
                });
    }

    onCancel() {
        this.onClose.next(false);
        this.bsImportTaskModalRef.hide();
    }

}

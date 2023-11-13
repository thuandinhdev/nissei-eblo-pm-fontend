import {Component, EventEmitter, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';

import {ImportProjectService} from '../../../../../core/services/import-project.service';

@Component({
    selector: 'app-project-import',
    templateUrl: './project-import.component.html',
    styleUrls: ['./project-import.component.scss']
})

export class ProjectImportComponent implements OnInit {
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
        public bsImportProjectModalRef: BsModalRef,
        private toastr: ToastrService,
        private importprojectService: ImportProjectService
    ) {
    }

    ngOnInit() {
        this.onClose = new Subject();
    }

    onSubmit() {
        this.isFormSubmitted = true;
        this.importprojectService.create({csv_file: this.csvData})
            .subscribe(
                data => {
                    this.event.emit({data: true});
                    this.onCancel();
                });
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

    onCancel() {
        this.onClose.next(false);
        this.bsImportProjectModalRef.hide();
    }

}

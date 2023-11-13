import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';

import {IncidentService} from '../../../../../core/services/incident.service';

@Component({
    selector: 'app-incident-notes',
    templateUrl: './incident-notes.component.html',
    styleUrls: ['./incident-notes.component.scss']
})

export class IncidentNotesComponent implements OnInit {
    @Input() incident;
    @Input() permission;
    editNoteForm: FormGroup;
    isFormSubmitted = false;

    constructor(
        public translate: TranslateService,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private incidentService: IncidentService
    ) {
    }

    ngOnInit() {
        this.editNoteForm = this.formBuilder.group({
            id: [this.incident.id],
            notes: [this.incident.notes]
        });
    }

    onSubmit() {
        this.isFormSubmitted = true;
        if (this.editNoteForm.invalid) {
            return;
        }

        this.incidentService.updateNotes(this.editNoteForm.value)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('notes.messages.update'), this.translate.instant('incidents.title'));
                });
    }
}

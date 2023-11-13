import {Component, OnInit} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';

import {EmailTemplateService} from '../../../../core/services/email-template.service';

@Component({
    selector: 'app-email-templates',
    templateUrl: './email-templates.component.html',
    styleUrls: ['./email-templates.component.scss']
})

export class EmailTemplatesComponent implements OnInit {
    emailGroups: any;
    emailGroupTemplates = [];
    email_group_id = 1;

    constructor(
        public translate: TranslateService,
        private emailTemplateService: EmailTemplateService,
        private toastr: ToastrService
    ) {
    }

    ngOnInit() {
        this.getEmailTemplates();
    }

    getEmailTemplates() {
        this.emailTemplateService.getAll()
            .subscribe(
                data => {
                    this.emailGroups = data;
                    this.loadEmailTemplates();
                });
    }

    loadEmailTemplates() {
        for (let iRow in this.emailGroups) {
            this.emailGroupTemplates[this.emailGroups[iRow].id] = this.emailGroups[iRow].templates;
        }
    }

    saveEmailtemplate(emailTemplate) {
        this.emailTemplateService.update(emailTemplate)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('settings.email_templates.messages.update'), this.translate.instant('settings.email_templates.title'));
                });
    }

}

import {Component, EventEmitter, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';

import {Provider} from '../../../../../shared/models/provider.model';

import {ProviderService} from '../../../../../core/services/provider.service';

@Component({
    selector: 'app-edit-provider',
    templateUrl: './edit-provider.component.html',
    styleUrls: ['./edit-provider.component.scss']
})

export class EditProviderComponent implements OnInit {
    public event: EventEmitter<any> = new EventEmitter();
    public onClose: Subject<boolean>;
    editProviderForm: FormGroup;
    provider: Provider;
    isSubmitted = false;

    constructor(
        public translate: TranslateService,
        public bsEditProviderModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private providerService: ProviderService,
        private toastr: ToastrService
    ) {
    }

    get providerControl() {
        return this.editProviderForm.controls;
    }

    ngOnInit() {
        this.onClose = new Subject();
        this.loadForm();
    }

    loadForm() {
        this.editProviderForm = this.formBuilder.group({
            id: [this.provider.id],
            firstname: [this.provider.firstname, [Validators.required, Validators.maxLength(50)]],
            lastname: [this.provider.lastname, [Validators.required, Validators.maxLength(50)]],
            email: [this.provider.email, [Validators.required, Validators.email]],
            color: [this.provider.color, Validators.required]
        });
    }

    onSubmit() {
        this.isSubmitted = true;
        if (this.editProviderForm.invalid) {
            return;
        }

        this.providerService.update(this.editProviderForm.value)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('providers.messages.edit'), this.translate.instant('providers.title'));
                    this.event.emit({data: true});
                    this.onCancel();
                }, error => {
                    this.onCancel();
                });
    }

    onCancel() {
        this.onClose.next(false);
        this.bsEditProviderModalRef.hide();
    }

}

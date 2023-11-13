import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { SeoService } from 'src/app/core/services/seo.service';

@Component({
  selector: 'app-edit-seo',
  templateUrl: './edit-seo.component.html',
  styleUrls: ['./edit-seo.component.scss']
})
export class EditSeoComponent implements OnInit {

  public event: EventEmitter<any> = new EventEmitter();
  public onClose: Subject<boolean>;
  editSeoForm: FormGroup;
  isFormSubmitted = false;
  isFormLoaded = false;
  seo: any;
  types: Array<any>;
  pages: Array<any>;
  constructor(
    public translate: TranslateService,
    public bsModalRef: BsModalRef,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private datepipe: DatePipe,
    private seoService: SeoService,
  ) { }
  get seoControl() {
    return this.editSeoForm.controls;
  }

  ngOnInit() {
    this.onClose = new Subject();
    this.types = [
      {
        id: 1,
        label: "select in page"
      },
      {
        id: 0,
        label: "all"
      },
    ];
    this.loadForm();
  }

  loadForm() {
    this.editSeoForm = this.formBuilder.group({
      id: [this.seo.id, Validators.required],
      attr: [this.seo.attr, Validators.required],
      value: [this.seo.value, Validators.required],
      type: [this.seo.type, Validators.required],
      default: [this.seo.default]
    });

    this.isFormLoaded = true;
  }
  onSubmit() {
    this.isFormSubmitted = true;
    if (this.editSeoForm.invalid) {
      return;
    }
    this.seoService.update(this.editSeoForm.value).subscribe(
            data => {
                this.toastr.success(this.translate.instant('seo.messages.create'), this.translate.instant('seo.title'));
                this.event.emit({data: true});
                this.onCancel();
            }, error => {
                this.onCancel();
            });
  }
  onCancel() {
    this.onClose.next(false);
    this.bsModalRef.hide();
  }
}

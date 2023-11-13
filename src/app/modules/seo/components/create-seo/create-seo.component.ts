import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { SeoService } from 'src/app/core/services/seo.service';

@Component({
  selector: 'app-create-seo',
  templateUrl: './create-seo.component.html',
  styleUrls: ['./create-seo.component.scss']
})
export class CreateSeoComponent implements OnInit {

  public event: EventEmitter<any> = new EventEmitter();
  public onClose: Subject<boolean>;
  createSeoForm: FormGroup;
  isFormSubmitted = false;
  isFormLoaded = false;
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
    return this.createSeoForm.controls;
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
    this.createSeoForm = this.formBuilder.group({
      attr: [null, Validators.required],
      value: [null, Validators.required],
      type: [null, Validators.required],
      default: [null]
    });

    this.isFormLoaded = true;
  }
  onSubmit() {
    this.isFormSubmitted = true;
    if (this.createSeoForm.invalid) {
      return;
    }
    this.seoService.create(this.createSeoForm.value).subscribe(
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

import { WebMenuService } from './../../../../core/services/web-menu.service';
import { DatePipe } from '@angular/common';
import { Component,EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-menu-create',
  templateUrl: './menu-create.component.html',
  styleUrls: ['./menu-create.component.scss']
})
export class MenuCreateComponent implements OnInit {

  public event: EventEmitter<any> = new EventEmitter();
  public onClose: Subject<boolean>;
  createMenuForm: FormGroup;
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
    private webMenuService: WebMenuService,
    private datepipe: DatePipe,
  ) { }
  get menuControl() {
    return this.createMenuForm.controls;
  }
  ngOnInit() {
    this.onClose = new Subject();
    this.types = [
      {
        id: 1,
        label: "all"
      },
      {
        id: 1,
        label: "select for page"
      },
    ];
    this.pages = [
      {
        id: 1,
        label: "single page"
      },
      {
        id: 2,
        label: "categorys"
      },
      {
        id: 3,
        label: "collections"
      },
      {
        id: 4,
        label: "news"
      },
      {
        id: 5,
        label: "products"
      },
    ];
    this.loadForm();
  }
  loadForm() {
    this.createMenuForm = this.formBuilder.group({
      name: [null, Validators.required],
      description: [null],
    });

    this.isFormLoaded = true;
  }
  onSubmit() {
    this.isFormSubmitted = true;
    if (this.createMenuForm.invalid) {
      return;
    }
    this.webMenuService.create(this.createMenuForm.value).subscribe(
            data => {
                this.toastr.success(this.translate.instant('menu.messages.create'), this.translate.instant('items.title'));
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

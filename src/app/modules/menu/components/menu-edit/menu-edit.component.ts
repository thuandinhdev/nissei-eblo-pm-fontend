import { DatePipe } from '@angular/common';
import { Component,EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { WebMenuService } from './../../../../core/services/web-menu.service';

@Component({
  selector: 'app-menu-edit',
  templateUrl: './menu-edit.component.html',
  styleUrls: ['./menu-edit.component.scss']
})
export class MenuEditComponent implements OnInit {

  public event: EventEmitter<any> = new EventEmitter();
  public onClose: Subject<boolean>;
  editMenuForm: FormGroup;
  isFormSubmitted = false;
  isFormLoaded = false;
  menu: any;
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
    return this.editMenuForm.controls;
  }
  ngOnInit() {
    this.onClose = new Subject();
    this.loadForm();
  }
  loadForm() {
    this.editMenuForm = this.formBuilder.group({
      name: [this.menu.name, Validators.required],
      id: [this.menu.id, Validators.required],
      description: [this.menu.description],
    });

    this.isFormLoaded = true;
  }
  onSubmit() {
    this.isFormSubmitted = true;
    if (this.editMenuForm.invalid) {
      return;
    }
    this.webMenuService.update(this.editMenuForm.value).subscribe(
            data => {
                this.toastr.success(this.translate.instant('menu.messages.edit'), this.translate.instant('items.title'));
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

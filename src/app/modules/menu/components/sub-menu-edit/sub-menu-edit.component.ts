import { DatePipe } from '@angular/common';
import { Component, EventEmitter,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { WebMenuService } from './../../../../core/services/web-menu.service';

@Component({
  selector: 'app-sub-menu-edit',
  templateUrl: './sub-menu-edit.component.html',
  styleUrls: ['./sub-menu-edit.component.scss']
})
export class SubMenuEditComponent implements OnInit {

  public event: EventEmitter<any> = new EventEmitter();
  public onClose: Subject<boolean>;
  editSubMenuForm: FormGroup;
  selectPage = false;
  typeShow = false;
  nameShow = false;
  isFormSubmitted = false;
  isFormLoaded = false;
  type_shows: Array<any>;
  pages_type: any;
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
  get subMenuControl() {
    return this.editSubMenuForm.controls;
  }
  ngOnInit() {
    this.onClose = new Subject();
    this.type_shows = [{
          name: 'Shows current page',
          id:0
        },{
          name: 'Show a list of subsites',
          id:1
        }];
    this.getDataSubMenu();
  }
  loadForm() {
    this.editSubMenuForm = this.formBuilder.group({
      id: [this.menu.id, Validators.required],
      name: [this.menu.name, Validators.required],
      type: [this.menu.type, Validators.required],
      // type_show: [this.menu.type_show, Validators.required],
      page_id: [this.menu.page_id, Validators.required],
      index: [this.menu.index, Validators.required],
    });

    for (var i = 0; i < this.pages_type.length; ++i) {
        if(this.pages_type[i].id == this.menu.type){
            this.pageTypeChange(this.pages_type[i], 'load');
        }
    }
    this.isFormLoaded = true;
  }
  pageTypeChange(data, action){
    if(data.id == 1){
      this.selectPage = false;
      this.typeShow = false;
      this.nameShow = true;
      if(action != 'load'){
        // this.editSubMenuForm.controls['type_show'].setValue(null);
        this.editSubMenuForm.controls['page_id'].setValue(null);
        this.editSubMenuForm.controls['name'].setValue(null);
      }
      // this.editSubMenuForm.get('type_show').setValidators([]);
      // this.editSubMenuForm.get('type_show').updateValueAndValidity();
      this.editSubMenuForm.get('page_id').setValidators([]);
      this.editSubMenuForm.get('page_id').updateValueAndValidity();
      this.editSubMenuForm.get('name').setValidators([Validators.required]);
      this.editSubMenuForm.get('name').updateValueAndValidity();
    } else {
      if([3,4,5,6].indexOf(data.id) != -1){
        this.typeShow = true;
        if(action != 'load'){
          // this.editSubMenuForm.controls['type_show'].setValue(0);
          this.editSubMenuForm.controls['page_id'].setValue(null);
        }
          this.editSubMenuForm.get('page_id').setValidators([Validators.required]);
          this.editSubMenuForm.get('page_id').updateValueAndValidity();
          // this.editSubMenuForm.get('type_show').setValidators([Validators.required]);
          // this.editSubMenuForm.get('type_show').updateValueAndValidity();
      } else {
        this.typeShow = false;
        if(action != 'load'){
          // this.editSubMenuForm.controls['type_show'].setValue(null);
          this.editSubMenuForm.controls['page_id'].setValue(null);
        }
        // this.editSubMenuForm.get('type_show').setValidators([]);
        // this.editSubMenuForm.get('type_show').updateValueAndValidity();
        this.editSubMenuForm.get('page_id').setValidators([Validators.required]);
        this.editSubMenuForm.get('page_id').updateValueAndValidity();
      }
      if(action != 'load'){
        this.editSubMenuForm.controls['name'].setValue(null);
      }
      this.editSubMenuForm.get('name').setValidators([]);
      this.editSubMenuForm.get('name').updateValueAndValidity();
      this.nameShow = false;
      this.selectPage = true;
    }
    this.pages = data.data;
  }
  getDataSubMenu(){
    this.webMenuService.getDataSubMenu().subscribe(
            data => {
              this.pages_type = data; 
              this.loadForm();
            });
  }
  onSubmit() {
    this.isFormSubmitted = true;
    if (this.editSubMenuForm.invalid) {
      return;
    }
    this.webMenuService.updateSubMenu(this.editSubMenuForm.value).subscribe(
            data => {
                this.toastr.success(this.translate.instant('menu.messages.create'), this.translate.instant('menu.title'));
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

import { DatePipe } from '@angular/common';
import { Component, EventEmitter,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { WebMenuService } from './../../../../core/services/web-menu.service';

@Component({
  selector: 'app-sub-menu-create',
  templateUrl: './sub-menu-create.component.html',
  styleUrls: ['./sub-menu-create.component.scss']
})
export class SubMenuCreateComponent implements OnInit {

  public event: EventEmitter<any> = new EventEmitter();
  public onClose: Subject<boolean>;
  createSubMenuForm: FormGroup;
  isFormSubmitted = false;
  isFormLoaded = false;
  selectPage = false;
  typeShow = false;
  nameShow = false;
  parent_id: number;
  menu_id: number;
  types: Array<any>;
  pages: Array<any>;
  type_shows: Array<any>;
  pages_type: any;
  constructor(
    public translate: TranslateService,
    public bsModalRef: BsModalRef,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private webMenuService: WebMenuService,
    private datepipe: DatePipe,
  ) {
  }
  get subMenuControl() {
    return this.createSubMenuForm.controls;
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
    this.createSubMenuForm = this.formBuilder.group({
      name: [null, Validators.required],
      type: [null, Validators.required],
      parent_id: [this.parent_id],
      menu_id: [this.menu_id],
      // type_show: [null, Validators.required],
      page_id: [null, Validators.required],
      index: [null, Validators.required],
    });

    this.isFormLoaded = true;
  }
  onSubmit() {
    this.isFormSubmitted = true;
    if (this.createSubMenuForm.invalid) {
      return;
    }
    console.log(this.createSubMenuForm.value);
    this.webMenuService.createSubMenu(this.createSubMenuForm.value).subscribe(
            data => {
                this.toastr.success(this.translate.instant('menu.messages.create'), this.translate.instant('menu.title'));
                this.event.emit({data: true});
                this.onCancel();
            }, error => {
                this.onCancel();
            });
  }
  pageTypeChange(data){
    if(data.id == 1){
      this.selectPage = false;
      this.typeShow = false;
      this.nameShow = true;
      // this.createSubMenuForm.controls['type_show'].setValue(null);
      // this.createSubMenuForm.get('type_show').setValidators([]);
      // this.createSubMenuForm.get('type_show').updateValueAndValidity();
      this.createSubMenuForm.controls['page_id'].setValue(null);
      this.createSubMenuForm.get('page_id').setValidators([]);
      this.createSubMenuForm.get('page_id').updateValueAndValidity();
      this.createSubMenuForm.controls['name'].setValue(null);
      this.createSubMenuForm.get('name').setValidators([Validators.required]);
      this.createSubMenuForm.get('name').updateValueAndValidity();
    } else {
      if([3,4,5,6].indexOf(data.id) != -1){
        this.typeShow = true;
        // this.createSubMenuForm.controls['type_show'].setValue(0);
        // this.createSubMenuForm.get('type_show').setValidators([Validators.required]);
        // this.createSubMenuForm.get('type_show').updateValueAndValidity();
        this.createSubMenuForm.controls['page_id'].setValue(null);
        this.createSubMenuForm.get('page_id').setValidators([Validators.required]);
        this.createSubMenuForm.get('page_id').updateValueAndValidity();
      } else {
        this.typeShow = false;
        // this.createSubMenuForm.controls['type_show'].setValue(null);
        // this.createSubMenuForm.get('type_show').setValidators([]);
        // this.createSubMenuForm.get('type_show').updateValueAndValidity();
        this.createSubMenuForm.controls['page_id'].setValue(null);
        this.createSubMenuForm.get('page_id').setValidators([Validators.required]);
        this.createSubMenuForm.get('page_id').updateValueAndValidity();
      }
      this.createSubMenuForm.controls['name'].setValue(null);
      this.createSubMenuForm.get('name').setValidators([]);
      this.createSubMenuForm.get('name').updateValueAndValidity();
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
  onCancel() {
    this.onClose.next(false);
    this.bsModalRef.hide();
  }
}

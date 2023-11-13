import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DataTableDirective } from 'angular-datatables';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ExportAsConfig, ExportAsService } from 'ngx-export-as';
import { NgxRolesService } from 'ngx-permissions';
import { ToastrService } from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { DatatablesResponse } from 'src/app/core/helpers/datatables-response.helper';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { environment } from 'src/environments/environment';
import { SubMenuCreateComponent } from '../../components/sub-menu-create/sub-menu-create.component';
import { SubMenuEditComponent } from '../../components/sub-menu-edit/sub-menu-edit.component';
import { WebMenuService } from './../../../../core/services/web-menu.service';

@Component({
  selector: 'app-sub-menu-list',
  templateUrl: './sub-menu-list.component.html',
  styleUrls: ['./sub-menu-list.component.scss']
})
export class SubMenuListComponent implements OnInit {
  public modalRef: BsModalRef;
  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: any = {};
  sub_menus = [];
  colspan = 1;
  params: any;
  loginUser: any;
  exportAsConfig: ExportAsConfig = {
    type: 'pdf',
    elementIdOrContent: 'sub_menu_table',
  };
  modalConfigs = {
    animated: true,
    keyboard: true,
    backdrop: true,
    initialState:{
      menu_id: '',
    },
    ignoreBackdropClick: false,
    class: 'inmodal modal-dialog-centered modal-lg animated fadeIn'
  };
  constructor(
    public translate: TranslateService,
    public ngxRolesService: NgxRolesService,
    private http: HttpClient,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private exportAsService: ExportAsService,
    private webMenuService: WebMenuService,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
  ) {
    this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
    this.route.paramMap.subscribe(params => {
        this.params = params;
    });
   }
   private apiUrl = environment.apiUrl;
  ngOnInit() {
    this.loadSubMenuDatatable();
  }
  loadSubMenuDatatable() {
    let that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: that.loginUser.settings.tables_pagination_limit,
      serverSide: true,
      processing: true,
      dom: '<"html5buttons"B>ltfrtip',
      // order: [0],
      // columns: [{
      //   'sortable': true,
      //   'width': '',
      //   'target': [0]
      // }, {
      //   'sortable': true,
      //   'width': '',
      //   'target': [1]
      // }, {
      //   'sortable': false,
      //   'width': '',
      //   'target': [2]
      // }, {
      //   'sortable': false,
      //   'width': '',
      //   'target': [3]
      // },
      // {
      //   'sortable': false,
      //   'width': '5%',
      //   'target': [4]
      // }],
      buttons: [{
        extend: 'csv',
        className: 'btn btn-datatable-gredient',
        action: function (e, dt, node, config) {
          that.exportFiles('csv');
        }
      }, {
        extend: 'excel',
        className: 'btn btn-datatable-gredient',
        action: function (e, dt, node, config) {
          that.exportFiles('xlsx');
        }
      }, {
        extend: 'pdf',
        className: 'btn btn-datatable-gredient',
        action: function (e, dt, node, config) {
          that.exportFiles('pdf');
        }
      }],
      language: {
        'sEmptyTable': this.translate.instant('common.datatable.sEmptyTable'),
        'sInfo': this.translate.instant('common.datatable.sInfo'),
        'sInfoEmpty': this.translate.instant('common.datatable.sInfoEmpty'),
        'sSearch': '',
        'sInfoPostFix': this.translate.instant('common.datatable.sInfoPostFix'),
        'sInfoThousands': this.translate.instant('common.datatable.sInfoThousands'),
        'sLengthMenu': this.translate.instant('common.datatable.sLengthMenu'),
        'sLoadingRecords': this.translate.instant('common.datatable.sLoadingRecords'),
        'sProcessing': this.translate.instant('common.datatable.sProcessing'),
        'sZeroRecords': this.translate.instant('common.datatable.sZeroRecords'),
        'sSearchPlaceholder': this.translate.instant('common.datatable.sSearchPlaceholder'),
        'oPaginate': {
          'sFirst': this.translate.instant('common.datatable.oPaginate.sFirst'),
          'sLast': this.translate.instant('common.datatable.oPaginate.sLast'),
          'sNext': this.translate.instant('common.datatable.oPaginate.sNext'),
          'sPrevious': this.translate.instant('common.datatable.oPaginate.sPrevious')
        },
        'oAria': {
          'sSortAscending': this.translate.instant('common.datatable.oAria.sSortAscending'),
          'sSortDescending': this.translate.instant('common.datatable.oAria.sSortDescending')
        }
      },
      ajax: (dataTablesParameters: any, callback) => {
        dataTablesParameters.menu_id = this.params.get('id');
        this.http.post<DatatablesResponse>(this.apiUrl + '/api/all-web-sub-menu', dataTablesParameters, {}).subscribe(resp => {
          if (resp) {
            this.sub_menus = resp.data;
            this.colspan = resp.colspan;
          }
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data: [],
          });
        });
      }
    };
  }
  exportFiles(type) {
    this.exportAsConfig.type = type;
    this.exportAsService.save(this.exportAsConfig, this.translate.instant('menu.title_sub')).subscribe(() => {
    });
  }
  openSubMenuCreateModal(id){
    if(id){
      let modalConfig = {
          animated: true,
          keyboard: true,
          backdrop: true,
          ignoreBackdropClick: false,
          class: 'inmodal modal-dialog-centered modal-lg animated fadeIn',
          initialState: {
              parent_id: id,
              menu_id: this.params.get('id')
          }
      };
      this.modalRef = this.modalService.show(SubMenuCreateComponent, modalConfig);
    } else {
      this.modalConfigs.initialState.menu_id = this.params.get('id');
      this.modalRef = this.modalService.show(SubMenuCreateComponent, this.modalConfigs);
    }
    this.modalRef.content.event.subscribe(data => {
        this.rerender();
    });
  }
  ngAfterViewInit(): void {
      this.dtTrigger.next();
  }

  ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      console.log(dtInstance);
        dtInstance.destroy();
        setTimeout(() => {
            this.dtTrigger.next();
            if (this.sub_menus.length > 0) {
                $('.tfoot_dt').addClass('d-none');
            } else {
                $('.tfoot_dt').removeClass('d-none');
            }
        });
    });
  }
  openSubMenuEditModal(menu) {
    let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: false,
        class: 'inmodal modal-dialog-centered modal-lg animated fadeIn',
        initialState: {
            menu: menu
        }
    };
    this.modalRef = this.modalService.show(SubMenuEditComponent, modalConfig);
    this.modalRef.content.event.subscribe(data => {
        this.rerender();
    });
  }
  deleteSubMenu(id){
    Swal.fire({
          title: this.translate.instant('common.swal.title'),
          text: this.translate.instant('common.swal.text') + this.translate.instant('menu.title1'),
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: this.translate.instant('common.swal.confirmButtonText'),
          cancelButtonText: this.translate.instant('common.swal.cancelButtonText')
      }).then((result) => {
          if (result.value) {
              this.webMenuService.deleteSubMenu(id)
                  .subscribe(
                      data => {
                          this.toastr.success(this.translate.instant('menu.messages.delete'), this.translate.instant('menu.title'));
                          this.rerender();
                      });
          }
      });
  }
}

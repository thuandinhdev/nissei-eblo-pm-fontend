import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DataTableDirective } from 'angular-datatables';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ExportAsConfig, ExportAsService } from 'ngx-export-as';
import { NgxRolesService } from 'ngx-permissions';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { DatatablesResponse } from 'src/app/core/helpers/datatables-response.helper';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { ItemService } from 'src/app/core/services/item.service';
import { environment } from 'src/environments/environment';
import { CreateSeoComponent } from '../../components/create-seo/create-seo.component';
import { EditSeoComponent } from '../../components/edit-seo/edit-seo.component';
import { SeoService } from 'src/app/core/services/seo.service';

@Component({
  selector: 'app-seo-list',
  templateUrl: './seo-list.component.html',
  styleUrls: ['./seo-list.component.scss']
})
export class SeoListComponent implements OnInit {
  public modalRef: BsModalRef;
  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: any = {};
  seos = [];
  loginUser: any;
  exportAsConfig: ExportAsConfig = {
    type: 'pdf',
    elementIdOrContent: 'seo_table',
  };
  modalConfigs = {
    animated: true,
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: false,
    class: 'inmodal modal-dialog-centered modal-lg animated fadeIn'
  };
  private apiUrl = environment.apiUrl;
  constructor(
    public translate: TranslateService,
    public ngxRolesService: NgxRolesService,
    private http: HttpClient,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private exportAsService: ExportAsService,
    private seoService: SeoService,
    private authenticationService: AuthenticationService,
  ) {
    this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
  }

  ngOnInit() {
    this.loadItemDatatable();
  }
  loadItemDatatable() {
    let that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: that.loginUser.settings.tables_pagination_limit,
      serverSide: true,
      processing: true,
      dom: '<"html5buttons"B>ltfrtip',
      order: [0],
      columns: [{
        'sortable': true,
        'width': '',
        'target': [0]
      }, {
        'sortable': true,
        'width': '',
        'target': [1]
      }, {
        'sortable': false,
        'width': '',
        'target': [2]
      }, {
        'sortable': true,
        'width': '',
        'target': [3]
      }, {
        'sortable': true,
        'width': '',
        'target': [4]
      }, {
        'sortable': false,
        'width': '5%',
        'target': [5]
      }
      ],
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
        this.http.post<DatatablesResponse>(this.apiUrl + '/api/all-seo', dataTablesParameters, {}).subscribe(resp => {
          if (resp) {
            this.seos = resp.data
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
  ngAfterViewInit(): void {
      this.dtTrigger.next();
  }
  exportFiles(type) {
    this.exportAsConfig.type = type;
    this.exportAsService.save(this.exportAsConfig, this.translate.instant('seo.title')).subscribe(() => {
    });
  }
  openSeoCreateModal() {
    this.modalRef = this.modalService.show(CreateSeoComponent, this.modalConfigs);
    this.modalRef.content.event.subscribe(data => {
        this.rerender();
    });
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        setTimeout(() => {
            this.dtTrigger.next();

            if (this.seos.length > 0) {
                $('.tfoot_dt').addClass('d-none');
            } else {
                $('.tfoot_dt').removeClass('d-none');
            }
        });
    });
  }
  openSeoEditModal(seo) {
    let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: false,
        class: 'inmodal modal-dialog-centered modal-lg animated fadeIn',
        initialState: {
            seo: seo
        }
    };

    this.modalRef = this.modalService.show(EditSeoComponent, modalConfig);
    this.modalRef.content.event.subscribe(data => {
        this.rerender();
    });
  }
  deleteSeo(id){
    Swal.fire({
          title: this.translate.instant('common.swal.title'),
          text: this.translate.instant('common.swal.text') + this.translate.instant('seo.title1'),
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: this.translate.instant('common.swal.confirmButtonText'),
          cancelButtonText: this.translate.instant('common.swal.cancelButtonText')
      }).then((result) => {
          if (result.value) {
              this.seoService.delete(id)
                  .subscribe(
                      data => {
                          this.toastr.success(this.translate.instant('seo.messages.delete'), this.translate.instant('seo.title'));
                          this.rerender();
                      });
          }
      });
  }
}

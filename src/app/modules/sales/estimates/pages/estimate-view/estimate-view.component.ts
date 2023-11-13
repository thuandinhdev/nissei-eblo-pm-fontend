import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {ExportAsConfig, ExportAsService} from 'ngx-export-as';
import {TranslateService} from '@ngx-translate/core';

import {AuthenticationService} from '../../../../../core/services/authentication.service';
import {EstimateSettingService} from '../../../../../core/services/estimate-setting.service';
import {EstimateService} from '../../../../../core/services/estimate.service';
import {HelperService} from '../../../../../core/services/helper.service';
import {TaxService} from '../../../../../core/services/tax.service';

import {environment} from '../../../../../../environments/environment';

@Component({
    selector: 'app-estimate-view',
    templateUrl: './estimate-view.component.html',
    styleUrls: ['./estimate-view.component.scss']
})

export class EstimateViewComponent implements OnInit {
    loginUser: any;
    estimate: any;
    taxes: any;
    estimateSettings: any;
    itemTaxes = [];
    taxesNameValues = [];
    isPageLoad = false;
    estimates = {
        sub_total: 0,
        total_taxes: 0,
        total: 0
    };
    exportAsConfig: ExportAsConfig = {
        type: 'pdf',
        elementIdOrContent: 'estimate_table',
    };
    private apiUrl = environment.apiUrl;

    constructor(
        public translate: TranslateService,
        private router: Router,
        private route: ActivatedRoute,
        private toastr: ToastrService,
        private exportAsService: ExportAsService,
        private estimateService: EstimateService,
        private estimateSettingService: EstimateSettingService,
        private taxService: TaxService,
        private helperService: HelperService,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
        this.route.paramMap.subscribe(params => {
            this.getById(params.get('id'));
        });
    }

    ngOnInit() {
        this.getEstimateSettings();
    }

    getById(estimateId) {
        this.estimateService.getById(estimateId).subscribe(data => {
            this.estimate = data;
            this.getTaxes();
        });
    }

    getEstimateSettings() {
        this.estimateSettingService.getAll()
            .subscribe(
                data => {
                    this.estimateSettings = data;
                });
    }

    getTaxes() {
        this.taxService.getAll().subscribe(
            data => {
                this.taxes = data;

                for (let iRow in this.taxes) {
                    if (this.taxesNameValues[this.taxes[iRow].id] == undefined) {
                        this.taxesNameValues[this.taxes[iRow].id] = [];
                    }

                    this.taxesNameValues[this.taxes[iRow].id] = this.taxes[iRow];
                }

                this.getItemTaxes();
            });

    }

    getItemTaxes() {
        this.estimates.sub_total = 0;
        this.estimates.total_taxes = 0;
        this.estimates.total = 0;
        let totalItemAmount = 0;
        let total_discount = 0;

        // --
        // Count item taxes
        for (let iRow in this.estimate.items) {
            totalItemAmount = this.estimate.items[iRow].quantity * this.estimate.items[iRow].unit_price;

            for (let jRow in this.estimate.items[iRow].taxes) {
                let totalTaxes = 0;
                if (this.itemTaxes[this.estimate.items[iRow].taxes[jRow].id] == undefined) {
                    this.itemTaxes[this.estimate.items[iRow].taxes[jRow].id] = 0;
                }

                totalTaxes = (totalItemAmount * this.estimate.items[iRow].taxes[jRow].tax_rate) / 100;
                this.estimates.total_taxes += totalTaxes;

                this.itemTaxes[this.estimate.items[iRow].taxes[jRow].id] = this.itemTaxes[this.estimate.items[iRow].taxes[jRow].id] + totalTaxes;

            }

            // --
            // Count sub total
            this.estimates.sub_total += totalItemAmount;
        }

        // --
        // Count total
        this.estimates.total = (this.estimates.sub_total + this.estimates.total_taxes - this.estimate.total_discount) + this.estimate.adjustment;

        this.isPageLoad = true;
    }

    downloadInvoice(estimateNumber) {
        this.exportAsService.save(this.exportAsConfig, estimateNumber).subscribe(() => {
        });
    }

    changeEstimateStatus(id: any, status: any) {
        this.estimateService.changeStatus({'id': id, 'status': status})
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('estimates.messages.status'), this.translate.instant('estimates.title'));
                    this.estimate.status = status;
                });
    }
}

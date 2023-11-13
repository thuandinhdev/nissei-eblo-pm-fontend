import {Component, Input, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-pm-dashboard-chart1',
    templateUrl: './pm-dashboard-chart1.component.html',
    styleUrls: ['./pm-dashboard-chart1.component.scss']
})

export class PmDashboardChart1Component implements OnInit {
    @Input() projectChartReport: any;
    polarAreaChartLabels: string[] = [];
    polarAreaChartData: number[] = [0, 0, 0];
    polarAreaLegend = true;
    ploarChartColors: any[] = [{
        backgroundColor: ['#1cbcd8', '#ffb136', '#2ecc71']
    }];
    polarAreaChartType = 'polarArea';
    polarChartOptions: any = {
        animation: false,
        responsive: true,
        maintainAspectRatio: false
    };

    constructor(public translate: TranslateService) {
        this.polarAreaChartLabels = [
            this.translate.instant('common.status.open'),
            this.translate.instant('common.status.in_progress'),
            this.translate.instant('common.status.completed')
        ];
    }

    ngOnInit() {
        this.polarAreaChartData = [
            this.projectChartReport.open,
            this.projectChartReport.in_progress + this.projectChartReport.on_hold,
            this.projectChartReport.cancel + this.projectChartReport.completed,
        ];
    }

}

import {Component, Input, OnInit} from '@angular/core';
import {ChartEvent, ChartType} from 'ng-chartist/dist/chartist.component';
import {TranslateService} from '@ngx-translate/core';

import * as Chartist from 'chartist';

import {DashboardService} from './../../../../core/services/dashboard.service';

export interface Chart {
    type: ChartType;
    data: Chartist.IChartistData;
    options?: any;
    responsiveOptions?: any;
    events?: ChartEvent;
}

const data = {'series': []};

@Component({
    selector: 'app-pm-dashboard-charts',
    templateUrl: './pm-dashboard-charts.component.html',
    styleUrls: ['./pm-dashboard-charts.component.scss']
})

export class PmDashboardChartsComponent implements OnInit {
    public donutChart: Chart[];
    @Input() taskReport: any;
    @Input() projectChartReport: any;
    @Input() monthlyReport: any;
    @Input() dashboardSettings;
    taskChartData: any = [0, 0, 0, 0, 0, 0];
    totalPercetangeValue = 0;

    constructor(
        public translate: TranslateService,
        private dashboardService: DashboardService
    ) {
    }

    ngOnInit() {
        this.getTaskCountByStatus();
    }

    getTaskCountByStatus() {
        this.taskReport.forEach(element => {
            this.taskChartData[element.status - 1] = element.total;
        });

        this.totalPercetangeValue = this.taskChartData[0] + this.taskChartData[1] + this.taskChartData[2] + this.taskChartData[3] + this.taskChartData[4] + this.taskChartData[5];

        let that = this,
            inProgressTotal = this.taskChartData[1] + this.taskChartData[2] + this.taskChartData[3],
            totalCounts = this.getPercentage(this.taskChartData[0]) + this.getPercentage(inProgressTotal) + this.getPercentage(this.taskChartData[4]) + this.getPercentage(this.taskChartData[5]);

        data.series = [
            {
                'name': this.translate.instant('common.status.open'),
                'className': 'ct-open',
                'value': this.getPercentage(this.taskChartData[0])
            },
            {
                'name': this.translate.instant('common.status.in_progress'),
                'className': 'ct-progress',
                'value': this.getPercentage(inProgressTotal)
            },
            {
                'name': this.translate.instant('common.status.cancel'),
                'className': 'ct-cancel',
                'value': this.getPercentage(this.taskChartData[4])
            },
            {
                'name': this.translate.instant('common.status.completed'),
                'className': 'ct-completed',
                'value': this.getPercentage(this.taskChartData[5])
            }
        ];

        this.donutChart = [{
            type: 'Pie',
            data: data,
            options: {
                donut: true,
                startAngle: 0,
                labelInterpolationFnc: function (value) {
                    let total = data.series.reduce(function (prev, series) {
                        return prev + series.value;
                    }, 0);

                    if (isNaN(Math.round(totalCounts))) {
                        return '0%';
                    } else {
                        return Math.round(totalCounts) + '%';
                    }
                }
            },
            events: {
                draw(data: any): void {
                    if (data.type === 'label') {
                        if (data.index === 0) {
                            data.element.attr({
                                dx: data.element.root().width() / 2,
                                dy: data.element.root().height() / 2
                            });
                        } else {
                            data.element.remove();
                        }
                    }

                }
            }
        }];
    }

    getPercentage(num = 0) {
        if (isNaN((100 * num) / this.totalPercetangeValue)) {
            return 0;
        } else {
            return (100 * num) / this.totalPercetangeValue;
        }
    }
}

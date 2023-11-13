import {Component, OnInit} from '@angular/core';

import {SettingService} from '../../services/setting.service';

import {detectBody} from '../../../core/helpers/app.helper';

@Component({
    selector: 'app-basic-layout',
    templateUrl: './basic-layout.component.html',
    styleUrls: ['./basic-layout.component.scss'],
    host: {
        '(window:resize)': 'onResize()'
    }
})

export class BasicLayoutComponent implements OnInit {
    settings: any;
    isSettingsLoad: boolean;

    /**
     *    @class BasicLayoutComponent
     *    @constructor
     */
    constructor(private settingService: SettingService) {
        this.getSettings();
    }

    /**
     *    Invoked only once when the component/directive is instantiated.
     *
     *    @class BasicLayoutComponent
     *    @method ngOnInit
     */
    public ngOnInit(): any {
        detectBody();
    }

    /**
     *    Invoked only when browser resize
     *
     *    @class BasicLayoutComponent
     *    @method onResize
     */
    public onResize() {
        detectBody();
    }

    getSettings() {
        this.settingService.getAll()
            .subscribe(
                data => {
                    this.settings = data;
                    this.isSettingsLoad = true;
                });
    }


}

import {Component, Input, OnInit, Renderer2} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {NgxPermissionsService} from 'ngx-permissions';
import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';
import {TranslateService} from '@ngx-translate/core';

import {SettingService} from '../../../core/services/setting.service';

import {
    sidebarBGColors,
    sidebarBGDefaultImages,
    sidebarBGGradientColors,
    transparentBGColors,
    transparentBGImages
} from '../../../core/helpers/pm-helper';
import {collapsedMenu} from '../../../core/helpers/app.helper';
import {environment} from 'src/environments/environment';

declare let $: any;

@Component({
    selector: 'app-theme-settings',
    templateUrl: './theme-settings.component.html',
    styleUrls: ['./theme-settings.component.scss']
})

export class ThemeSettingsComponent implements OnInit {
    public scrollConfig: PerfectScrollbarConfigInterface = {};
    @Input() settings;
    permissions: any;
    itemsPerSlide = 3;
    showIndicator = true;
    sidebarBGImages = [];
    sidebarBGDefaultImages = sidebarBGDefaultImages;
    sidebarBGGradientColors = sidebarBGGradientColors;
    sidebarBGColors = sidebarBGColors;
    transparentBGColors = transparentBGColors;
    transparentBGImages = transparentBGImages;
    private apiUrl = environment.apiUrl;

    constructor(
        public translate: TranslateService,
        private renderer: Renderer2,
        private ngxPermissionsService: NgxPermissionsService,
        private toastr: ToastrService,
        private settingService: SettingService
    ) {
        let permissions = this.ngxPermissionsService.getPermissions();
        this.ngxPermissionsService.permissions$.subscribe((permissions) => {
            this.permissions = permissions;
        });
    }

    ngOnInit() {
        let body = $('body'),
            default_sidebar_bg_color = $('.app-sidebar').attr('data-background-color'),
            default_sidebar_bg_image = $('.app-sidebar').attr('data-image');

        // --
        // Default select colors/Background image
        $('.sidebar-bg-color span[data-bg-color="' + default_sidebar_bg_color + '"]').addClass('selected');
        $('.sidebar-bg-image img[src$="' + default_sidebar_bg_image + '"]').addClass('selected');

        this.getSettings();
    }

    // --
    // Close theme settings
    closeThemeSettings() {
        $('.theme-settings').removeClass('open');
    }

    // --
    // Collapsed menu
    changeCollapsedMenu($event) {
        if (this.saveSettings(this.settings)) {
            this.setCollapsedMenu(this.settings.is_collapsed_menu);
        } else {
            return false;
        }
    }

    setCollapsedMenu(isCollapsed) {
        let collapsedValue = false;
        if (isCollapsed || isCollapsed == 1) {
            collapsedValue = true;
        }

        collapsedMenu(collapsedValue);
        if (isCollapsed) {
            $('.app-sidebar').trigger('mouseleave');
        }
    }

    // --
    // Sidebar width
    changeSidebarWidth($event) {
        if (this.saveSettings(this.settings)) {
            this.setSidebarWidth(this.settings.sidebar_width);
        } else {
            return false;
        }
    }

    setSidebarWidth(width) {
        let wrapper = $('.wrapper');
        switch (width) {
            case 'small':
                $(wrapper).removeClass('sidebar-lg').addClass('sidebar-sm');
                break;
            case 'large':
                $(wrapper).removeClass('sidebar-sm').addClass('sidebar-lg');
                break;
            default:
                $(wrapper).removeClass('sidebar-sm sidebar-lg');
                break;
        }
    }

    /**
     *    Change layout options [Dark, Light, Transparent]
     *
     *    @class ColorPalettesComponent
     *    @method changeBGColorLayout
     *    @param {newValue} value
     */
    changeBGColorLayout(newValue) {
        if (this.saveSettings(this.settings)) {
            this.setThemeLayout(newValue.key);
        }
    }

    /**
     *    Change layout options
     *
     *    @class ColorPalettesComponent
     *    @method changeBGColorLayout
     *    @param {layout} [Dark, Light, Transparent]
     *    @param {isLoaded} boolean
     */
    setThemeLayout(layout, isLoaded = false) {
        switch (layout) {
            case 'light':
                this.removeBackgroundColor();
                this.removeTransparentColors();
                this.renderer.removeClass(document.body, 'dark');
                this.renderer.removeClass(document.body, 'transparent');

                if (isLoaded) {
                    this.setSidebarBGImageColor(this.settings);
                }
                break;
            case 'dark':
                this.removeBackgroundColor();
                this.removeTransparentColors();
                this.renderer.removeClass(document.body, 'transparent');
                this.renderer.addClass(document.body, 'dark');

                if (isLoaded) {
                    this.setSidebarBGImageColor(this.settings);
                }
                break;
            case 'transparent':
                this.removeBackgroundColor();
                this.removeTransparentColors();
                this.renderer.addClass(document.body, 'dark');
                this.renderer.addClass(document.body, 'transparent');

                if (isLoaded) {
                    this.selectTransparentBGImage(this.settings);
                }
                break;
            case 'custom-colors':
                this.removeTransparentColors();
                $('.app-sidebar').attr('data-background-color', 'black');
                this.renderer.removeClass(document.body, 'dark');
                this.renderer.removeClass(document.body, 'transparent');

                if (isLoaded) {
                    this.setCustomSidebarColorFonts(this.settings);
                }
                break;
            default:
                break;
        }
    }

    /**
     *    Change sidebar gradient color
     *
     *    @class ColorPalettesComponent
     *    @method selectSidebarBGGradientColor
     *    @param {bgColor} color
     */
    selectSidebarBGGradientColor(bgColor) {
        this.settings.sidebar_bg_color = bgColor;
        if (this.saveSettings(this.settings)) {
            $('.app-sidebar').attr('data-background-color', bgColor);
        }
    }

    /**
     *    Set sidebar background image
     *
     *    @class ColorPalettesComponent
     *    @method setSidebarBGImageColor
     *    @param {settings} settings
     */
    setSidebarBGImageColor(settings) {
        $('.app-sidebar').attr('data-background-color', settings.sidebar_bg_color);
        if (settings.sidebar_bg_color == 'white') {
            $('.logo-img img').attr('src', 'assets/img/logos/vipspm-dark-logo.png');
        } else {
            if ($('.logo-img img').attr('src') == 'assets/img/logos/vipspm-dark-logo.png') {
                $('.logo-img img').attr('src', 'assets/img/logos/vipspm-white-logo.png');
            }
        }
        if (this.sidebarBGImages[settings.sidebar_bg_image]) {
            this.setBgImage(settings.is_sidebar_background);
            $('.sidebar-background').css('background-image', 'url(' + this.sidebarBGImages[settings.sidebar_bg_image].image + ')');
        }
    }

    /**
     *    Change sidebar background color
     *
     *    @class ColorPalettesComponent
     *    @method selectSidebarBGColor
     *    @param {bgColor} color
     */
    selectSidebarBGColor(bgColor) {
        this.settings.sidebar_bg_color = bgColor;
        if (this.saveSettings(this.settings)) {
            $('.app-sidebar').attr('data-background-color', bgColor);
            if (bgColor == 'white') {
                $('.logo-img img').attr('src', 'assets/img/logos/vipspm-dark-logo.png');
            } else {
                if ($('.logo-img img').attr('src') == 'assets/img/logos/vipspm-dark-logo.png') {
                    $('.logo-img img').attr('src', 'assets/img/logos/vipspm-white-logo.png');
                }
            }
        }
    }

    /**
     *    Change sidebar background image
     *
     *    @class ColorPalettesComponent
     *    @method selectSidebarBGImage
     *    @param {index} index number
     */
    selectSidebarBGImage(index: number) {
        this.settings.sidebar_bg_image = index;
        if (this.saveSettings(this.settings)) {
            $('.sidebar-background').css('background-image', 'url(' + this.sidebarBGImages[index].image + ')');
        }
    }

    /**
     *    Select trasparent background
     *
     *    @class ColorPalettesComponent
     *    @method selectTransparentBGColor
     *    @param {bgColor} color
     */
    selectTransparentBGColor(bgColor) {
        this.settings.sidebar_bg_color = bgColor;
        if (this.saveSettings(this.settings)) {
            this.removeTransparentColors();
            this.renderer.addClass(document.body, bgColor);
        }
    }

    /**
     *    Change trasparent background image
     *
     *    @class ColorPalettesComponent
     *    @method selectTrasparentBGImage
     *    @param {bgImage} image
     */
    selectTrasparentBGImage(bgImage) {
        this.settings.sidebar_transparent_bg_image = bgImage;
        if (this.saveSettings(this.settings)) {
            this.removeTransparentColors();
            this.renderer.addClass(document.body, bgImage);
        }
    }

    /**
     *    Set trasparent background image
     *
     *    @class ColorPalettesComponent
     *    @method selectTransparentBGImage
     *    @param {settings} settings
     */
    selectTransparentBGImage(settings) {
        this.removeTransparentColors();
        this.renderer.addClass(document.body, settings.sidebar_bg_color);
        this.renderer.addClass(document.body, settings.sidebar_transparent_bg_image);
    }

    /**
     *    Remove trasparent background color
     *
     *    @class ColorPalettesComponent
     *    @method removeTransparentColors
     */
    removeTransparentColors() {
        for (let iRow in this.transparentBGColors) {
            this.renderer.removeClass(document.body, this.transparentBGColors[iRow].key);
        }
        for (let iRow in this.transparentBGImages) {
            this.renderer.removeClass(document.body, this.transparentBGImages[iRow].class);
        }
    }

    /**
     *    Change sidebar
     *
     *    @class ColorPalettesComponent
     *    @method changeSidebarTransparentColors
     */
    changeSidebarTransparentColors($event) {
        $('.sidebar-background').css('display', 'none');
        $('.app-sidebar').css('background-color', $event);
    }

    selectSidebarTransparentFontColor(bgColor) {
        this.settings.sidebar_font_color = bgColor;
        if (this.saveSettings(this.settings)) {
            $('.app-sidebar').attr('data-background-color', bgColor);
        }
    }

    selectSidebarTransparentColors($event) {
        this.settings.sidebar_bg_custom_color = $event;
        if (this.saveSettings(this.settings)) {
            $('.sidebar-background').css('display', 'none');
            $('.app-sidebar').css('background-color', $event);
        }
    }

    setCustomSidebarColorFonts(settings) {
        $('.sidebar-background').css('display', 'none');
        $('.app-sidebar').css('background-color', settings.sidebar_bg_custom_color);
        $('.app-sidebar').attr('data-background-color', settings.sidebar_font_color);
    }

    // --
    // Others
    removeBackgroundColor() {
        $('.sidebar-background').css('display', 'block');
        $('.app-sidebar').css('background-color', '');
    }

    changeBGImage(event) {
        if (this.saveSettings(this.settings)) {
            this.setBgImage(this.settings.is_sidebar_background);
        }
    }

    setBgImage(isImageSelect) {
        if (isImageSelect) {
            $('.sidebar-background').css('display', 'block');
        } else {
            $('.sidebar-background').css('display', 'none');
        }
    }

    setBGImages() {
        if (this.settings.sidebar_background_images && typeof this.settings.sidebar_background_images == 'string') {
            JSON.parse(this.settings.sidebar_background_images).forEach(element => {
                let imgUrl = this.apiUrl + '/uploads/sidebar_background_images/' + element;
                this.sidebarBGImages.push({image: imgUrl});
            });
        } else {
            this.sidebarBGImages = this.sidebarBGDefaultImages;
        }

        this.setThemeLayout(this.settings.theme_layout, true);

        if (this.sidebarBGImages[this.settings.sidebar_bg_image] && this.sidebarBGImages[this.settings.sidebar_bg_image].image) {
            $('.sidebar-background').css('background-image', 'url(' + this.sidebarBGImages[this.settings.sidebar_bg_image].image + ')');
        }
    }

    // --
    // Others
    getSettings() {
        this.setSidebarWidth(this.settings.sidebar_width);
        this.setCollapsedMenu(this.settings.is_collapsed_menu);
        this.setBGImages();
    }

    saveSettings(settings) {
        // if (!this.permissions.themesettings_create || !this.permissions.themesettings_edit) {
        //     return false;
        // }

        return this.settingService.create(settings).subscribe(data => {
            return true;
            this.toastr.success(this.translate.instant('settings.messages.update'), this.translate.instant('settings.title'));
        }, data => {
            return false;
        });

    }
}

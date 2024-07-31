import { Component, OnInit } from '@angular/core';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-confirm-component',
  templateUrl: './confirm-component.component.html',
  styleUrls: ['./confirm-component.component.scss']
})
export class ConfirmComponentComponent implements OnInit{
    ticket: any;
    constructor(
        public themeService: CustomizerSettingsService,
        private route: ActivatedRoute,
    ) {}

    toggleTheme() {
        this.themeService.toggleTheme();
    }

    toggleCardBorderTheme() {
        this.themeService.toggleCardBorderTheme();
    }

    toggleCardBorderRadiusTheme() {
        this.themeService.toggleCardBorderRadiusTheme();
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.ticket = JSON.parse(params['ticket']);
        });
    }

}

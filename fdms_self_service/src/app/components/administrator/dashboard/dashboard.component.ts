import {Component, OnInit} from '@angular/core';
import {CustomizerSettingsService} from "../../customizer-settings/customizer-settings.service";
import {AppServiceService} from "../../../services/app-service.service";
import {Router} from "@angular/router";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{
    parentEvents: any[] = [];
    loadingData: boolean = false;
    expandedIndex = 0;
    panelOpenState = false;
    constructor(
        public themeService: CustomizerSettingsService,
        public appService: AppServiceService,
        private router: Router,
        private datePipe: DatePipe,
    ) {
    }

    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }

    formatDate(dateString: string): string {
        // Parse the input date into a JavaScript Date object
        const date = new Date(dateString);

        // Use the DatePipe to format the date as "dd MMM yyyy"
        return <string>this.datePipe.transform(date, 'dd/MM/yyyy');
    }

    //get parent events


    // navigate to events using parent id
    navigateToEvents(parentId: number) {
        this.router.navigate([`/administrator/events`], { queryParams: { parentId } });
    }

    navigateToSupport() {
        this.router.navigate([`/help-desk`]);
    }

    navigateToFiscalisation() {
        this.router.navigate([`main-container`]);
    }

    navigateToClientTransactions() {
        this.router.navigate([`/client-transactions`],);
    }
        navigateToClientSuppliers() {
        this.router.navigate([`/client-suppliers`],);
    }
    
    navigateToClientBuyers() {
        this.router.navigate([`/client-buyers`],);
    }

    ngOnInit(): void {
        // Check if the page has been reloaded
        const hasReloaded = localStorage.getItem('hasReloaded');

        if (!hasReloaded) {
            // Set the flag to indicate that the page has been reloaded
            localStorage.setItem('hasReloaded', 'true');

            // Reload the page
            window.location.reload();
        }

        // Your other initialization logic here
        localStorage.setItem('isSidebarDarkTheme', 'true');
        localStorage.setItem('isCardBorderTheme', 'true');
    }
}

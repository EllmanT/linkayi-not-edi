import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
 import {LoginComponent} from './components/authentication/login/login.component';
// import { LoginComponent } from './components/login/login.component';
import {InternalErrorComponent} from './components/common/internal-error/internal-error.component';
import {NotFoundComponent} from './components/common/not-found/not-found.component';
import {AuthGuard} from "./auth.guard";
// import { AuthGuard } from './auth/auth.guard';
import {DashboardComponent} from "./components/administrator/dashboard/dashboard.component";
import {LogoutComponent} from "./components/authentication/logout/logout.component";
import { StepperComponent } from './components/administrator/stepper/stepper.component';
import { HelpDeskComponent } from './components/administrator/help-desk/help-desk.component';
import { TicketChecker2000Component } from './components/administrator/ticket-checker2000/ticket-checker2000.component';
import { ConfirmComponentComponent } from './components/administrator/confirm-component/confirm-component.component';
import {MainComponent} from "./components/docsAi/main/main.component";
import {TablesComponent} from "./components/docsAi/tables/tables.component";
import {KeyValuePairsComponent} from "./components/docsAi/key-value-pairs/key-value-pairs.component";
import {FileUploadComponent} from "./components/docsAi/file-upload/file-upload.component";
import { CloseDayComponent } from './components/close-day/close-day.component';
import { SupplierRegistrationComponent } from './components/supplier-registration/supplier-registration.component';
import { ClientBuyersComponent } from './components/client-buyers/client-buyers.component';
import { ClientSuppliersComponent } from './components/client-suppliers/client-suppliers.component';
import { PendingInvoicesComponent } from './components/pending-invoices/pending-invoices.component';
import { ClientAllReceiptsComponent } from './components/all-receipts/client-all-receipts.component';
import { ClientDetailsComponent } from './components/client-details/client-details.component';
import { LoginLayoutComponent } from './components/login/login-layout';

const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        canActivate: [AuthGuard],

    },
    {
        
        path: 'app-login',
        component: LoginComponent,

    },

    // {
    //     path: '',
    //     component: LoginLayoutComponent,
    //     children: [
    //       { path: 'app-login', component: LoginComponent },
    //     ],
    //   },

    {
        path: 'templates',
        component: FileUploadComponent,
        canActivate: [AuthGuard],

    },

    {
        path: 'tables',
        component: TablesComponent,
        
    },

    {
        path: 'key-value-pairs',
        component: KeyValuePairsComponent,
    },

    {
        path: 'main-container',
        component: StepperComponent,
    },
    {
        path: 'help-desk',
        component: HelpDeskComponent,
    },
    {
        path: 'close-day',
        component: CloseDayComponent,
    },
    // {
    //     path: 'supplier-registration',
    //     component: SupplierRegistrationComponent,
    //     canActivate: [AuthGuard],

    // },
    {
        path: 'client-details',
        component: ClientDetailsComponent,
        canActivate: [AuthGuard],

    },
    {
        path: 'client-buyers',
        component: ClientBuyersComponent,
        canActivate: [AuthGuard],

    },
    {
        path: 'client-suppliers',
        component: ClientSuppliersComponent,
        canActivate: [AuthGuard],

    },
    {
        path: 'pending-invoices',
        component: PendingInvoicesComponent,
        canActivate: [AuthGuard],

    },
    {
        path: 'client-all-receipts',
        component: ClientAllReceiptsComponent,
        canActivate: [AuthGuard],

    },
    {
        path: 'ticket-checker-2000',
        component: TicketChecker2000Component,
    },
    {
        path: 'administrator-dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],

    },
    {
        path: 'confirm-request',
        component: ConfirmComponentComponent,
    },
    {
        path: 'error-500', component: InternalErrorComponent, canActivate: [AuthGuard],
    },
    {
        path: 'authentication/logout', component: LogoutComponent, canActivate: [AuthGuard],
    },
    {
        path: 'authentication/login',
        component: LoginComponent,
        // canActivate: [LoginAuthGuard],
    },
    {
        path: '**',
        component: NotFoundComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
    exports: [RouterModule]
})
export class AppRoutingModule {
}

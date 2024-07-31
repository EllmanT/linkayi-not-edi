import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MatMenuModule } from '@angular/material/menu';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { NgxEditorModule } from 'ngx-editor';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { MatCardModule } from '@angular/material/card';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgApexchartsModule } from "ng-apexcharts";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import {MatCalendar, MatDatepickerModule} from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatRippleModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxGaugeModule } from 'ngx-gauge';
import { NgChartsModule } from 'ng2-charts';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { QuillModule } from 'ngx-quill';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ColorPickerModule } from 'ngx-color-picker';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarComponent } from './components/common/sidebar/sidebar.component';
import { FooterComponent } from './components/common/footer/footer.component';
import { HeaderComponent } from './components/common/header/header.component';
import {DashboardComponent} from "./components/administrator/dashboard/dashboard.component";
import {AuthInterceptor} from "./auth.interceptor";
import {CustomizerSettingsComponent} from "./components/customizer-settings/customizer-settings.component";
import {LoginComponent} from "./components/authentication/login/login.component";
// import { RevmaxFormComponent } from './components/administrator/revmax-form/revmax-form.component';
import { StepperComponent } from './components/administrator/stepper/stepper.component';
// import { MainContainerComponent } from './components/administrator/main-container/main-container.component';
import { RegistrationFormComponent } from './components/administrator/registration-form/registration-form.component';
import { HelpDeskComponent } from './components/administrator/help-desk/help-desk.component';
import { ConfirmComponentComponent } from './components/administrator/confirm-component/confirm-component.component';
import { TicketChecker2000Component } from './components/administrator/ticket-checker2000/ticket-checker2000.component';
import {MainComponent} from "./components/docsAi/main/main.component";
import {TablesComponent} from "./components/docsAi/tables/tables.component";
import {DocumentNavComponent} from "./components/docsAi/document-nav/document-nav.component";
import {
    LinkillustrationComponent
} from "./components/docsAi/linking-components/linkillustration/linkillustration.component";
import {FileUploadComponent} from "./components/docsAi/file-upload/file-upload.component";
import { DataTableModule } from './components/common/components/data-table/data-table.module';
import { ComponentsModule } from './components/common/components/components.module';
// import { DataTableModule } from './components/common/components/data-table/data-table.module';

// import { DisplayCompanyDetailsComponent } from './components/administrator/display-company-details/display-company-details.component';

@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        SidebarComponent,
        FooterComponent,
        HeaderComponent,
        CustomizerSettingsComponent,
        LoginComponent,
        // RevmaxFormComponent,
        StepperComponent,
        // MainContainerComponent,
        RegistrationFormComponent,
        HelpDeskComponent,
        ConfirmComponentComponent,
        TicketChecker2000Component,
        // DisplayCompanyDetailsComponent,
        MainComponent,
        TablesComponent,
        DocumentNavComponent,
        FileUploadComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        MatMenuModule,
        MatCardModule,
        MatTableModule,
        MatPaginatorModule,
        BrowserAnimationsModule,
        NgApexchartsModule,
        MatProgressBarModule,
        MatButtonModule,
        MatAutocompleteModule,
        MatBadgeModule,
        MatBottomSheetModule,
        MatButtonToggleModule,
        MatCheckboxModule,
        MatChipsModule,
        MatDatepickerModule,
        MatDialogModule,
        MatDividerModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSlideToggleModule,
        MatSliderModule,
        MatSnackBarModule,
        MatSortModule,
        MatStepperModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        MatTreeModule,
        NgScrollbarModule,
        FormsModule,
        MatNativeDateModule,
        ReactiveFormsModule,
        CarouselModule,
        NgxEditorModule,
        DragDropModule,
        HttpClientModule,
        CdkAccordionModule,
        NgxEchartsModule.forRoot({
            echarts: () => import('echarts')
        }),
        NgxGaugeModule,
        NgChartsModule,
        NgxMatTimepickerModule,
        QuillModule.forRoot(),
        NgxDropzoneModule,
        ColorPickerModule,
        LinkillustrationComponent,
        DataTableModule,
        ComponentsModule,


    ],
    providers: [
        DatePipe,
        MatCalendar,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

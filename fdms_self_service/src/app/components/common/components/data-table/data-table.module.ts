import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DataTableComponent} from "./data-table.component";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
// import {NgxD}
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatTooltipModule} from "@angular/material/tooltip";
// import {GetTableDataPipe} from "../../pipes/get-table-data.pipe";
import { GetTableDataPipe } from 'src/app/pipes/get-table-data.pipe';

@NgModule({
  declarations: [
    DataTableComponent,
    GetTableDataPipe,

  ],
  exports: [
    DataTableComponent
  ],
    imports: [
        CommonModule,
        NgxDatatableModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
    ]
})
export class DataTableModule { }

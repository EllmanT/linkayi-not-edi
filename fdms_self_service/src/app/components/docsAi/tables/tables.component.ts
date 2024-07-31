import {Component, Input, OnInit} from '@angular/core';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from "@angular/material/table";
import {NgForOf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.css'
})
export class TablesComponent implements OnInit{
  @Input() data: any | undefined;

  dataSource= new MatTableDataSource<any>();
  displayedColumns: string[] | any;

  constructor(
      private route: ActivatedRoute
  ) {
  }
  ngOnInit(): void {
      // this.route.queryParams.subscribe(params => {
      //       if ( params['data']){
      //           this.data = params['data'];
      //       }
      // });
    if (this.data && this.data.length > 0) {
      // Extract columns from the first row
      this.displayedColumns = Object.keys(this.data[0]);

      // Create MatTableDataSource with the provided data
      this.dataSource.data = this.data;
    }
  }
}

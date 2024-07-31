import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import {DataTableService} from "./data-table.service";
import { TableData } from 'src/app/models/TableData';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {

  @Input() data: TableData
  @Output() actions = new EventEmitter();
  apiData: any;

  loadingIndicator = true;
  ColumnMode = ColumnMode;

  constructor(
    private dataTableService: DataTableService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.apiData = await this.dataTableService.getData(this.data.api, this.data?.params);
  }

  postAction(eventType: string, row: any) {
  this.actions.emit({eventType: eventType, data: row});
}
}

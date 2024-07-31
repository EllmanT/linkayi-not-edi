import { Component, OnInit } from '@angular/core';
import { TableData } from 'src/app/models/TableData';
import { FormField } from 'src/app/models/FormField';
import { ApiService } from 'src/app/services/api-service.service';
import {MatDialog} from "@angular/material/dialog";
import { MatButtonModule } from '@angular/material/button';
import { AddGenericComponent } from '../common/components/add-generic/add-generic.component';
import { DataTableModule } from '../common/components/data-table/data-table.module';
import { MatCardModule } from '@angular/material/card';
// import { MatCardModule } from '@angular/material/card';
@Component({
  selector: 'client-suppliers',
  standalone: true,
  imports: [
    MatButtonModule, 
    DataTableModule,
    MatCardModule,
  ],
  templateUrl: './client-suppliers.component.html',
  styleUrl: './client-suppliers.component.scss'
})
export class ClientSuppliersComponent implements OnInit {
// clientTIN :string 

clientTIN:string = localStorage.getItem('token')||"";

  data: TableData = {
    title: '',
    api: 'clients/GetReceiptsBySupplierTIN',
    type: 'client-supplier',
    columns: ['receiptDate', 'supplierTin','receiptTotal','currency','status',],
    actions: true,
    params: `clientTIN=${this.clientTIN}`  
  };

  formFields: FormField[] = [
    { name: 'companyName', type: 'text', label: 'Company Name' },
    { name: 'description', type: 'text', label: 'Description' },
  ];

  private updateId: any;

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,

  ) { }



  ngOnInit(): void {
    // this.clientTIN = localStorage.getItem('token');
    
  }

  async handleAction(event: { eventType: string, data: any }) {
    if (event.eventType === 'delete') {
      const response = await this.apiService.makeRequest('delete', `company/product-categories/${event.data.id}`);
    }

    if (event.eventType === 'edit') {
      this.formFields.forEach(field => {
        field.value = event.data[field.name];
      });

      this.updateId = event.data.id;
      this.edit();
    }

    if (event.data.eventType == 'put') {
      await this.apiService.makeRequest('put', `company/product-categories/${this.updateId}`, event.data.data);
    }

    if (event.eventType === 'submit') {
      await this.apiService.makeRequest('post', 'company/product-categories', event.data);
    }
  }

  addRole() {
    const dialogRef = this.dialog.open(AddGenericComponent, {
      width: '800px',
      disableClose: true,
      data: {stepper: false,formFields: this.formFields},
    });

    dialogRef.afterClosed().subscribe(async (eventData: any) => {
      if (eventData) {
        await this.handleAction(eventData)
      }
    })
  }

  edit() {
    const dialogRef = this.dialog.open(AddGenericComponent, {
      width: '800px',
      disableClose: true,
      data: {stepper: false,formFields: this.formFields, edit: true,},
    });

    dialogRef.afterClosed().subscribe(async (eventData: any) => {
      if (eventData) {
        await this.handleAction(eventData)
      }
    })
  }


}
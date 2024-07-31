import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { FormField } from 'src/app/models/FormField';
import { AddGenericData } from 'src/app/models/AddGenericData';
@Component({
  selector: 'app-add-generic',
  templateUrl: './add-generic.component.html',
  styleUrls: ['./add-generic.component.scss']
})
export class AddGenericComponent implements OnInit {

  @Input() data: AddGenericData;
  @Output() formData = new EventEmitter<any>();
  constructor(
    private readonly dialogRef: MatDialogRef<AddGenericData>,
    @Inject(MAT_DIALOG_DATA) public formFields: {stepper: boolean, formFields: FormField[] | [{step: string, formFields: FormField[]}], edit: boolean,},

  ) { }

  ngOnInit(): void {
  }

  handleFormData(data: any): void {
    if (data.eventType === 'close' || data.eventType === 'cancel') {
      this.dialogRef.close();
    }

    if (data.eventType === 'submit') {
      this.formData.emit(data);
      this.dialogRef.close(data);
    }

    if (data.eventType === 'put') {
      this.formData.emit(data);
      this.dialogRef.close({data});
    }
  }

  close(){
    this.dialogRef.close()
  }
}

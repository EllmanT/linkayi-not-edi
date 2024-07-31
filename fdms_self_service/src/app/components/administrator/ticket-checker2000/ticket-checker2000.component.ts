import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppServiceService } from '../../../services/app-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DocumentsAiServiceService } from '../../../services/documents-ai-service.service';

@Component({
  selector: 'app-ticket-checker2000',
  templateUrl: './ticket-checker2000.component.html',
  styleUrls: ['./ticket-checker2000.component.scss']
})
export class TicketChecker2000Component implements OnInit{
    ticketNumber: FormGroup;
    isLoading = false;
    ticketData: any | undefined = null;
    isError = false;

    constructor(
        private _formBuilder: FormBuilder,
        private apiService: AppServiceService,
        private snackbar: MatSnackBar,
        private docsAi: DocumentsAiServiceService
    ) {

    }
    ngOnInit(): void {
        this.ticketNumber = this._formBuilder.group({
            id: ['', Validators.required],
        });
    }
    public get id(): AbstractControl {
        return this.ticketNumber.get('id')!;
    }

    onSubmit() {
        this.isLoading = true;
        this.isError = false;
        this.ticketData = null;
        const id = this.id.getRawValue()

        if (id){
            this.apiService.getTicketStatus(id).subscribe((response) => {
                this.ticketData = response
                console.log(response);
                if (response){
                    this.ticketData = response?.request;
                }
                this.isLoading = false;
            }, error => {
                console.log(error);
                this.isError = true;
                this.snackbar.open("error, could no retrieve ticket",'close',{duration : 6000})
                this.isLoading = false;
            })
        }
    }
}

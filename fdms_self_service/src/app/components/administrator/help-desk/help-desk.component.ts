import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppServiceService } from '../../../services/app-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-help-desk',
  templateUrl: './help-desk.component.html',
  styleUrls: ['./help-desk.component.scss']
})
export class HelpDeskComponent implements OnInit{
    helpDeskForm: FormGroup;
    isLoading = false;
    constructor(
        private _formBuilder: FormBuilder,
        private snackBar: MatSnackBar,
        private appService: AppServiceService,
        private router: Router,
    ) {

    }

    ngOnInit(): void {
        this.helpDeskForm = this._formBuilder.group({
            phone: ['', Validators.required],
            email: ['', Validators.required],
            category: ['', Validators.required],
            company: ['', Validators.required],
            description: ['', Validators.required],
        })    }

    onSubmit(){
        this.isLoading = true;
        if (!this.helpDeskForm.valid){
            this.snackBar.open('Please fill in all inputs','close',{duration : 6000})
            return;
        }

        const regData = this.helpDeskForm.getRawValue();

        const request = {
            request: {
                subject: regData.category,
                description: regData.description,
                requester: {
                    name: regData.company
                },
                status: {
                    name: 'Open'
                },
                category: {
                    name: regData.category
                },
                // template: {
                //     name: 'Capture Support Ticket'
                // },
                udf_fields: {
                    udf_sline_301: regData.company,
                    udf_long_306: regData.phone,
                    udf_sline_307: regData.email,
                }
            }
        };
        console.log(request);

        this.appService.postTicket(request).subscribe((response) => {
            console.log('response: ', response);
            this.isLoading = false;
            this.helpDeskForm.reset();

            const params = {
                ticket: response.request.id
            };
            this.routerNavigstion('/confirm-request', params);

        },
            error =>{
                this.isLoading = false;
                this.snackBar.open("error, request not sent",'close',{duration : 6000})
                console.log(error);
            })
    }
    routerNavigstion(path: string, params?: any) {
        this.router.navigate([path], {
            queryParams: params,
        });
    }
    public get phone(): AbstractControl {
        return this.helpDeskForm.get('phone')!;
    }
    public get email(): AbstractControl {
        return this.helpDeskForm.get('email')!;
    }
    public get category(): AbstractControl {
        return this.helpDeskForm.get('category')!;
    }
    public get company(): AbstractControl {
        return this.helpDeskForm.get('company')!;
    }
    public get description(): AbstractControl {
        return this.helpDeskForm.get('description')!;
    }
}

import { Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { forkJoin, Observable, of, tap } from 'rxjs';
import { StepperOrientation } from '@angular/cdk/stepper';
import { BreakpointObserver } from '@angular/cdk/layout';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from '../api.service';
import { AppServiceService } from '../../../services/app-service.service';
import { MatStepper } from '@angular/material/stepper';
import { RegistrationFormComponent } from '../registration-form/registration-form.component';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent {
    firstFormGroup = this._formBuilder.group({
        firstCtrl: ['', Validators.required],
    });
    secondFormGroup = this._formBuilder.group({
        secondCtrl: ['', Validators.required],
    });
    thirdFormGroup = this._formBuilder.group({
        thirdCtrl: ['', Validators.required],
    });
    stepperOrientation: Observable<StepperOrientation>;
    // companyAlreadyExists = false;

    companyAlreadyExists = false;

    firstStepCompleted = false;
    secondStepCompleted = false;
    thirdStepCompleted = false;


    updateStatus = false
    company: any;
    companySuccess = false;
    companyFail = false;
    loading = false;
    companyDetail: any;
    isLoading = false;
    @ViewChild('stepper') stepper: MatStepper;

    constructor(
        private _formBuilder: FormBuilder,
        breakpointObserver: BreakpointObserver,
        private appService: AppServiceService,
        private router: Router,
        private snackBar: MatSnackBar,
    ) {
        this.stepperOrientation = breakpointObserver
            .observe('(min-width: 800px)')
            .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));
    }

    registerButtonClicked(stepper: MatStepper) {
        stepper.selected!.completed = true
        stepper.selectedIndex = 1;
        stepper.selected!.completed = true
        stepper.next();
        this.updateStatus = false;
    }
    setUpdateStatus(stepper : MatStepper) {
        stepper.selected!.completed = true;
        stepper.next();
        this.updateStatus = true;
    }

    reg(stepper: MatStepper) {
        this.updateStatus = false;
        stepper.selected!.completed = true
    }


    getCompany(BP: string) {
        this.loading = true;
        this.appService.searchCompany(BP).subscribe((response) => {
            console.log(response);
            this.company = response;
                this.loading = false;
                this.companySuccess = true
                this.companyFail = false;
            }
        ,(error) => {
                console.error('An error occurred:', error);
                this.loading = false;
                this.companyFail = true
                this.companySuccess = false
            })
    }

    getFormData(regForm: RegistrationFormComponent, stepper: MatStepper) {
        this.companyAlreadyExists = false;
        this.loading = true;
        this.companyDetail = regForm.getFormData();

        if (this.updateStatus){
            stepper.selected!.completed = true;
            stepper.next();
            this.loading = false;
            return;
        }

        this.appService.getCompanyByBP_VAT_TIN(this.companyDetail.BPN, this.companyDetail.VAT, this.companyDetail.TIN).subscribe((response) => {
            this.companyAlreadyExists = true;
                this.loading = false;
            },
        error => {
            stepper.selected!.completed = true;
            stepper.next();
            this.loading = false;
        })

        // const handleApiResponse = (property: keyof CompanyAlreadyExists) => {
        //     return (): void => {
        //         (this.companyAlreadyExists as any)[property] = true;
        //         this.loading = false;
        //     };
        // };
        //
        // const handleApiError = (property: keyof CompanyAlreadyExists) => {
        //     return (error: any): Observable<any> => {
        //         if (error.status === 404) {
        //             this.loading = false;
        //             (this.companyAlreadyExists as any)[property] = false;
        //
        //             // Set the custom property to track 404 errors
        //             return of({ '404Error': true });
        //         }
        //
        //         // Return an observable to satisfy the catchError requirement
        //         return of(error);
        //     };
        // };
        //
        // const bpn$ = this.appService.getCompanyByBP_VAT_TIN(this.companyDetail.BPN, "BPN")
        //     .pipe(
        //         tap(handleApiResponse('bpn')),
        //         catchError(handleApiError('bpn'))
        //     );
        //
        // const tin$ = this.appService.getCompanyByBP_VAT_TIN(this.companyDetail.TIN, "TIN")
        //     .pipe(
        //         tap(handleApiResponse('tin')),
        //         catchError(handleApiError('tin'))
        //     );
        //
        // const vat$ = this.appService.getCompanyByBP_VAT_TIN(this.companyDetail.VAT, "VAT")
        //     .pipe(
        //         tap(handleApiResponse('vat')),
        //         catchError(handleApiError('vat'))
        //     );
        //
        // forkJoin([bpn$, tin$, vat$]).subscribe((responses) => {
        //     // Check if all observables returned 404 status
        //     const all404 = responses.every(response => response && response['404Error']);
        //
        //     if (all404) {
        //         stepper.selected!.completed = true;
        //         stepper.next();
        //     }
        // }, error => {
        //     this.loading = false;
        //     console.log(error);
        // });

        console.log(this.companyDetail);
    }
    // getFormData(regForm: RegistrationFormComponent, stepper: MatStepper){
    //     this.companyAlreadyExists.bpn = false;
    //     this.companyAlreadyExists.vat = false;
    //     this.companyAlreadyExists.tin = false;
    //
    //     this.loading = true;
    //     this.companyDetail = regForm.getFormData();
    //
    //     //BPN Check
    //     this.appService.getCompanyByBPNumber(this.companyDetail.BPN).subscribe((ifExists) => {
    //         this.companyAlreadyExists.bpn = true;
    //         this.loading = false;
    //     }, error => {
    //         stepper.selected!.completed = true
    //         stepper.next();
    //         this.loading = false;
    //         this.companyAlreadyExists.bpn = false;
    //     })
    //
    //     //TIN Check
    //     this.appService.getCompanyByBPNumber(this.companyDetail.TIN).subscribe((ifExists) => {
    //         this.companyAlreadyExists.tin = true;
    //         this.loading = false;
    //     }, error => {
    //         stepper.selected!.completed = true
    //         stepper.next();
    //         this.loading = false;
    //         this.companyAlreadyExists.tin = false;
    //     })
    //
    //     //VAT Check
    //     this.appService.getCompanyByBPNumber(this.companyDetail.VAT).subscribe((ifExists) => {
    //         this.companyAlreadyExists.vat = true;
    //         this.loading = false;
    //     }, error => {
    //         stepper.selected!.completed = true
    //         stepper.next();
    //         this.loading = false;
    //         this.companyAlreadyExists.vat = false;
    //     })
    //     console.log(this.companyDetail);
    // }
    onSubmit(stepper: MatStepper) {
        this.isLoading = true;
        const regData =  this.companyDetail;

        const input_data = {
            request: {
                subject: 'FDMS Registration Form',
                requester: {
                    name: regData.company
                },
                status: {
                    name: 'Open'
                },
                category: {
                    name: 'FDMS Registration'
                },
                template: {
                    name: 'FDMS Registration Form'
                },
                udf_fields: {
                    udf_sline_605: regData.trading,
                    udf_sline_601: regData.Address,
                    udf_sline_301: regData.company,
                    udf_long_306: regData.phone,
                    udf_sline_307: regData.email,
                    udf_sline_302: regData.TIN,
                    udf_sline_603: regData.VAT,
                    udf_sline_602: regData.BPN,
                    udf_sline_604: regData.serialNumber,
                }
            }
        };

        const  revmaxPortalData = {
            address1: regData.Address,
            name: regData.company,
            address2: regData.Address2,
            tin: regData.TIN,
            vat: regData.VAT,
            serialNumber: regData.serialNumber,
            tel: regData.phone,
            email: regData.email,
            trading: regData.trading,
            bpn: regData.BPN
        }


        if (this.updateStatus){
            this.appService.updateCompanyDetails(revmaxPortalData).subscribe((response) => {
                this.isLoading = false;
                console.log(response);
                this.routerNavigstion('/confirm-request', null);
            })
        }else {
            this.appService.registerCompany(input_data).subscribe((response) => {

                this.appService.registerCompanyrevmaxPortal(revmaxPortalData).subscribe((res) => {
                    const params = {
                        ticket: response.request.id
                    };
                    this.routerNavigstion('/confirm-request', params);

                    console.log('response: ', response);
                    this.isLoading = false;
                    console.log(res);
                }, error => {
                    this.isLoading = false;
                    console.log("request not sent to revmax portal");
                    console.log(error);
                })

            }, error => {
                this.snackBar.open("error, request not sent", 'close',{duration : 6000})
                console.log("request not sent to support centre");
                this.isLoading = false;
                console.log(error);
            })
        }
    }
    setFirstStepCompletion() {
        this.firstStepCompleted = true;
    }

    setSecondStepCompletion() {
        this.secondStepCompleted = true;
    }

    setThirdStepCompletion() {
        this.thirdStepCompleted = true;
    }
// ... other steps ...

    routerNavigstion(path: string, params?: any) {
        this.router.navigate([path], {
            queryParams: params,
        });
    }

    refresh() {
        window.location.reload();
    }
}
interface CompanyAlreadyExists {
    tin: boolean;
    vat: boolean;
    bpn: boolean;
}

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-registration-form',
    templateUrl: './registration-form.component.html',
    styleUrls: ['./registration-form.component.scss']
})
export class RegistrationFormComponent implements OnChanges {
    registrationForm: FormGroup;
    @Input() updateStatus!: boolean;
    @Input() companyData!: any;

    forRawValue: any;

    constructor(
        private _formBuilder: FormBuilder
    ) {
        this.initializeDefaultForm()
        const requestData = {
            request: {
                subject: '',
                requester: {
                    name: this.registrationForm.get('company')
                },
                status: {
                    name: ''
                },
                category: {
                    name: 'FDMS Registration'
                },
                template: {
                    name: 'FDMS Registration Form'
                },
                udf_fields: {
                    udf_sline_605: this.registrationForm.get('trading'),
                    udf_sline_601: this.registrationForm.get('Address'),
                    udf_sline_301: this.registrationForm.get('company'),
                    udf_long_306: this.registrationForm.get('phone'),
                    udf_sline_307: this.registrationForm.get('email'),
                    udf_sline_302: this.registrationForm.get('TIN'),
                    udf_sline_603: this.registrationForm.get('VAT'),
                    udf_sline_602: this.registrationForm.get('BPN'),
                    udf_sline_604: this.registrationForm.get('serialNumber')
                }
            }
        };

    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['updateStatus'] || changes['companyData']) {
            // Check if the updateStatus input has changed
            const newStatus = changes['updateStatus']?.currentValue || changes['companyData']?.currentValue;

            console.log(newStatus);
            // Perform actions based on the new value
            if (newStatus) {
                this.registrationForm = this._formBuilder.group({
                    company: [this.companyData?.name, Validators.required],
                    trading: ['', Validators.required],
                    Address: [this.companyData?.address1, Validators.required],
                    Address2: [this.companyData?.address2, Validators.required],
                    phone: [this.companyData?.tel, Validators.required],
                    email: [this.companyData?.email, Validators.required],
                    TIN: [this.companyData?.tin, Validators.required],
                    VAT: [this.companyData?.vat, Validators.required],
                    BPN: [this.companyData?.bpn, Validators.required],
                    serialNumber: ['', ]
                });

                this.BPN.disable()
                this.company.disable();

                if (this.companyData?.vat){
                    this.VAT.disable();
                }
                if (this.companyData?.tin){
                    this.TIN.disable();
                }
                console.log(this.BPN.getRawValue());

            } else {
                this.initializeDefaultForm()
            }
        }
    }

    initializeDefaultForm (){
        this.registrationForm = this._formBuilder.group({
            company: ['', Validators.required],
            trading: ['', Validators.required],
            Address: ['', Validators.required],
            Address2: ['', Validators.required],
            phone: ['', Validators.required],
            email: ['', Validators.required],
            TIN: ['', Validators.required],
            VAT: ['', Validators.required],
            BPN: ['', Validators.required],
            serialNumber: ['', ]
        });
    }

    getFormData(){
        if (this.registrationForm.valid){
            return this.registrationForm.getRawValue()
        }
    }

    // Define individual getters for each form control
    public get company(): AbstractControl {
        return this.registrationForm.get('company')!;
    }

    public get category(): AbstractControl {
        return this.registrationForm.get('category')!;
    }

    public get trading(): AbstractControl {
        return this.registrationForm.get('trading')!;
    }

    public get Address(): AbstractControl {
        return this.registrationForm.get('Address')!;
    }

    public get Address2(): AbstractControl {
        return this.registrationForm.get('Address2')!;
    }

    public get phone(): AbstractControl {
        return this.registrationForm.get('phone')!;
    }

    public get email(): AbstractControl {
        return this.registrationForm.get('email')!;
    }

    public get TIN(): AbstractControl {
        return this.registrationForm.get('TIN')!;
    }

    public get VAT(): AbstractControl {
        return this.registrationForm.get('VAT')!;
    }

    public get BPN(): AbstractControl {
        return this.registrationForm.get('BPN')!;
    }

    public get serialNumber(): AbstractControl {
        return this.registrationForm.get('serialNumber')!;
    }
}


import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
// import {FormField} from "../../models/FormField";
import { FormField } from 'src/app/models/FormField';

interface _FormField {
  name: string;
  value?: any;
}

interface StepFormField {
  step: string;
  formFields: FormField[];
}
@Component({
  selector: 'app-generic-form',
  templateUrl: './generic-form.component.html',
  styleUrls: ['./generic-form.component.scss']
})
export class GenericFormComponent implements OnInit, AfterViewInit {

  @Input() formFields!: { stepper: boolean, formFields: _FormField[] } | { stepper: true, formFields: StepFormField[], edit: boolean } | any;
  @Output() formDataEmmiter = new EventEmitter<any>();
  form: FormGroup;
  forms: { [key: string]: FormGroup } = {};
  isFinished = false;
  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    console.log('form fields: ', this.formFields);
    this.form = this.fb.group({});
    if ('stepper' in this.formFields && this.formFields.stepper === true) {
      (this.formFields as { stepper: true, formFields: StepFormField[] }).formFields.forEach((step) => {
        const stepForm = this.fb.group({});
        step.formFields.forEach(field => {
          this.form.addControl(field.name, this.fb.control(field.value || '', field.required ? Validators.required : null));
        });
        this.forms[step.step] = stepForm;
      });
      console.log('forms : ', this.forms);
    } else {
      (this.formFields as { stepper: false, formFields: FormField[] }).formFields.forEach(field => {
        this.form.addControl(field.name, this.fb.control(field.value || '', field.required ? Validators.required : null));
      });
    }
  }

  onSubmit(): void {
    if (this.formFields.edit){
      this.formDataEmmiter.emit({eventType: 'put', data: this.form.getRawValue()});
    }else {
      this.formDataEmmiter.emit({eventType: 'submit', data: this.form.getRawValue()});
    }
  }

  close() {
    this.formDataEmmiter.emit({eventType: 'close'});
  }

  finishFunction(): void {
    const formValues = Object.keys(this.forms).reduce((acc: any, key) => {
      acc[key] = this.forms[key].getRawValue();
      return acc;
    }, {});
    this.formDataEmmiter.emit({ eventType: 'finish', data: formValues });
  }

  ngAfterViewInit(): void {
    this.isFinished = true;
    this.cdr.detectChanges();
  }
}

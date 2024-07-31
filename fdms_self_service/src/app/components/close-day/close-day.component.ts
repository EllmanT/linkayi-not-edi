import { Component,OnInit,ViewChild} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBar, MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinner, MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { NgForOf, NgIf } from '@angular/common';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ReactiveFormsModule } from '@angular/forms'; // Add this line
import { MatInputModule } from '@angular/material/input';
import { HttpClient } from '@angular/common/http';
import { CloseDayServiceService } from 'src/app/services/close-day-service.service';
@Component({
  selector: 'app-close-day',
  standalone: true,
  imports: [
    MatCardModule,
    MatProgressBarModule,
    MatButtonModule,
    MatRadioModule,
    MatProgressBarModule,
    MatTabsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatInputModule,
    MatProgressSpinnerModule,
    NgIf
    //FormGroup,
    // MatSnackBar
  
  ],
  templateUrl: './close-day.component.html',
  styleUrl: './close-day.component.scss'
})
export class CloseDayComponent implements OnInit {
  @ViewChild('stepper') stepper: MatStepper;
  closeDayForm: FormGroup; // Declare the closeDayForm FormGroup
  companyName: string; // The company name
  loading = false;

  constructor(private formBuilder: FormBuilder,
    private http:HttpClient,
    private closeDayService: CloseDayServiceService
  ) { }

  ngOnInit() {
    this.closeDayForm = this.formBuilder.group({
      deviceId: ['', Validators.required], // Define the form control 'deviceId'
      email: ['', Validators.required], // Define the form control 'email'
      companyName: ['', Validators.required]
    });
  }

  onSubmit(){
    this.loading = true;
    if(this.closeDayForm.invalid){
      return;
    }

    const formData = this.closeDayForm.value;

    console.log("formdata",formData)


    this.closeDayService.closeDay(formData).subscribe(
      response => {
        console.log('Success', response);
        setTimeout(() => {
          // Upon response completion
          this.loading = false;
          this.stepper.selectedIndex = this.stepper.steps.length - 1;
        }, 1000); // Simulating a 2-second delay
      },
      error => {
        console.error('Error', error);
      }
    );


  }
}
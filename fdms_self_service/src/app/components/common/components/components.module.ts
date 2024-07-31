import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { GenericFormComponent } from './generic-form/GenericFormComponent';
import { GenericFormComponent } from './generic-form/generic-form.component';
import {AddGenericComponent} from "./add-generic/add-generic.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDialogModule} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {ArchwizardModule} from "angular-archwizard";
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
// import {FeatherIconModule} from "../feather-icon/feather-icon.module";



@NgModule({
  declarations: [
    GenericFormComponent,
    AddGenericComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,

    // MatButtonModule,

    // ArchwizardModule,  
      // FeatherIconModule,
  ],
  exports: [
    GenericFormComponent,
    AddGenericComponent,
  ]
})
export class ComponentsModule { }

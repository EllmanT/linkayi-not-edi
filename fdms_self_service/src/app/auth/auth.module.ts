import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { LoginComponent } from '../pages/login/login.component';
import { LoginComponent } from '../components/authentication/login/login.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import {ReactiveFormsModule} from "@angular/forms";
// import {AuthService} from "../services/auth.service";
import { AuthService } from '../auth.service';
import {HttpClientModule} from "@angular/common/http";

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        component: LoginComponent
      },
    ]
  },
]

@NgModule({
  declarations: [LoginComponent, AuthComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule,
        HttpClientModule,
    ],
  providers: [AuthService],
})
export class AuthModule { }

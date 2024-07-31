import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
 import Swal from 'sweetalert2';
// import {AuthService} from "../../services/auth.service";
import { AuthService } from 'src/app/auth.service';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [
    // Other modules imports
    ReactiveFormsModule,
    CommonModule,
    // Other component imports
],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  returnUrl: any;

  form: FormGroup;

  isLoading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private authService: AuthService,
  ) { }

  async ngOnInit(): Promise<void> {
    if (!localStorage.getItem('token')){
      await this.router.navigate(['/administrator-dashboard']);
    }
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    await this.createForm();
  }

  onLoggedin(e: Event) {
    e.preventDefault()
    this.isLoading = true;
    const data = this.form.getRawValue();

    this.authService.login(data).subscribe((response: any) => {
      this.isLoading = false
      console.log(response)

      if (response.status === "success" && response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
    }, (error) => {
      Swal.fire({
        title: 'Error!',
        text: 'Login failed. Please check your credentials.',
        icon: 'error',
      }).then(() => {
        this.isLoading = false; // Stop loading
      });
    })
    if (localStorage.getItem('token')) {
      this.router.navigate(['/dashboard']);
    }
  }

  async createForm(): Promise<void> {
    this.form = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    })
  }

}

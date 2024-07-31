import {Component} from '@angular/core';
import {CustomizerSettingsService} from '../../customizer-settings/customizer-settings.service';
import {AuthService} from '../../../auth.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
    hide = true;
    isLoading = false; // Add this flag to track loading state
    loginError: string | null = null; // Error message for wrong password
    userInfo: any;

    constructor(
        public themeService: CustomizerSettingsService,
        private authService: AuthService,
        private router: Router,
        private snackBar: MatSnackBar,
    ) {
    }

    toggleTheme() {
        this.themeService.toggleTheme();
    }

    toggleCardBorderTheme() {
        this.themeService.toggleCardBorderTheme();
    }

    toggleCardBorderRadiusTheme() {
        this.themeService.toggleCardBorderRadiusTheme();
    }

    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }

    onLogin(supplierTIN:string) {
        this.isLoading = true;
        const credentials = {
            supplierTIN: supplierTIN,
            // password: password,
        };

        this.authService.login(credentials).subscribe(
            response => {
                if (response && response.token) {
                    localStorage.setItem('token', response.token);
                    this.router.navigate(['/administrator-dashboard']);

                } else {
                    // Handle case where token is missing in the response
                    this.showSnackBar('Login failed. Please check your credentials.');
                    this.isLoading = false; // Stop loading
                }
            },
            error => {
                // Handle login errors here
                this.showSnackBar('Login failed. Please check your credentials.'); // Set the error message
                this.isLoading = false; // Stop loading
            }
        );
    }

    showSnackBar(message: string): void {
        this.snackBar.open(message, 'Close', {
            duration: 5000, // The duration in milliseconds for which the snackbar should be shown
        });
    }
}

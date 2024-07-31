import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EMPTY, Observable, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private baseUrl = environment.apiBaseUrl;
    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            tenant: 'root', // Include the tenant header with the value 'root'
        }),
    };

    constructor(
        private http: HttpClient,
        private router: Router
    ) {}

    register(userData: any): Observable<any> {
        const url = `${this.baseUrl}/register`;
        return this.http.post<any>(url, userData, this.httpOptions).pipe(
            tap(response => {
                // Handle any additional actions upon successful registration if needed
            }),
            catchError(error => {
                // Handle and log any error that occurs during registration
                throw error;
            })
        );
    }

    login(credentials: any): Observable<any> {
        const url = `${this.baseUrl}/users/login/${credentials.supplierTIN}`;
        // const url = `${this.baseUrl}/users/loginclientTIN=${credentials.supplierTIN}`;
        return this.http.post<any>(url, this.httpOptions).pipe(
            tap(response => {
                console.log(response.data);
            }),
            catchError(error => {
                // Handle and log any error that occurs during login
                throw error;
            })
        );
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

        refreshToken() {
            const storedToken = localStorage.getItem('token');
            const storedRefreshToken = localStorage.getItem('refreshToken');
            const storedRefreshTokenExpiryTime = localStorage.getItem(
                'refreshTokenExpiryTime'
            );

            const credentials = {
                token: storedToken,
                refreshToken: storedRefreshToken,
            };

            if (!storedToken || !storedRefreshToken) {
                const url = `${this.baseUrl}/tokens`;
                return this.http.post<any>(url, credentials, this.httpOptions).pipe(
                    tap(response => {
                        localStorage.setItem('token', response.token);
                        localStorage.setItem('refreshToken', response.refreshToken);
                        localStorage.setItem(
                            'refreshTokenExpiryTime',
                            response.refreshTokenExpiryTime
                        );
                    }),
                    catchError(error => {
                        // Handle and log any error that occurs during token refresh
                        localStorage.removeItem('token');
                        localStorage.removeItem('refreshToken');
                        localStorage.removeItem('refreshTokenExpiryTime');
                        this.router.navigate(['/authentication/login']);
                        throw error; // Rethrow the error to propagate it further if needed
                    })
                );
            } else {
                this.router.navigate(['/authentication/login']);
                return EMPTY; // Return an empty observable if refresh is not needed
            }
        }

    verifyToken(): Observable<any> {
        const url = `${this.baseUrl}/verify`;
        const token = localStorage.getItem('token');
        if (!token) {
            // Handle the case when the token is not available
            // For example, redirect to the login page
            // or show an error message.
            // Here, we're just returning an empty observable.
            return new Observable();
        }

        // Set the Authorization header with the JWT token
        const httpOptionsWithToken = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            }),
        };

        return this.http.get<any>(url, httpOptionsWithToken).pipe(
            tap(response => {
                // Handle any additional actions upon successful token verification if needed
            }),
            catchError(error => {
                // Handle and log any error that occurs during token verification
                throw error;
            })
        );
    }

    isAuthenticated(): boolean {
        // Check if the user is authenticated by verifying the token's existence and validity
        const token = localStorage.getItem('token');
        // You might need to perform additional checks on the token's validity,
        // such as checking for expiration, token signature, etc.
        const isAuthenticated = token;
    
    console.log('Is user authenticated:', isAuthenticated);
        return !!token;
    }

    logout(): void {
        // Clear the token from local storage upon logout
        localStorage.removeItem('token');
    }
}

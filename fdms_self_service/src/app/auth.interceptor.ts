import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpResponse,
    HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private router: Router) {} // Inject Router

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            tap((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    // Check if response status is 401
                    if (event.status === 401) {
                        localStorage.removeItem('token');
                        // Check if the current route is the authentication route before reloading
                        if (this.router.url !== '/authentication/login') {
                            // Force a page refresh
                            location.reload();
                        }
                    }
                }
            }),
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    localStorage.removeItem('token');
                    if (this.router.url !== '/authentication/login') {
                        // Force a page refresh
                        location.reload();
                    }
                }
                return throwError(error);
            })
        );
    }
}

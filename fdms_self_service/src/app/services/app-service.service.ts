import { Injectable } from '@angular/core';
import {AuthService} from "../auth.service";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {catchError, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AppServiceService {
    private baseUrl = environment.apiRevmaxPortal;
    private token: string | null = '';

    url = environment.apiRevmaxPortal;
    authToken = environment.authToken;
    contentType = 'application/x-www-form-urlencoded';
    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) {
        this.token = this.authService.getToken();
    }

    postTicket(data: any): Observable<any> {
        const url = `${environment.apiSupportCentreBridge}/support/support-ticket`;
        const token = this.authToken;

        const headers = new HttpHeaders()
            .set('authtoken', `${token}`)
            .set('Content-Type', "application/json")
            .set('tenant', "root")

        return this.http.post(url, data, { headers });
    }
    getTicketStatus(id: string): Observable<any> {
        const url = `${environment.apiSupportCentreBridge}/support/status?ticketId=${id}`;
        const token = this.authToken;

        const headers = new HttpHeaders()
            .set('Content-Type', "application/json")
            .set('tenant', "root")


        return this.http.get(url, { headers });
    }

    getCompanyByBP_VAT_TIN(BP : string, VAT: string, TIN: string): Observable<any> {
        const url = `${environment.apiSupportCentreBridge}/company/get-company/${BP}/${VAT}/${TIN}`;
        const token = this.authToken;
        const headers = new HttpHeaders()
            .set('Content-Type', "application/json")
            .set('tenant', "root")
        return this.http.get(url, {headers});
    }

    searchCompany(value : string): Observable<any> {
        const url = `${environment.apiSupportCentreBridge}/company/search-company?revCompanyId=${value}`;
        const token = this.authToken;

        const headers = new HttpHeaders()
            .set('Content-Type', "application/json")
            .set('tenant', "root")

        return this.http.get(url, {headers});
    }

    updateCompanyDetails(data: any): Observable<any> {
        const url = `${environment.apiSupportCentreBridge}/company/update-company-revmax-portal`;
        const token = this.authToken;

        const headers = new HttpHeaders()
            .set('authtoken', `${token}`)
            .set('Content-Type', "application/json")
            .set('tenant', "root")

        return this.http.post(url, data, );
    }

    registerCompany(data: any): Observable<any> {
        const url = `${environment.apiSupportCentreBridge}/company/save-company`;
        const token = this.authToken;

        const headers = new HttpHeaders()
            .set('authtoken', `${token}`)
            .set('Content-Type', "application/json")
            .set('tenant', "root")

        return this.http.post(url, data, );
    }
    registerCompanyrevmaxPortal(data: any): Observable<any> {
        const url = `${environment.apiSupportCentreBridge}/company/save-company-revmax-portal`;
        const token = this.authToken;

        const headers = new HttpHeaders()
            .set('authtoken', `${token}`)
            .set('Content-Type', "application/json")
            .set('tenant', "root")

        return this.http.post(url, data, );
    }

}

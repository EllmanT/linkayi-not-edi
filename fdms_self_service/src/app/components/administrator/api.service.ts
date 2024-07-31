import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
    url = environment.apiRevmaxPortal;
    authToken = environment.authToken;
    contentType = 'application/x-www-form-urlencoded';
    constructor(
        private http: HttpClient,
    ) {}
    getTicketStatus(id: string): Observable<any> {
        const url = `${this.url}/${id}`;
        const token = this.authToken;

        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

        return this.http.get(url, { headers });
    }

    getCompanyByBPNumber(BP : string): Observable<any> {
        const url = `http://140.82.25.196:8096/api/Companies?BPN=${BP}`;
        const token = this.authToken;

        const headers = new HttpHeaders()
            .set('authtoken', `${token}`)
            .set('Content-Type', this.contentType);

        return this.http.get(url, { headers });
    }

    updateCompanyDetails(data: any): Observable<any> {
        const url = `${this.url}/endpoint`;
        const token = this.authToken;

        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

        return this.http.post(url, data,{ headers });
    }

    registerCompany(data: any): Observable<any> {
        const url = `${this.url}/endpoint`;
        const token = this.authToken;

        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

        return this.http.post(url, data,{ headers });
    }
}

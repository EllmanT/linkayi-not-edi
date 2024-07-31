import { Injectable } from '@angular/core';
// import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from "@angular/common/http";
import {AuthService} from "../auth.service";
import {map} from "rxjs";
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = environment.apiBaseUrl;

  

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  async makeRequest(method: string, api: string, body?: any, params?: any): Promise<any> {
       // Retrieve token from localStorage
    // const url = `${this.baseUrl}/${api}`;
    const url = `${this.baseUrl}/${api}`;
    const token = await this.authService.getToken();

    
    //  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    let httpParams = new HttpParams();
    if (params) {
      for (const key of Object.keys(params)) {
        httpParams = httpParams.set(key, params[key]);
      }
    }

    const options = {
      //  headers,
      params: httpParams,
      observe: 'response' as 'response'
    };

    const requestOptions = ['post', 'put'].includes(method) ? [url, body, options] : [url, options];

    // @ts-ignore
    return this.http[method as keyof HttpClient](...requestOptions)
      .pipe(map((response: HttpResponse<any>) => response.body))
      
      .toPromise();

  }
}

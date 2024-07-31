import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
// import {environment} from "../../../../environments/environment";
import { environment } from 'src/environments/environment';
// import {AuthService} from "../../services/auth.service";
import { AuthService } from 'src/app/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataTableService {

  private baseUrl = environment.apiBaseUrl;


  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  async getData(api: string, param: string|undefined) {
    const url = `${this.baseUrl}/${api}?${param ? param : ''}`;
    // const url = `http://140.82.25.196:10069/api/GetReceiptsBySupplierTIN?supplierTIN=2000152399`;
    



    const token = await this.authService.getToken();

    console.log(token)
    // Set up query parameters for pagination
    const params = new HttpParams()
      .set('PageNumber', '1')
      .set('PageSize', '100');

    // const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    // const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);


    // Pass the params as the second argument to the get() method
    return this.http.get(url).pipe((response: any) => {
      return response.toPromise();
    });
  }
}

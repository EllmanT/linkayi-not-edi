import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CloseDayServiceService {

  private token:string | null='';
  authToken= environment.authToken
  url = environment.apiRevmaxPortal;
  private baseUrl = environment.apiBaseUrl;

  contentType= 'application/x-www-form-urlencoded'

  constructor(
    private http:HttpClient,
    private authService:AuthService

  ) { 
    this.token = this.authService.getToken()
  }


  closeDay(data:any):Observable<any> {
const url=  `${this.baseUrl}/errorsHandling/close-day`
const token = this.authToken;
console.log("sent the requesst");
console.log("this is the data",data)
return this.http.post(url, data,);
  } 
}

import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { environment } from 'src/environments/environment';


@Injectable({
    providedIn: 'root'
})
export class DocumentsAiServiceService {
    private baseUrl = environment.apiBaseUrl;

    constructor(
        private http: HttpClient,
    ) {}

    uploadRequestFile(data: any) {
        const url = `${this.baseUrl}/docsAi`;

        console.log('posting', data)
        console.log(url)
        return this.http.post(url, data);
    }



    uploadRequestFile2(data: any) {
        const url2 = `${this.baseUrl}/docsAi/form-parser`;

        console.log("posting to form parser", data);
        console.log('posting', data);
        return this.http.post(url2, data)
    }



    convertText(fileUrl: string){
        const url = `${this.baseUrl}/docAi/convertText`;
        const data = { fileUrl };

        console.log(url)
        return this.http.post(url, data);
    }

    generateTextFile(data: any): void {
        this.http.post(`${this.baseUrl}/docsAi/generate-text-file`, data, { responseType: 'blob' })
            .subscribe((response: Blob) => {
                const blob = new Blob([response], { type: 'text/plain' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'Settings.ini';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);



                window.location.reload();
            });
    }
}

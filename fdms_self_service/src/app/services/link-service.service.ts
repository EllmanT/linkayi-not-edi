import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LinkServiceService {

  constructor() { }
    private linkedPropertiesSubject = new BehaviorSubject<{ propertyA: string; propertyB: string } | null>(null);

    get linkedProperties$() {
        return this.linkedPropertiesSubject.asObservable();
    }

    linkProperties(propertyA: string, propertyB: string) {
        this.linkedPropertiesSubject.next({ propertyA, propertyB });
    }
}

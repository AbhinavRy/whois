import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    constructor(private http: HttpClient) {}

    rootURL = 'http://localhost:5000/api';

    addUser(urlData: any) {
        return this.http.post(this.rootURL + '/whois', {...urlData});
    }

}
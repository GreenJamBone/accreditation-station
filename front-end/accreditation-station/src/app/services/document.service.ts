import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
 
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
 
@Injectable()
export class DocumentService {
 
    constructor(private http: HttpClient) {}
 
    // Uses http.get() to load data from a single API endpoint
    addDocument(payload): Observable<any> {
        return this.http.post(environment.createDocument, payload);
    }

    getAllDocuments(): Observable<any> {
        return this.http.get(environment.allDocuments);
    }

    updateDocument(payload): Observable<any> {
        return this.http.post(environment.updateDocument, payload);
    } 

    removeDocument(payload): Observable<any> {
        return this.http.post(environment.removeDocument, payload);
    }
}
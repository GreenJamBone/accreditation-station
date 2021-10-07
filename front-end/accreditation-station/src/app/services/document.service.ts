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
        return this.http.post(environment.root_path + environment.createDocument, payload);
    }

    getAllDocuments(): Observable<any> {
        return this.http.get(environment.root_path + environment.allDocuments);
    }

    updateDocument(payload): Observable<any> {
        return this.http.post(environment.root_path + environment.updateDocument, payload);
    } 

    removeDocument(payload): Observable<any> {
        return this.http.post(environment.root_path + environment.removeDocument, payload);
    }

    getDocument(payload): Observable<any> {
        return this.http.get(environment.root_path + environment.getSingleDoc + '/' + payload);
    }
    getMultipleDocsById(payload): Observable<any> {
        return this.http.post(environment.root_path + environment.getMultipleDocs, payload);
    }
}
import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
 
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
 
@Injectable()
export class UserService {
 
    constructor(private http: HttpClient) {}
 
    // Uses http.get() to load data from a single API endpoint
    addUser(payload): Observable<any> {
        return this.http.post(environment.createUser, payload);
    }

    getAllUsers(): Observable<any> {
        return this.http.get(environment.allUsers);
    }

    updateUser(payload): Observable<any> {
        return this.http.post(environment.updateUser, payload);
    }
}
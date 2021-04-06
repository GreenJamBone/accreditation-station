import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
 
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
 
@Injectable()
export class AssignmentService {
 
    constructor(private http: HttpClient) {}
 
    // Uses http.get() to load data from a single API endpoint
    addAssignment(payload): Observable<any> {
        return this.http.post(environment.root_path + environment.createAssignment, payload);
    }

    getAllAssignments(): Observable<any> {
        return this.http.get(environment.root_path + environment.allAssignments);
    }
    getAssignment(assID): Observable<any> {
        return this.http.get(environment.root_path + environment.getAssignment + '/' + assID);
    }
    getAssignmentsByCourse(courseId): Observable<any> {
        return this.http.get(environment.root_path + environment.getAssignmentsByCourse + '/' + courseId);
    }
    updateAssignment(payload): Observable<any> {
        return this.http.post(environment.root_path + environment.updateAssignment, payload);
    } 

    removeAssignment(payload): Observable<any> {
        return this.http.post(environment.root_path + environment.removeAssignment, payload);
    }
}